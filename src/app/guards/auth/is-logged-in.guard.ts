import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '../../services/session/session.service';
import { UtilitiesService } from "../../services/utilities-service/utilities.service";

@Injectable()
export class IsLoggedInGuard implements CanActivate {

  constructor( private router: Router, private sessionService: SessionService ) {}

  canActivate( ) {
      var data = localStorage.getItem( 'user_data' )
      var session_data;
      if ( data != null ) {
          session_data = JSON.parse( data ).session_data
      }
      else
          return true

      this.sessionService.isSessionActive( 'Client' )[ 0 ].subscribe(
          res => {
              /* Session is active... */
              UtilitiesService.debug( "Redirecting..." )
              this.router.navigate( [ "cliente", "perfil" ] )
          },
          err => {
              /* Maybe an investor?... */
              this.sessionService.isSessionActive( 'Investor' )[ 0 ].subscribe(
                  res => {
                      UtilitiesService.debug( "Redirecting..." )
                      this.router.navigate( [ "inversionista", "perfil" ] )
                  },
                  err => {
                      /* Maybe an admin?... */
                      this.sessionService.isSessionActive( 'Admin' )[ 0 ].subscribe(
                          res => {
                              UtilitiesService.debug( "Redirecting..." )
                              this.router.navigate( [ "admin", "match" ] )
                          },
                          err => {

                          },
                          () => {
                              UtilitiesService.debug( "Admin session is active" )
                          }
                      )
                  },
                  () => {
                      UtilitiesService.debug( "Investor session is active" )
                  }
              )
              return false
          },
          () => {
              UtilitiesService.debug( "Session is active" )
          }
      )

      return true
  }
}
