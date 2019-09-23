import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InvestorRegistrationService } from '../../../services/investor-registration/investor-registration.service';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-investor-registration-step5',
  templateUrl: './investor-registration-step5.component.html',
  styleUrls: ['./investor-registration-step5.component.scss'],
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
export class InvestorRegistrationStep5Component implements OnInit {

  constructor( private router: Router, private investorRegService: InvestorRegistrationService ) {
      for ( var i = ( new Date( ) ).getFullYear( ); i <= ( new Date( ) ).getFullYear( ) + 30; i++ )
          this.years.push( i )
  }

  requestSent = false

  @ViewChild( 'month' ) month: any;
  @ViewChild( 'year' ) year: any;

  @ViewChild( 'f1' ) f1: any;
  @ViewChild( 'f2' ) f2: any;

  @ViewChild( 'f6' ) f6: any;

  years = []

  form = new FormGroup({
      names: new FormControl( null, [ Validators.required, Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+" ) ] ),
      last_names: new FormControl( null, [ Validators.required, Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+" ) ] ),
      card: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ), Validators.minLength( 8 ) ] ),
      sec_numb: new FormControl( null, [ Validators.pattern( "[0-9]+" ), Validators.minLength( 3 ), , Validators.maxLength( 3 ) ] )
  })

  registration_data_parsed;
  session_data;
  user_data;

  ngOnInit() {
      window.scrollTo( 0, 0 )
      var registration_data = localStorage.getItem( 'investor_registration_process' )

      /* Force step (for testing) */
      // localStorage.setItem( 'investor_registration_process', JSON.stringify({
      //     current_step: 1
      // }))

      /* First time in registration */
      if ( registration_data == null ) {
          localStorage.setItem( 'investor_registration_process', JSON.stringify({
              current_step: 1
          }))
          this.router.navigate( [ 'formulario-inversionista','paso-1' ] )
      } /* A registration process already started */
      else {
          this.registration_data_parsed = JSON.parse( registration_data )
          switch ( this.registration_data_parsed.current_step ) {
              case 1:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-inversionista','paso-1' ] )
                  break;
              case 2:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-inversionista','paso-2' ] )
                  break;
              case 3:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-inversionista','paso-3' ] )
                  break;
              case 4:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-inversionista','paso-4' ] )
                  break;
              case 6:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-inversionista','paso-6' ] )
                  break;
          }

          this.session_data = JSON.parse( localStorage.getItem( 'user_data' ) ).session_data
          this.user_data = JSON.parse( localStorage.getItem( 'user_data' ) ).user_data
          /* TODO: Verify if token is alive */
      }
  }

  isFormValid( ) {
      if ( !this.f1.nativeElement.checked && !this.f2.nativeElement.checked )
          return false
      if ( this.month.nativeElement.value == "0" || this.year.nativeElement.value == "0" )
          return false
      if ( !this.f2.nativeElement.checked && ( this.f6.nativeElement.value == "" || this.f6.nativeElement.value == undefined ) )
          return false

      return this.form.valid && !this.requestSent
  }

  onSubmit( ) {
      if ( this.isFormValid( ) ) {
          UtilitiesService.debug( "Posting data..." )
          this.requestSent = true
          this.investorRegService.postStep5Data( this.f2.nativeElement.checked ? 1 : 0,
                                                  this.form.value, this.month.nativeElement.value, this.year.nativeElement.value ).subscribe(
                                                      res => {
                                                          this.investorRegService.updateStep( this.user_data.id, 6 ).subscribe(
                                                              ttt => {
                                                                  localStorage.setItem( 'investor_registration_process', JSON.stringify({
                                                                      current_step: 6
                                                                  }))
                                                                  var user_data: any = JSON.parse( localStorage.getItem( 'user_data' ) )
                                                                  user_data.session_data.auth_token = res.headers.get( 'token' )
                                                                  localStorage.setItem( 'user_data', JSON.stringify( user_data ) )
                                                                  this.requestSent = false
                                                                  this.router.navigate( [ 'formulario-inversionista','paso-6' ] )
                                                              },
                                                              err => {
                                                                  UtilitiesService.debug( err )
                                                                  if ( err.status == 401 ) {
                                                                      UtilitiesService.debug( "Session is not more active, redirecting..." )
                                                                      localStorage.setItem( 'redirect_to_url', window.location.pathname )
                                                                      this.router.navigate( [ "/iniciar-sesion" ] )
                                                                  }
                                                                  this.requestSent = false
                                                              },
                                                              () => {
                                                                  UtilitiesService.debug( "Step updated" )
                                                              }
                                                          )
                                                      },
                                                      err => {
                                                          UtilitiesService.debug( err )
                                                          if ( err.status == 401 ) {
                                                              UtilitiesService.debug( "Session is not more active, redirecting..." )
                                                              localStorage.setItem( 'redirect_to_url', window.location.pathname )
                                                              this.router.navigate( [ "/iniciar-sesion" ] )
                                                          }
                                                          this.requestSent = false
                                                      },
                                                      () => {
                                                          UtilitiesService.debug( "Payment created" )
                                                      }
                                                  )
      }
  }

}
