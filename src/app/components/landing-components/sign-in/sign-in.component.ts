import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { style, state, animate, transition, trigger } from '@angular/core';
import { SessionService } from '../../../services/session/session.service';
import { AdminManagementService } from "../../../services/admin-management/admin-management.service";
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
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
export class SignInComponent implements OnInit, OnDestroy {

  constructor( private router: Router, private sessionService: SessionService,
        private adminManService: AdminManagementService, private dataService: DataService ) { }

  @ViewChild( 'email' ) email_input: any;
  @ViewChild( 'password' ) password_input: any;
  @ViewChild( 'rol' ) rol: any;

  invalidCredentials = false;
  dead_session = false
  requestSent = false

  ngOnInit( ) {
      this.dataService.onInit( `Iniciar Sesión` )
      var tmp = localStorage.getItem( 'redirect_to_url' )
      if ( tmp != null )
          this.dead_session = true
  }

  ngOnDestroy( ) {
      localStorage.removeItem( 'redirect_to_url' )
  }

  signIn( ) {
      if ( ( this.email_input.nativeElement.value == "" || this.password_input.nativeElement.value == "" ) && !this.requestSent )
          return
      this.dataService.updateShowBird( true )
      this.sessionService.signIn( this.email_input.nativeElement.value, this.password_input.nativeElement.value, this.rol.nativeElement.value ).subscribe(
          res => {
              this.dataService.updateUserAndSessionData( res.json( ).data.auth_token, null )
              this.sessionService.isSessionActive( this.rol.nativeElement.value )[ 0 ].subscribe(
                  ans => {
                      this.requestSent = false
                      localStorage.removeItem( 'redirect_to_url' )
                      if ( this.rol.nativeElement.value == "Client" ) {
                          localStorage.setItem( 'user_type', 'client' )
                          this.dataService.updateUserAndSessionData( res.json( ).data.auth_token, ans.json( ).client )
                      }
                      else if ( this.rol.nativeElement.value == "Investor" ) {
                          localStorage.setItem( 'user_type', 'investor' )
                          this.dataService.updateUserAndSessionData( res.json( ).data.auth_token, ans.json( ).investor )
                      }

                      if ( this.rol.nativeElement.value == "Client" ) {
                        ( <any> window ).ga( 'send', 'event', {
                          eventCategory: 'login',
                          eventAction: 'client login'
                        });
                        this.router.navigate( [ 'cliente', 'perfil' ] )
                      }
                      else if ( this.rol.nativeElement.value == "Investor" ) {
                        ( <any> window ).ga( 'send', 'event', {
                          eventCategory: 'login',
                          eventAction: 'investor login'
                        });
                        this.router.navigate( [ 'inversionista', 'perfil' ] )
                      }
                  },
                  err => {
                      this.dataService.errorHandler( err, { userType: 'Client' } )
                      this.requestSent = false
                  },
                  () => {
                      UtilitiesService.debug( "user data retreived" )
                      this.dataService.updateShowBird( false )
                  }
              )
          },
          err => {
              this.dataService.errorHandler( err, { userType: 'Client', validations: true } )
              this.invalidCredentials = true
              this.requestSent = false
          },
          () => {
              UtilitiesService.debug( "Successfull loggin" )
          }
      )
  }

}
