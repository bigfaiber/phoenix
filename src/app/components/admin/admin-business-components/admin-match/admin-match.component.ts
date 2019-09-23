import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-match',
  templateUrl: './admin-match.component.html',
  styleUrls: ['./admin-match.component.scss'],
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
export class AdminMatchComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  matches = []
  API_path;
  total_notifications = 0
  requestSent = false
  meta
  page = 1

  ngOnInit() {
      this.dataService.onInit( `Matches` )
      this.API_path = this.adminManService.API_path

      var tmp = localStorage.getItem( 'total_notifications' )
      if ( tmp == null )
          this.total_notifications = 0
      else
          this.total_notifications = Number( tmp )

      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.adminManService.getGroupedMatches( this.page ).subscribe(
          res => {
              this.matches = res.json( ).data
              this.meta = res.json( ).meta
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              this.requestSent = false
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
              UtilitiesService.debug( "Got matches" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  imgPath( index, s ) {
      var dec = this.matches[ index ].client.rating - Math.floor( this.matches[ index ].client.rating )

      if ( s > this.matches[ index ].client.rating )
          return "assets/images/client-profile/star_empty.png"
      if ( s < Math.floor( this.matches[ index ].client.rating ) )
          return "assets/images/client-profile/star_fill.png"
      else
          if ( dec < 0.5 )
              return "assets/images/client-profile/star_empty.png"
          else
              return "assets/images/client-profile/star_half_fill.png"
  }

  seeSinglematch( index ) {
      localStorage.setItem( 'single_match', JSON.stringify( this.matches[ index ] ) )
      this.router.navigate( [ 'admin', 'datos-match' ] )
  }

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  onScrollDown( ) {
      UtilitiesService.debug( 'scrolled down!!' );
      // if ( this.page + 1 <= this.meta.total_pages ) {
      //     this.page++
      //     this.requestSent = true
      //     this.dataService.updateShowBird( true )
      //     this.adminManService.getMatches( this.page ).subscribe(
      //         res => {
      //             this.matches.concat( res.json( ).matches )
      //             this.meta = res.json( ).meta
      //             this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
      //             this.requestSent = false
      //         },
      //         err => {
      //             this.requestSent = false
      //             this.dataService.errorHandler( err, { userType: 'Admin' } )
      //         },
      //         () => {
      //             this.dataService.updateShowBird( false )
      //             UtilitiesService.debug( "Got matches" )
      //         }
      //     )
      // }
  }

}
