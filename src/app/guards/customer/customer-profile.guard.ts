import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '../../services/session/session.service';
import { DataService } from '../../services/data-service/data.service';
import { UtilitiesService } from "../../services/utilities-service/utilities.service";

@Injectable()
export class CustomerProfileGuard implements CanActivate {
  constructor( private router: Router, private sessionService: SessionService,
      private dataService: DataService ) {}

  canActivate( ) {
      var data = localStorage.getItem( 'user_data' )
      var session_data;
      if ( data != null )
          session_data = JSON.parse( data ).session_data
      else {
          localStorage.setItem( 'redirect_to_url', window.location.pathname )
          this.router.navigate( [ "/iniciar-sesion" ] )
          return false
      }

      this.sessionService.isSessionActive( 'Client' )[ 0 ].subscribe(
          res => {
              /* Session is active, checking if it is a client... */
              if ( res.json( ).client == undefined ) {
                  UtilitiesService.debug( "User is not a client, redirecting..." )
                  this.router.navigate( [ "/iniciar-sesion" ] )
              }
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), res.json( ).client )

              var step = res.json( ).client.step
              switch ( step ) {
                  case 1:
                      localStorage.setItem( 'customer_registration_process', JSON.stringify({
                          current_step: 2
                      }))
                      this.router.navigate( [ "formulario-cliente", "paso-2" ] )
                      break
                  case 2:
                      localStorage.setItem( 'customer_registration_process', JSON.stringify({
                          current_step: 2
                      }))
                      this.router.navigate( [ "formulario-cliente", "paso-2" ] )
                      break
                  case 3:
                      localStorage.setItem( 'customer_registration_process', JSON.stringify({
                          current_step: 3
                      }))
                      this.router.navigate( [ "formulario-cliente", "paso-3" ] )
                      break
              }
          },
          err => {
              /* Session is not active, redirect to sign-in... */
              this.dataService.errorHandler( err, { userType: 'Client' } )
          },
          () => {
              UtilitiesService.debug( "Session is active" )
          }
      )

      return true
  }
}
