import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyCurrencyFormatterDirective } from "../../../directives/currency/my-currency-formatter.directive";
import { MyCurrencyPipe } from "../../../pipes/currency/my-currency.pipe";
import { CustomerManagementService } from "../../../services/customerManagement/customer-management.service";
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from '../../../services/utilities-service/utilities.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
  animations: [
      trigger('fadeInOut', [
        transition(':enter', [
          style({opacity:0}),
          animate(200, style({opacity:1}))
        ]),
        transition(':leave', [
          animate(200, style({opacity:0}))
        ])
    ])
  ]
})
export class CreateProjectComponent implements OnInit, OnDestroy {

  constructor( private router: Router, private cuPipe: MyCurrencyPipe,
                 private customerMangService: CustomerManagementService, private dataService: DataService,
                    private uService: UtilitiesService, private dp: DecimalPipe ) {
                   this.user_data = dataService.user_data_value
                   dataService.user_data$.subscribe( val => {
                     this.user_data = val
                   })
                 }

  requestSent = false

  rate = 0.015;

  form = new FormGroup({
      dream: new FormControl({
        value: "0",
        disabled: false
      }, [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
      description: new FormControl( null, [ Validators.required ] ),
      needings: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
      payment: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
      months: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
      warranties: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
      banks: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
      account_type: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
      account: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ), Validators.minLength( 6 ), Validators.maxLength( 14 ) ] ),
      rate: new FormControl( "1.5%", [] ),
  });

  user_data;
  updating_data = false;
  project_data;

  ngOnInit( ) {
      this.dataService.onInit( `Crear Proyecto` )

      this.uService.getAverageInterest( ).subscribe(
        res => {
          UtilitiesService.debug( res.json( ).data.interest )
          let rate = res.json( ).data.interest
          if ( rate ) {
            this.rate = Number( rate ) / 100
            this.form.get( 'rate' ).setValue( this.dp.transform( rate, '1.0-1' ) )
          }
        },
        err => {
          this.dataService.errorHandler( err, {} )
        },
        () => {
          UtilitiesService.debug( "Average interest retrieved" )
        }
      )

      if ( !( this.allDocumentsComplete( ) == 4 || ( !this.user_data.rent_tax && this.allDocumentsComplete( ) == 3 ) ) ) {
          UtilitiesService.debug( "Documents are not complete, redirecting..." )
          this.router.navigate( [ 'cliente', 'perfil' ] )
      }

      var temp = localStorage.getItem( 'missing_data_project' )
      if ( temp != null ) {
          this.updating_data = true
          this.project_data = JSON.parse( temp )
          UtilitiesService.debug( "Project pending for update" )

          this.form.get( 'dream' ).setValue( this.project_data.dream )
          this.form.get( 'dream' ).disable( )
          this.form.get( 'description' ).setValue( this.project_data.description )
          this.form.get( 'needings' ).clearValidators( )
          this.form.get( 'payment' ).clearValidators( )
          this.form.get( 'needings' ).setValue( this.cuPipe.transform( this.project_data.money ) )
          this.form.get( 'payment' ).setValue( this.cuPipe.transform( this.project_data.monthly_payment ) )
          this.form.get( 'months' ).setValue( this.project_data.month )

          switch ( this.project_data.warranty ) {
              case "Prenda":
                  this.form.get( 'warranties' ).setValue( "1" )
                  break
              case "Hipoteca":
                  this.form.get( 'warranties' ).setValue( "2" )
                  break
              case "Pagare":
                  this.form.get( 'warranties' ).setValue( "3" )
                  break
          }
      }
  }

  allDocumentsComplete( ) {
     var statements_doc_counter = 0
     var id_doc_counter = 0
     var rent_doc_counter = 0
     var incomes_doc_counter = 0

     for ( var i = 0; i < this.user_data.documents.length; i++ )
         if ( this.user_data.documents[ i ].document_type == "extractos" ) {
             statements_doc_counter = 1
             break
         }

     for ( var i = 0; i < this.user_data.documents.length; i++ )
         if ( this.user_data.documents[ i ].document_type == "cc" ) {
             id_doc_counter = 1
             break
         }

     for ( var i = 0; i < this.user_data.documents.length; i++ )
         if ( this.user_data.documents[ i ].document_type == "ingresos" ) {
             incomes_doc_counter = 1
             break
         }

     for ( var i = 0; i < this.user_data.documents.length; i++ )
         if ( this.user_data.documents[ i ].document_type == "renta" ) {
             rent_doc_counter = 1
             break
         }

     return statements_doc_counter + id_doc_counter + rent_doc_counter + incomes_doc_counter
  }

  numbRegexTest( value ) {
      return /^\d+$/.test( value )
  }

  isFormValid( ) {
      return this.form.valid
  }

  onSubmit( ) {
      UtilitiesService.debug( this.form.value )
      if ( this.isFormValid( ) && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          UtilitiesService.debug( "Post data!!" )

          if ( !this.updating_data ) {
              var dream = {
                  dream: this.form.get( 'dream' ).value,
                  description: this.form.get( 'description' ).value,
                  needings: this.cuPipe.parse( this.form.get( 'needings' ).value ),
                  payment: this.cuPipe.parse( this.form.get( 'payment' ).value ),
                  months: this.calcTime( this.cuPipe.parse( this.form.get( 'needings' ).value ),
                                    this.cuPipe.parse( this.form.get( 'payment' ).value ) ),
                  rate: this.rate,
                  warranty: Number( this.form.get( 'warranties' ).value ) - 1
              }

              this.customerMangService.createProject( dream ).subscribe(
                  res => {
                      var project = res.json( ).project
                      var data = {
                          bank: this.form.get( 'banks' ).value,
                          account_type: Number( this.form.get( 'account_type' ).value ) - 1,
                          account_number: this.form.value.account
                      }
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                      this.customerMangService.addAccount( project.id, data ).subscribe(
                          res => {
                              this.requestSent = false
                              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                              this.router.navigate( [ 'cliente', 'perfil' ] )
                          },
                          err => {
                              this.requestSent = false
                              this.dataService.errorHandler( err, { userType: 'Client' } )
                          },
                          () => {
                              UtilitiesService.debug( "Account added" )
                              this.dataService.updateShowBird( false )
                          }
                      )
                  },
                  err => {
                      this.requestSent = false
                      this.dataService.errorHandler( err, { userType: 'Client' } )
                  },
                  () => {
                      UtilitiesService.debug( "Project created" )
                  }
              )
          } else {
              var data = {
                  bank: this.form.get( 'banks' ).value,
                  account_type: Number( this.form.get( 'account_type' ).value ) - 1,
                  account_number: Number( this.form.get( 'account' ).value ),
                  warranty: Number( this.form.get( 'warranties' ).value ) - 1
              }
              this.customerMangService.updateProject( this.project_data.id, data ).subscribe(
                  res => {
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                      this.customerMangService.addAccount( this.project_data.id, data ).subscribe(
                          res2 => {
                              this.requestSent = false
                              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                              this.router.navigate( [ 'cliente', 'perfil' ] )
                          },
                          err => {
                              this.requestSent = false
                              this.dataService.errorHandler( err, { userType: 'Client' } )
                          },
                          () => {
                              UtilitiesService.debug( "Account added" )
                              this.dataService.updateShowBird( false )
                          }
                      )
                  },
                  err => {
                      this.requestSent = false
                      this.dataService.errorHandler( err, { userType: 'Client' } )
                  },
                  () => {
                      UtilitiesService.debug( "Warranty added" )
                  }
              )
          }
      }
  }

  calcTime( needings, share ) {
      if ( needings == "" || share == "" )
        return ""

      var period = 0
      var is_creating = true
      var money_temp = Number( needings )
      var monthly_payment = Number( share )

      while ( is_creating ) {
          period = period + 1
          var interest_temp = this.rate * money_temp
          var payment = monthly_payment - interest_temp

          if ( money_temp >= monthly_payment )
              money_temp = money_temp - payment
          else
              money_temp = 0

          if ( money_temp == 0 )
              is_creating = false

          if ( period >= 122 )
              return "La cuota es insuficiente"
      }

      return period
  }

  paymentChanged( val ) {
    this.form.get( 'months' ).setValue( this.calcTime( this.cuPipe.parse( this.form.get( 'needings' ).value ), val ) )
  }

  needingsChanged( val ) {
      this.form.get( 'months' ).setValue( this.calcTime( val, this.cuPipe.parse( this.form.get( 'payment' ).value ) ) )
  }

  ngOnDestroy( ) {
      localStorage.removeItem( 'missing_data_project' )
      this.router.navigate( [ 'cliente', 'perfil' ] )
  }

  getBack( ) {
      window.history.back( )
  }

}
