import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyCurrencyFormatterDirective } from "../../../directives/currency/my-currency-formatter.directive";
import { MyCurrencyPipe } from "../../../pipes/currency/my-currency.pipe";
import { CustomerRegistrationService } from "../../../services/customer-registration/customer-registration.service";
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from '../../../services/utilities-service/utilities.service';

@Component({
  selector: 'app-customer-registration-step3',
  templateUrl: './customer-registration-step3.component.html',
  styleUrls: ['./customer-registration-step3.component.scss'],
  animations: [
      trigger('fadeInOut', [
        transition(':enter', [
          style({opacity:0,height:0}),
          animate(200, style({opacity:1,height:'*'}))
        ]),
        transition(':leave', [
          animate(200, style({opacity:0,height:0}))
        ])
    ]),
    trigger('appearingAnimNoDelay', [
      transition(':enter', [
        style({opacity:0,transform:'scale(0)',height:0}),
        animate(100, style({opacity:1,transform:'scale(1.2)',height:'*'})),
        animate(80, style({transform:'scale(1)'}))
      ]),
      transition(':leave', [
        animate(80, style({transform:'scale(1.2)',height:'*'})),
        animate(100, style({opacity:0,transform:'scale(0)',height:0}))
      ])
    ])
  ]
})
export class CustomerRegistrationStep3Component implements OnInit {

  constructor( private router: Router, private cuPipe: MyCurrencyPipe, private customerRegService: CustomerRegistrationService,
      private dataService: DataService ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  requestSent = false

  form: FormGroup

  @ViewChild( 'f2' ) f2: any;
  @ViewChild( 'f3' ) f3: any;

  @ViewChild( 'lab1' ) lab1: any;
  @ViewChild( 'lab2' ) lab2: any;

  @ViewChild( 'f6' ) f6: any;
  @ViewChild( 'f7' ) f7: any;

  @ViewChild( 'rent_yes' ) rent_yes: any;
  @ViewChild( 'rent_no' ) rent_no: any;

  charBase = 'a'

  propertyArray = [];
  vehicleArray = [];

  registration_data_parsed;
  user_data

  ngOnInit( ) {
      this.dataService.onInit( `Registro Cliente: Paso 3` )
      var registration_data = localStorage.getItem( 'customer_registration_process' )

      /* Force step (for testing) */
      // localStorage.setItem( 'customer_registration_process', JSON.stringify({
      //     current_step: 1
      // }))

      /* First time in registration */
      if ( registration_data == null ) {
          localStorage.setItem( 'customer_registration_process', JSON.stringify({
              current_step: 1
          }))
          this.router.navigate( [ 'formulario-cliente','paso-1' ] )
      } /* A registration process already started */
      else {
          this.registration_data_parsed = JSON.parse( registration_data )
          switch ( this.registration_data_parsed.current_step ) {
              case 1:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-cliente','paso-1' ] )
                  break;
              case 2:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-cliente','paso-2' ] )
                  break;
              // case 5:
              //     UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
              //     this.router.navigate( [ 'formulario-cliente','paso-5' ] )
              //     break;
          }
      }

      this.user_data.estates.forEach( x => {
        this.addProperty( x )
      })
      this.user_data.vehicles.forEach( x => {
        this.addVehicle( x )
      })

      this.form = new FormGroup({
          monthly_payment: new FormControl( this.user_data.rent_payment, [ ] ),

          market_expenses: new FormControl( this.user_data.market_expenses, [ Validators.required, Validators.pattern( '[0-9]+' ) ] ),
          transport_expenses: new FormControl( this.user_data.transport_expenses, [ Validators.required, Validators.pattern( '[0-9]+' ) ] ),
          public_service_expenses: new FormControl( this.user_data.public_service_expenses, [ Validators.required, Validators.pattern( '[0-9]+' ) ] ),
          bank_obligations: new FormControl( this.user_data.bank_obligations, [ Validators.required, Validators.pattern( '[0-9]+' ) ] ),

          technical_career: new FormControl( this.user_data.technical_career, [ ] ),

          family_options: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
          civil_status: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
          labor: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
          education_level: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
          household_type: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
          career: new FormControl( "0", [ ] ),
      });

      switch ( this.user_data.employment_status ) {
          case "Desempleado":
              this.form.get( 'labor' ).setValue( "1" )
              break
          case "Empleado":
              this.form.get( 'labor' ).setValue( "2" )
              break
          case "Independiente":
              this.form.get( 'labor' ).setValue( "3" )
              break
          case "Contratista":
              this.form.get( 'labor' ).setValue( "4" )
              break
      }

      switch ( this.user_data.household_type ) {
          case "Arriendo":
              this.form.get( 'household_type' ).setValue( "1" )
              this.householdChange( "1" )
              break
          case "Vivienda propia":
              this.form.get( 'household_type' ).setValue( "2" )
              this.householdChange( "2" )
              break
          case "Vivienda familiar":
              this.form.get( 'household_type' ).setValue( "3" )
              this.householdChange( "3" )
              break
          case "Estoy pagando vivienda":
              this.form.get( 'household_type' ).setValue( "4" )
              this.householdChange( "4" )
              break
      }

      switch ( this.user_data.people ) {
          case "Ninguna":
              this.form.get( 'family_options' ).setValue( "1" )
              break
          case "Una":
              this.form.get( 'family_options' ).setValue( "2" )
              break
          case "Dos":
              this.form.get( 'family_options' ).setValue( "3" )
              break
          case "Tres":
              this.form.get( 'family_options' ).setValue( "4" )
              break
          case "Mas de 3":
              this.form.get( 'family_options' ).setValue( "5" )
      }

      switch ( this.user_data.education ) {
          case "Primaria":
              this.form.get( 'education_level' ).setValue( "1" )
              break
          case "Bachiller":
              this.form.get( 'education_level' ).setValue( "2" )
              break
          case "Profesional":
              this.form.get( 'education_level' ).setValue( "3" )
              this.setCareerValidation( "3" )
              break
          case "Maestria":
              this.form.get( 'education_level' ).setValue( "4" )
              this.setCareerValidation( "3" )
              break
          case "Tecnico/Tecnologo":
              this.form.get( 'education_level' ).setValue( "5" )
              this.setCareerValidation( "5" )
      }

      switch ( this.user_data.marital_status ) {
          case "Soltero":
              this.form.get( 'civil_status' ).setValue( "1" )
              break
          case "Casado":
              this.form.get( 'civil_status' ).setValue( "2" )
              break
          case "Union libre":
              this.form.get( 'civil_status' ).setValue( "3" )
              break
      }

      switch ( this.user_data.career ) {
          case "Administrador":
              this.form.get( 'career' ).setValue( "1" )
              break
          case "Ingeniero":
              this.form.get( 'career' ).setValue( "2" )
              break
          case "Medicina":
              this.form.get( 'career' ).setValue( "3" )
              break
          case "Economia":
              this.form.get( 'career' ).setValue( "4" )
              break
          case "Veterinaria":
              this.form.get( 'career' ).setValue( "5" )
              break
          case "Contrabilidad":
              this.form.get( 'career' ).setValue( "6" )
              break
          case "Mercadeo":
              this.form.get( 'career' ).setValue( "7" )
              break
          case "Derecho":
              this.form.get( 'career' ).setValue( "8" )
              break
          case "Arquitectura":
              this.form.get( 'career' ).setValue( "9" )
              break
          case "Diseño":
              this.form.get( 'career' ).setValue( "10" )
              break
          case "Otra":
              this.form.get( 'career' ).setValue( "11" )
              break
      }

      if ( this.user_data.rent_tax )
          this.rent_yes.nativeElement.click( )
      else
          this.rent_no.nativeElement.click( )
  }

  numbRegexTest( value ) {
      if ( value == undefined || value == "" )
          return true
      return /^\d+$/.test( value )
  }

  addProperty( property? ) {
      UtilitiesService.debug( "Called!" )
      if ( this.propertyArray.length == 0 ) {
          this.propertyArray.push({
              label: 'a',
              value: property ? property.price : ""
          })
          return
      }
      this.propertyArray.push({
          label: String.fromCharCode( this.propertyArray[ this.propertyArray.length - 1 ].label.charCodeAt( 0 ) + 1 ),
          value: property ? property.price : ""
      })
  }

  removeProperty( index ) {
      this.propertyArray = this.propertyArray.slice( 0, index ).concat( this.propertyArray.slice( index + 1, this.propertyArray.length ) )
  }

  addVehicle( vehicle? ) {
      if ( this.vehicleArray.length == 0 ) {
          this.vehicleArray.push({
              label: 'a',
              value: vehicle ? vehicle.price : "",
              plate: vehicle ? vehicle.plate : "",
          })
          return
      }
      this.vehicleArray.push({
          label: String.fromCharCode( this.vehicleArray[ this.vehicleArray.length - 1 ].label.charCodeAt( 0 ) + 1 ),
          value: vehicle ? vehicle.price : "",
          plate: vehicle ? vehicle.plate : "",
      })
  }

  removeVehicle( index ) {
      this.vehicleArray = this.vehicleArray.slice( 0, index ).concat( this.vehicleArray.slice( index + 1, this.vehicleArray.length ) )
  }

  isFormValid( ) {
      if ( !this.f6.nativeElement.checked && !this.f7.nativeElement.checked ) {
        return false
      }

      for ( var i = 0; i < this.propertyArray.length; i++ )
          if ( this.propertyArray[ i ].value == "" || !this.numbRegexTest( this.propertyArray[ i ].value ) ) {
            return false
          }

      for ( var i = 0; i < this.vehicleArray.length; i++ )
          if ( this.vehicleArray[ i ].value == "" || this.vehicleArray[ i ].plate == "" || !this.numbRegexTest( this.vehicleArray[ i ].value ) ) {
            return false
          }

      return ( this.form.valid && !this.requestSent )
  }

  onSubmit( ) {
      if ( this.isFormValid( ) ) {
          UtilitiesService.debug( "Posting data..." )
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var response = this.customerRegService.postStep3Data(
                                                  this.propertyArray, this.vehicleArray,
                                                  this.form.value,
                                                  this.f6.nativeElement.checked ? 1 : 0 )

          response[ 0 ].subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), res.json( ).client )
                  if ( response[ 1 ] != null ) {
                      response[ 1 ].subscribe(
                          res2 => {
                              this.customerRegService.updateStep( this.user_data.id, 5 ).subscribe(
                                  ttt => {
                                      localStorage.setItem( 'customer_registration_process', JSON.stringify({
                                          current_step: 5
                                      }))
                                      this.dataService.updateUserAndSessionData( res2.headers.get( 'token' ), null )
                                      this.router.navigate( [ 'formulario-cliente','paso-4' ] )
                                  },
                                  err => {
                                      this.requestSent = false
                                      this.dataService.errorHandler( err, { userType: 'Client' } )
                                  },
                                  () => {
                                      UtilitiesService.debug( "Step updated" )
                                      this.dataService.updateShowBird( false )
                                  }
                              )
                          },
                          err2 => {
                              this.requestSent = false
                              this.dataService.errorHandler( err2, { userType: 'Client' } )
                          },
                          () => {
                              UtilitiesService.debug( "Properties successfully posted" )
                          }
                      )
                  } else {
                      this.customerRegService.updateStep( this.user_data.id, 5 ).subscribe(
                          ttt => {
                              localStorage.setItem( 'customer_registration_process', JSON.stringify({
                                  current_step: 5
                              }))
                              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                              this.router.navigate( [ 'formulario-cliente','paso-4' ] )
                              this.requestSent = false
                          },
                          err => {
                              this.requestSent = false
                              this.dataService.errorHandler( err, { userType: 'Client' } )
                          },
                          () => {
                              UtilitiesService.debug( "Step updated" )
                              this.dataService.updateShowBird( false )
                          }
                      )
                  }
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Client' } )
              },
              () => {
                  UtilitiesService.debug( "Data successfully posted" )
              }
          )
      }
  }

  showCareerSelection( ) {
    return this.form.get( 'education_level' ).value == "3" || this.form.get( 'education_level' ).value == "4"
  }

  showTecType( ) {
    return this.form.get( 'education_level' ).value == "5"
  }

  showPayment( ) {
    return this.form.get( 'household_type' ).value == "1" || this.form.get( 'household_type' ).value == "4"
  }

  setCareerValidation( value ) {
    this.form.get( 'career' ).clearValidators( )
    this.form.get( 'technical_career' ).clearValidators( )
    switch ( value ) {
      case "3":
      case "4":
        this.form.get( 'career' ).setValidators( [ Validators.required, UtilitiesService.emptySelectTagValidator ] )
        break
      case "5":
        this.form.get( 'technical_career' ).setValidators( [ Validators.required ] )
    }
    this.form.get( 'career' ).updateValueAndValidity( )
    this.form.get( 'technical_career' ).updateValueAndValidity( )
  }

  householdChange( value ) {
    this.form.get( 'monthly_payment' ).clearValidators( )
    if ( value === "1" || value === "4" ) {
      this.form.get( 'monthly_payment' ).setValidators( [ Validators.required, Validators.pattern( '[0-9]+' ) ] )
    }
    this.form.get( 'monthly_payment' ).updateValueAndValidity( )
  }

  printErrors( ) {
    UtilitiesService.getFormValidationErrors( this.form )
  }

}
