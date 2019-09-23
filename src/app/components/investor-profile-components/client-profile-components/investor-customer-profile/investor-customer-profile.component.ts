import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { InvestorManagementService } from "../../../../services/investor-management/investor-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import { Chart } from 'angular-highcharts';
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-investor-customer-profile',
  templateUrl: './investor-customer-profile.component.html',
  styleUrls: ['./investor-customer-profile.component.scss']
})
export class InvestorCustomerProfileComponent implements OnInit {

  @ViewChild( 'profile_pic' ) profile_pic_tag: any;
  user_data
  currentGlobal = 50
  requestSent = false
  graphValues = []
  chart: Chart;

  constructor( private router: Router, private investorMangService: InvestorManagementService,
      private dataService: DataService ) { }

  ngOnInit( ) {
      var tmp = localStorage.getItem( 'customer_profile' )
      if ( tmp == null ) {
          this.router.navigate( [ 'inversionista', 'inversion' ] )
          return
      } else {
          this.user_data = JSON.parse( tmp )
          this.dataService.onInit( `Perfil Cliente: ${this.user_data.name} ${this.user_data.lastname}` )
          UtilitiesService.debug( this.user_data )
          if ( this.user_data.avatar.url == null )
              this.profile_pic_tag.nativeElement.src = "assets/images/client-profile/default_avatar.png"
          else
              this.profile_pic_tag.nativeElement.src = this.investorMangService.API_path + this.user_data.avatar.url

          this.initChart( )

          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.investorMangService.getGraphValues( this.user_data.id ).subscribe(
              ans => {
                  this.graphValues = Object.values( ans.json( ).data.values )
                  this.fillChart( 0 )
                  this.requestSent = false
                  this.dataService.updateShowBird( false )
              },
              err => {
                  UtilitiesService.debug( err )
                  this.requestSent = false
                  this.dataService.updateShowBird( false )
                  if ( err.status == 401 ) {
                      UtilitiesService.debug( "Session is not more active, redirecting..." )
                      localStorage.setItem( 'redirect_to_url', window.location.pathname )
                      this.router.navigate( [ "/iniciar-sesion" ] )
                  }
              },
              () => {
                  UtilitiesService.debug( "Graph values retrieved" )
              }
          )

          this.moveNeedle( )
      }
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

  moveNeedle( ) {
      if ( this.currentGlobal <= this.user_data.global ) {
          setTimeout( () => {
            this.currentGlobal += 0.1
            this.moveNeedle( )
          }, 1 )
      }
  }

  getBack( ) {
    window.history.back( )
  }

}
