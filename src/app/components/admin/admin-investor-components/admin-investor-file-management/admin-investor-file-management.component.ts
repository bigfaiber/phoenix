import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import * as FileSaver from 'file-saver';
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-investor-file-management',
  templateUrl: './admin-investor-file-management.component.html',
  styleUrls: ['./admin-investor-file-management.component.scss'],
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
export class AdminInvestorFileManagementComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  @ViewChild( 'pdf_viewer' ) pdf_viewer: any;
  @ViewChild( 'table_input' ) table_input: any;
  @ViewChild( 'warranty_input' ) warranty_input: any;

  project;

  AT: Blob;
  AT_url;

  process_AT: Blob;
  process_AT_url;

  requestSent = false

  table: File;
  warranty: File;

  safeFlag = true;
  safeFlag2 = true;

  ngOnInit() {
      this.dataService.onInit( `Archivos Inversionista` )

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
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              this.requestSent = false
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
              UtilitiesService.debug( "Project retreived" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  showAT( omb ) {
      if ( this.project.initial_payment != null && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.getAmortizationTable( this.project.id ).subscribe(
              res => {
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
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
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
          this.adminManService.getAmortizationTable( this.project.id ).subscribe(
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
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
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
          this.pdf_viewer.nativeElement.src = this.adminManService.API_path + this.project.amortization_table.amortization_table.url
          omb.click( )
      }
  }

  processATUrl( ) {
      if ( this.project.amortization_table != undefined )
          return this.adminManService.API_path + this.project.amortization_table.amortization_table.url
      else
          return ""
  }

  downloadWarranty( d ) {
      if ( this.project.warranty_file != null )
          d.click( )
  }

  showWarranty( omb ) {
      if ( this.project.warranty_file != null ) {
          this.pdf_viewer.nativeElement.src = this.adminManService.API_path + this.project.warranty_file.document.url
          omb.click( )
      }
  }

  warrantyUrl( ) {
      if ( this.project.warranty_file != undefined )
          return this.adminManService.API_path + this.project.warranty_file.document.url
      else
          return ""
  }

  openTableInput( ) {
      this.table_input.nativeElement.click( )
  }

  catchTableFile( ) {
      if ( this.table_input.nativeElement.files[ 0 ] != undefined ) {
          this.table = this.table_input.nativeElement.files[ 0 ]
          this.safeFlag = false
      }
  }

  openWarrantyInput( ) {
      this.warranty_input.nativeElement.click( )
  }

  catchWarrantyFile( ) {
      if ( this.warranty_input.nativeElement.files[ 0 ] != undefined ) {
          this.warranty = this.warranty_input.nativeElement.files[ 0 ]
          this.safeFlag2 = false
      }
  }

  uploadAT( ) {
      if ( !this.requestSent && !this.safeFlag && this.table != undefined ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.adminManService.uploadAT( this.table, this.project.id ).subscribe(
              res => {
                  this.safeFlag = true
                  this.adminManService.getProjectById( this.project.id ).subscribe(
                      res => {
                          this.project = res.json( ).project
                          this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                          this.requestSent = false
                      },
                      err => {
                          this.requestSent = false
                          this.dataService.errorHandler( err, { userType: 'Admin' } )
                      },
                      () => {
                          UtilitiesService.debug( "Project retreived" )
                          this.dataService.updateShowBird( false )
                      }
                  )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "AT uploaded" )
              }
          )
      }
  }

  uploadWarranty( ) {
    if ( !this.requestSent && !this.safeFlag2 && this.warranty != undefined ) {
        this.requestSent = true
        this.dataService.updateShowBird( true )
        this.adminManService.uploadWarranty( this.warranty, this.project.id ).subscribe(
            res => {
                this.safeFlag = true
                this.adminManService.getProjectById( this.project.id ).subscribe(
                    res => {
                        this.project = res.json( ).project
                        this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                        this.requestSent = false
                    },
                    err => {
                        this.requestSent = false
                        this.dataService.errorHandler( err, { userType: 'Admin' } )
                    },
                    () => {
                        UtilitiesService.debug( "Project retreived" )
                        this.dataService.updateShowBird( false )
                    }
                )
            },
            err => {
                this.requestSent = false
                this.dataService.errorHandler( err, { userType: 'Admin' } )
            },
            () => {
                UtilitiesService.debug( "AT uploaded" )
            }
        )
    }
  }

  getBack( ) {
      window.history.back( )
  }

}
