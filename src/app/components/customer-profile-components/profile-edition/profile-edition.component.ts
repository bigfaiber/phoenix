import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerManagementService } from "../../../services/customerManagement/customer-management.service";
import { ProfileChangeNotifierService } from '../../../services/profile-change-notifier/profile-change-notifier.service'
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-profile-edition',
  templateUrl: './profile-edition.component.html',
  styleUrls: ['./profile-edition.component.scss'],
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
export class ProfileEditionComponent implements OnInit {

  constructor( private router: Router, private customerMangService: CustomerManagementService,
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

  user_data;

  uniqueness_errors = {
      phone: false
  }

  ngOnInit() {
      this.dataService.onInit( `Editar Perfil` )
      if ( this.user_data.avatar.url == null )
          this.profile_pic_tag.nativeElement.src = "assets/images/client-profile/default_avatar.png"
      else
          this.profile_pic_tag.nativeElement.src = this.customerMangService.API_path + this.user_data.avatar.url
  }

  isFormValid( ) {
      return this.form.valid
  }

  onSubmit( ) {
      if ( this.isFormValid( ) && this.data_changed && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          UtilitiesService.debug( "Posting data..." )

          this.customerMangService.editProfile( this.user_data.id,
                                                this.name_input.nativeElement.value, this.address_input.nativeElement.value,
                                                this.phone_input.nativeElement.value ).subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), res.json( ).client )
                  this.data_updated = true
                  this.data_changed = false
                  this.requestSent = false
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: 'Client', validations: true } )
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
          this.customerMangService.editAvatar( this.profilePic ).subscribe(
                  res2 => {
                      this.profile_pic_tag.nativeElement.src = this.customerMangService.API_path + res2.json( ).client.avatar.url
                      this.dataService.updateUserAndSessionData( res2.headers.get( 'token' ), res2.json( ).client )
                      this.profileChaNot.updateUserData( res2.json( ).client.avatar.url )
                      this.data_updated = true
                      this.data_changed = false
                      this.requestSent = false
                  },
                  err => {
                      this.requestSent = false
                      this.dataService.errorHandler( err, { userType: 'Client' } )
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
      localStorage.setItem( 'customer_came_from', window.location.pathname )
      this.router.navigate( [ 'cliente', 'subir-archivos' ] )
  }

  getBack( ) {
      this.router.navigate( [ 'cliente', 'perfil' ] )
  }

}
