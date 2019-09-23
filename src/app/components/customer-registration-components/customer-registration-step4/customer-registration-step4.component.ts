import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { CustomerRegistrationService } from "../../../services/customer-registration/customer-registration.service";
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-customer-registration-step4',
  templateUrl: './customer-registration-step4.component.html',
  styleUrls: ['./customer-registration-step4.component.scss'],
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
export class CustomerRegistrationStep4Component implements OnInit {

  constructor( private router: Router, private customerRegService: CustomerRegistrationService,
      private dataService: DataService ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  requestSent = false

  @ViewChild( 'f1' ) f1: any;
  @ViewChild( 'f2' ) f2: any;

  registration_data_parsed;
  user_data;

  ngOnInit() {
      this.dataService.onInit( `Registro Cliente: Paso 4` )
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
              case 3:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-cliente','paso-3' ] )
                  break;
              case 5:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-cliente','paso-5' ] )
                  break;
          }
      }
  }

  isFormValid( ) {
      if ( this.f1.nativeElement.checked && this.f2.nativeElement.checked && !this.requestSent )
          return true
      return false
  }

  onSubmit( ) {
      if ( this.isFormValid( ) ) {
          UtilitiesService.debug( "Posting data..." )
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.customerRegService.acceptTerms( -1 ).subscribe(
              res => {
                  this.customerRegService.updateStep( this.user_data.id, 5 ).subscribe(
                      ttt => {
                          localStorage.setItem( 'customer_registration_process', JSON.stringify({
                              current_step: 5
                          }))
                          this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                          this.router.navigate( [ 'formulario-cliente','paso-5' ] )
                      },
                      err => {
                          this.dataService.errorHandler( err, { userType: 'Client' } )
                          this.requestSent = false
                      },
                      () => {
                          UtilitiesService.debug( "Step updated" )
                          this.dataService.updateShowBird( false )
                      }
                  )
              },
              err => {
                  this.dataService.errorHandler( err, { userType: 'Client' } )
                  this.requestSent = false
              },
              () => {
                  UtilitiesService.debug( "Terms accepted" )
              }
          )
      }
  }
}
