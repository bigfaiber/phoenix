import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import * as FileSaver from 'file-saver';
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-customer-docs',
  templateUrl: './admin-customer-docs.component.html',
  styleUrls: ['./admin-customer-docs.component.scss'],
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
export class AdminCustomerDocsComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  @ViewChild( 'pdf_viewer' ) pdf_viewer: any;

  documents = []

  ngOnInit( ) {
      this.dataService.onInit( `Documentos cliente` )
      var temp = localStorage.getItem( 'customer_docs' )
      if ( temp == null ) {
          UtilitiesService.debug( "No documents found, redirecting..." )
          this.router.navigate( [ 'admin', 'perfil-cliente' ] )
          return
      }
      this.documents = JSON.parse( temp )
      UtilitiesService.debug( this.documents )
  }

  showDocument( omb, index ) {
      this.the_index = index
      this.pdf_viewer.nativeElement.src = this.adminManService.API_path + this.documents[ index ].document.url
      omb.click( )
  }

  requestSent = false
  the_index
  downloadDoc( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var format = this.documents[ this.the_index ].document.url.split( "." )[ 1 ]
          var name = this.documents[ this.the_index ].document_type
          this.adminManService.getDocumentBlob( this.documents[ this.the_index ].document.url ).subscribe(
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

}
