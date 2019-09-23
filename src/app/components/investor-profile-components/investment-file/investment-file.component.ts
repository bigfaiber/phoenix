import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InvestorManagementService } from "../../../services/investor-management/investor-management.service";
import { style, state, animate, transition, trigger } from '@angular/core';
import { DataService } from "../../../services/data-service/data.service";
import * as FileSaver from 'file-saver';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-investment-file',
  templateUrl: './investment-file.component.html',
  styleUrls: ['./investment-file.component.scss'],
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
export class InvestmentFileComponent implements OnInit {

  constructor( private router: Router, private investorMangService: InvestorManagementService,
      private dataService: DataService ) { }

  @ViewChild( 'pdf_viewer' ) pdf_viewer: any;

  project: any;
  AT: Blob;
  AT_url;

  requestSent = false

  ngOnInit( ) {
      this.dataService.onInit( `Archivos Inversión` )
      var temp = localStorage.getItem( 'investor_investment' )
      if ( temp == null ){
          UtilitiesService.debug( "Project not found, redirecting..." )
          this.router.navigate( [ 'inversionista', 'mis-inversiones' ] )
          return
      } else {
          this.project = JSON.parse( temp )
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.investorMangService.getProjectById( this.project.id ).subscribe(
              res => {
                  this.project = res.json( ).project
                  this.requestSent = false
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              },
              err => {
                  this.dataService.errorHandler( err, { userType: 'Investor' } )
              },
              () => {
                  UtilitiesService.debug( "Project retreived" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  showAT( omb ) {
      if ( this.project.initial_payment != null && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.investorMangService.getAmortizationTable( this.project.id ).subscribe(
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

                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Investor' } )
              },
              () => {
                  UtilitiesService.debug( "AT downloaded" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
      else
          omb.click( )
  }

  downloadAT( ) {
      if ( this.AT == undefined && this.project.initial_payment != null && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.investorMangService.getAmortizationTable( this.project.id ).subscribe(
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
                  FileSaver.saveAs( this.AT, "Tabla de amortizacion.pdf" )

                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )

                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Investor' } )
              },
              () => {
                  UtilitiesService.debug( "AT downloaded" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
      else
          FileSaver.saveAs( this.AT, "Tabla de amortizacion.pdf" )
  }

  downloadProcessAT( d ) {
      if ( this.project.amortization_table != null )
          d.click( )
  }

  showProcessAT( omb ) {
      if ( this.project.amortization_table != null ) {
          this.pdf_viewer.nativeElement.src = this.investorMangService.API_path + this.project.amortization_table.amortization_table.url
          omb.click( )
      }
  }

  processATUrl( ) {
      if ( this.project.amortization_table != undefined )
          return this.investorMangService.API_path + this.project.amortization_table.amortization_table.url
      else
          return ""
  }

  showWarranty( omb ) {
      if ( this.project.warranty_file != null ) {
          this.pdf_viewer.nativeElement.src = this.investorMangService.API_path + this.project.warranty_file.document.url
          omb.click( )
      }
  }

  warrantyUrl( ) {
      if ( this.project.warranty_file != undefined )
          return this.investorMangService.API_path + this.project.warranty_file.document.url
      else
          return ""
  }

  downloadWarranty( d ) {
      if ( this.project.warranty_file != null )
          d.click( )
  }

  getBack( ) {
      window.history.back( )
  }

}
