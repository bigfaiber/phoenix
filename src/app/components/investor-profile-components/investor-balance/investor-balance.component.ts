import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { InvestorManagementService } from "../../../services/investor-management/investor-management.service";
import { DataService } from "../../../services/data-service/data.service";
import { Chart } from 'angular-highcharts';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-investor-balance',
  templateUrl: './investor-balance.component.html',
  styleUrls: ['./investor-balance.component.scss'],
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
export class InvestorBalanceComponent implements OnInit {

  constructor( private router: Router, private investorMangService: InvestorManagementService,
      private dataService: DataService ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  user_data;
  requestSent = false
  meta
  page = 1

  chart: Chart;
  chart2: Chart;
  chart3: Chart;
  chart4: Chart;

  ngOnInit( ) {
      this.dataService.onInit( `Balance` )

      this.dataService.updateShowBird( true )
      this.investorMangService.getGraphs( this.user_data.id ).subscribe(
        res => {
          this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
          UtilitiesService.debug( res.json( ) )
          var graphs = res.json( ).data

          this.initCharts( Object.keys( graphs.interest ).map( x => this.dataService.dateParser( x ) ) )

          // Object.keys( graphs.interest ).map( x => graphs.interest[ x ] ).forEach( val => {
          //   this.chart4.addPoint( Number( val ) )
          // })

          this.chart.addSerie({
            type: 'line',
            name: 'CARTERA ACTIVA',
            data: Object.keys( graphs.debt ).map( x => graphs.debt[ x ] ).map( x => Number( x ) ),
            zIndex: 3
          })

          this.chart.addSerie({
            type: 'column',
            name: 'CARTERA ACTIVA',
            data: Object.keys( graphs.debt ).map( x => graphs.debt[ x ] ).map( x => Number( x ) ),
            zIndex: 2,
            color: '#1A2C35'
          })

          this.chart2.addSerie({
            name: 'GANANCIA MES A MES',
            data: Object.keys( graphs.interest ).map( x => graphs.interest[ x ] ).map( x => Number( x ) )
          })

          var people: any = {}
          var total = 0
          graphs.people.forEach( val => {
            if ( !people[ val[ 0 ] ] )
              people[ val[ 0 ] ] = 0
            people[ val[ 0 ] ] += val[ 1 ]
            total += val [ 1 ]
          })

          this.chart3.addSerie({
            name: 'People',
            data: Object.keys( people ).map( x => {
              return {
                name: x,
                y: people[ x ] / total * 100
              }
            })
          })
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

  fillDocs( ) {
      localStorage.setItem( 'investor_came_from', window.location.pathname )
      this.router.navigate( [ 'inversionista', 'subir-archivos' ] )
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

  initCharts( categories ) {
    let chart = new Chart({
      chart: {
        type: 'line',
        height: 310,
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
        lineColor: '#94734b',
        labels: {
          style: {
            color: '#1A2C35',
            fontWeight: 'bold'
          }
        },
        categories: categories
      },
      plotOptions: {
        line: {
          color: '#D0A26B'
        },
        series: {
          showInLegend: false,
          marker: {
            fillColor: '#1A2C35'
          },
          lineWidth: 5
        },
        column: {
          pointWidth: 1
        }
      }
    });
    this.chart = chart;

    let chart2 = new Chart({
      chart: {
        type: 'column',
        height: 310,
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
        lineColor: '#94734b',
        categories: categories
      },
      tooltip: {
        formatter: function () {
            return 'Ganancia mes: $' + this.point.y;
        }
      },
      plotOptions: {
        column: {
          color: '#5eb36c'
        },
        series: {
          showInLegend: false,
        }
      }
    });
    this.chart2 = chart2;

    let chart3 = new Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        height: 370,
        marginTop: 40,
        zoomType: 'x'
      },
      title: {
          text: ''
      },
      tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                  enabled: false
              },
              showInLegend: true,
              colors: [
                '#D0A26B',
                '#d6b48c',
                '#e8cca9',
                '#e8dbca'
              ]
          }
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
        lineColor: '#94734b',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    });
    this.chart3 = chart3;
  }

}
