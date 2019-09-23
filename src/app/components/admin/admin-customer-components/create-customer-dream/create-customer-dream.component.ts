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
  selector: 'app-create-customer-dream',
  templateUrl: './create-customer-dream.component.html',
  styleUrls: ['./create-customer-dream.component.scss'],
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
export class CreateCustomerDreamComponent implements OnInit {

  constructor( private router: Router, private cuPipe: MyCurrencyPipe,
                 private adminManService: AdminManagementService, private dataService: DataService,
                  private dp: DecimalPipe, private uService: UtilitiesService ) { }

  @ViewChild( 'rate_input' ) rate_input: any;

  @ViewChild( 'myDatepicker' ) date_picker: any
  @ViewChild( 'myDatepicker2' ) date_picker2: any

  rate = 1.5;

  form = new FormGroup({
     needings: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
     rate: new FormControl( "1.5", [ Validators.required, Validators.pattern( "[0-9]+([.][0-9]+)" ) ] ),
     payment: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
     account: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ), Validators.minLength( 6 ), Validators.maxLength( 14 ) ] ),
     date: new FormControl( null, [ ] ),
     approved_date: new FormControl( null, [ Validators.required ] ),
     dream: new FormControl( null, [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
     description: new FormControl( null, [ Validators.required ] ),
     months: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
     warranties: new FormControl( null, [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
     banks: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
     account_type: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
     investor: new FormControl( "-1", [ ] ),
  });

  requestSent = false
  customer_data;
  allInvestors = []

  ngOnInit( ) {
      this.dataService.onInit( `Crear Sueño` )
      var temp = localStorage.getItem( 'admin_customer_profile' )
      if ( temp == null ) {
          UtilitiesService.debug( "No dream found, redirecting..." )
          this.router.navigate( [ 'admin', 'clientes' ] )
          return
      }

      this.customer_data = JSON.parse( temp )
      UtilitiesService.debug( this.customer_data )

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

      this.adminManService.getAllInvestors( ).subscribe(
        res => {
          UtilitiesService.debug( res.json( ) )
          this.allInvestors = res.json( ).investors
        },
        err => {
          this.dataService.errorHandler( err, { userType: 'Admin' } )
        },
        () => {
          UtilitiesService.debug( "Investors Retrieved" )
        }
      )
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
              initial_payment: this.form.get( 'investor' ).value == "-1" ? undefined : this.form.get( 'date' ).value,
              months: this.form.get( 'months' ).value,
              approved_date: this.form.get( 'approved_date' ).value,
              warranty: Number( this.form.get( 'warranties' ).value ) - 1,
              rate: Number( this.form.get( 'rate' ).value ),
              c_id: this.customer_data.id,
              inv_id: this.form.get( 'investor' ).value == "-1" ? undefined : this.form.get( 'investor' ).value,
              bank: this.form.get( 'banks' ).value,
              account_type: Number( this.form.get( 'account_type' ).value ) - 1,
              account_number: this.form.get( 'account' ).value
          }
          this.adminManService.createCustomerProject( data ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.router.navigate( [ 'admin', 'perfil-cliente' ] )
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Project updated" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  getBack( ) {
      window.history.back( )
  }

  showInterestRate( ) {
    if ( this.customer_data.recommended_interest != null && this.customer_data.recommended_interest.indexOf( "NO" ) != -1 )
      return "-"
    else
      return this.dp.transform( this.customer_data.recommended_interest, '1.0-2' )
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

  investorChanged( event ) {
    if ( event != "-1" ) {
      this.form.get( 'date' ).clearValidators( )
      this.form.get( 'date' ).setValidators( [ Validators.required ] )
      this.form.get( 'date' ).updateValueAndValidity( )
    } else {
      this.form.get( 'date' ).setValue( null )
      this.form.get( 'date' ).clearValidators( )
      this.form.get( 'date' ).updateValueAndValidity( )
    }
  }

  toggleDatePicker( op? ) {
    if ( op )
      this.date_picker.opened = !this.date_picker.opened;
    else
      this.date_picker2.opened = !this.date_picker2.opened;
  }

}
