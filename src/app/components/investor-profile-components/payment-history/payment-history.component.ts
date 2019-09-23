import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { InvestorManagementService } from "../../../services/investor-management/investor-management.service";
import { DataService } from "../../../services/data-service/data.service";
import * as FileSaver from 'file-saver';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss'],
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
export class PaymentHistoryComponent implements OnInit {

  constructor( private router: Router, private investorMangService: InvestorManagementService,
      private dataService: DataService ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  @ViewChild( 'pdf_viewer' ) pdf_viewer: any;

  receipts = [];

  user_data;

  project;

  requestSent = false

  ngOnInit( ) {
      this.dataService.onInit( `Historial de Pagos` )

      var temp = localStorage.getItem( 'investor_receipts_project' )
      if ( temp == null ) {
          UtilitiesService.debug( "No project found, redirecting..." )
          this.router.navigate( [ 'cliente', 'perfil' ] )
          return
      } else {
          this.project = JSON.parse( temp )
      }

      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.investorMangService.getReceipts( this.project.id ).subscribe(
          res => {
              this.receipts = res.json( ).project.receipts
              this.requestSent = false
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Investor' } )
          },
          () => {
              UtilitiesService.debug( "Got receipts" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  showReceipt( index, omb ) {
      this.the_index = index
      this.pdf_viewer.nativeElement.src = this.investorMangService.API_path + this.receipts[ index ].receipt.url
      omb.click( )
  }

  the_index
  downloadDoc( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var format = this.receipts[ this.the_index ].receipt.url.split( "." )[ 1 ]
          var name = this.receipts[ this.the_index ].month + "_" + this.receipts[ this.the_index ].day + "_" + this.receipts[ this.the_index ].year
          this.investorMangService.getDocumentBlob( this.receipts[ this.the_index ].receipt.url ).subscribe(
              res => {
                  FileSaver.saveAs( res.blob( ), name + "." + format )
                  this.requestSent = false
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Investor' } )
              },
              () => {
                  UtilitiesService.debug( "Got a file" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  downloadMobileReceipt( index, a_ref ) {
    a_ref.href = this.investorMangService.API_path + this.receipts[ index ].receipt.url
    a_ref.click( )
  }

  getBack( ) {
      window.history.back( )
  }

}
