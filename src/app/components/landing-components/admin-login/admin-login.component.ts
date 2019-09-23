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
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
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
export class AdminLoginComponent implements OnInit {

  constructor( private router: Router, private sessionService: SessionService,
        private adminManService: AdminManagementService, private dataService: DataService ) { }

  @ViewChild( 'email' ) email_input: any;
  @ViewChild( 'password' ) password_input: any;

  invalidCredentials = false;
  requestSent = false

  dead_session = false

  ngOnInit( ) {
      this.dataService.onInit( `Iniciar sesión Administrador` )
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
      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.sessionService.signIn( this.email_input.nativeElement.value, this.password_input.nativeElement.value, "Admin" ).subscribe(
          res => {
              this.dataService.updateUserAndSessionData( res.json( ).data.auth_token, null )
              this.sessionService.isSessionActive( "Admin" )[ 0 ].subscribe(
                  ans => {
                      localStorage.removeItem( 'redirect_to_url' )
                      localStorage.setItem( 'user_type', 'admin' )
                      this.dataService.updateUserAndSessionData( res.json( ).data.auth_token, ans.json( ).admin )

                      this.adminManService.getOldCustomers( 1 ).subscribe(
                          res2 => {
                              this.requestSent = false
                              var total = res2.json( ).meta.new_clients + res2.json( ).meta.new_projects
                              localStorage.setItem( 'total_notifications', String( total ) )
                              this.router.navigate( [ 'admin', 'match' ] )
                          },
                          err => {
                              this.requestSent = false
                              this.dataService.errorHandler( err, { userType: 'Admin' } )
                          },
                          () => {
                              UtilitiesService.debug( "Got old customers" )
                              this.dataService.updateShowBird( false )
                          }
                      )
                  },
                  err => {
                      this.requestSent = false
                      this.dataService.errorHandler( err, { userType: 'Admin' } )
                  },
                  () => {
                      UtilitiesService.debug( "user data retreived" )
                  }
              )
          },
          err => {
              this.invalidCredentials = true
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Admin', validations: true } )
          },
          () => {
              UtilitiesService.debug( "Successfull loggin" )
          }
      )
  }

}
