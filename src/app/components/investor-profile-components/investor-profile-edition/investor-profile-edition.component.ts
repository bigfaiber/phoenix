import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InvestorManagementService } from "../../../services/investor-management/investor-management.service";
import { ProfileChangeNotifierService } from '../../../services/profile-change-notifier/profile-change-notifier.service'
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from '../../../services/utilities-service/utilities.service';

@Component({
  selector: 'app-investor-profile-edition',
  templateUrl: './investor-profile-edition.component.html',
  styleUrls: ['./investor-profile-edition.component.scss'],
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
export class InvestorProfileEditionComponent implements OnInit {

  constructor( private router: Router, private investorMangService: InvestorManagementService,
                private profileChaNot: ProfileChangeNotifierService, private dataService: DataService ) {
                  this.user_data = dataService.user_data_value
                  dataService.user_data$.subscribe( val => {
                    this.user_data = val
                  })
                }

  @ViewChild( 'files_input' ) files_input: any;
  @ViewChild( 'profile_pic_input' ) profile_pic_input: any;

  @ViewChild( 'f1' ) name_input: any;
  @ViewChild( 'f3' ) address_input: any;
  @ViewChild( 'f2' ) phone_input: any;

  @ViewChild( 'profile_pic' ) profile_pic_tag: any;

  data_updated = false
  data_changed = false

  requestSent = false

  files: File;
  profilePic: File;

  form = new FormGroup({
      names: new FormControl( null, [ Validators.minLength( 3 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+" ) ] ),
      lastname: new FormControl( null, [ Validators.minLength( 3 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+" ) ] ),
      address: new FormControl( null, [ Validators.minLength( 5 ) ] )
  });

  accountForm = new FormGroup({
     account_number: new FormControl( null, [ Validators.required, Validators.pattern( "[0-9]+" ), Validators.minLength( 6 ), Validators.maxLength( 14 ) ] ),
     bank: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
     account_type: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
  });

  user_data;
  allAccounts = []

  uniqueness_errors = {
      phone: false
  }

  ngOnInit() {
      this.dataService.onInit( `Editar Perfil` )
      UtilitiesService.debug( this.user_data )

      if ( this.user_data.avatar.url == null )
          this.profile_pic_tag.nativeElement.src = "assets/images/client-profile/default_avatar.png"
      else
          this.profile_pic_tag.nativeElement.src = this.investorMangService.API_path + this.user_data.avatar.url

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
    this.investorMangService.getAccounts( ).subscribe(
      res => {
        this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), res.json( ).investor )
        this.allAccounts = res.json( ).inv_accounts.map( x => Object.assign({
          editing: false,
          form: this.formFactory( x.account_number, x.bank, x.account_type )
        }, x ))
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

  isFormValid( ) {
      return this.form.valid
  }

  onSubmit( ) {
      if ( this.isFormValid( ) && this.data_changed && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          UtilitiesService.debug( "Posting data..." )

          this.investorMangService.editProfile( this.user_data.id,
                                                this.name_input.nativeElement.value, this.address_input.nativeElement.value,
                                                this.phone_input.nativeElement.value ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), res.json( ).investor )
                  this.data_updated = true
                  this.data_changed = false
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Investor', validations: true } )
                  var errors = err.json( ).data.errors
                  if ( errors.phone != undefined )
                      this.uniqueness_errors.phone = true
              },
              () => {
                  UtilitiesService.debug( "Info updated" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  openFilesInput( ) {
      this.files_input.nativeElement.click( )
  }

  catchFiles( ) {
      if ( this.files_input.nativeElement.files[ 0 ] != undefined ) {
          this.files = this.files_input.nativeElement.files[ 0 ]
          this.data_updated = false
      }
  }

  openProfilePicInput( ) {
      this.profile_pic_input.nativeElement.click( )
  }

  catchProfilePicFile( ) {
      if ( this.profile_pic_input.nativeElement.files[ 0 ] != undefined ) {
          this.profilePic = this.profile_pic_input.nativeElement.files[ 0 ]
          this.data_updated = false
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.investorMangService.editAvatar( this.profilePic ).subscribe(
              res2 => {
                  this.profile_pic_tag.nativeElement.src = this.investorMangService.API_path + res2.json( ).investor.avatar.url
                  this.profileChaNot.updateUserData( res2.json( ).investor.avatar.url )
                  this.dataService.updateUserAndSessionData( res2.headers.get( 'token' ), res2.json( ).investor )
                  this.data_updated = true
                  this.data_changed = false
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Investor' } )
              },
              () => {
                  UtilitiesService.debug( "Profile pic posted" )
                  this.dataService.updateShowBird( false )
              }
          )
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

  fillDocs( ) {
      localStorage.setItem( 'investor_came_from', window.location.pathname )
      this.router.navigate( [ 'inversionista', 'subir-archivos' ] )
  }

  getBack( ) {
      this.router.navigate( [ 'inversionista', 'perfil' ] )
  }

  clearAccountCreation( ) {
    this.accountForm.get( 'account_number' ).setValue( null )
    this.accountForm.get( 'bank' ).setValue( "0" )
    this.accountForm.get( 'account_type' ).setValue( "0" )
  }

  postNewAccount( ) {
    if ( this.accountForm.valid ) {
      this.dataService.updateShowBird( true )
      this.investorMangService.postNewAccount( this.accountForm.value ).subscribe(
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
          this.dataService.errorHandler( err, { userType: 'Investor' } )
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
        this.investorMangService.updateAccount( this.allAccounts[ index ].form.value, this.allAccounts[ index ].id ).subscribe(
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
            this.dataService.errorHandler( err, { userType: 'Investor' } )
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
