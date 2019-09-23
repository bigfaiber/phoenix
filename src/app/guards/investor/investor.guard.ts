import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '../../services/session/session.service';
import { DataService } from '../../services/data-service/data.service';
import { UtilitiesService } from "../../services/utilities-service/utilities.service";

@Injectable()
export class InvestorGuard implements CanActivate {
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

      this.sessionService.isSessionActive( 'Investor' )[ 0 ].subscribe(
          res => {
              /* Session is active, continue... */
              if ( res.json( ).investor == undefined ) {
                  UtilitiesService.debug( "User is not an investor, redirecting..." )
                  this.router.navigate( [ "/iniciar-sesion" ] )
              }

              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), res.json( ).investor )
          },
          err => {
              /* Session is not active, redirect to sign-in... */
              this.dataService.errorHandler( err, { userType: 'Investor' } )
          },
          () => {
              UtilitiesService.debug( "Session is active" )
          }
      )

      return true
  }
}
