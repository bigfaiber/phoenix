import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyCurrencyFormatterDirective } from "../../../../directives/currency/my-currency-formatter.directive";
import { MyCurrencyPipe } from "../../../../pipes/currency/my-currency.pipe";
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from '../../../../services/utilities-service/utilities.service';

@Component({
  selector: 'app-admin-investor-form',
  templateUrl: './admin-investor-form.component.html',
  styleUrls: ['./admin-investor-form.component.scss'],
  animations: [
      trigger('fadeInOut', [
        transition(':enter', [
          style({opacity:0}),
          animate(200, style({opacity:1}))
        ]),
        transition(':leave', [
          animate(200, style({opacity:0}))
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
export class AdminInvestorFormComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  @ViewChild( 'rent_yes' ) rent_yes: any;
  @ViewChild( 'rent_no' ) rent_no: any;

  @ViewChild( 'myDatepicker' ) date_picker: any

  @ViewChild( 'f2' ) f2: any;
  @ViewChild( 'f3' ) f3: any;

  uniqueness_errors = {
      email: false,
      id: false,
      phone: false
  }

  requestSent = false

  investor_data;
  form;

  ngOnInit() {
      this.dataService.onInit( `Formulario Inversionista` )

      var temp = localStorage.getItem( 'investor_form_data' )
      if ( temp == null ) {
          UtilitiesService.debug( "No customer found, redirecting..." )
          this.router.navigate( [ 'admin', 'perfil-inversionista' ] )
          return
      }
      this.investor_data = JSON.parse( temp )
      UtilitiesService.debug( this.investor_data )
      // console.log( this.investor_data )

      var date = new Date( )
      var today = date.getDate( ) + "/" + ( date.getMonth( ) + 1 ) + "/" + date.getFullYear( )

      this.form = new FormGroup({
          email: new FormControl( this.investor_data.email, [
            Validators.required,
            Validators.pattern( "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$" )
          ] ),
          names: new FormControl( this.investor_data.name, [ Validators.required, Validators.minLength( 3 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+" ) ] ),
          last_names: new FormControl( this.investor_data.lastname, [ Validators.required, Validators.minLength( 3 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+" ) ] ),
          id: new FormControl( this.investor_data.identification, [ Validators.required, Validators.minLength( 5 ), Validators.maxLength( 12 ), Validators.pattern( "[0-9]+" ) ] ),
          address: new FormControl( this.investor_data.address, [ Validators.required, Validators.minLength( 5 ) ] ),
          city: new FormControl( this.investor_data.city, [ Validators.required, Validators.minLength( 4 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ. ]+" ) ] ),
          phone: new FormControl( this.investor_data.phone.slice( 3 ), [ Validators.required, Validators.minLength( 10 ), Validators.maxLength( 15 ), Validators.pattern( "[0-9]+" ) ] ),
          date: new FormControl( this.investor_data.birthday, [ Validators.required ] ),
          maximum: new FormControl( this.investor_data.maximum, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
          labor_options: new FormControl( null, [ Validators. required, UtilitiesService.emptySelectTagValidator ] ),
          education_level: new FormControl( null, [ Validators. required, UtilitiesService.emptySelectTagValidator ] ),
          career: new FormControl( "0", [ ] ),
          technical_career: new FormControl( this.investor_data.technical_career, [ ] ),
      });

      switch ( this.investor_data.employment_status ) {
          case "Desempleado":
              this.form.get( 'labor_options' ).setValue( "1" )
              break
          case "Empleado":
              this.form.get( 'labor_options' ).setValue( "2" )
              break
          case "Independiente":
              this.form.get( 'labor_options' ).setValue( "3" )
              break
          case "Contratista":
              this.form.get( 'labor_options' ).setValue( "4" )
              break
      }

      switch ( this.investor_data.education ) {
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

      switch ( this.investor_data.career ) {
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

      if ( this.investor_data.rent )
          this.rent_yes.nativeElement.click( )
      else
          this.rent_no.nativeElement.click( )
  }

  calculateAge ( birthDate, otherDate ) {
      birthDate = new Date( birthDate );
      otherDate = new Date( otherDate );

      var years = ( otherDate.getFullYear( ) - birthDate.getFullYear( ) );

      if ( otherDate.getMonth( ) < birthDate.getMonth( ) ||
          otherDate.getMonth( ) == birthDate.getMonth( ) && otherDate.getDate( ) < birthDate.getDate( ) ) {
          years--;
      }

      return years;
  }

  isFormValid( ) {
      if ( !this.f2.nativeElement.checked && !this.f3.nativeElement.checked )
          return false

      return this.form.valid
  }

  updateInvestor( ) {
      UtilitiesService.debug( this.isFormValid( ), this.form.valid )
      if ( this.isFormValid( ) && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var additional_data = {
              nivel: this.form.value.level,
              stability: this.form.value.stability,
              job: this.form.value.job,
              patrimony: this.form.value.patrimony,
              max_capacity: this.form.value.max_capacity,
              debt: this.form.value.debt,
              income: this.form.value.income,
              payment_cap: this.form.value.payment_cap,

              rent: this.f2.nativeElement.checked ? 1 : 0,
              labor: Number( this.form.get( 'labor_options' ).value ) - 1,
              education: Number( this.form.get( 'education_level' ).value ) - 1,
              career: this.showCareerSelection( ) ? Number( this.form.get( 'career' ).value ) - 1 : undefined,
          }

          this.adminManService.updateInvestor( this.investor_data.id, additional_data, this.form.value ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  localStorage.setItem( 'admin_investor_profile', JSON.stringify( res.json( ).investor ) )
                  this.adminManService.updateInvestorMaximum( this.investor_data.id, this.form.get( 'maximum' ).value ).subscribe(
                    res => {
                      this.requestSent = false
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                      this.router.navigate( [ 'admin', 'perfil-inversionista' ] )
                    },
                    err => {
                      this.requestSent = false
                      this.dataService.errorHandler( err, { userType: 'Admin' } )
                    },
                    () => {
                      UtilitiesService.debug( "Investor maximum updated" )
                      this.dataService.updateShowBird( false )
                    }
                  )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin', validations: true } )
                  var errors = err.json( ).data.errors
                  if ( errors.email != undefined )
                      this.uniqueness_errors.email = true
                  if ( errors.identification != undefined )
                      this.uniqueness_errors.id = true
                  if ( errors.phone != undefined )
                      this.uniqueness_errors.phone = true
              },
              () => {
                  UtilitiesService.debug( "Investor basic data updated" )
              }
          )
      }
  }

  getBack( ) {
      window.history.back( )
  }

  hasError( name ) {
      switch( name ) {
          case 'names':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Nombre inválido"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 3 caracteres"
              break
          case 'last_names':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Apellido inválido"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 3 caracteres"
              break
          case 'id':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.uniqueness_errors.id )
                  return "Ya fue tomado"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Sólo puede contener números"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 5 números"
              else if ( this.form.get( name ).hasError( 'maxlength' ) )
                  return "Máximo 12 números"
              break
          case 'phone':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.uniqueness_errors.phone )
                  return "Ya fue tomado"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Sólo puede contener números"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 10 números"
              else if ( this.form.get( name ).hasError( 'maxlength' ) )
                  return "Máximo 15 números"
              break
          case 'address':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 5 números"
              break
          case 'date':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              break
          case 'email':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Email inválido"
              else if ( this.uniqueness_errors.email )
                  return "Ya fue tomado"
              break
          case 'city':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Ciudad inválida"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 4 caracteres"
              break
          case 'maximum':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Sólo números"
              break
      }
      return null
  }

  toggleDatePicker( ) {
    this.date_picker.opened = !this.date_picker.opened;
  }

  showCareerSelection( ) {
    return this.form.get( 'education_level' ).value == "3" || this.form.get( 'education_level' ).value == "4"
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

  showTecType( ) {
    return this.form.get( 'education_level' ).value == "5"
  }

}
