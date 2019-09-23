import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, stagger, query, keyframes } from '@angular/animations';
import { Chart } from 'angular-highcharts';
import { Observable } from 'rxjs/Rx';
import { DataService } from "../../../services/data-service/data.service";
import { AdminManagementService } from "../../../services/admin-management/admin-management.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";
import { ProfitabilitiesChartComponent } from '../../share/profitabilities-chart/profitabilities-chart.component';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-become-inversor',
  templateUrl: './become-inversor.component.html',
  styleUrls: ['./become-inversor.component.scss'],
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
    ])
  ]
})
export class BecomeInversorComponent implements OnInit {

  constructor( private adminManService: AdminManagementService, private dataService: DataService,
      private dp: DecimalPipe ) { }

  @HostListener("window:scroll", [])
  onWindowScroll( ) {
    // console.log( this.benefits_container )
    if ( UtilitiesService.elementInViewport( this.chart_container.nativeElement.childNodes[ 1 ], window.innerWidth < 575 ? .2 : .35 ) ) {
     this.fillProfitabilitiesChart( )
    }
    if ( UtilitiesService.elementInViewport( this.statistics_container.nativeElement.childNodes[ 7 ].childNodes[ 1 ], .4 ) ) {
     this.updateCustomerPortfolioValue( )
    }
    if ( UtilitiesService.elementInViewport( this.statistics_container.nativeElement.childNodes[ 7 ].childNodes[ 3 ], .4 ) ) {
     this.updateInvestorPortfolioValue( )
    }
    if ( UtilitiesService.elementInViewport( this.statistics_container.nativeElement.childNodes[ 9 ].childNodes[ 1 ], .4 ) ) {
     this.updateRatePortfolioValue( )
    }
    if ( UtilitiesService.elementInViewport( this.statistics_container.nativeElement.childNodes[ 9 ].childNodes[ 3 ], .4 ) ) {
     this.updateBusinessPortfolioValue( )
    }
    if ( UtilitiesService.elementInViewport( this.statistics_container.nativeElement.childNodes[ 9 ].childNodes[ 5 ], .4 ) ) {
     this.updateCashPortfolioValue( )
    }
    if ( UtilitiesService.elementInViewport( this.dream_stats_container.nativeElement.childNodes[ 1 ], .4 ) ) {
     this.updatMaleInvestmentValue( )
    }
    if ( UtilitiesService.elementInViewport( this.dream_stats_container.nativeElement.childNodes[ 3 ], .4 ) ) {
     this.updateFemaleInvestmentValue( )
    }

    if ( UtilitiesService.elementInViewport( this.statistics_container.nativeElement.childNodes[ 11 ].childNodes[ 0 ], window.innerWidth < 575 ? .2 : .35 ) ) {
     this.portfolio_chart.fillChart( )
    }
    if ( UtilitiesService.elementInViewport( this.benefits_container.nativeElement.childNodes[ 1 ], .5 ) ) {
     this.showBenefits( 0 )
    }
    if ( UtilitiesService.elementInViewport( this.steps_container.nativeElement, .5 ) ) {
      this.showSteps( 0 )
    }
    if ( UtilitiesService.elementInViewport( this.map_container.nativeElement.childNodes[ 1 ].childNodes[ 3 ].childNodes[ 3 ], .5 ) ) {
      this.initPieChart( )
      this.fillMenArray( false )
      this.fillWomenArray( false )
    }

    UtilitiesService.debug( this.map_container )
  }

  @ViewChild( 'top_video' ) top_video: any;
  @ViewChild( 'map_container' ) map_container: any;
  @ViewChild( 'steps_container' ) steps_container: any;
  @ViewChild( 'chart_container' ) chart_container: any;
  @ViewChild( 'benefits_container' ) benefits_container: any;
  @ViewChild( 'statistics_container' ) statistics_container: any;
  @ViewChild( 'dream_stats_container' ) dream_stats_container: any;
  @ViewChild( 'profitabilitiesChart' ) profChartRef: ProfitabilitiesChartComponent
  @ViewChild( 'portfolio_chart' ) portfolio_chart: any;
  chart: Chart;
  chart3: Chart;

  womenAmount = []
  menAmount = []

  customerTimeout: any
  investorTimeout: any
  businessTimeout: any
  rateTimeout: any
  cashTimeout: any
  maleTimeout: any
  femaleTimeout: any

  portfolioTargetValues = {
    customers: 27,
    activeBusiness: 1345040000,
    investors: 4,
    rate: 1.55,
    cash: 20848121,
    most_male_investor: 1100000000,
    most_female_investor: 50000000
  }

  portfolioValues = {
    customers: 0,
    activeBusiness: 0,
    investors: 0,
    rate: 0,
    cash: 0,
    most_male_investor: 0,
    most_female_investor: 0
  }

  stepsShowing = {
    step1: false,
    step2: false,
    step3: false
  }

  benefitsShowing = {
    ben1: false,
    ben2: false,
    ben3: false
  }
  profitabilitiesRetrieved: Boolean = false

  ngOnInit() {
      this.dataService.onInit( `Conviértete en Inversionista` )
      this.initLineChart( )
      if ( UtilitiesService.elementInViewport( this.steps_container.nativeElement, .5 ) ) {
        this.showSteps( 0 )
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

  updatMaleInvestmentValue( ) {
    if ( this.maleTimeout == undefined ) {
      this.maleTimeout = Observable.interval( 5 ).subscribe( () => {
        if ( this.portfolioValues.most_male_investor < this.portfolioTargetValues.most_male_investor ) {
          this.portfolioValues.most_male_investor += Math.floor( Math.random( ) * 10000000 )
        } else {
          this.portfolioValues.most_male_investor = this.portfolioTargetValues.most_male_investor
          this.maleTimeout.unsubscribe( )
        }
      })
    }
  }

  updateFemaleInvestmentValue( ) {
    if ( this.femaleTimeout == undefined ) {
      this.femaleTimeout = Observable.interval( 5 ).subscribe( () => {
        if ( this.portfolioValues.most_female_investor < this.portfolioTargetValues.most_female_investor ) {
          this.portfolioValues.most_female_investor += Math.floor( Math.random( ) * 800000 )
        } else {
          this.portfolioValues.most_female_investor = this.portfolioTargetValues.most_female_investor
          this.femaleTimeout.unsubscribe( )
        }
      })
    }
  }

  updateInvestorPortfolioValue( ) {
    if ( this.investorTimeout == undefined ) {
      this.investorTimeout = Observable.interval( 300 ).subscribe( () => {
        if ( this.portfolioValues.investors < this.portfolioTargetValues.investors ) {
          this.portfolioValues.investors++
        } else {
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
          this.portfolioValues.cash += Math.floor( Math.random( ) * 100000 )
        } else {
          this.portfolioValues.cash = this.portfolioTargetValues.cash
          this.cashTimeout.unsubscribe( )
        }
      } )
    }
  }

  fillProfitabilitiesChart( ) {
    if ( !this.profitabilitiesRetrieved ) {
      this.profitabilitiesRetrieved = true
      this.profChartRef.retrieveProfitabilities( )
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

  showBenefits( i ) {
    if ( i == 0 ) {
      setTimeout( () => {
        switch ( i ) {
          case 0:
            this.benefitsShowing.ben1 = true
            break
          case 1:
            this.benefitsShowing.ben2 = true
            break
          case 2:
            this.benefitsShowing.ben3 = true
            break
        }
        if ( i < 2 )
          this.showBenefits( i + 1 )
      }, 500 )
    } else {
      setTimeout( () => {
        switch ( i ) {
          case 0:
            this.benefitsShowing.ben1 = true
            break
          case 1:
            this.benefitsShowing.ben2 = true
            break
          case 2:
            this.benefitsShowing.ben3 = true
            break
        }
        if ( i < 2 )
          this.showBenefits( i + 1 )
      }, 700 )
    }
  }

  stopVideo( ) {
      this.top_video.nativeElement.src = ''
  }

  resetTopVideo( ovb ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'videos',
        eventAction: 'home investor video click'
      });
      this.top_video.nativeElement.src = "https://www.youtube.com/embed/TiV_oqPEmLM?showinfo=0&rel=0&autoplay=1"
      ovb.click( )
  }

  fillWomenArray( flag ) {
    if ( flag ) {
      setTimeout( () => {
        if ( this.womenAmount.length < 1 ) {
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
        if ( this.menAmount.length < 3 ) {
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

  addChartPoint( index ) {

    return index + 1
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
          text: ''
        },
        credits: {
          enabled: false
        },
        yAxis: {
          title: {
            align: 'high',
            text: '<b>Valores en<br><b>Miles</b></b>',
            style: {
              color: '#D0A26B'
            },
            rotation: 0,
            offset: 0,
            y: -30
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
            'May<br>2017',
            'Jun',
            'Jul',
            'Ago',
            'Sep',
            'Oct',
            'Nov',
            'Dic',
            'Ene<br>2018',
            'Feb',
            'Mar',
            'Abr'
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

  initPieChart( ) {
    if ( this.chart3 == undefined ) {
      let chart3 = new Chart({
        chart: {
          backgroundColor: '#1A2C35',
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
                borderColor: '#1A2C35',
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
                  '#C9C9C9',
                  '#D0A26B'
                ]
            }
        },
        series: [{
            name: 'Porcentaje',
            data: [{
                name: 'Hombres',
                y: 75,
            }, {
                name: 'Mujeres',
                y: 25,
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

  resetBottomLeftVideo( ovb ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'videos',
        eventAction: 'testimonial investor video click',
        eventLabel: 'Fabio Serrano video'
      });
      this.top_video.nativeElement.src = "https://www.youtube.com/embed/BDfl1XlTkTk?showinfo=0&rel=0&autoplay=1"
      ovb.click( )
  }

  resetBottomRightVideo( ovb ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'videos',
        eventAction: 'testimonial investor video click',
        eventLabel: 'Lina María Calle video'
      });
      this.top_video.nativeElement.src = "https://www.youtube.com/embed/_2RTLv6pn20?showinfo=0&rel=0&autoplay=1"
      ovb.click( )
  }

  dreamTracker( ) {
    ( <any> window ).ga( 'send', 'event', {
      eventCategory: 'call to action',
      eventAction: "become investor 'Regístrate' click"
    });
  }

}
