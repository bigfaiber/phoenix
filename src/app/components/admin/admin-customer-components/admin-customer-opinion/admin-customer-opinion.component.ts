import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-admin-customer-opinion',
  templateUrl: './admin-customer-opinion.component.html',
  styleUrls: ['./admin-customer-opinion.component.scss'],
  animations: [
    trigger('editingToggler', [
      transition(':enter', [
        style({opacity:0,transform:'scale(0)',height:0}),
        animate('100ms 180ms', style({opacity:1,transform:'scale(1.1)',height:'*'})),
        animate(80, style({transform:'scale(1)'}))
      ]),
      transition(':leave', [
        animate(80, style({transform:'scale(1.1)',height:'*'})),
        animate(100, style({opacity:0,transform:'scale(0)',height:0}))
      ])
    ]),
    trigger('appearingAnim', [
      transition(':enter', [
        style({opacity:0,transform:'scale(0)',height:0,width:0}),
        animate('100ms 480ms', style({opacity:1,transform:'scale(1.2)',height:'*',width:'*'})),
        animate(80, style({transform:'scale(1)'}))
      ]),
      transition(':leave', [
        animate(80, style({transform:'scale(1.2)',height:'*',width:'*'})),
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
        style({opacity:0,transform:'scale(0)',height:0,width:0}),
        animate(100, style({opacity:1,transform:'scale(1.2)',height:'*',width:'*'})),
        animate(80, style({transform:'scale(1)'}))
      ]),
      transition(':leave', [
        animate(80, style({transform:'scale(1.2)',height:'*',width:'*'})),
        animate(100, style({opacity:0,transform:'scale(0)',height:0,width:0}))
      ])
    ]),
  ]
})
export class AdminCustomerOpinionComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  current_user;
  API_path;

  opinions = [];

  ngOnInit( ) {
      this.API_path = this.adminManService.API_path

      var data = localStorage.getItem( 'current_user' )
      if ( data == null ) {
          UtilitiesService.debug( "No customer found, redirecting..." )
          this.router.navigate( [ 'admin', 'match' ] )
          return
      } else
          this.current_user = JSON.parse( data )

      this.dataService.onInit( this.current_user.type == 'client' ? `Opiniones Cliente` : `Opiniones Inversionista` )

      this.dataService.updateShowBird( true )
      this.adminManService.getOpinions( this.current_user.user.id, this.current_user.type ).subscribe(
        res => {
          this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
          if ( this.current_user.type == 'client' )
            this.opinions = res.json( ).opinions
          else
            this.opinions = res.json( ).opinion_invs
          this.opinions.forEach( op => {
            op.editing = false
          })
        },
        err => {
          this.dataService.errorHandler( err, { userType: 'Admin' } )
        },
        () => {
          UtilitiesService.debug( "Opinions retrieved" )
          this.dataService.updateShowBird( false )
        }
      )
  }

  toggleEditing( index ) {
      if ( this.opinions[ index ].id != -1 )
          this.opinions[ index ].editing = !this.opinions[ index ].editing
      else
          this.opinions = this.opinions.slice( 0, index ).concat( this.opinions.slice( index + 1, this.opinions.length ) )
  }

  addForm( type ) {
      this.opinions.push({
        id: -1,
        opinion: undefined,
        editing: true,
        opinion_status: type
      })
  }

  saveOpinion( index ) {
      if ( this.opinions[ index ].opinion != "" && this.opinions[ index ].opinion != undefined ) {
          this.dataService.updateShowBird( true )
          if ( this.opinions[ index ].id == -1 ) {
              this.adminManService.createOpinion( this.opinions[ index ].opinion,
                  this.opinions[ index ].opinion_status, this.current_user.user.id, this.current_user.type ).subscribe(
                res => {
                    UtilitiesService.debug( res.json( ) )
                    this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                    if ( this.current_user.type == 'client' )
                      this.opinions[ index ] = res.json( ).opinion
                    else
                      this.opinions[ index ] = res.json( ).opinion_inv
                    this.opinions[ index ].editing = false
                },
                err => {
                    this.dataService.errorHandler( err, { userType: 'Admin' } )
                },
                () => {
                    UtilitiesService.debug( "Opinion created" )
                    this.dataService.updateShowBird( false )
                }
              )
          } else {
              this.adminManService.updateOpinion( this.opinions[ index ].opinion,
                  this.opinions[ index ].id, this.current_user.type ).subscribe(
                res => {
                    UtilitiesService.debug( res.json( ) )
                    this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                    this.opinions[ index ].editing = false
                },
                err => {
                    this.dataService.errorHandler( err, { userType: 'Admin' } )
                },
                () => {
                    UtilitiesService.debug( "Opinion updated" )
                    this.dataService.updateShowBird( false )
                }
              )
          }
      }
  }

  deleteOpinion( index ) {
      if ( this.opinions[ index ].id != -1 ) {
        this.dataService.updateShowBird( true )
        this.adminManService.deleteOpinion( this.opinions[ index ].id, this.current_user.type ).subscribe(
          res => {
            UtilitiesService.debug( res.json( ) )
            this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
            this.opinions = this.opinions.slice( 0, index ).concat( this.opinions.slice( index + 1, this.opinions.length ) )
          },
          err => {
            this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
            UtilitiesService.debug( "Opinion deleted" )
            this.dataService.updateShowBird( false )
          }
        )
      }
  }

  getBack( ) {
      window.history.back( )
  }

}
