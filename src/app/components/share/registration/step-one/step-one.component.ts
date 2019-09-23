import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from '../../../../services/utilities-service/utilities.service';

declare var FB: any

interface UErrors {
  email: boolean,
  id: boolean,
  phone: boolean,
}

@Component({
  selector: 'app-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
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
export class StepOneComponent implements OnInit {

  constructor( private router: Router, private dataService: DataService ) {
        FB.init({
          appId: '266987074067969',
          cookie: false,
          xfbml: true,
          version: 'v2.8'
        });
      }

  @ViewChild( 'myDatepicker' ) date_picker: any
  @ViewChild( 'openModalButton' ) modal_ref: any

  phone_codes = UtilitiesService.phone_codes

  private subscription: Subscription = new Subscription( );

  @Input( ) uniqueness_errors: UErrors
  @Input( ) phone_error: boolean

  @Output( ) formSubmitted = new EventEmitter( )
  @Output( ) modalOk = new EventEmitter( )

  fb_profilepic_url: string

  form = new FormGroup({
      email: new FormControl( null, [
        Validators.required,
        Validators.pattern( "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$" )
      ] ),
      names: new FormControl( null, [ Validators.required, Validators.minLength( 3 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+" ) ] ),
      last_names: new FormControl( null, [ Validators.required, Validators.minLength( 3 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+" ) ] ),
      id: new FormControl( null, [ Validators.required, Validators.minLength( 5 ), Validators.maxLength( 12 ), Validators.pattern( "[0-9]+" ) ] ),
      address: new FormControl( null, [ Validators.required, Validators.minLength( 5 ) ] ),
      city: new FormControl( null, [ Validators.required, Validators.minLength( 4 ), Validators.pattern( "[a-zA-ZñÑáéíóúÁÉÍÓÚ. ]+" ) ] ),
      phone: new FormControl( null, [ Validators.required, Validators.minLength( 10 ), Validators.maxLength( 15 ), Validators.pattern( "[0-9]+" ) ] ),
      phone_code: new FormControl( "+57", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
      date: new FormControl( null, [ Validators.required ] ),
      password: new FormControl( null, [ Validators.required, Validators.minLength( 8 ), Validators.pattern( "[a-zA-Z0-9]+" ) ] ),
      password_confirmation: new FormControl( null, [ Validators.required, Validators.minLength( 8 ), Validators.pattern( "[a-zA-Z0-9]+" ) ] ),
      terms: new FormControl( false, [ Validators.required, this.termsValidation ] )
    }, UtilitiesService.matchPasswordValidator );

  ngOnInit( ) {
  }

  termsValidation( control: FormControl ) {
    if ( control.value != true )
      return {
        wrongTerm: true
      }
    return null
  }

  fbLogin( ) {
    FB.login((response: any) => {
        if (response.status === 'connected') {
           this.me(response.authResponse.userID, response.authResponse.accessToken);
            // Logged into your app and Facebook.
        } else if (response.status === 'not_authorized') {
            // The person is logged into Facebook, but not your app.
        } else {

            // The person is not logged into Facebook, so we're not sure if
            // they are logged into this app or not.
        }

    }, {scope: 'user_friends,email,user_birthday,user_location'});
  }

  me( userId, accessToken ) {
    FB.api( "/" + userId + '?fields=id,first_name,last_name,email,gender,picture.width(300).height(300),birthday,location,address',
      res => {
        this.fb_profilepic_url = res.picture.data.url
        this.form.get( 'email' ).setValue( res.email )
        this.form.get( 'names' ).setValue( res.first_name )
        this.form.get( 'last_names' ).setValue( res.last_name )
        this.form.get( 'date' ).setValue( new Date( res.birthday ) )
        this.form.get( 'date' ).updateValueAndValidity( )
      }
    )
  }

  ngOnDestroy( ) {
      this.subscription.unsubscribe( );
  }

  isFormValid( ) {
      return this.form.valid
  }

  hasError( name ) {
      switch( name ) {
          case 'names':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Nombre inválido"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 3 caracteres"
              break
          case 'last_names':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Apellido inválido"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 3 caracteres"
              break
          case 'id':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.uniqueness_errors.id )
                  return "Ya fue tomado"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Sólo puede contener números"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 5 números"
              else if ( this.form.get( name ).hasError( 'maxlength' ) )
                  return "Máximo 12 números"
              break
          case 'phone':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.phone_error )
                  return "No pudimos enviar un código"
              else if ( this.uniqueness_errors.phone )
                  return "Ya fue tomado"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Sólo puede contener números"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 10 números"
              else if ( this.form.get( name ).hasError( 'maxlength' ) )
                  return "Máximo 15 números"
              break
          case 'address':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 5 números"
              break
          case 'date':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              break
          case 'email':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Email inválido"
              break
          case 'city':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Ciudad inválida"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 4 caracteres"
              break
          case 'password':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'pattern' ) )
                  return "Contraseña inválida"
              else if ( this.form.get( name ).hasError( 'minlength' ) )
                  return "Mínimo 8 caracteres"
              break
          case 'password_confirmation':
              if ( this.form.get( name ).hasError( 'required' ) && this.form.get( name ).touched )
                  return "Campo requerido"
              else if ( this.form.get( name ).hasError( 'passwordMatch' ) )
                  return "Las contraseñas no coinciden"
              break
      }
      return null
  }

  toggleDatePicker( ) {
    this.date_picker.opened = !this.date_picker.opened;
  }

  onSubmit( ) {
    this.formSubmitted.emit({
      form: this.form,
      fb: {
        fb_profilepic_url: this.fb_profilepic_url
      }
    })
  }

  openModal( ) {
    this.modal_ref.nativeElement.click( )
  }

  modalOkEvent( ) {
    this.modalOk.emit( )
  }

}
