import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, stagger, query, keyframes } from '@angular/animations';
import { Observable } from 'rxjs/Rx';
import { Chart } from 'angular-highcharts';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";
import { DataService } from "../../../services/data-service/data.service";
import { DecimalPipe } from '@angular/common';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('stepState', [
      transition(':enter', [
        style({opacity:0,transform:'translateX(-100%)',height:0}),
        animate(200, style({opacity:1,transform:'translateX(0)',height:'*'}))
      ])
    ]),
    trigger('appearingAnimNoDelay', [
      transition(':enter', [
        style({opacity:0,transform:'scale(0)',height:0,width:0}),
        animate(100, style({opacity:1,transform:'scale(1.2)',height:'*',width:'*'})),
        animate(80, style({transform:'scale(1)'}))
      ]),
      transition(':leave', [
        animate(80, style({transform:'scale(1.2)',height:'*',width:'*'})),
        animate(100, style({opacity:0,transform:'scale(0)',height:0,width:0}))
      ])
    ]),
    trigger('appearingAnim', [
      transition(':enter', [
        style({opacity:0,transform:'scale(0)',height:0,width:0}),
        animate(300, style({opacity:1,transform:'scale(1.2)',height:'*',width:'*'})),
        animate(280, style({transform:'scale(1)'}))
      ]),
      transition(':leave', [
        animate(280, style({transform:'scale(1.2)',height:'*',width:'*'})),
        animate(300, style({opacity:0,transform:'scale(0)',height:0,width:0}))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  constructor( private dataService: DataService, private dp: DecimalPipe ) { }

  @HostListener("window:scroll", [])
  onWindowScroll( ) {
    // console.log( this.dream_stats_container )
    if ( UtilitiesService.elementInViewport( this.statistics_container.nativeElement.childNodes[ 7 ].childNodes[ 1 ], .4 ) ) {
     this.updateCustomerPortfolioValue( )
    }
    if ( UtilitiesService.elementInViewport( this.statistics_container.nativeElement.childNodes[ 7 ].childNodes[ 5 ], .4 ) ) {
      this.updateRatePortfolioValue( )
    }
    if ( UtilitiesService.elementInViewport( this.statistics_container.nativeElement.childNodes[ 7 ].childNodes[ 3 ], .4 ) ) {
     this.updateBusinessPortfolioValue( )
    }
    if ( UtilitiesService.elementInViewport( this.dream_stats_container.nativeElement.childNodes[ 1 ], .4 ) ) {
     this.updateInvestorPortfolioValue( )
    }
    if ( UtilitiesService.elementInViewport( this.dream_stats_container.nativeElement.childNodes[ 3 ], .4 ) ) {
     this.updateCashPortfolioValue( )
    }
    // if ( UtilitiesService.elementInViewport( this.statistics_container.nativeElement.childNodes[ 11 ].childNodes[ 0 ], window.innerWidth < 575 ? .2 : .35 ) ) {
    //  this.portfolio_chart.fillChart( )
    // }
    if ( UtilitiesService.elementInViewport( this.steps_container.nativeElement, .5 ) ) {
      this.showSteps( 0 )
    }
    if ( UtilitiesService.elementInViewport( this.map_container.nativeElement.childNodes[ 3 ].childNodes[ 3 ].childNodes[ 1 ], .3 ) ) {
      this.initCharts( )
      this.fillMenArray( false )
      this.fillWomenArray( false )
      this.showLen = true
    }
    // console.log( this.dreams_container )
    if ( UtilitiesService.elementInViewport( this.dreams_container.nativeElement.childNodes[ 3 ], .3 ) ) {
      this.initDreamPie( )
    }
  }

  @ViewChild( 'top_video' ) top_video: any;
  @ViewChild( 'statistics_container' ) statistics_container: any;
  @ViewChild( 'dream_stats_container' ) dream_stats_container: any;
  @ViewChild( 'steps_container' ) steps_container: any;
  @ViewChild( 'map_container' ) map_container: any;
  @ViewChild( 'dreams_container' ) dreams_container: any;
  @ViewChild( 'portfolio_chart' ) portfolio_chart: any;
  chart3: Chart;
  customerPieChart: Chart;

  womenAmount = []
  menAmount = []

  showLen: Boolean = false

  customerTimeout: any
  investorTimeout: any
  businessTimeout: any
  rateTimeout: any
  cashTimeout: any

  portfolioTargetValues = {
    customers: 27,
    activeBusiness: 1345040000,
    investors: 180000000,
    rate: 1.55,
    cash: 800000
  }

  portfolioValues = {
    customers: 0,
    activeBusiness: 0,
    investors: 0,
    rate: 0,
    cash: 0
  }

  stepsShowing = {
    step1: false,
    step2: false,
    step3: false
  }

  ngOnInit( ) {
      this.dataService.onInit( `Bienvenido` )
      if ( UtilitiesService.elementInViewport( this.steps_container.nativeElement, .5 ) ) {
        this.showSteps( 0 )
      }
  }

  showSteps( i ) {
    if ( i == 0 ) {
      setTimeout( () => {
        switch ( i ) {
          case 0:
            this.stepsShowing.step1 = true
            break
          case 1:
            this.stepsShowing.step2 = true
            break
          case 2:
            this.stepsShowing.step3 = true
            break
        }
        if ( i < 2 )
          this.showSteps( i + 1 )
      }, 200 )
    } else {
      setTimeout( () => {
        switch ( i ) {
          case 0:
            this.stepsShowing.step1 = true
            break
          case 1:
            this.stepsShowing.step2 = true
            break
          case 2:
            this.stepsShowing.step3 = true
            break
        }
        if ( i < 2 )
          this.showSteps( i + 1 )
      }, 700 )
    }
  }

  updateCustomerPortfolioValue( ) {
    if ( this.customerTimeout == undefined ) {
      this.customerTimeout = Observable.interval( 100 ).subscribe( () => {
        if ( this.portfolioValues.customers < this.portfolioTargetValues.customers ) {
          this.portfolioValues.customers++
        } else {
          this.customerTimeout.unsubscribe( )
        }
      } )
    }
  }

  updateBusinessPortfolioValue( ) {
    if ( this.businessTimeout == undefined ) {
      this.businessTimeout = Observable.interval( 5 ).subscribe( () => {
        if ( this.portfolioValues.activeBusiness < this.portfolioTargetValues.activeBusiness ) {
          this.portfolioValues.activeBusiness += Math.floor( Math.random( ) * 10000000 )
        } else {
          this.portfolioValues.activeBusiness = this.portfolioTargetValues.activeBusiness
          this.businessTimeout.unsubscribe( )
        }
      })
    }
  }

  updateInvestorPortfolioValue( ) {
    if ( this.investorTimeout == undefined ) {
      this.investorTimeout = Observable.interval( 5 ).subscribe( () => {
        if ( this.portfolioValues.investors < this.portfolioTargetValues.investors ) {
          this.portfolioValues.investors += Math.floor( Math.random( ) * 1000000 )
        } else {
          this.portfolioValues.investors = this.portfolioTargetValues.investors
          this.investorTimeout.unsubscribe( )
        }
      } )
    }
  }

  updateRatePortfolioValue( ) {
    if ( this.rateTimeout == undefined ) {
      this.rateTimeout = Observable.interval( 10 ).subscribe( () => {
        if ( this.portfolioValues.rate < this.portfolioTargetValues.rate ) {
          this.portfolioValues.rate = Number( this.dp.transform( Number( this.portfolioValues.rate ) + .011, '1.0-2' ) )
        } else {
          this.rateTimeout.unsubscribe( )
        }
      } )
    }
  }

  updateCashPortfolioValue( ) {
    if ( this.cashTimeout == undefined ) {
      this.cashTimeout = Observable.interval( 5 ).subscribe( () => {
        if ( this.portfolioValues.cash < this.portfolioTargetValues.cash ) {
          this.portfolioValues.cash += Math.floor( Math.random( ) * 10000 )
        } else {
          this.portfolioValues.cash = this.portfolioTargetValues.cash
          this.cashTimeout.unsubscribe( )
        }
      } )
    }
  }

  fillWomenArray( flag ) {
    if ( flag ) {
      setTimeout( () => {
        if ( this.womenAmount.length < 14 ) {
          this.womenAmount.push( 1 )
          this.fillWomenArray( true )
        }
      }, Math.random( ) * 100 + 150 )
    } else {
      if ( this.womenAmount.length == 0 ) {
        this.womenAmount.push( 1 )
        this.fillWomenArray( true )
      }
    }
  }

  fillMenArray( flag ) {
    if ( flag ) {
      setTimeout( () => {
        if ( this.menAmount.length < 14 ) {
          this.menAmount.push( 1 )
          this.fillMenArray( true )
        }
      }, Math.random( ) * 100 + 150 )
    } else {
      if ( this.menAmount.length == 0 ) {
        this.menAmount.push( 1 )
        this.fillMenArray( true )
      }
    }
  }

  stopVideo( ) {
      this.top_video.nativeElement.src = ''
  }

  resetTopVideo( ovb ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'videos',
        eventAction: 'home client video click'
      });
      this.top_video.nativeElement.src = "https://www.youtube.com/embed/704BkT3SzDs?showinfo=0&rel=0&autoplay=1"
      ovb.click( )
  }

  resetBottomLeftVideo( ovb ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'videos',
        eventAction: 'testimonial client video click',
        eventLabel: 'Jeniffer Prada video'
      });
      this.top_video.nativeElement.src = "https://www.youtube.com/embed/oaRVRHX2WQU?showinfo=0&rel=0&autoplay=1"
      ovb.click( )
  }

  resetBottomMiddleVideo( ovb ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'videos',
        eventAction: 'testimonial client video click',
        eventLabel: 'Julio Torres video'
      });
      this.top_video.nativeElement.src = "https://www.youtube.com/embed/Ra50mgw0cGc?showinfo=0&rel=0&autoplay=1"
      ovb.click( )
  }

  resetBottomRightVideo( ovb ) {
      this.top_video.nativeElement.src = "https://www.youtube.com/embed/g-jwWYX7Jlo?controls=0&showinfo=0&rel=0&autoplay=1"
      ovb.click( )
  }

  initCharts( ) {
    if ( this.chart3 == undefined ) {
      let chart3 = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          marginTop: 40,
          zoomType: 'x',
          width: 180,
          height: 180
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                  format: '{point.percentage:.0f}%',
                  distance: -28,
                  style: {
                    fontWeight: '1',
                    fontFamily: 'Open-Sans-Regular',
                    textOutline: '0'
                  }
                },
                showInLegend: false,
                colors: [
                  '#1A2C35',
                  '#D0A26B'
                ]
            }
        },
        series: [{
            name: 'Porcentaje',
            data: [{
                name: 'Hombres',
                y: 50,
            }, {
                name: 'Mujeres',
                y: 50,
            }
          ],
        }],
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

  initDreamPie( ) {
    if ( this.customerPieChart == undefined ) {
      let customerPieChart = new Chart({
        chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
        },
        title: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.0f}%</b>'
        },
        legend: {
          labelFormat: '{name} {percentage:.0f}%',
          style: {
            fontSize: '16px',
            fontFamily: 'Open-Sans-Regular',
            color: '#1A2C35'
          }
        },
        plotOptions: {
            pie: {
                allowPointSelect: false,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    style: {
                      fontSize: '16px',
                      fontFamily: 'Open-Sans-Regular',
                      color: '#1A2C35'
                    },
                    format: '<b>{point.name}</b>: {point.percentage:.0f} %'
                },
                showInLegend: true,
                colors: [
                  '#2E4D5C',
                  '#D0A26B',
                  '#4C8842',
                  '#69BF5C',
                  '#C2F7A6',
                  '#A6E0F7',
                  '#5C9EBF',
                ]
            }
        },
        credits: {
          enabled: false
        },
        series: [{
            name: 'Porcentaje',
            data: [{
                name: 'Unificación de deudas',
                y: 16
            }, {
                name: 'Capital de trabajo',
                y: 51
            }, {
                name: 'Vehículos',
                y: 8
            }, {
                name: 'Vivienda',
                y: 11
            }, {
                name: 'Libre inversión',
                y: 8
            }, {
                name: 'Estudio',
                y: 3
            }, {
                name: 'Viajes',
                y: 3
            }]
        }]
      });
      this.customerPieChart = customerPieChart;
    }
  }

  dreamTracker( ) {
    ( <any> window ).ga( 'send', 'event', {
      eventCategory: 'call to action',
      eventAction: "home 'Cumple tu sueño' click"
    });
  }
}
