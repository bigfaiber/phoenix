import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-active-portfolio',
  templateUrl: './active-portfolio.component.html',
  styleUrls: ['./active-portfolio.component.scss']
})
export class ActivePortfolioComponent implements OnInit {

  constructor() { }

  chart: Chart
  chartTimeout: any

  lineChartValues = [ 1400, 1500, 1540, 1600, 1800, 1640, 1695, 1750, 1300, 1290, 1700, 1370 ]

  ngOnInit( ) {
    this.initLineChart( )
  }

  initLineChart( ) {
    if ( this.chart == undefined ) {
      let chart = new Chart({
        chart: {
          type: 'line',
          height: window.innerWidth < 575 ? '100%' : '45%',
          marginTop: 40,
          zoomType: 'x'
        },
        title: {
          text: '<b>Valores en Miles</b>',
          align: 'left',
          style: {
            color: '#D0A26B',
            fontFamily: 'Open-Sans-Regular'
          }
        },
        credits: {
          enabled: false
        },
        yAxis: {
          title: {
            text: '',
          },
          gridLineColor: 'white',
          lineColor: '#94734b',
          lineWidth: 1,
          min: 1280,
          labels: {
            style: {
              color: '#1A2C35',
              fontWeight: 'bold'
            },
            format: "${value}"
          }
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
          categories: [
            'Sep<br>2017',
            'Oct',
            'Nov',
            'Dic',
            'Ene<br>2018',
            'Feb',
            'Mar',
            'Abr',
            'May',
            'Jun',
            'Jul',
            'Ago'
          ]
        },
        plotOptions: {
          line: {
            color: '#D0A26B'
          },
          series: {
            marker: {
              fillColor: '#1A2C35'
            },
            showInLegend: false,
            lineWidth: 5
          },
          column: {
            pointWidth: 1
          }
        }
      });
      this.chart = chart;
    }
  }

  fillChart( ) {
    if ( this.chartTimeout == undefined ) {
      this.chart.addSerie({
        type: 'line',
        name: 'Monto',
        data: this.lineChartValues,
        zIndex: 3
      })
      this.chart.addSerie({
        type: 'column',
        name: 'Monto',
        data: this.lineChartValues,
        zIndex: 2,
        color: '#1A2C35'
      })
      this.chartTimeout = 2
    }
  }

}
