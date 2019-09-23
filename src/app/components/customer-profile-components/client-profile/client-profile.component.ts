import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { style, state, animate, transition, trigger } from '@angular/core';
import { CustomerManagementService } from "../../../services/customerManagement/customer-management.service";
import { MyCurrencyPipe } from "../../../pipes/currency/my-currency.pipe";
import { DataService } from "../../../services/data-service/data.service";
import { Chart } from 'angular-highcharts';
import { CustomerNavComponent } from "../customer-nav/customer-nav.component";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.component.html',
  styleUrls: ['./client-profile.component.scss'],
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
export class ClientProfileComponent implements OnInit {

  constructor( private router: Router, private customerMangService: CustomerManagementService,
                 private cuPipe: MyCurrencyPipe, private dataService: DataService ) {
                   this.user_data = dataService.user_data_value
                   dataService.user_data$.subscribe( val => {
                     this.user_data = val
                   })
                 }

  @ViewChild( 'upper_nav' ) upperNav: CustomerNavComponent

  projects = []
  user_data;
  page = 1
  requestSent = false
  meta

  ngOnInit() {
      this.dataService.onInit( `Perfil Cliente` )

      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.customerMangService.getProjects( this.page ).subscribe(
          res => {
              UtilitiesService.debug( res.json( ) )
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              this.projects = res.json( ).projects.map( x => {
                return Object.assign({
                  state: this.projectState( x ),
                  notification: this.projectNotification( x )
                }, x )
              })
              this.meta = res.json( ).meta
              this.requestSent = false
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Client' } )
          },
          () => {
              UtilitiesService.debug( "Customer projects retreived" )
              this.dataService.updateShowBird( false )
          }
      )

      UtilitiesService.debug( this.user_data )
  }

  redirectToProject( index ) {
      localStorage.setItem( "customer_matched_project", JSON.stringify( this.projects[ index ] ) )
      this.router.navigate( [ 'cliente', 'proyecto' ] )
  }

  viewPatch( o, index ) {
      if ( UtilitiesService.allDocumentsComplete( this.user_data ) ) {
          this.upperNav.notifyMissingDoc( )
      } else if ( this.projects[ index ].account == null ) {
          localStorage.setItem( 'missing_data_project', JSON.stringify( this.projects[ index ] ) )
          this.router.navigate( [ 'cliente', 'crear-proyecto' ] )
      } else  {
          o.click( )
      }
  }

  openProject( index ) {
      let project = this.user_data.projects.filter( project => project.id === this.projects[ index ].id )[ 0 ]

      localStorage.setItem( 'view_data_project', JSON.stringify( project ) )
      this.router.navigate( [ 'cliente', 'ver-proyecto' ] )
  }

  projectRoutingHandler( index, modal ) {
    if ( this.projects[ index ].approved && this.projects[ index ].investor )
      this.redirectToProject( index )
    else if ( this.projects[ index ].approved && !this.projects[ index ].investor )
      this.openProject( index )
    else
      this.viewPatch( modal, index )
  }

  createProject( ) {
      if ( !UtilitiesService.allDocumentsComplete( this.user_data ) )
          this.router.navigate( [ 'cliente', 'crear-proyecto' ] )
      else {
          this.upperNav.notifyMissingDoc( )
      }
  }

  fillDocs( ) {
      localStorage.setItem( 'customer_came_from', window.location.pathname )
      this.router.navigate( [ 'cliente', 'subir-archivos' ] )
  }

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  onScrollDown( ) {
      UtilitiesService.debug( 'scrolled down!!' );
      if ( this.page + 1 <= this.meta.total_pages ) {
          this.page++
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.customerMangService.getProjects( this.page ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.meta = res.json( ).meta
                  this.projects.concat( res.json( ).projects.map( x => {
                    return Object.assign({
                      state: this.projectState( x ),
                      notification: this.projectNotification( x )
                    }, x )
                  }) )
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Client' } )
              },
              () => {
                  UtilitiesService.debug( "Got matches" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  projectState( project ) {
    if ( project.approved && project.investor )
      return "match"
    else if ( project.approved && !project.investor )
      return "approved"
    else
      return "created"
  }

  projectNotification( project ) {
    if ( project.account == null )
      return {
        message: 'Faltan datos',
        color: 'orange'
      }
  }

}
