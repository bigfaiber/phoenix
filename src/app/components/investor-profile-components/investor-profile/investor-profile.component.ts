import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { InvestorManagementService } from "../../../services/investor-management/investor-management.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";
import { MyCurrencyPipe } from "../../../pipes/currency/my-currency.pipe";
import { DataService } from "../../../services/data-service/data.service";
import { NouisliderModule } from 'ng2-nouislider';
import { Chart } from 'angular-highcharts';
import { InvestorNavComponent } from "../../../components/investor-profile-components/investor-nav/investor-nav.component";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-investor-profile',
  templateUrl: './investor-profile.component.html',
  styleUrls: ['./investor-profile.component.scss'],
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
export class InvestorProfileComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor( private router: Router, private investorMangService: InvestorManagementService,
                 private cuPipe: MyCurrencyPipe, private dataService: DataService, private dp: DecimalPipe ) {
                   this.user_data = dataService.user_data_value
                   dataService.user_data$.subscribe( val => {
                     this.user_data = val
                   })
                 }

   millionsRange = [ 0, 150 ]
   interestRange = [ 1.0, 2.2 ]
   termRange = 120

   user_data;
   projects = []

   requestSent = false
   highlight = false

   _timeout: any = null;

   meta
   page = 1

   @ViewChild( 'upper_nav' ) upper_nav: InvestorNavComponent

   printCurrentValues( ) {
     UtilitiesService.debug( this.millionsRange )
   }

   ngOnInit( ) {
       this.dataService.onInit( `Perfil Inversionista` )

       var search_params: any = localStorage.getItem( 'search_params' )
       if ( search_params != null ) {
         var search_params_parsed = JSON.parse( search_params )
         this.millionsRange = [ search_params_parsed.cap_lower, search_params_parsed.cap_upper ]
         this.interestRange = [ search_params_parsed.rate_lower, search_params_parsed.rate_upper ]
         this.termRange = search_params_parsed.term_upper
       }

       this.requestSent = true
       this.dataService.updateShowBird( true )
       this.investorMangService.searchProjects( this.millionsRange[ 0 ], this.millionsRange[ 1 ], this.interestRange[ 0 ], this.interestRange[ 1 ],
          1, this.termRange, this.page ).subscribe(
           res => {
               this.meta = res.json( ).meta
               var projects: [ any ] = res.json( ).projects
               for ( var i = 0; i < projects.length; i++ ) {
                   if ( projects[ i ].approved && projects[ i ].investor == null ) {
                       this.projects.push( projects[ i ] )
                   }
               }
               this.projects = this.projects.map( x => {
                 return Object.assign({
                   parse: this.parseData( x )
                 }, x )
               })
               UtilitiesService.debug( this.projects )
               this.requestSent = false
               this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
           },
           err => {
               this.requestSent = false
               this.dataService.errorHandler( err, { userType: 'Investor' } )
           },
           () => {
               UtilitiesService.debug( "Got specific projects" )
               this.dataService.updateShowBird( false )
           }
       )
   }

   changeMillionsRange( index, val ) {
     var tmp = [ this.millionsRange[ 0 ], this.millionsRange[ 1 ] ]
     tmp[ index ] += val
     this.millionsRange = tmp
   }

   changeInterestRange( index, val ) {
     var tmp = [ this.interestRange[ 0 ], this.interestRange[ 1 ] ]
     tmp[ index ] += val
     this.interestRange = tmp
   }

   changeTermRange( val ) {
     if ( this.termRange + val > 0 && this.termRange + val <= 120 ) {
         var tmp = this.termRange
         tmp += val
         this.termRange = tmp
      }
   }

   ngAfterViewInit( ) {
   }

   redirectToProject( index ) {
      let completeDocs = UtilitiesService.allDocumentsComplete( this.user_data )
      let missing = UtilitiesService.missingAccount( this.user_data )
       if ( !completeDocs && missing == 0 ) {
           localStorage.setItem( 'customer_project', JSON.stringify( this.projects[ index ] ) )
           this.router.navigate( [ 'inversionista','proyecto' ] )
       }
       else if ( completeDocs ) {
         this.upper_nav.notifyMissingDoc( )
       } else {
         this.upper_nav.shakeAccount( )
       }
   }

   catchValues( ) {
        if ( this.millionsRange[ 0 ] != null && this.millionsRange[ 1 ] != null &&
            this.interestRange[ 0 ] != null && this.interestRange[ 1 ] != null &&
                this.termRange != null ){

            if( this._timeout != null ) {
              window.clearTimeout( this._timeout );
              this.requestSent = false
            }

            this._timeout = window.setTimeout( () => {
                this._timeout = null;

                localStorage.setItem( 'search_params', JSON.stringify({
                    cap_lower: this.millionsRange[ 0 ],
                    cap_upper: this.millionsRange[ 1 ],
                    rate_lower: this.interestRange[ 0 ],
                    rate_upper: this.interestRange[ 1 ],
                    term_upper: this.termRange
                  })
                )

                this.requestSent = true
                this.dataService.updateShowBird( true )
                this.page = 1
                this.investorMangService.searchProjects( this.millionsRange[ 0 ],
                  this.millionsRange[ 1 ], this.interestRange[ 0 ],
                    this.interestRange[ 1 ], 1, this.termRange,
                       this.page ).subscribe(
                          res => {
                              this.projects = []
                              var projects: [ any ] = res.json( ).projects
                              for ( var i = 0; i < projects.length; i++ ) {
                                  if ( projects[ i ].approved && projects[ i ].investor == null ) {
                                      this.projects.push( projects[ i ] )
                                  }
                              }
                              this.projects = this.projects.map( x => {
                                return Object.assign({
                                  parse: this.parseData( x )
                                }, x )
                              })
                              this.requestSent = false
                              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                          },
                          err => {
                              this.requestSent = false
                              this.dataService.errorHandler( err, { userType: 'Investor' } )
                          },
                          () => {
                              UtilitiesService.debug( "Got specific projects" )
                              this.dataService.updateShowBird( false )
                          }
                      )
            }, 600 );
        }
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

           this.investorMangService.searchProjects( this.millionsRange[ 0 ],
             this.millionsRange[ 1 ], this.interestRange[ 0 ],
               this.interestRange[ 1 ], 1, this.termRange,
                  this.page ).subscribe(
                     res => {
                        this.meta = res.json( ).meta
                         var projects: [ any ] = res.json( ).projects
                         for ( var i = 0; i < projects.length; i++ ) {
                             if ( projects[ i ].approved && projects[ i ].investor == null ) {
                                 this.projects.push( projects[ i ] )
                             }
                         }
                         this.projects = this.projects.map( x => {
                           return Object.assign({
                             parse: this.parseData( x )
                           }, x )
                         })
                         this.requestSent = false
                         this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                     },
                     err => {
                         this.requestSent = false
                         this.dataService.errorHandler( err, { userType: 'Investor' } )
                     },
                     () => {
                         UtilitiesService.debug( "Got specific projects" )
                         this.dataService.updateShowBird( false )
                     }
                 )
       }
   }

   ngOnDestroy( ) {
      // localStorage.setItem( 'already_reload', "0" )
   }

   parseData( project ) {
     return [
       {
         label: 'nombre',
         value: project.dream
       },
       {
         label: 'tasa',
         value: this.dp.transform( project.interest_rate, '1.0-1' ),
         sufix: '%'
       },
       {
         label: 'cuota',
         value: this.cuPipe.transform( project.monthly_payment ),
         prefix: '$'
       }
     ]
   }

}
