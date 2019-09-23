import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-investors',
  templateUrl: './admin-investors.component.html',
  styleUrls: ['./admin-investors.component.scss'],
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
export class AdminInvestorsComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  buttonSelected = false;

  investors = []

  API_path;

  total_notifications = 0

  requestSent = false

  old_page = 1
  new_page = 1

  old_meta;
  new_meta;

  ngOnInit( ) {
      this.dataService.onInit( `Inversionistas` )
      this.API_path = this.adminManService.API_path

      var tmp = localStorage.getItem( 'total_notifications' )
      if ( tmp == null )
          this.total_notifications = 0
      else
          this.total_notifications = Number( tmp )

      this.requestSent = true
      this.dataService.updateShowBird( true )
      var tmp = localStorage.getItem( 'investor_memory' )
      if ( tmp == null )
          this.adminManService.getNewInvestors( this.new_page ).subscribe(
              res => {
                  this.investors = res.json( ).investors
                  this.new_meta = res.json( ).meta
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Got new investors" )
                  this.dataService.updateShowBird( false )
              }
          )
      else {
          this.buttonSelected = tmp == 'true' ? true : false
          if ( this.buttonSelected )
              this.adminManService.getOldInvestors( this.old_page ).subscribe(
                  res => {
                      this.investors = res.json( ).investors
                      this.old_meta = res.json( ).meta
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                      this.requestSent = false
                  },
                  err => {
                      this.requestSent = false
                      this.dataService.errorHandler( err, { userType: 'Admin' } )
                  },
                  () => {
                      UtilitiesService.debug( "Got old investors" )
                      this.dataService.updateShowBird( false )
                  }
              )
          else
              this.adminManService.getNewInvestors( this.new_page ).subscribe(
                  res => {
                      this.investors = res.json( ).investors
                      this.new_meta = res.json( ).meta
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                      this.requestSent = false
                  },
                  err => {
                      this.requestSent = false
                      this.dataService.errorHandler( err, { userType: 'Admin' } )
                  },
                  () => {
                      UtilitiesService.debug( "Got new investors" )
                      this.dataService.updateShowBird( false )
                  }
              )
      }
  }

  toggleCButton( ) {
      if ( this.buttonSelected ) {
          this.buttonSelected = false;
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.new_page = 1
          this.adminManService.getNewInvestors( this.new_page ).subscribe(
              res => {
                  this.investors = res.json( ).investors
                  this.new_meta = res.json( ).meta
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Got new investors" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  toggleDButton( ) {
      if ( !this.buttonSelected ) {
          this.buttonSelected = true;
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.old_page = 1

          this.adminManService.getOldInvestors( this.old_page ).subscribe(
              res => {
                  this.investors = res.json( ).investors
                  this.old_meta = res.json( ).meta
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Got old investors" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  showProfile( index ) {
      localStorage.setItem( 'admin_investor_profile', JSON.stringify( this.investors[ index ] ) )
      localStorage.setItem( 'came_from', window.location.pathname )
      this.router.navigate( [ 'admin', 'perfil-inversionista' ] )
  }

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  onScrollDown( ) {
      UtilitiesService.debug( 'scrolled down!!' );
      if ( this.buttonSelected ) {
          if ( this.old_page + 1 <= this.old_meta.total_pages ) {
              this.old_page++
              this.requestSent = true
              this.dataService.updateShowBird( true )
              this.adminManService.getOldInvestors( this.old_page ).subscribe(
                  res => {
                      this.investors.concat( res.json( ).investors )
                      this.old_meta = res.json( ).meta
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                      this.requestSent = false
                  },
                  err => {
                      this.requestSent = false
                      this.dataService.errorHandler( err, { userType: 'Admin' } )
                  },
                  () => {
                      UtilitiesService.debug( "Got old investors" )
                      this.dataService.updateShowBird( false )
                  }
              )
          }
      }
      else {
          if ( this.new_page + 1 <= this.new_meta.total_pages ) {
              this.new_page++
              this.requestSent = true
              this.dataService.updateShowBird( true )
              this.adminManService.getNewInvestors( this.new_page ).subscribe(
                  res => {
                      this.investors.concat( res.json( ).investors )
                      this.new_meta = res.json( ).meta
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                      this.requestSent = false
                  },
                  err => {
                      this.requestSent = false
                      this.dataService.errorHandler( err, { userType: 'Admin' } )
                  },
                  () => {
                      UtilitiesService.debug( "Got new investors" )
                      this.dataService.updateShowBird( false )
                  }
              )
          }
      }
  }

  ngOnDestroy( ) {
      localStorage.setItem( 'investor_memory', String( this.buttonSelected ) )
  }

}
