import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-customers',
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.scss'],
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
export class AdminCustomersComponent implements OnInit, OnDestroy {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  clientState = "new"

  customers = []

  API_path;

  total_notifications = 0

  requestSent = false

  page = 1
  meta: any = {
      new_projects: 0,
      new_clients: 0
  };

  ngOnInit( ) {
      this.dataService.onInit( `Clientes` )
      this.API_path = this.adminManService.API_path

      var tmp = localStorage.getItem( 'total_notifications' )
      if ( tmp == null )
          this.total_notifications = 0
      else
          this.total_notifications = Number( tmp )

      var tmp = localStorage.getItem( 'customer_memory' )
      if ( tmp == null ) {
          this.retrieveNewCustomers( this.page )
      }
      else {
          this.clientState = tmp
          switch ( this.clientState ) {
              case "new":
                  this.retrieveNewCustomers( this.page )
                  break
              case "old":
                  this.retrieveOldCustomers( this.page )
                  break
              case "eval":
                  this.retrieveEvalCustomers( this.page )
                  break
              case "unfit":
                  this.retrieveUnfitCustomers( this.page )
                  break
          }
      }
  }

  retrieveOldCustomers( page ) {
      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.adminManService.getOldCustomers( this.page ).subscribe(
          res => {
              UtilitiesService.debug( res.json( ) )
              this.meta = res.json( ).meta
              this.customers = this.customers.concat( res.json( ).clients )
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              this.total_notifications = this.meta.new_projects + this.meta.new_clients
              localStorage.setItem( 'total_notifications', String( this.total_notifications ) )
              this.requestSent = false
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
  }

  retrieveNewCustomers( page ) {
      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.adminManService.getNewCustomers( page ).subscribe(
          res => {
              UtilitiesService.debug( res.json( ) )
              this.meta = res.json( ).meta
              this.customers = this.customers.concat( res.json( ).clients )
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              this.total_notifications = this.meta.new_projects + this.meta.new_clients
              localStorage.setItem( 'total_notifications', String( this.total_notifications ) )
              this.requestSent = false
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
              UtilitiesService.debug( "Got new customers" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  retrieveEvalCustomers( page ) {
      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.adminManService.getOnEvalulation( this.page ).subscribe(
          res => {
              UtilitiesService.debug( res.json( ) )
              this.meta = Object.assign({
                new_clients: this.meta.new_clients,
                new_projects: this.meta.new_projects
              }, res.json( ).meta )
              this.customers = this.customers.concat( res.json( ).clients )
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              this.requestSent = false
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
              UtilitiesService.debug( "Got eval customers" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  retrieveUnfitCustomers( page ) {
      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.adminManService.getUnfit( this.page ).subscribe(
          res => {
              UtilitiesService.debug( res.json( ) )
              this.meta = Object.assign({
                new_clients: this.meta.new_clients,
                new_projects: this.meta.new_projects
              }, res.json( ).meta )
              this.customers = this.customers.concat( res.json( ).clients )
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              this.requestSent = false
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
              UtilitiesService.debug( "Got unfit customers" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  onNewSelection( ) {
      if ( this.clientState != "new" ) {
          this.clientState = "new";
          this.customers = []
          this.page = 1
          this.retrieveNewCustomers( this.page )
      }
  }

  onOldSelection( ) {
      if ( this.clientState != "old" ) {
          this.clientState = "old";
          this.customers = []
          this.page = 1
          this.retrieveOldCustomers( this.page )
      }
  }

  onEvalSelection( ) {
      if ( this.clientState != "eval" ) {
          this.clientState = "eval";
          this.customers = []
          this.page = 1
          this.retrieveEvalCustomers( this.page )
      }
  }

  onUnfitSelection( ) {
      if ( this.clientState != "unfit" ) {
          this.clientState = "unfit";
          this.customers = []
          this.page = 1
          this.retrieveUnfitCustomers( this.page )
      }
  }

  imgPath( c, index ) {
      var dec = this.customers[ index ].rating - Math.floor( this.customers[ index ].rating )

      if ( c > this.customers[ index ].rating )
          return "assets/images/client-profile/star_empty.png"
      if ( c < Math.floor( this.customers[ index ].rating ) )
          return "assets/images/client-profile/star_fill.png"
      else
          if ( dec < 0.5 )
              return "assets/images/client-profile/star_empty.png"
          else
              return "assets/images/client-profile/star_half_fill.png"
  }

  showProfile( index ) {
      localStorage.setItem( 'admin_customer_profile', JSON.stringify( this.customers[ index ] ) )
      console.log(this.customers[index])
      localStorage.setItem( 'came_from', window.location.pathname )
      this.router.navigate( [ 'admin', 'perfil-cliente' ] )
  }

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  onScrollDown( ) {
      UtilitiesService.debug( 'scrolled down!!' );
      switch ( this.clientState ) {
          case "new":
              if ( this.page + 1 <= this.meta.total_pages ) {
                  this.page++
                  this.retrieveNewCustomers( this.page )
              }
              break
          case "old":
              if ( this.page + 1 <= this.meta.total_pages ) {
                    this.page++
                    this.retrieveOldCustomers( this.page )
              }
              break
          case "eval":
              if ( this.page + 1 <= this.meta.total_pages ) {
                  this.page++
                  this.retrieveEvalCustomers( this.page )
              }
              break
          case "unfit":
              if ( this.page + 1 <= this.meta.total_pages ) {
                  this.page++
                  this.retrieveUnfitCustomers( this.page )
              }
              break
      }
  }

  ngOnDestroy( ) {
      localStorage.setItem( 'customer_memory', this.clientState )
  }

}
