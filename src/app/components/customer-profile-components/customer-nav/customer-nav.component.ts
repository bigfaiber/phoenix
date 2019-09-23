import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { style, state, animate, transition, trigger } from '@angular/core';
import { CustomerManagementService } from "../../../services/customerManagement/customer-management.service";
import { MyCurrencyPipe } from "../../../pipes/currency/my-currency.pipe";
import { DataService } from "../../../services/data-service/data.service";
import { MissingDocsComponent } from "../../share/missing-docs/missing-docs.component";
import { Chart } from 'angular-highcharts';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-customer-nav',
  templateUrl: './customer-nav.component.html',
  styleUrls: ['./customer-nav.component.scss']
})
export class CustomerNavComponent implements OnInit {

  constructor( private router: Router, private customerMangService: CustomerManagementService,
                 private cuPipe: MyCurrencyPipe, private dataService: DataService ) {
                   this.user_data = dataService.user_data_value
                   dataService.user_data$.subscribe( val => {
                     this.user_data = val
                   })
                 }

  @ViewChild( 'profile_pic' ) profile_pic_tag: any;
  @ViewChild( 'missing_ref' ) missingRef: MissingDocsComponent
  @ViewChild( 'top_video' ) top_video: any;

  user_data: any
  chart: Chart;

  currentGlobal = 50
  graphValues = []

  ngOnInit( ) {
      if ( this.user_data.avatar.url == null )
          this.profile_pic_tag.nativeElement.src = "assets/images/client-profile/default_avatar.png"
      else
          this.profile_pic_tag.nativeElement.src = this.customerMangService.API_path + this.user_data.avatar.url

      this.initChart( )

      this.customerMangService.getGraphValues( this.user_data.id ).subscribe(
          ans => {
              this.dataService.updateUserAndSessionData( ans.headers.get( 'token' ), null )
              this.graphValues = Object.values( ans.json( ).data.values )
              this.fillChart( 0 )
          },
          err => {
              this.dataService.errorHandler( err, { userType: 'Client' } )
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
      if ( this.currentGlobal <= this.user_data.global ) {
          setTimeout( () => {
            this.currentGlobal += 0.1
            this.moveNeedle( )
          }, 1 )
      }
  }

  calcNeedleRotation( ) {
      return `rotate(${this.currentGlobal*3.78-353}deg)`
  }

  initChart( ) {
    let chart = new Chart({
      chart: {
        type: 'line',
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

  imgPath( index ) {
      var dec = this.user_data.rating - Math.floor( this.user_data.rating )

      if ( index > this.user_data.rating )
          return "assets/images/client-profile/star_empty.png"
      if ( index < Math.floor( this.user_data.rating ) )
          return "assets/images/client-profile/star_fill.png"
      else
          if ( dec < 0.5 )
              return "assets/images/client-profile/star_empty.png"
          else
              return "assets/images/client-profile/star_half_fill.png"
  }

  notifyMissingDoc( ) {
    this.missingRef.blink( )
  }

  stopVideo( ) {
      this.top_video.nativeElement.src = ''
  }

  resetTopVideo( ovb ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'videos',
        eventAction: 'internal client video click'
      });
      this.top_video.nativeElement.src = "https://www.youtube.com/embed/qyTazSsdIN8?showinfo=0&rel=0&autoplay=1"
      ovb.click( )
  }

}
