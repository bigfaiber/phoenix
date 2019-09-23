import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InvestorManagementService } from "../../../services/investor-management/investor-management.service";
import { style, state, animate, transition, trigger } from '@angular/core';
import { DataService } from "../../../services/data-service/data.service";
import { Chart } from 'angular-highcharts';
import * as FileSaver from 'file-saver';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-investor-project',
  templateUrl: './investor-project.component.html',
  styleUrls: ['./investor-project.component.scss'],
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
export class InvestorProjectComponent implements OnInit {

  constructor( private router: Router, private investorMangService: InvestorManagementService,
      private dataService: DataService ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  chart: Chart;
  @ViewChild( 'pdf_viewer' ) pdf_viewer: any;

  project;
  user_data;
  customer_age;

  AT: Blob;
  AT_url;

  requestSent = false

  currentGlobal = 50

  graphValues = []

  ngOnInit() {
      this.dataService.onInit( `Proyecto para Invertir` )

      if ( !( this.allDocumentsComplete( ) == 4 || ( !this.user_data.rent_tax && this.allDocumentsComplete( ) == 3 ) ) ) {
          UtilitiesService.debug( "Documents are not complete, redirecting..." )
          this.router.navigate( [ 'inversionista', 'perfil' ] )
      }

      var project = localStorage.getItem( 'customer_project' )
      if ( project == null ) {
          UtilitiesService.debug( "No project found, redirecting..." )
          this.router.navigate( [ 'inversionista', 'perfil' ] )
          return
      } else
          this.project = JSON.parse( project )

      UtilitiesService.debug( this.project )

      var date = new Date( )
      var today = ( date.getMonth( ) + 1 ) + "/" + date.getDate( ) + "/" + date.getFullYear( )

      this.customer_age = this.calculateAge( this.project.client.birthday, today )
      UtilitiesService.debug( this.project.client )
      UtilitiesService.debug( this.user_data )

      this.initChart( )
      this.investorMangService.getGraphValues( this.project.client.id ).subscribe(
          ans => {
              this.graphValues = Object.values( ans.json( ).data.values )
              this.fillChart( 0 )
              this.requestSent = false
              this.dataService.updateUserAndSessionData( ans.headers.get( 'token' ), null )
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Investor' } )
          },
          () => {
              UtilitiesService.debug( "Graph values retrieved" )
          }
      )

      this.moveNeedle( )
  }

  fillChart( index ) {
    if ( index >= this.graphValues.length )
        return
    else {
        if ( index > 0 )
            setTimeout( () => {
                this.chart.addPoint( this.graphValues[ index ] )
                this.fillChart( index + 1 )
            }, 400 )
        else {
            this.chart.addPoint( this.graphValues[ index ] )
            this.fillChart( index + 1 )
        }
    }
  }

  moveNeedle( ) {
      if ( this.currentGlobal <= this.project.client.global ) {
          setTimeout( () => {
            this.currentGlobal += 0.1
            this.moveNeedle( )
          }, 1 )
      }
  }

  allDocumentsComplete( ) {
     var statements_doc_counter = 0
     var id_doc_counter = 0
     var rent_doc_counter = 0
     var incomes_doc_counter = 0

     for ( var i = 0; i < this.user_data.documents.length; i++ )
         if ( this.user_data.documents[ i ].document_type == "extractos" ) {
             statements_doc_counter = 1
             break
         }

     for ( var i = 0; i < this.user_data.documents.length; i++ )
         if ( this.user_data.documents[ i ].document_type == "cc" ) {
             id_doc_counter = 1
             break
         }

     for ( var i = 0; i < this.user_data.documents.length; i++ )
         if ( this.user_data.documents[ i ].document_type == "ingresos" ) {
             incomes_doc_counter = 1
             break
         }

     for ( var i = 0; i < this.user_data.documents.length; i++ )
         if ( this.user_data.documents[ i ].document_type == "renta" ) {
             rent_doc_counter = 1
             break
         }

     return statements_doc_counter + id_doc_counter + rent_doc_counter + incomes_doc_counter
  }

  imgPath( index ) {
      var dec = this.project.client.rating - Math.floor( this.project.client.rating )

      if ( index > this.project.client.rating )
          return "assets/images/client-profile/star_empty.png"
      if ( index < Math.floor( this.project.client.rating ) )
          return "assets/images/client-profile/star_fill.png"
      else
          if ( dec < 0.5 )
              return "assets/images/client-profile/star_empty.png"
          else
              return "assets/images/client-profile/star_half_fill.png"
  }

  flag = true
  likeHandler( thankModal, exceedLimitModal, exceedPercentLimitModal ) {
    if ( Number( this.user_data.debt ) + this.project.money > Number( this.user_data.maximum ) ) {
      exceedLimitModal.click( )
    } else if ( this.project.money > Number( this.user_data.maximum ) * .25 ) {
      exceedPercentLimitModal.click( )
    } else {
      this.likeProject( thankModal )
    }
  }

  likeProject( omb ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.investorMangService.likeProject( this.project.id ).subscribe(
              res => {
                  omb.click( )
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Investor' } )
              },
              () => {
                  UtilitiesService.debug( "Project liked" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  calculateAge ( birthDate, otherDate ) {
      birthDate = new Date( birthDate );
      otherDate = new Date( otherDate );

      var years = ( otherDate.getFullYear( ) - birthDate.getFullYear( ) );

      if ( otherDate.getMonth( ) < birthDate.getMonth( ) ||
          otherDate.getMonth( ) == birthDate.getMonth( ) && otherDate.getDate( ) < birthDate.getDate( ) ) {
          years--;
      }

      return years;
  }

  getBack( ) {
      this.router.navigate( [ 'inversionista', 'perfil' ] )
  }

  calcNeedleRotation( ) {
      return `rotate(${this.currentGlobal*3.78-353}deg)`
  }

  initChart( ) {
    let chart = new Chart({
      chart: {
        type: 'line',
        height: 240,
        marginTop: 40,
        zoomType: 'x'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      yAxis: {
        title: {
          text: ''
        },
        gridLineColor: '#b8cbd0',
        lineColor: '#94734b',
        lineWidth: 1
      },
      xAxis: {
        gridLineColor: '#D0A26B',
        minorGridLineColor: '#D0A26B',
        lineColor: '#94734b'
      },
      series: [{
        name: 'Progreso',
        data: [ ]
      }],
      plotOptions: {
        line: {
          dashStyle: 'dash',
          color: '#1A2C35'
        }
      }
    });
    this.chart = chart;
  }

  downloadAT( omb ) {
    UtilitiesService.debug( "Holito" )
    if ( this.AT == undefined && !this.requestSent ) {
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

                if ( window.innerWidth < 575 ) {
                    FileSaver.saveAs( this.AT, "tabla_amortizacion.pdf" )
                } else {
                    this.AT_url = this.pdf_viewer.nativeElement.src = URL.createObjectURL( this.AT )
                    omb.click( )
                }

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
    else
        omb.click( )
  }
}
