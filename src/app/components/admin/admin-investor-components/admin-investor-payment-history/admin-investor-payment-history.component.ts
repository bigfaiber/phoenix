import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import * as FileSaver from 'file-saver';
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-investor-payment-history',
  templateUrl: './admin-investor-payment-history.component.html',
  styleUrls: ['./admin-investor-payment-history.component.scss'],
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
export class AdminInvestorPaymentHistoryComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
    private dataService: DataService ) { }

  project;
  receipts = []
  receiptFile: File;
  requestSent = false

  form = new FormGroup({
      number: new FormControl( 0, [ Validators.required, Validators.min( 0 ), Validators.max( 20 ) ] )
  });

  form2 = new FormGroup({
    date: new FormControl( null, [ Validators.required ] )
  });

  date_error = false

  @ViewChild( 'pdf_viewer' ) pdf_viewer: any;
  @ViewChild( 'receipt_file_input' ) receipt_file_input: any;

  ngOnInit( ) {
      this.dataService.onInit( `Historial de Pagos` )
      var temp = localStorage.getItem( 'admin_investor_project' )
      if ( temp == null ) {
          UtilitiesService.debug( "No investor project found, redirecting..." )
          this.router.navigate( [ 'admin', 'inversionistas' ] )
          return
      }

      this.project = JSON.parse( temp )
      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.adminManService.getProjectById( this.project.id ).subscribe(
          res => {
              this.project = res.json( ).project
              this.receipts = this.project.receipts
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              this.requestSent = false
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
              UtilitiesService.debug( "Project received" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  showReceipt( index, show_m ) {
      this.the_index = index
      this.pdf_viewer.nativeElement.src = this.adminManService.API_path + this.receipts[ index ].receipt.url
      show_m.click( )
  }

  rateReceipt( index, rate_m ) {
      this.the_index = index
      this.form.get( 'number' ).setValue( this.receipts[ index ].delay )
      rate_m.click( )
  }

  the_index
  downloadDoc( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var format = this.receipts[ this.the_index ].receipt.url.split( "." )[ 1 ]
          var name = this.receipts[ this.the_index ].month + "_" + this.receipts[ this.the_index ].day + "_" + this.receipts[ this.the_index ].year
          this.adminManService.getDocumentBlob( this.receipts[ this.the_index ].receipt.url ).subscribe(
              res => {
                  FileSaver.saveAs( res.blob( ), name + "." + format )
                  this.requestSent = false
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Got a file" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  downloadMobileDoc( index ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var format = this.receipts[ index ].receipt.url.split( "." )[ 1 ]
          var name = this.receipts[ index ].month + "_" + this.receipts[ index ].day + "_" + this.receipts[ index ].year
          this.adminManService.getDocumentBlob( this.receipts[ index ].receipt.url ).subscribe(
              res => {
                  FileSaver.saveAs( res.blob( ), name + "." + format )
                  this.requestSent = false
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Got a file" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  getBack( ) {
      window.history.back( )
  }

  isFormValid( ) {
      return this.form.valid
  }

  rateReceiptRequest( o ) {
      if ( this.isFormValid && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.rateReceipt( this.receipts[ this.the_index ].id, this.form.get( 'number' ).value ).subscribe(
              res => {
                  o.click( )
                  this.requestSent = false
                  this.receipts[ this.the_index ] = res.json( ).receipt
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

  openReceiptFileInput( ) {
      this.receipt_file_input.nativeElement.click( )
  }

  catchReceiptFile( ) {
      if ( this.receipt_file_input.nativeElement.files[ 0 ] != undefined )
          this.receiptFile = this.receipt_file_input.nativeElement.files[ 0 ]
  }

  getMonth( n ) {
      switch( n ) {
          case 1:
              return "Enero"
          case 2:
              return "Febrero"
          case 3:
              return "Marzo"
          case 4:
              return "Abril"
          case 5:
              return "Mayo"
          case 6:
              return "Junio"
          case 7:
              return "Julio"
          case 8:
              return "Agosto"
          case 9:
              return "Septiembre"
          case 10:
              return "Octubre"
          case 11:
              return "Noviembre"
          case 12:
              return "Diciembre"
      }
  }

  isFormValid2( ) {
      return this.form.valid && this.receiptFile != undefined
  }

  uploadReceipt( cum ) {
      if ( this.isFormValid2( ) && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var values = this.form2.value.date.split( "-" )
          var data = {
              year: Number( values[ 0 ] ),
              month: this.getMonth( Number( values[ 1 ] ) ),
              day: Number( values[ 2 ] )
          }
          UtilitiesService.debug( data )
          this.adminManService.uploadReceipt( this.project.id, data, this.receiptFile ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.adminManService.getReceipts( this.project.id ).subscribe(
                      res => {
                          this.receipts = res.json( ).project.receipts
                          cum.click( )
                          this.receiptFile = undefined
                          this.requestSent = false
                          this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                      },
                      err => {
                          this.requestSent = false
                          this.dataService.errorHandler( err, { userType: 'Admin' } )
                      },
                      () => {
                          UtilitiesService.debug( "Got receipts" )
                          this.dataService.updateShowBird( false )
                      }
                  )
              },
              err => {
                  UtilitiesService.debug( err )
                  this.date_error = true
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin', validations: true } )
              },
              () => {
                  UtilitiesService.debug( "Receipt uploaded" )
              }
          )
      }
    }

}
