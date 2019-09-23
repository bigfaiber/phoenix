import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InvestorRegistrationService } from '../../../services/investor-registration/investor-registration.service';
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from '../../../services/utilities-service/utilities.service';
import { StepOneComponent } from '../../share/registration/step-one/step-one.component';

@Component({
  selector: 'app-investor-registration-step1',
  templateUrl: './investor-registration-step1.component.html',
  styleUrls: ['./investor-registration-step1.component.scss'],
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
export class InvestorRegistrationStep1Component implements OnInit, OnDestroy {

  constructor( private router: Router, private investorRegService: InvestorRegistrationService,
      private dataService: DataService ) { }

  requestSent = false
  @ViewChild( StepOneComponent ) stepComRef: StepOneComponent

  private subscription: Subscription = new Subscription( );

  uniqueness_errors = {
      email: false,
      id: false,
      phone: false
  }

  phone_error = false
  registration_data_parsed;

  ngOnInit( ) {
      this.dataService.onInit( `Registro Inversionista: Paso 1` )
      var registration_data = localStorage.getItem( 'investor_registration_process' )

      /* Force step (for testing) */
      // localStorage.setItem( 'investor_registration_process', JSON.stringify({
      //     current_step: 1
      // }))

      /* Make sure investor "dream" was provided */
      var investor_dream = localStorage.getItem( 'investor_dream' )
      if ( investor_dream == null ) {
          UtilitiesService.debug( "Investor landing form not provided, redirecting..." )
          this.router.navigate( [ 'registro-inversionista' ] )
      }

      /* First time in registration */
      if ( registration_data == null ) {
          localStorage.setItem( 'investor_registration_process', JSON.stringify({
              current_step: 1
          }))
      } /* A registration process already started */
      else {
          this.registration_data_parsed = JSON.parse( registration_data )
          switch ( this.registration_data_parsed.current_step ) {
              case 2:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-inversionista','paso-2' ] )
                  break;
              case 3:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-inversionista','paso-3' ] )
                  break;
              case 6:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-inversionista','paso-6' ] )
                  break;
          }
      }
  }

  nextStep( ) {
      this.subscription.add(
          Observable.interval( 1000 ).subscribe( x => {
              this.router.navigate( [ 'formulario-inversionista','paso-2' ] )
          })
      )
  }

  ngOnDestroy( ) {
      this.subscription.unsubscribe( );
  }

  success = false
  onSubmit( data ) {
      if ( !this.success ) {
          UtilitiesService.debug( "Posting data..." )
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.subscription.add(
              this.investorRegService.postStepOneData( data.form.value, JSON.parse( localStorage.getItem( 'investor_dream' ) ) ).subscribe(
                  res => {
                      this.subscription.add(
                          this.investorRegService.signInUser( data.form.value.email, data.form.value.password ).subscribe(
                              ans => {
                                  this.dataService.updateUserAndSessionData( ans.json( ).data.auth_token, null )
                                  this.investorRegService.acceptTerms( res.json( ).investor.id ).subscribe(
                                      xxx => {
                                        this.investorRegService.updateStep( res.json( ).investor.id, 2 ).subscribe(
                                            ttt => {
                                                localStorage.setItem( 'investor_registration_process', JSON.stringify({
                                                    current_step: 2
                                                }))
                                                this.dataService.updateUserAndSessionData( ans.json( ).data.auth_token, res.json( ).investor )

                                                if ( data.fb.fb_profilepic_url ) {
                                                  this.investorRegService.postFacebookPhoto( data.fb.fb_profilepic_url ).subscribe(
                                                    res => {
                                                      this.success = true
                                                      this.requestSent = false
                                                      this.stepComRef.openModal( )
                                                    },
                                                    err => {
                                                      this.requestSent = false
                                                      this.dataService.errorHandler( err, { userType: 'Client' } )
                                                    },
                                                    () => {
                                                      UtilitiesService.debug( "Facebook photo upladed" )
                                                      this.dataService.updateShowBird( false )
                                                    }
                                                  )
                                                } else {
                                                  this.success = true
                                                  this.requestSent = false
                                                  this.dataService.updateShowBird( false )
                                                  this.stepComRef.openModal( )
                                                }
                                            },
                                            err => {
                                              this.requestSent = false
                                                this.dataService.errorHandler( err, { userType: 'Investor' } )
                                            },
                                            () => {
                                                UtilitiesService.debug( "Step updated" )
                                            }
                                        )
                                      },
                                      err => {
                                          this.dataService.errorHandler( err, { userType: 'Investor' } )
                                          this.requestSent = false
                                      },
                                      () => {
                                          UtilitiesService.debug( "Terms accepted" )
                                      }
                                  )
                              },
                              err => {
                                  this.requestSent = false
                                  this.dataService.errorHandler( err, { userType: 'Investor' } )
                              },
                              () => {
                                  UtilitiesService.debug( "User signed in successfully" )
                              }
                          )
                      )
                  },
                  err => {
                      this.dataService.errorHandler( err, { userType: 'Investor', validations: true } )
                      if ( err.json( ).data != undefined ) {
                          var errors = err.json( ).data.errors
                          if ( errors.email != undefined )
                              this.uniqueness_errors.email = true
                          if ( errors.identification != undefined )
                              this.uniqueness_errors.id = true
                          if ( errors.phone != undefined )
                              this.uniqueness_errors.phone = true
                          if ( typeof errors[ 0 ] == "string" )
                              if ( errors[ 0 ].indexOf( "We have" ) >= 0 )
                                  this.uniqueness_errors.id = true
                          if ( typeof errors[ 0 ] == "string" )
                              if ( errors[ 0 ].indexOf( "We can" ) >= 0 )
                                  this.phone_error = true
                      }
                      this.requestSent = false
                  },
                  () => {
                      UtilitiesService.debug( "User posted!" )
                  }
              )
          )
      } else if ( this.success ) {
          this.stepComRef.openModal( )
      }
  }
}
