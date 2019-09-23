import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { ProfileChangeNotifierService } from "../../../../services/profile-change-notifier/profile-change-notifier.service";
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-all-projects',
  templateUrl: './all-projects.component.html',
  styleUrls: ['./all-projects.component.scss'],
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
export class AllProjectsComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private profileChangeNotifierService: ProfileChangeNotifierService, private dataService: DataService ) { }

  requestSent = false
  meta
  page = 1

  matches = []

  searchCode: String = undefined

  ngOnInit( ) {
      this.dataService.onInit( `Proyectos` )

      this.requestSent = true
      this.dataService.updateShowBird( true )
      this.adminManService.getApprovedMatches( this.page ).subscribe(
          res => {
              this.matches = res.json( ).matches.map( x => {
                return Object.assign({
                  parse: this.parseData( x )
                }, x )
              })
              UtilitiesService.debug( this.matches )
              this.meta = res.json( ).meta
              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
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

      this.profileChangeNotifierService.searchCode$.subscribe(
          ans => {
              this.searchCode = ans
              UtilitiesService.debug( ans )
              this.searchProjectByCode( this.searchCode )
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
          this.adminManService.getApprovedMatches( this.page ).subscribe(
              res => {
                  this.matches.concat( res.json( ).matches.map( x => {
                    return Object.assign({
                      parse: this.parseData( x )
                    }, x )
                  }))
                  this.meta = res.json( ).meta
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
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

  _timeout: any = null;
  projectsWentToHell: Boolean = false
  searchProjectByCode( code ) {
      if ( code != "" && code != null && code != undefined ) {
          if( this._timeout != null ) {
              window.clearTimeout( this._timeout );
              this.requestSent = false
              this.dataService.updateShowBird( false )
          }

          this._timeout = window.setTimeout( () => {
              this._timeout = null;
              this.requestSent = true
              this.dataService.updateShowBird( true )
              this.adminManService.getProjectByCode( code ).subscribe(
                res => {
                    this.matches = []
                    var obj = res.json( )
                    obj.investor = res.json( ).project.investor
                    this.matches.push(
                      Object.assign({
                        parse: this.parseData( obj )
                      }, obj )
                    )
                    this.requestSent = false
                    this.projectsWentToHell = true
                    this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                },
                err => {
                    this.requestSent = false
                    this.dataService.errorHandler( err, { userType: 'Admin' } )
                },
                () => {
                    UtilitiesService.debug( "Search done" )
                    this.dataService.updateShowBird( false )
                }
              )
          }, 600 );
      } else {
          if ( this.projectsWentToHell ) {
              this.requestSent = true
              this.dataService.updateShowBird( true )
              this.page = 1
              this.adminManService.getApprovedMatches( this.page ).subscribe(
                  res => {
                      this.matches = res.json( ).matches.map( x => {
                        return Object.assign({
                          parse: this.parseData( x )
                        }, x )
                      })
                      this.meta = res.json( ).meta
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                      this.requestSent = false
                      this.projectsWentToHell = false
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
