import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerRegistrationService } from '../../../services/customer-registration/customer-registration.service';
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";
import { StepTwoComponent } from '../../share/registration/step-two/step-two.component';

@Component({
  selector: 'app-customer-registration-step2',
  templateUrl: './customer-registration-step2.component.html',
  styleUrls: ['./customer-registration-step2.component.scss'],
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
export class CustomerRegistrationStep2Component implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription( );

  constructor( private router: Router, private customerRegService: CustomerRegistrationService,
      private dataService: DataService ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  requestSent = false

  @ViewChild( StepTwoComponent ) stepRef: StepTwoComponent

  registration_data_parsed;
  user_data;

  invalidCode = false;

  ngOnInit() {
      this.dataService.onInit( `Registro Cliente: Paso 2` )
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

  nextStep( ) {
      this.subscription.add(
          Observable.interval( 1000 ).subscribe( x => {
              this.router.navigate( [ 'formulario-cliente','paso-3' ] )
          })
      )
  }

  ngOnDestroy( ) {
      this.subscription.unsubscribe( );
  }

  resendCode( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.subscription.add(
              this.customerRegService.resendCode( ).subscribe(
                  res => {
                      this.stepRef.openNewCodeModal( )
                      this.requestSent = false
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  },
                  err => {
                      this.requestSent = true
                      this.dataService.errorHandler( err, { userType: 'Client' } )
                  },
                  () => {
                      UtilitiesService.debug( "Code sent!" )
                      this.dataService.updateShowBird( false )
                  }
              )
          )
      }
  }

  success = false
  onSubmit( data ) {
      if ( !this.success ) {
          UtilitiesService.debug( "Posting data..." )
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.subscription.add(
              this.customerRegService.verifyCode( data.form.get( 'numb' ).value ).subscribe(
                  res => {
                      this.customerRegService.updateStep( this.user_data.id, 3 ).subscribe(
                          ttt => {
                              localStorage.setItem( 'customer_registration_process', JSON.stringify({
                                  current_step: 3
                              }))

                              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                              this.requestSent = false
                              this.success = true
                              this.stepRef.openSuccessModal( )
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
                  err => {
                    this.dataService.errorHandler( err, { userType: 'Client' } )
                    this.invalidCode = true
                    this.requestSent = false
                  },
                  () => {
                      UtilitiesService.debug( "Code verified!" )
                  }
              )
          )
      } else if ( this.success ) {
          this.stepRef.openSuccessModal( )
      }
  }

}
