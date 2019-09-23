import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-customer-profile',
  templateUrl: './admin-customer-profile.component.html',
  styleUrls: ['./admin-customer-profile.component.scss'],
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
export class AdminCustomerProfileComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService, private dataService: DataService ) { }

  customer_data;
  API_path;

  projects = [];

  editable_customer_score;

  requestSent = false

  form = new FormGroup({
      number: new FormControl( 0, [ Validators.required, Validators.min( 0 ), Validators.max( 100 ) ] )
  });

  ngOnInit( ) {
      this.API_path = this.adminManService.API_path

      var data = localStorage.getItem( 'admin_customer_profile' )
      if ( data == null ) {
          UtilitiesService.debug( "No customer found, redirecting..." )
          this.router.navigate( [ 'admin', 'match' ] )
          return
      } else
          this.customer_data = JSON.parse( data )

      this.dataService.onInit( `Cliente: ${this.customer_data.name} ${this.customer_data.lastname}` )

      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.adminManService.getCustomer( this.customer_data.id ).subscribe(
          res => {
              this.customer_data = res.json( ).client
              UtilitiesService.debug( this.customer_data )
              this.editable_customer_score = this.customer_data.rating
              this.projects = this.customer_data.projects.map( x => {
                return Object.assign({
                  state: this.projectState( x ),
                  notification: this.projectNotification( x )
                }, x )
              })
              this.requestSent = false
              this.form.get( 'number' ).setValue( this.customer_data.global )
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
              UtilitiesService.debug( "Got a customer" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  imgPath( index ) {
      var dec = this.customer_data.rating - Math.floor( this.customer_data.rating )

      if ( index > this.customer_data.rating )
          return "assets/images/client-profile/star_empty.png"
      if ( index < Math.floor( this.customer_data.rating ) )
          return "assets/images/client-profile/star_fill.png"
      else
          if ( dec < 0.5 )
              return "assets/images/client-profile/star_empty.png"
          else
              return "assets/images/client-profile/star_half_fill.png"
  }

  imgPathEditScore( index ) {
      if ( index <= this.editable_customer_score )
          return "assets/images/admin-business/stargold_on_desktop@72x.png"
      else
          return "assets/images/admin-business/stargrey_off_desktop@72x.png"
  }

  setScore( i ) {
      this.editable_customer_score = i
  }

  postNewScore( omb ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.postNewScore( this.customer_data.id, this.editable_customer_score ).subscribe(
              res => {
                  this.customer_data.rating = this.editable_customer_score
                  omb.click( )
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Score updated" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  return_to( ) {
      window.history.back( )
  }

  openDream( index ) {
      if ( this.projects[ index ].new_project && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.projectSeen( this.projects[ index ].id ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
                  this.projects[ index ].recommended_interest = this.customer_data.recommended_interest
                  localStorage.setItem( 'admin_customer_dream', JSON.stringify( this.projects[ index ] ) )
                  this.router.navigate( [ 'admin', 'sueno-cliente' ] )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Project marked as read" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
      else {
          this.projects[ index ].recommended_interest = this.customer_data.recommended_interest
          localStorage.setItem( 'admin_customer_dream', JSON.stringify( this.projects[ index ] ) )
          this.router.navigate( [ 'admin', 'sueno-cliente' ] )
      }
  }

  openDocuments( ) {
      localStorage.setItem( 'customer_docs', JSON.stringify( this.customer_data.documents ) )
      this.router.navigate( [ 'admin', 'documentos-cliente' ] )
  }

  openForm( ) {
      localStorage.setItem( 'customer_form_data', JSON.stringify( this.customer_data ) )
      this.router.navigate( [ 'admin', 'formulario-cliente' ] )
  }

  deleteCustomer( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.deleteCustomer( this.customer_data.id ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
                  setTimeout( () => {
                    this.router.navigate( [ 'admin', 'clientes' ] )
                  }, 1000 )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Customer deleted" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  isFormValid( ) {
      return this.form.valid
  }

  rateClient( o ) {
      if ( this.isFormValid && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.globalRate( this.customer_data.id, this.form.get( 'number' ).value ).subscribe(
              res => {
                  UtilitiesService.debug( res )
                  o.click( )
                  this.requestSent = false
                  this.customer_data.global = this.form.get( 'number' ).value
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Receipt rated successfully" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  addOpinion( ) {
    localStorage.setItem( 'current_user', JSON.stringify({
      type: 'client',
      user: this.customer_data
    }))
    this.router.navigate( [ 'admin/cliente-proscons' ] )
  }

  createProject( ) {
      this.router.navigate( [ 'admin', 'crear-proyecto' ] )
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
    if ( project.new_project )
      return {
        message: 'Nuevo Proyecto',
        color: 'red'
      }
  }

}
