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
  selector: 'app-investor-registration',
  templateUrl: './investor-registration.component.html',
  styleUrls: ['./investor-registration.component.scss'],
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
export class InvestorRegistrationComponent implements OnInit {

  constructor( private router: Router, private cuPipe: MyCurrencyPipe, private uService: UtilitiesService,
      private dataService: DataService, private dp: DecimalPipe ) { }

  @ViewChild( 'payments' ) payments_input: any;
  @ViewChild( 'investment' ) investment_input: any;
  @ViewChild( 'time' ) time_input: any;
  @ViewChild( 'efectiveness' ) efectiveness_input: any;

  form = new FormGroup({
    investment: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
    time: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ) ] ),
    payments: new FormControl( null, [ Validators.required] ),
    efectiveness: new FormControl( null, [ Validators.required] ),
    rate: new FormControl( "1.5", [] ),
  });

  rate = 0.015;

  ngOnInit() {
      this.dataService.onInit( `Registro Inversionista` )
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

  calcPayments( investment, time ) {
    if ( investment == "" || time == "" )
        return ""
    var fee = investment * ( this.rate * Math.pow( ( 1 + this.rate ), time ) / ( Math.pow( 1 + this.rate, time ) - 1 ) );
    return Math.round( fee / 5000.0 ) * 5000
  }

  calcEfectiveness( investment, payments, time ) {
    if ( investment == "" || payments == "" || time == "" )
        return ""
    return ( payments * time ) - investment
  }

  setCalcs() {
    let investment = this.cuPipe.parse( this.investment_input.nativeElement.value )
    let time = this.cuPipe.parse( this.time_input.nativeElement.value )
    
    let paymentCalculated = this.calcPayments( investment, time )
    
    let payments = this.cuPipe.transform( paymentCalculated )
    this.form.get( 'payments' ).setValue( payments )
    
    var value = this.calcEfectiveness( investment, paymentCalculated, time )
    
    let efectiveness = this.cuPipe.transform( Number( value ) * 0.95 )
    this.form.get( 'efectiveness' ).setValue( efectiveness )
  }

  isFormValid( ) {
      return this.form.valid
  }

  onSubmit( ) {
      if ( this.isFormValid( ) ) {
          /* TODO: Check user active session pending!! */
          UtilitiesService.debug( "Customer is not logged in, redirecting to registration form..." )
          localStorage.setItem( 'investor_dream', JSON.stringify({
              investment: this.cuPipe.parse( this.form.get( 'investment' ).value ),
              time: this.cuPipe.parse( this.form.get( 'time' ).value ),
              payments: this.cuPipe.parse( this.form.get( 'payments' ).value ),
              efectiveness: this.cuPipe.parse( this.form.get( 'efectiveness' ).value ),
              rate: this.rate
          }))
          UtilitiesService.debug( JSON.parse( localStorage.getItem( 'investor_dream' ) ) )
          this.router.navigate( [ 'formulario-inversionista','paso-1' ] )
      }
  }
}
