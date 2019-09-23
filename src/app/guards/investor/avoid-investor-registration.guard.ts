import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SessionService } from '../../services/session/session.service';
import { UtilitiesService } from "../../services/utilities-service/utilities.service";

@Injectable()
export class AvoidInvestorRegistrationGuard implements CanActivate {
  constructor( private router: Router, private sessionService: SessionService ) {}

  canActivate( ) {
    var data = localStorage.getItem( 'user_data' )
    var session_data;
    if ( data != null )
        session_data = JSON.parse( data ).session_data
    else
        return true

    this.sessionService.isSessionActive( 'Investor' )[ 0 ].subscribe(
        res => {
            /* Session is active, avoid registration... */
            var step = res.json( ).investor.step
            switch ( step ) {
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
                case 6:
                    this.router.navigate( [ "inversionista", "perfil" ] )
                    break
                default:
                    this.router.navigate( [ "inversionista", "perfil" ] )
            }
        },
        err => {
            /* Session is not active, permit registration... */
            this.sessionService.isSessionActive( 'Client' )[ 0 ].subscribe(
                res => {
                    UtilitiesService.debug( "But not an investor, redirecting..." )
                    this.router.navigate( [ "cliente", "perfil" ] )
                },
                err => {
                    this.sessionService.isSessionActive( 'Admin' )[ 0 ].subscribe(
                        res => {
                            UtilitiesService.debug( "But not an investor, redirecting..." )
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
                    UtilitiesService.debug( "Customer session is active" )
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
