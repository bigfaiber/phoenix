import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { style, state, animate, transition, trigger } from '@angular/core';
import { CustomerManagementService } from "../../../services/customerManagement/customer-management.service";
import { MyCurrencyPipe } from "../../../pipes/currency/my-currency.pipe";
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-customer-history',
  templateUrl: './customer-history.component.html',
  styleUrls: ['./customer-history.component.scss'],
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
export class CustomerHistoryComponent implements OnInit {

  constructor( private router: Router, private customerMangService: CustomerManagementService,
                 private cuPipe: MyCurrencyPipe, private dataService: DataService ) {
                   this.user_data = dataService.user_data_value
                   dataService.user_data$.subscribe( val => {
                     this.user_data = val
                   })
                 }

  projects = []
  user_data;
  page = 1
  requestSent = false
  meta

  ngOnInit() {
      this.dataService.onInit( `Historial` )

      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.customerMangService.getFinishedProjects( this.page ).subscribe(
          res => {
              UtilitiesService.debug( res.json( ) )
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              this.projects = this.projects.concat( res.json( ).projects )
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
              this.dataService.errorHandler( err, { userType: 'Client' } )
          },
          () => {
              UtilitiesService.debug( "Finished projects retreived" )
              this.dataService.updateShowBird( false )
          }
      )
  }

  redirectToProject( index ) {
      localStorage.setItem( "customer_matched_project", JSON.stringify( this.projects[ index ] ) )
      this.router.navigate( [ 'cliente', 'proyecto' ] )
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
          this.customerMangService.getFinishedProjects( this.page ).subscribe(
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
                  this.dataService.errorHandler( err, { userType: 'Client' } )
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
