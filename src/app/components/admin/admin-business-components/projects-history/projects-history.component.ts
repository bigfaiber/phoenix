import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-projects-history',
  templateUrl: './projects-history.component.html',
  styleUrls: ['./projects-history.component.scss'],
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
export class ProjectsHistoryComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  requestSent = false
  meta
  page = 1

  matches = []

  ngOnInit( ) {
      this.dataService.onInit( `Historial` )

      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.adminManService.getFinishedMatches( this.page ).subscribe(
          res => {
              // this.matches = res.json( ).projects
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              for ( var i = 0; i < res.json( ).projects.length; i++ ) {
                  this.matches.push({
                    project: res.json( ).projects[ i ],
                    investor: res.json( ).projects[ i ].investor,
                  })
              }
              this.matches = this.matches.map( x => {
                return Object.assign({
                  parse: this.parseData( x )
                }, x )
              })
              UtilitiesService.debug( this.matches )
              this.meta = res.json( ).meta
              this.requestSent = false
          },
          err => {
              this.requestSent = false
              this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
              UtilitiesService.debug( "Got matches" )
              this.dataService.updateShowBird( false )
          }
      )
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
          this.adminManService.getFinishedMatches( this.page ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  for ( var i = 0; i < res.json( ).projects.length; i++ ) {
                      this.matches.push({
                        project: res.json( ).projects[ i ],
                        investor: res.json( ).projects[ i ].investor,
                      })
                  }
                  this.matches = this.matches.map( x => {
                    return Object.assign({
                      parse: this.parseData( x )
                    }, x )
                  })
                  this.meta = res.json( ).meta
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Admin' } )
              },
              () => {
                  UtilitiesService.debug( "Got matches" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  openProject( index ) {
      localStorage.setItem( 'single_match', JSON.stringify( this.matches[ index ] ) )
      this.router.navigate( [ 'admin', 'proyecto' ] )
  }

  parseData( match ) {
    return [
      {
        label: 'negocio',
        value: match.project.code
      },
      {
        label: 'Proveedor',
        value: `${match.investor.name} ${match.investor.lastname}`
      },
      {
        label: 'Cliente',
        value: `${match.project.client.name} ${match.project.client.lastname}`
      }
    ]
  }

}
