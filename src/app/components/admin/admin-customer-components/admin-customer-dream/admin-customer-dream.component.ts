import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyCurrencyFormatterDirective } from "../../../../directives/currency/my-currency-formatter.directive";
import { MyCurrencyPipe } from "../../../../pipes/currency/my-currency.pipe";
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import { DecimalPipe } from '@angular/common';
import { UtilitiesService } from '../../../../services/utilities-service/utilities.service';

@Component({
  selector: 'app-admin-customer-dream',
  templateUrl: './admin-customer-dream.component.html',
  styleUrls: ['./admin-customer-dream.component.scss'],
  providers: [ DecimalPipe ],
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
export class AdminCustomerDreamComponent implements OnInit {

  constructor( private router: Router, private cuPipe: MyCurrencyPipe,
                 private adminManService: AdminManagementService, private dataService: DataService,
                  private dp: DecimalPipe ) { }

  @ViewChild( 'rate_input' ) rate_input: any;

  @ViewChild( 'myDatepicker' ) date_picker: any
  @ViewChild( 'myDatepicker2' ) date_picker2: any

  rate = 1.5;

  form;
  requestSent = false
  project_data;

  ngOnInit( ) {
      this.dataService.onInit( `Sueño Cliente` )
      var temp = localStorage.getItem( 'admin_customer_dream' )
      if ( temp == null ) {
          UtilitiesService.debug( "No dream found, redirecting..." )
          this.router.navigate( [ 'admin', 'clientes' ] )
          return
      }

      this.project_data = JSON.parse( temp )
      UtilitiesService.debug( this.project_data )

      this.form = new FormGroup({
         needings: new FormControl( String( this.project_data.money ), [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
         rate: new FormControl( this.dp.transform( this.project_data.interest_rate, '1.0-1' ), [ Validators.required, Validators.pattern( "[0-9]+([.][0-9]+)" ) ] ),
         payment: new FormControl( String( this.project_data.monthly_payment ), [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
         account: new FormControl( this.project_data.account != null ? this.project_data.account.account_number : null,
              [ Validators.required, Validators.pattern( "[0-9]+" ), Validators.minLength( 6 ), Validators.maxLength( 14 ) ] ),

         date: new FormControl( this.project_data.initial_payment != null ? this.project_data.initial_payment : null, [ ] ),
         approved_date: new FormControl( this.project_data.approved_date != null ? this.project_data.approved_date : null, [ ] ),

         dream: new FormControl( this.project_data.dream, [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
         description: new FormControl( this.project_data.description, [ Validators.required ] ),
         months: new FormControl( this.project_data.month, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
         warranties: new FormControl( null, [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
         banks: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
         account_type: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] )
      });

      this.rate = this.project_data.interest_rate

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

      if ( this.project_data.account != null ) {
          this.form.get( 'banks' ).setValue( this.project_data.account.bank )
          this.form.get( 'account_type' ).setValue( this.project_data.account.account_type == "Ahorros" ? "1" : "2" )
      }

      this.rate = this.project_data.interest_rate

      UtilitiesService.debug( this.project_data )
  }

  rateTest( value ) {
      return /((\d+)+(\.\d+))$/.test( value )
  }

  calcTime( needings, share ) {
      if ( needings == "" || share == "" || !this.rateTest( this.rate_input.nativeElement.value ) )
        return ""

      var period = 0
      var is_creating = true
      var money_temp = Number( needings )
      var monthly_payment = Number( share )

      while ( is_creating ) {
          period = period + 1
          var interest_temp = this.rate / 100 * money_temp
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

  isFormValid( ) {
      return this.form.valid
  }

  updateProject( ) {
      if ( this.isFormValid( ) && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var data = {
              dream: this.form.get( 'dream' ).value,
              description: this.form.get( 'description' ).value,
              needings: Number( this.form.get( 'needings' ).value ),
              payment: Number( this.form.get( 'payment' ).value ),
              initial_payment: this.form.get( 'date' ).value,
              approved_date: this.form.get( 'approved_date' ).value,
              warranty: Number( this.form.get( 'warranties' ).value ) - 1
          }
          this.adminManService.updateProject( this.project_data.id, data ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.project_data.initial_payment = this.form.get( 'date' ).value
                  this.project_data.approved_date = this.form.get( 'approved_date' ).value
                  var data = {
                      bank: this.form.get( 'banks' ).value,
                      account_type: Number( this.form.get( 'account_type' ).value ) - 1,
                      account_number: this.form.get( 'account' ).value
                  }
                  this.adminManService.addAccount( this.project_data.id, data ).subscribe(
                      res2 => {
                          this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                          this.adminManService.updateInterestRate( this.project_data.id, Number( this.rate ) ).subscribe(
                              res3 => {
                                  localStorage.setItem( 'admin_customer_dream', JSON.stringify( res3.json( ).project ) )
                                  this.requestSent = false
                              },
                              err => {
                                  this.requestSent = false
                                  this.dataService.errorHandler( err, { userType: 'Admin' } )
                              },
                              () => {
                                  UtilitiesService.debug( "Interest rate updated" )
                                  this.dataService.updateShowBird( false )
                              }
                          )
                      },
                      err => {
                          this.requestSent = false
                          this.dataService.errorHandler( err, { userType: 'Admin' } )
                      },
                      () => {
                          UtilitiesService.debug( "Account added" )
                      }
                  )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Project updated" )
              }
          )
      }
  }

  approveProject( ) {
      if ( this.isFormValid( ) && !this.project_data.approved && !this.requestSent && this.project_data.approved_date != null ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.approveProject( this.project_data.id ).subscribe(
              res => {
                  this.project_data.approved = true
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Project approved" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  deleteProject( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.deleteProject( this.project_data.id ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
                  this.router.navigate( [ 'admin', 'perfil-cliente' ] )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Project deleted" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  getBack( ) {
      window.history.back( )
  }

  showInterestRate( ) {
    if ( this.project_data.recommended_interest != null && this.project_data.recommended_interest.indexOf( "NO" ) != -1 )
      return "-"
    else
      return this.dp.transform( this.project_data.recommended_interest, '1.0-2' )
  }

  paymentChanged( val ) {
    UtilitiesService.debug( this.form.get( 'payment' ).value )
    this.form.get( 'months' ).setValue( this.calcTime( this.cuPipe.parse( this.form.get( 'needings' ).value ), val ) )
  }

  needingsChanged( val ) {
      UtilitiesService.debug( this.form.get( 'needings' ).value )
      this.form.get( 'months' ).setValue( this.calcTime( val, this.cuPipe.parse( this.form.get( 'payment' ).value ) ) )
  }

  rateChanged( val ) {
      this.rate = val
      this.form.get( 'months' ).setValue( this.calcTime( this.cuPipe.parse( this.form.get( 'needings' ).value ), this.cuPipe.parse( this.form.get( 'payment' ).value ) ) )
  }

  toggleDatePicker( op? ) {
    if ( op )
      this.date_picker.opened = !this.date_picker.opened;
    else
      this.date_picker2.opened = !this.date_picker2.opened;
  }

}
