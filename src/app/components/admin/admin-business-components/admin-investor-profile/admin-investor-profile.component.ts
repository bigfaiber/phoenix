import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { Observable } from 'rxjs/Rx';
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-investor-profile',
  templateUrl: './admin-investor-profile.component.html',
  styleUrls: ['./admin-investor-profile.component.scss'],
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
export class AdminInvestorProfileComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  investor_data;
  API_path;

  investments = [];
  requestSent = false

  ngOnInit( ) {
      this.API_path = this.adminManService.API_path

      var data = localStorage.getItem( 'admin_investor_profile' )
      if ( data == null ) {
          UtilitiesService.debug( "No customer found, redirecting..." )
          this.router.navigate( [ 'admin', 'match' ] )
          return
      } else {
        this.investor_data = JSON.parse( data )
        UtilitiesService.debug( "Hello", this.investor_data )
      }

      this.dataService.onInit( `Inversionista: ${this.investor_data.name} ${this.investor_data.lastname}` )

      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.adminManService.getInvestor( this.investor_data.id ).subscribe(
          res => {
              this.investor_data = res.json( ).investor
              this.investments = this.investor_data.projects.map( x => {
                return Object.assign({
                  parse: this.parseData( x )
                }, x )
              })
              this.requestSent = false
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              UtilitiesService.debug( this.investments )
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
              UtilitiesService.debug( "Got an investor" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  return_to( ) {
      window.history.back()
  }

  openProject( index ) {
      localStorage.setItem( 'admin_investor_project', JSON.stringify( this.investments[ index ] ) )
      this.router.navigate( [ 'admin', 'proyecto-inversionista' ] )
  }

  openDocuments( ) {
      localStorage.setItem( 'investor_docs', JSON.stringify( this.investor_data.documents ) )
      this.router.navigate( [ 'admin', 'documentos-inversionista' ] )
  }

  openForm( ) {
      localStorage.setItem( 'investor_form_data', JSON.stringify( this.investor_data ) )
      this.router.navigate( [ 'admin', 'formulario-inversionista' ] )
  }

  deleteInvestor( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.deleteInvestor( this.investor_data.id ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
                  setTimeout( () => {
                      this.router.navigate( [ 'admin', 'inversionistas' ] )
                  }, 1000 )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Investor deleted" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  addOpinion( ) {
    localStorage.setItem( 'current_user', JSON.stringify({
      type: 'investor',
      user: this.investor_data
    }))
    this.router.navigate( [ 'admin/inversionista-proscons' ] )
  }

  parseData( project ) {
    return [
      {
        label: 'nombre',
        value: project.dream
      }
    ]
  }

}
