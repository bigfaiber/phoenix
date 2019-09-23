import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SessionService } from '../../../services/session/session.service';
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-request-new-password',
  templateUrl: './request-new-password.component.html',
  styleUrls: ['./request-new-password.component.scss'],
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
export class RequestNewPasswordComponent implements OnInit {

  constructor( private router: Router, private sessionService: SessionService,
      private dataService: DataService ) { }

  @ViewChild( 'rol' ) rol: any;

  success = false;
  requestSent = false

  form = new FormGroup({
      email: new FormControl( null, [
        Validators.required,
        Validators.pattern( "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$" )
      ] )
  })

  ngOnInit() {
      this.dataService.onInit( `Solicitud nueva Contraseña` )
  }

  isFormValid( ) {
      return this.form.valid
  }

  onSubmit( ) {
      if ( this.isFormValid( ) && !this.success && !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.sessionService.requestPassword( this.rol.nativeElement.value == "Client" ? "Client" : "Investor", this.form.value.email ).subscribe(
              res => {
                  this.success = true
                  this.dataService.updateShowBird( false )
                  this.requestSent = false
              },
              err => {
                  UtilitiesService.debug( err )
                  this.dataService.updateShowBird( false )
                  this.requestSent = false
              },
              () => {
                  UtilitiesService.debug( "Email sent" )
              }
          )
      }
  }

}
