import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { AdminManagementService } from "../../../../services/admin-management/admin-management.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from '../../../../services/utilities-service/utilities.service';

@Component({
  selector: 'app-admin-investor-accounts',
  templateUrl: './admin-investor-accounts.component.html',
  styleUrls: ['./admin-investor-accounts.component.scss'],
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
export class AdminInvestorAccountsComponent implements OnInit {

  constructor( private router: Router, private adminManService: AdminManagementService,
      private dataService: DataService ) { }

  investor_data;
  API_path;

  investments = [];
  requestSent = false
  allAccounts = []

  accountForm = new FormGroup({
     account_number: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ), Validators.minLength( 6 ), Validators.maxLength( 14 ) ] ),
     bank: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
     account_type: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
  });

  ngOnInit( ) {
      this.dataService.onInit( `Cuentas Inversionista` )
      this.API_path = this.adminManService.API_path

      var data = localStorage.getItem( 'admin_investor_profile' )
      if ( data == null ) {
          UtilitiesService.debug( "No customer found, redirecting..." )
          this.router.navigate( [ 'admin', 'match' ] )
          return
      } else
          this.investor_data = JSON.parse( data )

      this.retrieveAccounts( )
  }

  formFactory( n, b, t ) {
    return new FormGroup({
       account_number: new FormControl( n, [ Validators.required, Validators.pattern( "[0-9]+" ), Validators.minLength( 6 ), Validators.maxLength( 14 ) ] ),
       bank: new FormControl( b, [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
       account_type: new FormControl( t == "Ahorros" ? "1" : "2", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
    });
  }

  retrieveAccounts( ) {
    this.dataService.updateShowBird( true )
    this.adminManService.getAccounts( this.investor_data.id ).subscribe(
      res => {
        this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
        this.allAccounts = res.json( ).inv_accounts.map( x => Object.assign({
          editing: false,
          form: this.formFactory( x.account_number, x.bank, x.account_type )
        }, x ))
        UtilitiesService.debug( this.allAccounts )
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

  return_to( ) {
      window.history.back()
  }

  clearAccountCreation( ) {
    this.accountForm.get( 'account_number' ).setValue( null )
    this.accountForm.get( 'bank' ).setValue( "0" )
    this.accountForm.get( 'account_type' ).setValue( "0" )
  }

  postNewAccount( ) {
    if ( this.accountForm.valid ) {
      this.dataService.updateShowBird( true )
      this.adminManService.postNewAccount( this.accountForm.value, this.investor_data.id ).subscribe(
        res => {
          UtilitiesService.debug( res.json( ) )
          this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
          this.clearAccountCreation( )
          let account = res.json( ).inv_account
          this.allAccounts.push( Object.assign({
            editing: false,
            form: this.formFactory( account.account_number, account.bank, account.account_type )
          }, account ))
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

  toggleEdition( index ) {
    if ( this.allAccounts[ index ].editing ) {
      if ( this.allAccounts[ index ].form.valid ) {
        this.dataService.updateShowBird( true )
        this.adminManService.updateAccount( this.allAccounts[ index ].form.value, this.allAccounts[ index ].id ).subscribe(
          res => {
            UtilitiesService.debug( res.json( ) )
            let account = res.json( ).inv_account
            this.allAccounts[ index ].account_number = account.account_number
            this.allAccounts[ index ].account_type = account.account_type
            this.allAccounts[ index ].bank = account.bank
            this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
            this.allAccounts[ index ].editing = false
          },
          err => {
            this.dataService.errorHandler( err, { userType: 'Admin' } )
          },
          () => {
            this.dataService.updateShowBird( false )
          }
        )
      }
    } else {
      this.allAccounts[ index ].editing = true
    }
  }

}
