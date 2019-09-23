import { Component, OnInit, Input } from '@angular/core';
import { AdminManagementService } from "../../../services/admin-management/admin-management.service";
import { DataService } from "../../../services/data-service/data.service";
import { Chart } from 'angular-highcharts';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-profitabilities-chart',
  templateUrl: './profitabilities-chart.component.html',
  styleUrls: ['./profitabilities-chart.component.scss']
})
export class ProfitabilitiesChartComponent implements OnInit {

  constructor( private adminManService: AdminManagementService, private dataService: DataService ) { }

  chart: Chart;
  allProfitabilities = []

  @Input( )
  height: number = 370

  @Input( )
  description: Number = 0

  ngOnInit( ) {

  }

  retrieveProfitabilities( ) {
    this.adminManService.getProfitabilities( ).subscribe(
      res => {
        this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
        this.allProfitabilities = res.json( ).profitabilities
        this.initCharts( this.allProfitabilities.map( x => x.name ) )
        this.chart.addSerie({
          name: 'Comparativo de Rentabilidad del sector financiero vs Phoenix',
          data: this.allProfitabilities.map( x => Number( x.percentage ) )
        })
      },
      err => {
        this.dataService.errorHandler( err, { userType: 'Admin' } )
      },
      () => {
        UtilitiesService.debug( "Accounts retrieved" )
      }
    )
  }

  initCharts( categories ) {
    let chart = new Chart({
      chart: {
        type: 'column',
        height: this.height,
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
        labels: {
          format: '{value}%'
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
            return 'Porcentaje: ' + this.point.y + '%';
        }
      },
      plotOptions: {
        column: {
          color: '#66C3F1'
        }
      }
    });
    this.chart = chart;
  }

}
