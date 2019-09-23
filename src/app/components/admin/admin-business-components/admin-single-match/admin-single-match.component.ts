import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-single-match',
  templateUrl: './admin-single-match.component.html',
  styleUrls: ['./admin-single-match.component.scss'],
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
export class AdminSingleMatchComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  match;

  API_path;

  requestSent = false

  ngOnInit() {
      this.dataService.onInit( `Detalle Match` )
      this.API_path = this.adminManService.API_path

      var match = localStorage.getItem( 'single_match' )
      if ( match == null ) {
          UtilitiesService.debug( "No match found, redirecting..." )
          this.router.navigate( [ 'admin', 'match' ] )
          return
      } else
          this.match = JSON.parse( match )

      UtilitiesService.debug( this.match )
  }

  imgPath( index ) {
      var dec = this.match.client.rating - Math.floor( this.match.client.rating )

      if ( index > this.match.client.rating )
          return "assets/images/client-profile/star_empty.png"
      if ( index < Math.floor( this.match.client.rating ) )
          return "assets/images/client-profile/star_fill.png"
      else
          if ( dec < 0.5 )
              return "assets/images/client-profile/star_empty.png"
          else
              return "assets/images/client-profile/star_half_fill.png"
  }

  openCustomerProfile( ) {
      localStorage.setItem( 'admin_customer_profile', JSON.stringify( this.match.client ) )
      localStorage.setItem( 'came_from', window.location.pathname )
      this.router.navigate( [ 'admin', 'perfil-cliente' ] )
  }

  openInvestorProfile( i ) {
      localStorage.setItem( 'admin_investor_profile', JSON.stringify( this.match.investors[ i ] ) )
      localStorage.setItem( 'came_from', window.location.pathname )
      this.router.navigate( [ 'admin', 'perfil-inversionista' ] )
  }

  approveMatch( i, e ) {
      e.stopPropagation( )
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.approveMatch( this.match.investors[ i ].id, this.match.project.id ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.router.navigate( [ 'admin', 'match' ] )
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  this.dataService.updateShowBird( false )
                  UtilitiesService.debug( "Match approved" )
              }
          )
      }
  }

  getBack( ) {
      window.history.back( )
  }

}
