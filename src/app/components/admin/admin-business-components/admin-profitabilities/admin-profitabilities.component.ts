import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from '../../../../services/utilities-service/utilities.service';
import { Chart } from 'angular-highcharts';
import { ProfitabilitiesChartComponent } from '../../../share/profitabilities-chart/profitabilities-chart.component';

@Component({
  selector: 'app-admin-profitabilities',
  templateUrl: './admin-profitabilities.component.html',
  styleUrls: ['./admin-profitabilities.component.scss'],
  animations: [
      trigger('editingToggler', [
        transition(':enter', [
          style({opacity:0,transform:'scale(0)',height:0,width:0}),
          animate('100ms 180ms', style({opacity:1,transform:'scale(1.1)',height:'*',width:'*'})),
          animate(80, style({transform:'scale(1)'}))
        ]),
        transition(':leave', [
          animate(80, style({transform:'scale(1.1)',height:'*',width:'*'})),
          animate(100, style({opacity:0,transform:'scale(0)',height:0,width:0}))
        ])
      ]),
      trigger('fadeInOut', [
        transition(':enter', [
          style({opacity:0}),
          animate(200, style({opacity:1}))
        ]),
        transition(':leave', [
          animate(200, style({opacity:0}))
        ])
    ]),
    trigger('appearingAnimNoDelay', [
      transition(':enter', [
        style({opacity:0,transform:'scale(0)',height:0}),
        animate(100, style({opacity:1,transform:'scale(1.2)',height:'*'})),
        animate(80, style({transform:'scale(1)'}))
      ]),
      transition(':leave', [
        animate(80, style({transform:'scale(1.2)',height:'*'})),
        animate(100, style({opacity:0,transform:'scale(0)',height:0}))
      ])
    ])
  ]
})
export class AdminProfitabilitiesComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  API_path;

  @ViewChild( 'profitabilitiesChart' ) profChartRef: ProfitabilitiesChartComponent

  requestSent = false
  allProfitabilities = []

  uniquenessError: Boolean = false

  profitabilityForm = new FormGroup({
     percentage: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+([.][0-9]+)?" ), Validators.min( 0 ), Validators.max( 100 ) ] ),
     name: new FormControl( null, [ Validators.required ] ),
  });

  ngOnInit( ) {
      this.dataService.onInit( `Rentabilidades` )
      this.API_path = this.adminManService.API_path

      this.retrieveProfitabilities( )
      this.profChartRef.retrieveProfitabilities( )
  }

  formFactory( n, p ) {
    return new FormGroup({
      percentage: new FormControl( p, [ Validators.required, Validators.pattern( "[0-9]+([.][0-9]+)?" ), Validators.min( 0 ), Validators.max( 100 ) ] ),
      name: new FormControl( n, [ Validators.required ] ),
    });
  }

  retrieveProfitabilities( ) {
    this.dataService.updateShowBird( true )
    this.adminManService.getProfitabilities( ).subscribe(
      res => {
        this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
        this.allProfitabilities = res.json( ).profitabilities.map( x => Object.assign({
          editing: false,
          form: this.formFactory( x.name, x.percentage )
        }, x ))
        UtilitiesService.debug( res.json( ) )
      },
      err => {
        this.dataService.errorHandler( err, { userType: 'Admin' } )
      },
      () => {
        this.dataService.updateShowBird( false )
        UtilitiesService.debug( "Accounts retrieved" )
      }
    )
  }

  updateChart( ) {
    this.profChartRef.retrieveProfitabilities( )
  }

  return_to( ) {
      window.history.back()
  }

  clearProfitabilityCreation( ) {
    this.profitabilityForm.get( 'percentage' ).setValue( null )
    this.profitabilityForm.get( 'name' ).setValue( null )
  }

  postNewProfitability( ) {
    if ( this.profitabilityForm.valid ) {
      this.dataService.updateShowBird( true )
      this.adminManService.postNewProfitability( this.profitabilityForm.value ).subscribe(
        res => {
          UtilitiesService.debug( res.json( ) )
          this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
          this.clearProfitabilityCreation( )
          let profitability = res.json( ).profitability
          this.allProfitabilities.push( Object.assign({
            editing: false,
            form: this.formFactory( profitability.name, profitability.percentage )
          }, profitability ))

          this.updateChart( )
        },
        err => {
          this.dataService.errorHandler( err, { userType: 'Admin', validations: true  } )
          if ( err.json( ).data ) {
            if ( err.json( ).data.errors ) {
              if ( err.json( ).data.errors.name ) {
                this.uniquenessError = true
              }
            }
          }
        },
        () => {
          this.dataService.updateShowBird( false )
        }
      )
    }
  }

  toggleEdition( index ) {
    if ( this.allProfitabilities[ index ].editing ) {
      if ( this.allProfitabilities[ index ].form.valid ) {
        this.dataService.updateShowBird( true )
        this.adminManService.updateProfitability( this.allProfitabilities[ index ].form.value, this.allProfitabilities[ index ].id ).subscribe(
          res => {
            UtilitiesService.debug( res.json( ) )
            let profitability = res.json( ).profitability
            this.allProfitabilities[ index ].name = profitability.name
            this.allProfitabilities[ index ].percentage = profitability.percentage
            this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
            this.allProfitabilities[ index ].editing = false

            this.updateChart( )
          },
          err => {
            this.dataService.errorHandler( err, { userType: 'Admin', validations: true } )
            if ( err.json( ).data ) {
              if ( err.json( ).data.errors ) {
                if ( err.json( ).data.errors.name ) {
                  this.allProfitabilities[ index ].uniquenessError = true
                }
              }
            }
          },
          () => {
            this.dataService.updateShowBird( false )
          }
        )
      }
    } else {
      this.allProfitabilities[ index ].editing = true
    }
  }

  deleteProfitability( index ) {
    this.dataService.updateShowBird( true )
    this.adminManService.deleteProfitability( this.allProfitabilities[ index ].id ).subscribe(
      res => {
        UtilitiesService.debug( res.json( ) )
        this.allProfitabilities = this.allProfitabilities.slice( 0, index ).concat(
          this.allProfitabilities.slice( index + 1, this.allProfitabilities.length )
        )

        this.updateChart( )
      },
      err => {
        this.dataService.errorHandler( err, { userType: 'Admin' } )
      },
      () => {
        this.dataService.updateShowBird( false )
      }
    )
  }

}
