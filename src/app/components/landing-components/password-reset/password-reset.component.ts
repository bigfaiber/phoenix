import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { SessionService } from '../../../services/session/session.service';
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
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
export class PasswordResetComponent implements OnInit, OnDestroy {

  constructor( private router: Router, private activatedRoute: ActivatedRoute,
        private sessionService: SessionService, private dataService: DataService ) { }

  form = new FormGroup({
      password: new FormControl( null, [ Validators.required, Validators.minLength( 8 ), Validators.pattern( "[a-zA-Z0-9]+" ) ] ),
      password_confirmation: new FormControl( null, [ Validators.required, Validators.minLength( 8 ), Validators.pattern( "[a-zA-Z0-9]+" ) ] ),
  });

  success = false
  error = false
  requestSent = false
  params;

  private subscription: Subscription = new Subscription( );

  ngOnInit( ) {
      this.dataService.onInit( `Cambio de Contraseña` )
      this.activatedRoute.queryParams.subscribe(
          ( params: Params ) => {
              this.params = params;
              if ( this.params.email == undefined || this.params.token == undefined || this.params.type == undefined ) {
                  UtilitiesService.debug( "Params not found, redirecting..." )
                  this.router.navigate( [ 'iniciar-sesion' ] )
              }
          }
      );
  }

  isFormValid( ) {
      if ( this.form.value.password != this.form.value.password_confirmation )
          return false
      return this.form.valid
  }

  onSubmit( omb ) {
      if ( this.isFormValid( ) && !this.success && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.sessionService.resetPassword( this.params.token, this.params.email, this.form.value.password,
                                              this.form.value.password_confirmation, this.params.type ).subscribe(
                                                  res => {
                                                      this.success = true
                                                      this.requestSent = false
                                                      this.dataService.updateShowBird( false )
                                                      omb.click( )
                                                  },
                                                  err => {
                                                      UtilitiesService.debug( err )
                                                      this.error = true
                                                      this.requestSent = false
                                                      this.dataService.updateShowBird( false )
                                                  },
                                                  () => {
                                                      UtilitiesService.debug( "Password reset" )
                                                  }
                                              )
      }
  }

  ngOnDestroy( ) {
      this.subscription.unsubscribe( );
  }

  nextStep( ) {
      this.subscription.add(
          Observable.interval( 1000 ).subscribe( x => {
              this.router.navigate( [ 'iniciar-sesion' ] )
          })
      )
  }

}
