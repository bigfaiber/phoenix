import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InvestorManagementService } from "../../../services/investor-management/investor-management.service";
import { DataService } from "../../../services/data-service/data.service";
import * as FileSaver from 'file-saver';
import { UtilitiesService } from '../../../services/utilities-service/utilities.service';

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  styleUrls: ['./investment.component.scss'],
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
export class InvestmentComponent implements OnInit {

  constructor( private router: Router, private investorMangService: InvestorManagementService,
      private dataService: DataService ) { }

  project: any;
  showAccountSelector: Boolean = false
  showNewAccountForm: Boolean = false
  showAvailableAccounts: Boolean = false

  allAccounts = []

  accountForm = new FormGroup({
     account_number: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ), Validators.minLength( 6 ), Validators.maxLength( 14 ) ] ),
     bank: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
     account_type: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
  });

  buttonsData = []
  bottomButtons = [
    {
      text: 'Volver',
      enable: true
    }
  ]

  ngOnInit( ) {
      this.dataService.onInit( `Proyecto` )
      var temp = localStorage.getItem( 'investor_investment' )
      if ( temp == null ){
          UtilitiesService.debug( "Project not found, redirecting..." )
          this.router.navigate( [ 'inversionista', 'mis-inversiones' ] )
          return
      } else {
          this.project = JSON.parse( temp )
          UtilitiesService.debug( this.project )
      }

      this.buttonsData = [
        {
          text: 'Archivos',
          enable: this.project.initial_payment != null
        },
        {
          text: 'Comprobantes de pago',
          enable: this.project.initial_payment != null
        }
      ]

      this.retrieveAccounts( )
  }

  retrieveAccounts( ) {
    this.dataService.updateShowBird( true )
    this.investorMangService.getAccounts( ).subscribe(
      res => {
        this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), res.json( ).investor )
        this.allAccounts = res.json( ).inv_accounts
        UtilitiesService.debug( this.allAccounts )
      },
      err => {
        this.dataService.errorHandler( err, { userType: 'Investor' } )
      },
      () => {
        this.dataService.updateShowBird( false )
        UtilitiesService.debug( "Accounts retrieved" )
      }
    )
  }

  openReceiptsView( ) {
      if ( this.project.initial_payment != null ) {
          localStorage.setItem( 'investor_receipts_project', JSON.stringify( this.project ) )
          this.router.navigate( [ 'inversionista', 'historial-pagos' ] )
      }
  }

  openATView( ) {
      if ( this.project.initial_payment != null ) {
          this.router.navigate( [ 'inversionista', 'archivo-inversion' ] )
      }
  }

  formatBankNumb( n : String ) {
      var finalString = ""
      var index = 0
      var cnt = 0
      while ( index < n.length ) {
          if ( cnt == 3 ) {
              finalString += "-"
              cnt = 0
          }
          finalString += n.charAt( index )
          cnt++
          index++
      }
      return finalString
  }

  showCustomerProfile( ) {
      localStorage.setItem( 'customer_profile', JSON.stringify( Object.assign( { project_account: this.project.account }, this.project.client ) ) )
      this.router.navigate( [ 'inversionista', 'perfil-cliente' ] )
  }

  getBack( ) {
      this.router.navigate( [ 'inversionista', 'mis-inversiones' ] )
  }

  addAccount( new_flag, account_id ) {
    this.dataService.updateShowBird( true )
    this.investorMangService.linkAccount( new_flag, this.project.id, account_id, this.accountForm.value ).subscribe(
      res => {
        UtilitiesService.debug( res )
        this.project = res.json( ).project
        this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), res.json( ).investor )
        this.showNewAccountForm = false
        this.showAvailableAccounts = false
      },
      err => {
        this.dataService.errorHandler( err, { userType: 'Investor' } )
      },
      () => {
        UtilitiesService.debug( "Account linked" )
        this.dataService.updateShowBird( false )
      }
    )
  }

  buttonClickHandler( event ) {
    switch ( event ) {
      case 0:
        this.openATView( )
        break
      case 1:
        this.openReceiptsView( )
        break
    }
  }

  bottomButtonClickHandler( event ) {
    switch ( event ) {
      case 0:
        this.getBack( )
        break
    }
  }

}
