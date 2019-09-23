import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { style, state, animate, transition, trigger } from '@angular/core';
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-investor-project',
  templateUrl: './admin-investor-project.component.html',
  styleUrls: ['./admin-investor-project.component.scss'],
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
export class AdminInvestorProjectComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  @ViewChild( 'deleteModal' ) deleteModal: any

  project: any;
  buttonsData = []
  bottomButtons = [
    {
      text: 'Volver',
      enable: true
    },
    {
      text: 'Eliminar',
      warning: true,
      enable: true
    }
  ]

  ngOnInit() {
      this.dataService.onInit( `Proyecto Inversionista` )
      var temp = localStorage.getItem( 'admin_investor_project' )
      if ( temp == null ) {
          UtilitiesService.debug( "No investor project found, redirecting..." )
          this.router.navigate( [ 'admin', 'inversionistas' ] )
          return
      }

      this.project = JSON.parse( temp )
      UtilitiesService.debug( this.project )
      this.buttonsData = [
        {
          text: 'Archivos',
          enable: this.project.initial_payment != null
        },
        {
          text: 'Comprobantes de pago',
          enable: this.project.initial_payment != null
        }
      ]
  }

  openATView( ) {
      if ( this.project.initial_payment != null )
          this.router.navigate( [ 'admin', 'archivos-inversionista' ] )
  }

  openReceiptsView( ) {
      if ( this.project.initial_payment != null )
          this.router.navigate( [ 'admin', 'historial-pagos-inversionista' ] )
  }

  formatBankNumb( n : String ) {
      var finalString = ""
      var index = 0
      var cnt = 0
      while ( index < n.length ) {
          if ( cnt == 3 ) {
              finalString += "-"
              cnt = 0
          }
          finalString += n.charAt( index )
          cnt++
          index++
      }
      return finalString
  }

  requestSent = false
  deleteProject( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.deleteProject( this.project.id ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
                  this.router.navigate( [ 'admin', 'perfil-inversionista' ] )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Project deleted" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  buttonClickHandler( event ) {
    switch ( event ) {
      case 0:
        this.openATView( )
        break
      case 1:
        this.openReceiptsView( )
        break
    }
  }

  bottomButtonClickHandler( event, dm ) {
    switch ( event ) {
      case 0:
        this.getBack( )
        break
      case 1:
        dm.click( )
        break
    }
  }

  getBack( ) {
      window.history.back( )
  }

}
