import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { InvestorManagementService } from "../../../services/investor-management/investor-management.service";
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-investor-history',
  templateUrl: './investor-history.component.html',
  styleUrls: ['./investor-history.component.scss'],
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
export class InvestorHistoryComponent implements OnInit {

  constructor( private router: Router, private investorMangService: InvestorManagementService,
      private dataService: DataService ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  user_data;
  projects = []
  requestSent = false
  meta
  page = 1

  ngOnInit( ) {
      this.dataService.onInit( `Historial` )

      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.investorMangService.getFinishedProjects( this.page ).subscribe(
          res => {
              UtilitiesService.debug( res.json( ) )
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              this.projects = res.json( ).projects.map( x => {
                return Object.assign({
                  parse: this.parseData( x )
                }, x )
              })
              this.meta = res.json( ).meta
              this.requestSent = false
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Investor' } )
          },
          () => {
              UtilitiesService.debug( "Customer projects retreived" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  openInvestment( index ) {
      localStorage.setItem( 'investor_investment', JSON.stringify( this.projects[ index ] ) )
      this.router.navigate( [ 'inversionista', 'inversion' ] )
  }

  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  onScrollDown( ) {
      UtilitiesService.debug( 'scrolled down!!' );
      if ( this.page + 1 <= this.meta.total_pages ) {
          this.page++
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.investorMangService.getFinishedProjects( this.page ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.meta = res.json( ).meta
                  this.projects = this.projects.concat( res.json( ).projects.map( x => {
                    return Object.assign({
                      parse: this.parseData( x )
                    }, x )
                  }))
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Investor' } )
              },
              () => {
                  UtilitiesService.debug( "Got matches" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  parseData( project ) {
    return [
      {
        label: 'nombre',
        value: project.dream
      }
    ]
  }

}
