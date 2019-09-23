import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";
import { DataService } from "../../../../services/data-service/data.service";

@Component({
  selector: 'app-match-visualizer',
  templateUrl: './match-visualizer.component.html',
  styleUrls: ['./match-visualizer.component.scss'],
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
export class MatchVisualizerComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  form;
  years = []
  months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]
  requestSent = false

  project: any;
  buttonsData = []
  bottomButtons = []

  ngOnInit( ) {

      for ( var i = 2000; i <= ( new Date( ) ).getFullYear( ); i++ )
          this.years.push( i )


      var match = localStorage.getItem( 'single_match' )
      if ( match == null ) {
          UtilitiesService.debug( "No match found, redirecting..." )
          this.router.navigate( [ 'admin', 'proyectos' ] )
          return
      } else {
        this.project = JSON.parse( match )
        this.project = Object.assign({
          client: this.project.project.client,
          investor: this.project.investor
        }, this.project.project )
        this.dataService.onInit( `Información proyecto` )
      }
      UtilitiesService.debug( this.project )

      this.form = new FormGroup({
          year: new FormControl( 0, [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
          month: new FormControl( 0, [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
          interest: new FormControl( null, [ Validators.required, Validators.min( 0 ), Validators.pattern( "[0-9]+" ) ] ),
          debt: new FormControl( null, [ Validators.required, Validators.min( 0 ), Validators.pattern( "[0-9]+" ) ] )
      });

      this.buttonsData = [
        {
          text: 'Archivos',
          enable: this.project.initial_payment != null
        },
        {
          text: 'Comprobantes de pago',
          enable: this.project.initial_payment != null
        },
        {
          text: 'Balance Mensual',
          enable: true
        }
      ]

      this.bottomButtons = [
        {
          text: 'Volver',
          enable: true
        },
        {
          text: 'Finalizar proyecto',
          enable: !this.project.finished
        },
        {
          text: 'Eliminar',
          warning: true,
          enable: true
        }
      ]
  }

  isFormValid( ) {
      return this.form.valid
  }

  openATView( ) {
      if ( this.project.initial_payment != null ) {
          localStorage.setItem( 'admin_investor_project', JSON.stringify( this.project ) )
          this.router.navigate( [ 'admin', 'archivos-inversionista' ] )
      }
  }

  openReceiptsView( ) {
      if ( this.project.initial_payment != null ) {
          localStorage.setItem( 'admin_investor_project', JSON.stringify( this.project ) )
          this.router.navigate( [ 'admin', 'historial-pagos-inversionista' ] )
      }
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

  getBack( ) {
    window.history.back( )
  }

  deleteProject( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.deleteProject( this.project.id ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
                  this.router.navigate( [ 'admin', 'proyectos' ] )
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

  finishProject( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.finishProject( this.project.id ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
                  this.router.navigate( [ 'admin', 'proyectos' ] )
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

  postBalance( modal ) {
    this.dataService.updateShowBird( true )
    this.adminManService.postMonthBalance( this.project.id, this.form.value ).subscribe(
      res => {
        UtilitiesService.debug( res )
        this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
        modal.click( )
      },
      err => {
        this.dataService.errorHandler( err, { userType: 'Admin' } )
      },
      () => {
        UtilitiesService.debug( "Project deleted" )
        this.dataService.updateShowBird( false )
      }
    )
  }

  buttonClickHandler( event, bm ) {
    switch ( event ) {
      case 0:
        this.openATView( )
        break
      case 1:
        this.openReceiptsView( )
        break
      case 2:
        bm.click( )
        break
    }
  }

  bottomButtonClickHandler( event, fm, dm ) {
    switch ( event ) {
      case 0:
        this.getBack( )
        break
      case 1:
        fm.click( )
        break
      case 2:
        dm.click( )
        break
    }
  }

}
