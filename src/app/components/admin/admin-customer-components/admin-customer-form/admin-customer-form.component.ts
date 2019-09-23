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
  selector: 'app-admin-customer-form',
  templateUrl: './admin-customer-form.component.html',
  styleUrls: ['./admin-customer-form.component.scss'],
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
export class AdminCustomerFormComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  @ViewChild( 'rent_yes' ) rent_yes: any;
  @ViewChild( 'rent_no' ) rent_no: any;

  @ViewChild( 'arrear_yes' ) arrear_yes: any;
  @ViewChild( 'arrear_no' ) arrear_no: any;

  @ViewChild( 'estate_yes' ) estate_yes: any;
  @ViewChild( 'estate_no' ) estate_no: any;

  @ViewChild( 'myDatepicker' ) date_picker: any

  @ViewChild( 'f2' ) f2: any;
  @ViewChild( 'f3' ) f3: any;

  @ViewChild( 're1' ) re1: any;
  @ViewChild( 're2' ) re2: any;

  @ViewChild( 'a1' ) a1: any;
  @ViewChild( 'a2' ) a2: any;

  uniqueness_errors = {
      email: false,
      id: false,
      phone: false
  }

  requestSent = false

  customer_data;
  form;

  ngOnInit() {
      this.dataService.onInit( `Formulario Cliente` )

      var temp = localStorage.getItem( 'customer_form_data' )
      if ( temp == null ) {
          UtilitiesService.debug( "No customer found, redirecting..." )
          this.router.navigate( [ 'admin', 'perfil-cliente' ] )
          return
      }
      this.customer_data = JSON.parse( temp )
      UtilitiesService.debug( this.customer_data )

      var date = new Date( )
      var today = ( date.getMonth( ) + 1 ) + "/" + date.getDate( ) + "/" + date.getFullYear( )

      this.form = new FormGroup({
          email: new FormControl( this.customer_data.email, [
            Validators.required,
            Validators.pattern( "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$" )
          ] ),
          names: new FormControl( this.customer_data.name, [ Validators.required, Validators.minLength( 3 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+" ) ] ),
          last_names: new FormControl( this.customer_data.lastname, [ Validators.required, Validators.minLength( 3 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+" ) ] ),
          id: new FormControl( this.customer_data.identification, [ Validators.required, Validators.minLength( 5 ), Validators.maxLength( 12 ), Validators.pattern( "[0-9]+" ) ] ),
          address: new FormControl( this.customer_data.address, [ Validators.required, Validators.minLength( 5 ) ] ),
          city: new FormControl( this.customer_data.city, [ Validators.required, Validators.minLength( 4 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ. ]+" ) ] ),
          phone: new FormControl( this.customer_data.phone.slice( 3 ), [ Validators.required, Validators.minLength( 10 ), Validators.maxLength( 15 ), Validators.pattern( "[0-9]+" ) ] ),
          date: new FormControl( this.customer_data.birthday, [ Validators.required ] ),

          labor_options: new FormControl( null, [ Validators. required, UtilitiesService.emptySelectTagValidator ] ),
          civil_status: new FormControl( null, [ Validators. required, UtilitiesService.emptySelectTagValidator ] ),
          family_options: new FormControl( null, [ Validators. required, UtilitiesService.emptySelectTagValidator ] ),
          education_level: new FormControl( null, [ Validators. required, UtilitiesService.emptySelectTagValidator ] ),

          age: new FormControl( this.calculateAge( this.customer_data.birthday, today ), [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
          job: new FormControl( this.customer_data.job_position == null ? null : this.customer_data.job_position, [ Validators.required ] ),
          patrimony: new FormControl( this.customer_data.patrimony == null ? null : this.customer_data.patrimony, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
          max_capacity: new FormControl( this.customer_data.max_capacity == null ? null : this.customer_data.max_capacity, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),

          debt: new FormControl( this.customer_data.current_debt == null ? null : this.customer_data.current_debt, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
          income: new FormControl( this.customer_data.income == null ? null : this.customer_data.income, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
          payment_cap: new FormControl( this.customer_data.payment_capacity == null ? null : this.customer_data.payment_capacity, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),

          career: new FormControl( "0", [ ] ),

          monthly_payment: new FormControl( this.customer_data.rent_payment, [ ] ),

          market_expenses: new FormControl( this.customer_data.market_expenses, [ Validators.required, Validators.pattern( '[0-9]+' ) ] ),
          transport_expenses: new FormControl( this.customer_data.transport_expenses, [ Validators.required, Validators.pattern( '[0-9]+' ) ] ),
          public_service_expenses: new FormControl( this.customer_data.public_service_expenses, [ Validators.required, Validators.pattern( '[0-9]+' ) ] ),
          bank_obligations: new FormControl( this.customer_data.bank_obligations, [ Validators.required, Validators.pattern( '[0-9]+' ) ] ),

          payments_in_arrears_time: new FormControl( this.customer_data.payments_in_arrears_time, [ Validators.required ] ),
          payments_in_arrears_value: new FormControl( this.customer_data.payments_in_arrears_value, [ Validators.required, Validators.pattern( '[0-9]+' ) ] ),

          technical_career: new FormControl( this.customer_data.technical_career, [ ] ),
          household_type: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
      });

      switch ( this.customer_data.employment_status ) {
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

      switch ( this.customer_data.people ) {
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

      switch ( this.customer_data.education ) {
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

      switch ( this.customer_data.marital_status ) {
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

      switch ( this.customer_data.career ) {
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

      switch ( this.customer_data.household_type ) {
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

      if ( this.customer_data.rent_tax )
          this.rent_yes.nativeElement.click( )
      else
          this.rent_no.nativeElement.click( )

      if ( this.customer_data.payments_in_arrears )
          this.arrear_yes.nativeElement.click( )
      else
          this.arrear_no.nativeElement.click( )

      if ( this.customer_data.real_estate )
          this.estate_yes.nativeElement.click( )
      else
          this.estate_no.nativeElement.click( )
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

      if ( !this.re1.nativeElement.checked && !this.re2.nativeElement.checked )
          return false

      if ( !this.a1.nativeElement.checked && !this.a2.nativeElement.checked )
          return false

      return this.form.valid
  }

  updateCustomer( ) {
      if ( this.isFormValid( ) && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var response = this.adminManService.updateCustomer( this.customer_data.id, this.form.value,
            this.f2.nativeElement.checked ? 1 : 0,
            this.re1.nativeElement.checked ? true : false,
            this.a1.nativeElement.checked ? true : false )
          response[ 1 ].subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  response[ 0 ].subscribe(
                      res2 => {
                          this.dataService.updateUserAndSessionData( res2.headers.get( 'token' ), null )
                          this.requestSent = false
                          localStorage.setItem( 'admin_customer_profile', JSON.stringify( res2.json( ).client ) )
                          this.router.navigate( [ 'admin', 'perfil-cliente' ] )
                      },
                      err => {
                          this.requestSent = false
                          this.dataService.errorHandler( err, { userType: 'Admin' } )
                      },
                      () => {
                          UtilitiesService.debug( "Customer additional data updated" )
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
                  UtilitiesService.debug( "Customer basic data updated" )
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
          case 'level':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              break
          case 'job':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              break
          case 'patrimony':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Valor inválido"
              break
          case 'max_capacity':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Valor inválido"
              break
          case 'debt':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Valor inválido"
              break
          case 'income':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Valor inválido"
              break
          case 'payment_cap':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Valor inválido"
              break
          case 'age':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Valor inválido"
              break
          case 'market_expenses':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Sólo puede contener números"
          case 'transport_expenses':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Sólo puede contener números"
          case 'public_service_expenses':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Sólo puede contener números"
          case 'bank_obligations':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Sólo puede contener números"
          case 'payments_in_arrears_value':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Sólo puede contener números"
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

  householdChange( value ) {
    this.form.get( 'monthly_payment' ).clearValidators( )
    if ( value === "1" || value === "4" ) {
      this.form.get( 'monthly_payment' ).setValidators( [ Validators.required, Validators.pattern( '[0-9]+' ) ] )
    }
    this.form.get( 'monthly_payment' ).updateValueAndValidity( )
  }

  showPayment( ) {
    return this.form.get( 'household_type' ).value == "1" || this.form.get( 'household_type' ).value == "4"
  }

  printErrors( ) {
    UtilitiesService.getFormValidationErrors( this.form )
  }

}
