import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { InvestorRegistrationService } from '../../../services/investor-registration/investor-registration.service';
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from '../../../services/utilities-service/utilities.service';

@Component({
  selector: 'app-investor-registration-step3',
  templateUrl: './investor-registration-step3.component.html',
  styleUrls: ['./investor-registration-step3.component.scss'],
  animations: [
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
export class InvestorRegistrationStep3Component implements OnInit {

  constructor( private router: Router, private investorRegService: InvestorRegistrationService,
      private dataService: DataService ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  requestSent = false

  @ViewChild( 'f1' ) f1: any;
  @ViewChild( 'f2' ) f2: any;

  @ViewChild( 'rent_yes' ) rent_yes: any;
  @ViewChild( 'rent_no' ) rent_no: any;

  form: FormGroup

  registration_data_parsed;
  user_data;

  ngOnInit() {
      this.dataService.onInit( `Registro Inversionista: Paso 3` )
      var registration_data = localStorage.getItem( 'investor_registration_process' )

      /* Force step (for testing) */
      // localStorage.setItem( 'investor_registration_process', JSON.stringify({
      //     current_step: 1
      // }))

      /* First time in registration */
      if ( registration_data == null ) {
          localStorage.setItem( 'investor_registration_process', JSON.stringify({
              current_step: 1
          }))
          this.router.navigate( [ 'formulario-inversionista','paso-1' ] )
      } /* A registration process already started */
      else {
          this.registration_data_parsed = JSON.parse( registration_data )
          switch ( this.registration_data_parsed.current_step ) {
              case 1:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-inversionista','paso-1' ] )
                  break;
              case 2:
                  UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  this.router.navigate( [ 'formulario-inversionista','paso-2' ] )
                  break;
              // case 6:
              //     UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
              //     this.router.navigate( [ 'formulario-inversionista','paso-6' ] )
              //     break;
          }
      }

      this.form = new FormGroup({
          labor: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
          education_level: new FormControl( "0", [ Validators.required, UtilitiesService.emptySelectTagValidator ] ),
          career: new FormControl( "0", [ ] ),
          technical_career: new FormControl( this.user_data.technical_career, [ ] ),
      });

      switch ( this.user_data.employment_status ) {
          case "Desempleado":
              this.form.get( 'labor' ).setValue( "1" )
              break
          case "Empleado":
              this.form.get( 'labor' ).setValue( "2" )
              break
          case "Independiente":
              this.form.get( 'labor' ).setValue( "3" )
              break
          case "Contratista":
              this.form.get( 'labor' ).setValue( "4" )
              break
      }

      switch ( this.user_data.education ) {
          case "Primaria":
              this.form.get( 'education_level' ).setValue( "1" )
              break
          case "Bachiller":
              this.form.get( 'education_level' ).setValue( "2" )
              break
          case "Profesional":
              this.form.get( 'education_level' ).setValue( "3" )
              this.setCareerValidation( "3" )
              break
          case "Maestria":
              this.form.get( 'education_level' ).setValue( "4" )
              this.setCareerValidation( "3" )
              break
          case "Tecnico/Tecnologo":
              this.form.get( 'education_level' ).setValue( "5" )
              this.setCareerValidation( "5" )
      }

      switch ( this.user_data.career ) {
          case "Administrador":
              this.form.get( 'career' ).setValue( "1" )
              break
          case "Ingeniero":
              this.form.get( 'career' ).setValue( "2" )
              break
          case "Medicina":
              this.form.get( 'career' ).setValue( "3" )
              break
          case "Economia":
              this.form.get( 'career' ).setValue( "4" )
              break
          case "Veterinaria":
              this.form.get( 'career' ).setValue( "5" )
              break
          case "Contrabilidad":
              this.form.get( 'career' ).setValue( "6" )
              break
          case "Mercadeo":
              this.form.get( 'career' ).setValue( "7" )
              break
          case "Derecho":
              this.form.get( 'career' ).setValue( "8" )
              break
          case "Arquitectura":
              this.form.get( 'career' ).setValue( "9" )
              break
          case "Diseño":
              this.form.get( 'career' ).setValue( "10" )
              break
          case "Otra":
              this.form.get( 'career' ).setValue( "11" )
              break
      }

      if ( this.user_data.rent_tax )
          this.rent_yes.nativeElement.click( )
      else
          this.rent_no.nativeElement.click( )
  }

  isFormValid( ) {
      if ( !this.f1.nativeElement.checked && !this.f2.nativeElement.checked )
          return false
      return this.form.valid && !this.requestSent
  }

  onSubmit( ) {
      if ( this.isFormValid( ) ) {
          UtilitiesService.debug( "Posting data..." )
          this.requestSent = true
          this.dataService.updateShowBird( true )
          this.investorRegService.postStep3Data(
              Number( this.form.get( 'labor' ).value ) - 1,
              Number( this.form.get( 'education_level' ).value ) - 1,
              this.f1.nativeElement.checked ? 1 : 0,
              this.showCareerSelection( ) ? ( Number( this.form.get( 'career' ).value ) - 1 ) : undefined,
              this.form.get( 'technical_career' ).value ).subscribe(
                  res => {
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), res.json( ).investor )
                      this.investorRegService.updateStep( this.user_data.id, 6 ).subscribe(
                          ttt => {
                              localStorage.setItem( 'investor_registration_process', JSON.stringify({
                                  current_step: 6
                              }))
                              this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                              this.router.navigate( [ 'formulario-inversionista','paso-4' ] )
                              this.requestSent = false
                          },
                          err => {
                              this.dataService.errorHandler( err, { userType: 'Investor' } )
                              this.requestSent = false
                          },
                          () => {
                              UtilitiesService.debug( "step updated" )
                              this.dataService.updateShowBird( false )
                          }
                      )
                  },
                  err => {
                      this.dataService.errorHandler( err, { userType: 'Investor' } )
                      this.requestSent = false
                  },
                  () => {
                      UtilitiesService.debug( "Data posted" )
                  }
              )
      }
  }

  showCareerSelection( ) {
    return this.form.get( 'education_level' ).value == "3" || this.form.get( 'education_level' ).value == "4"
  }

  setCareerValidation( value ) {
    this.form.get( 'career' ).clearValidators( )
    this.form.get( 'technical_career' ).clearValidators( )
    switch ( value ) {
      case "3":
      case "4":
        this.form.get( 'career' ).setValidators( [ Validators.required, UtilitiesService.emptySelectTagValidator ] )
        break
      case "5":
        this.form.get( 'technical_career' ).setValidators( [ Validators.required ] )
    }
    this.form.get( 'career' ).updateValueAndValidity( )
    this.form.get( 'technical_career' ).updateValueAndValidity( )
  }

  showTecType( ) {
    return this.form.get( 'education_level' ).value == "5"
  }

}
