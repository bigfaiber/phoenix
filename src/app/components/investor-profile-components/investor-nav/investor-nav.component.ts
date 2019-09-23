import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { InvestorManagementService } from "../../../services/investor-management/investor-management.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";
import { DataService } from "../../../services/data-service/data.service";
import { ProfitabilitiesChartComponent } from '../../share/profitabilities-chart/profitabilities-chart.component';
import { MissingDocsComponent } from "../../share/missing-docs/missing-docs.component";
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-investor-nav',
  templateUrl: './investor-nav.component.html',
  styleUrls: ['./investor-nav.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity:0}),
        animate(200, style({opacity:1}))
      ]),
      transition(':leave', [
        animate(200, style({opacity:0}))
      ])
    ]),
    trigger('notfState', [
      state('a', style({})),
      state('b', style({})),
      transition('a => b', [
        animate( 50, style({transform:'translateX(5px)'}) ),
        animate( 50, style({transform:'translateX(-5px)'}) ),
        animate( 50, style({transform:'translateX(5px)'}) ),
        animate( 50, style({transform:'translateX(-5px)'}) ),
        animate( 50, style({transform:'translateX(0px)'}) )
      ]),
      transition('b => a', [
        animate( 50, style({transform:'translateX(5px)'}) ),
        animate( 50, style({transform:'translateX(-5px)'}) ),
        animate( 50, style({transform:'translateX(5px)'}) ),
        animate( 50, style({transform:'translateX(-5px)'}) ),
        animate( 50, style({transform:'translateX(0px)'}) )
      ])
    ])
  ]
})
export class InvestorNavComponent implements OnInit {

  constructor( private router: Router, private investorMangService: InvestorManagementService,
      private dataService: DataService ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  user_data;
  chart: Chart;
  @ViewChild( 'profile_pic' ) profile_pic_tag: any;
  @ViewChild( 'profitabilitiesChart' ) profChartRef: ProfitabilitiesChartComponent
  @ViewChild( 'missing_ref' ) missingRef: MissingDocsComponent
  @ViewChild( 'top_video' ) top_video: any;

  notificationState: String = 'a'

  ngOnInit( ) {
    if ( this.user_data.avatar.url == null )
        this.profile_pic_tag.nativeElement.src = "assets/images/client-profile/default_avatar.png"
    else
        this.profile_pic_tag.nativeElement.src = this.investorMangService.API_path + this.user_data.avatar.url

    this.profChartRef.retrieveProfitabilities( )

    this.investorMangService.getGraphs( this.user_data.id ).subscribe(
      res => {
        this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
        UtilitiesService.debug( res.json( ) )
        var graphs = res.json( ).data

        this.initChart( Object.keys( graphs.interest ).map( x => this.dataService.dateParser( x ) ) )

        Object.keys( graphs.interest ).map( x => graphs.interest[ x ] ).forEach( val => {
          this.chart.addPoint( Number( val ) )
        })

      },
      err => {
        this.dataService.errorHandler( err, { userType: 'Investor' } )
      },
      () => {
        UtilitiesService.debug( "Project retreived" )
      }
    )
  }

  missingAccount( ) {
    return UtilitiesService.missingAccount( this.user_data )
  }

  initChart( categories ) {
    let chart = new Chart({
      chart: {
        type: 'column',
        height: 270,
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
      series: [{
          name: 'GANANCIA MES A MES',
          data: []
      }],
      tooltip: {
        formatter: function () {
            return 'Ganancia mes: $' + this.point.y;
        }
      },
      plotOptions: {
        column: {
          color: '#5eb36c'
        }
      }
    });
    this.chart = chart;
  }

  showProfsChart( ) {
    let arr: String[] = window.location.pathname.split( '/' )
    return arr[ arr.length - 2 ] == 'inversionista' && arr[ arr.length - 1 ] == 'balance'
  }

  notifyMissingDoc( ) {
    this.missingRef.blink( )
  }

  shakeAccount( ) {
    if ( window.innerWidth > 575 )
      window.scrollTo( 0, 0 )
    else
      window.scrollTo( 0, 500 )
    this.notificationState = this.notificationState == 'a' ? 'b' : 'a'
  }

  stopVideo( ) {
      this.top_video.nativeElement.src = ''
  }

  resetTopVideo( ovb ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'videos',
        eventAction: 'internal investor video click'
      });
      this.top_video.nativeElement.src = "https://www.youtube.com/embed/cy19jNVKKSw?showinfo=0&rel=0&autoplay=1"
      ovb.click( )
  }

}
