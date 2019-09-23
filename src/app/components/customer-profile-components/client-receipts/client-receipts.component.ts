import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerManagementService } from "../../../services/customerManagement/customer-management.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { style, state, animate, transition, trigger } from '@angular/core';
import { DataService } from "../../../services/data-service/data.service";
import * as FileSaver from 'file-saver';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-client-receipts',
  templateUrl: './client-receipts.component.html',
  styleUrls: ['./client-receipts.component.scss'],
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
export class ClientReceiptsComponent implements OnInit, OnDestroy {

  constructor( private router: Router, private customerMangService: CustomerManagementService,
      private dataService: DataService ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  @ViewChild( 'receipt_file_input' ) receipt_file_input: any;
  @ViewChild( 'pdf_viewer' ) pdf_viewer: any;

  receiptFile: File;
  requestSent = false

  receipts = [];

  user_data;

  project;

  date_error = false

  form = new FormGroup({
      date: new FormControl( null, [ Validators.required ] )
  });

  ngOnInit() {
      this.dataService.onInit( `Recibos de Pago` )

      var temp = localStorage.getItem( 'receipts_project' )
      if ( temp == null ) {
          UtilitiesService.debug( "No project found, redirecting..." )
          this.router.navigate( [ 'cliente', 'perfil' ] )
          return
      } else {
          this.project = JSON.parse( temp )
      }

      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.customerMangService.getReceipts( this.project.id ).subscribe(
          res => {
              this.receipts = res.json( ).project.receipts
              this.requestSent = false
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Client' } )
          },
          () => {
              UtilitiesService.debug( "Got receipts" )
              this.dataService.updateShowBird( false )
          }
      )
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

  isFormValid( ) {
      return this.form.valid && this.receiptFile != undefined
  }

  uploadReceipt( cum ) {
      if ( this.isFormValid( ) && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var values = this.form.value.date.split( "-" )
          var data = {
              year: Number( values[ 0 ] ),
              month: this.getMonth( Number( values[ 1 ] ) ),
              day: Number( values[ 2 ] )
          }
          UtilitiesService.debug( data )
          this.customerMangService.uploadReceipt( this.project.id, data, this.receiptFile ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.customerMangService.getReceipts( this.project.id ).subscribe(
                      res => {
                          this.receipts = res.json( ).project.receipts
                          cum.click( )
                          this.receiptFile = undefined
                          this.requestSent = false
                          this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                      },
                      err => {
                          this.requestSent = false
                          this.dataService.errorHandler( err, { userType: 'Client' } )
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
                  this.dataService.errorHandler( err, { userType: 'Client', validations: true } )
              },
              () => {
                  UtilitiesService.debug( "Receipt uploaded" )
              }
          )
      }
  }

  showReceipt( index, omb ) {
      this.the_index = index
      this.pdf_viewer.nativeElement.src = this.customerMangService.API_path + this.receipts[ index ].receipt.url
      omb.click( )
  }

  the_index
  downloadDoc( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var format = this.receipts[ this.the_index ].receipt.url.split( "." )[ 1 ]
          var name = this.receipts[ this.the_index ].month + "_" + this.receipts[ this.the_index ].day + "_" + this.receipts[ this.the_index ].year
          this.customerMangService.getDocumentBlob( this.receipts[ this.the_index ].receipt.url ).subscribe(
              res => {
                  FileSaver.saveAs( res.blob( ), name + "." + format )
                  this.requestSent = false
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Client' } )
              },
              () => {
                  UtilitiesService.debug( "Got a file" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  downloadMobileReceipt( index, a_ref ) {
    a_ref.href = this.customerMangService.API_path + this.receipts[ index ].receipt.url
    a_ref.click( )
  }

  ngOnDestroy( ) {
      localStorage.removeItem( 'receipts_project' )
  }

}
