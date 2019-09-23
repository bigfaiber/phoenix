import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '../../services/session/session.service';
import { DataService } from '../../services/data-service/data.service';
import { UtilitiesService } from "../../services/utilities-service/utilities.service";

@Injectable()
export class InvestorProfileGuard implements CanActivate {
  constructor( private router: Router, private sessionService: SessionService,
      private dataService: DataService ) {}

  canActivate( ) {
      UtilitiesService.debug( window.location.pathname.split( "/" )[ 2 ] )

      var data = localStorage.getItem( 'user_data' )
      var session_data;
      if ( data != null )
          session_data = JSON.parse( data ).session_data
      else {
          localStorage.setItem( 'redirect_to_url', window.location.pathname )
          this.router.navigate( [ "/iniciar-sesion" ] )
          return false
      }

      this.sessionService.isSessionActive( 'Investor' )[ 0 ].subscribe(
          res => {
              /* Session is active, checking if it is an investor... */
              if ( res.json( ).investor == undefined ) {
                  UtilitiesService.debug( "User is not an investor, redirecting..." )
                  this.router.navigate( [ "/iniciar-sesion" ] )
              }

              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), res.json( ).investor )
              var step = res.json( ).investor.step
              switch ( step ) {
                  case 1:
                      localStorage.setItem( 'investor_registration_process', JSON.stringify({
                          current_step: 2
                      }))
                      this.router.navigate( [ "formulario-inversionista", "paso-2" ] )
                      break
                  case 2:
                      localStorage.setItem( 'investor_registration_process', JSON.stringify({
                          current_step: 2
                      }))
                      this.router.navigate( [ "formulario-inversionista", "paso-2" ] )
                      break
                  case 3:
                      localStorage.setItem( 'investor_registration_process', JSON.stringify({
                          current_step: 3
                      }))
                      this.router.navigate( [ "formulario-inversionista", "paso-3" ] )
                      break
              }
          },
          err => {
              /* Session is not active, redirect to sign-in... */
              this.dataService.errorHandler( err, { userType: 'Investor' } )
          },
          () => {
              UtilitiesService.debug( "Session is active" )
              // if ( window.location.pathname.split( "/" )[ 2 ] == "perfil" ) {
              //     var tmp = localStorage.getItem( 'already_reload' )
              //     if ( tmp == null ) {
              //        localStorage.setItem( 'already_reload', "0" )
              //        window.location.reload( )
              //     } else {
              //        if ( tmp == "0" ) {
              //            localStorage.setItem( 'already_reload', "1" )
              //            window.location.reload( )
              //        }
              //     }
              // }
          }
      )

      return true
  }
}
