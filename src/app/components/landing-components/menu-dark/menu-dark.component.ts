import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition, stagger, query, keyframes } from '@angular/animations';
import { SessionService } from '../../../services/session/session.service';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-menu-dark',
  templateUrl: './menu-dark.component.html',
  styleUrls: ['./menu-dark.component.scss'],
  animations: [
    trigger('navState', [
      transition(':enter', [
        style({opacity:0,height:0}),
        animate(200, style({opacity:1,height:'*'}))
      ]),
      transition(':leave', [
        animate(200, style({opacity:0,height:0}))
      ])
    ])
  ]
})
export class MenuDarkComponent implements OnInit {

  constructor( private router: Router, private sessionService: SessionService, private uService: UtilitiesService ) {
    this.API_path = uService.API_path
  }

  sessionActive = false
  API_path: String
  user_data

  navLinksState: Boolean = true

  ngOnInit( ) {
      if ( window.innerWidth <= 992 ) {
        this.navLinksState = false
      } else {
        this.navLinksState = true
      }

      var data = localStorage.getItem( 'user_data' )
      var session_data;
      if ( data != null ) {
        this.user_data = JSON.parse( data ).user_data
        session_data = JSON.parse( data ).session_data
        this.sessionService.isSessionActive( 'Client' )[ 0 ].subscribe(
            res => {
                /* Session is active... */
                UtilitiesService.debug( "Redirecting..." )
                this.sessionActive = true
            },
            err => {
                /* Maybe an investor?... */
                this.sessionService.isSessionActive( 'Investor' )[ 0 ].subscribe(
                    res => {
                        UtilitiesService.debug( "Redirecting..." )
                        this.sessionActive = true
                    },
                    err => {
                        /* Maybe an admin?... */
                        this.sessionService.isSessionActive( 'Admin' )[ 0 ].subscribe(
                            res => {
                                UtilitiesService.debug( "Redirecting..." )
                                this.sessionActive = true
                            },
                            err => {
                              this.sessionActive = false
                              localStorage.clear( )
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
            },
            () => {
                UtilitiesService.debug( "Session is active" )
            }
        )
      }
  }

  signOut( ) {
      if ( this.sessionActive ) {
          var user_type = localStorage.getItem( 'user_type' )
          if ( user_type == null ) {
              this.router.navigate( [ '/iniciar-sesion' ] )
              return
          } else {
              switch ( user_type ) {
                  case "client":
                      this.router.navigate( [ 'cliente', 'perfil' ] )
                      break;
                  case "investor":
                      this.router.navigate( [ 'inversionista', 'perfil' ] )
                      break;
                  case "admin":
                      this.router.navigate( [ 'admin', 'match' ] )
                      break;
              }
          }
      } else {
          this.router.navigate( [ '/iniciar-sesion' ] )
      }
  }

  @HostListener( 'window:resize', [ '$event' ] )
  onResize( event ) {
    if ( window.innerWidth <= 992 ) {
      this.navLinksState = false
    } else {
      this.navLinksState = true
    }
  }

}
