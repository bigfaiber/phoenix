import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyCurrencyFormatterDirective } from "../../../directives/currency/my-currency-formatter.directive";
import { MyCurrencyPipe } from "../../../pipes/currency/my-currency.pipe";
import { UtilitiesService } from '../../../services/utilities-service/utilities.service';
import { DataService } from '../../../services/data-service/data.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-customer-registration',
  templateUrl: './customer-registration.component.html',
  styleUrls: ['./customer-registration.component.scss'],
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
export class CustomerRegistrationComponent implements OnInit {

  constructor( private router: Router, private cuPipe: MyCurrencyPipe, private uService: UtilitiesService,
      private dataService: DataService, private dp: DecimalPipe ) { }

  rate = 0.015;

  form = new FormGroup({
      dream: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
      description: new FormControl( null, [ Validators.required ] ),
      needings: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
      payment: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
      months: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
      rate: new FormControl( "1.5%", [] ),
  });

  ngOnInit() {
      this.dataService.onInit( `Registro Cliente` )
      this.uService.getAverageInterest( ).subscribe(
        res => {
          UtilitiesService.debug( res.json( ) )
          let rate = res.json( ).data.interest
          if ( rate ) {
            this.rate = Number( rate ) / 100
            this.form.get( 'rate' ).setValue( rate + '%' )
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
  }

  isFormValid( ) {
      return this.form.valid
  }

  onSubmit( ) {
      UtilitiesService.debug( this.form.value )
      if ( this.isFormValid( ) ) {
          UtilitiesService.debug( "Customer is not logged in, redirecting to registration form..." )
          localStorage.setItem( 'customer_dream', JSON.stringify({
              dream: this.form.get( 'dream' ).value,
              description: this.form.get( 'description' ).value,
              needings: this.cuPipe.parse( this.form.get( 'needings' ).value ),
              payment: this.cuPipe.parse( this.form.get( 'payment' ).value ),
              months: this.calcTime( this.cuPipe.parse( this.form.get( 'needings' ).value ),
                                this.cuPipe.parse( this.form.get( 'payment' ).value ) ),
              rate: this.rate
          }))
          UtilitiesService.debug( JSON.parse( localStorage.getItem( 'customer_dream' ) ) )
          this.router.navigate( [ 'formulario-cliente','paso-1' ] )
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

}
