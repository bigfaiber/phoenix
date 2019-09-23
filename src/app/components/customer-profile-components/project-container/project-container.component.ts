import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerManagementService } from "../../../services/customerManagement/customer-management.service";
import { style, state, animate, transition, trigger } from '@angular/core';
import { DataService } from "../../../services/data-service/data.service";
import * as FileSaver from 'file-saver';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-project-container',
  templateUrl: './project-container.component.html',
  styleUrls: ['./project-container.component.scss'],
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
export class ProjectContainerComponent implements OnInit {

  constructor( private router: Router, private customerMangService: CustomerManagementService,
      private dataService: DataService ) { }

  @ViewChild( 'pdf_viewer' ) pdf_viewer: any;

  project: any;
  AT: Blob;
  AT_url;
  show_flag = false

  requestSent = false

  buttonsData = []
  bottomButtons = [
    {
      text: 'Volver',
      enable: true
    }
  ]

  ngOnInit( ) {
      this.dataService.onInit( `Proyecto` )
      var temp = localStorage.getItem( 'customer_matched_project' )
      if ( temp == null ){
          UtilitiesService.debug( "Project not found, redirecting..." )
          this.router.navigate( [ 'cliente', 'perfil' ] )
          return
      } else {
          this.project = JSON.parse( temp )
          UtilitiesService.debug( this.project )
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.customerMangService.getProjectById( this.project.id ).subscribe(
              res => {
                  this.project = res.json( ).project
                  this.requestSent = false
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              },
              err => {
                  this.dataService.errorHandler( err, { userType: 'Client' } )
                  this.requestSent = false
              },
              () => {
                  UtilitiesService.debug( "Project retreived" )
                  this.dataService.updateShowBird( false )
              }
          )
      }

      this.buttonsData = [
        {
          text: 'Tabla de amortización (programada)',
          enable: this.project.initial_payment != null
        },
        {
          text: 'Tabla de amortización (activa)',
          enable: this.project.amortization_table != null
        },
        {
          text: 'Comprobantes de pago',
          enable: this.project.initial_payment != null
        }
      ]
  }

  downloadAT( omb ) {
      if ( this.project.initial_payment != null && this.AT == undefined && this.project.initial_payment != null && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.customerMangService.getAmortizationTable( this.project.id ).subscribe(
              res => {
                  UtilitiesService.debug( res.text( ) )
                  var binaryImg = atob( res.text( ) );
                  var length = binaryImg.length;
                  var arrayBuffer = new ArrayBuffer( length );
                  var uintArray = new Uint8Array( arrayBuffer );

                  for ( var i = 0; i < length; i++ ) {
                  uintArray[ i ] = binaryImg.charCodeAt( i );
                  }

                  this.AT = new Blob( [ uintArray ], { type: 'application/pdf' } )
                  this.AT_url = this.pdf_viewer.nativeElement.src = URL.createObjectURL( this.AT )
                  omb.click( )

                  this.requestSent = false
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Client' } )
              },
              () => {
                  UtilitiesService.debug( "AT downloaded" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
      else if ( this.project.initial_payment != null )
          omb.click( )
  }

  downloadMobileAT( ) {
    if ( this.project.initial_payment != null && this.AT == undefined && this.project.initial_payment != null && !this.requestSent ) {
        this.requestSent = true
        this.dataService.updateShowBird( true )
        this.customerMangService.getAmortizationTable( this.project.id ).subscribe(
            res => {
                UtilitiesService.debug( res.text( ) )
                var binaryImg = atob( res.text( ) );
                var length = binaryImg.length;
                var arrayBuffer = new ArrayBuffer( length );
                var uintArray = new Uint8Array( arrayBuffer );

                for ( var i = 0; i < length; i++ ) {
                uintArray[ i ] = binaryImg.charCodeAt( i );
                }

                this.AT = new Blob( [ uintArray ], { type: 'application/pdf' } )
                this.AT_url = this.pdf_viewer.nativeElement.src = URL.createObjectURL( this.AT )

                FileSaver.saveAs( this.AT, "tabla_amortizacion.pdf" )

                this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                this.requestSent = false

            },
            err => {
                this.requestSent = false
                this.dataService.errorHandler( err, { userType: 'client' } )
            },
            () => {
                UtilitiesService.debug( "AT downloaded" )
                this.dataService.updateShowBird( false )
            }
          )
      } else if ( this.AT != undefined ){
          FileSaver.saveAs( this.AT, "tabla_amortizacion.pdf" )
      }
  }

  openReceiptsView( ) {
      if ( this.project.initial_payment != null ) {
          localStorage.setItem( 'receipts_project', JSON.stringify( this.project ) )
          this.router.navigate( [ 'cliente', 'recibos-proyecto' ] )
      }
  }

  showProcessAT( omb ) {
      if ( this.project.amortization_table != null ) {
          this.pdf_viewer.nativeElement.src = this.customerMangService.API_path + this.project.amortization_table.amortization_table.url
          omb.click( )
      }
  }

  downloadProcessMobileAT( a_ref ) {
      if ( this.project.amortization_table != null ) {
          a_ref.href = this.customerMangService.API_path + this.project.amortization_table.amortization_table.url
          a_ref.click( )
      }
  }

  buttonClickHandler( event, omb, rl ) {
    switch ( event ) {
      case 0:
        if ( window.innerWidth > 575 )
          this.downloadAT( omb )
        else
          this.downloadMobileAT( )
        break
      case 1:
        if ( window.innerWidth > 575 )
          this.showProcessAT( omb )
        else
          this.downloadProcessMobileAT( rl )
        break
      case 2:
        this.openReceiptsView( )
        break
    }
  }

  bottomButtonClickHandler( event ) {
    switch ( event ) {
      case 0:
        this.getBack( )
        break
    }
  }

  getBack( ) {
      window.history.back( )
  }

}
