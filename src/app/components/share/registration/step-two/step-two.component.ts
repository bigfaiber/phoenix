import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataService } from "../../../../services/data-service/data.service";
import { UtilitiesService } from '../../../../services/utilities-service/utilities.service';

@Component({
  selector: 'app-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
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
export class StepTwoComponent implements OnInit {

  constructor( private router: Router, private dataService: DataService ) { }

  @Input( ) invalidCode: boolean
  @ViewChild( 'openModalButton' ) successModalRef: any
  @ViewChild( 'newCode' ) newCodeModalRef: any

  @Output( ) formSubmitted = new EventEmitter( )
  @Output( ) modalOk = new EventEmitter( )
  @Output( ) newCode = new EventEmitter( )

  form = new FormGroup({
      numb: new FormControl( null, [ Validators.required, Validators.minLength( 8 ) ] ),
  });

  ngOnInit( ) {
  }

  isFormValid( ) {
      return this.form.valid
  }

  openSuccessModal( ) {
    this.successModalRef.nativeElement.click( )
  }

  openNewCodeModal( ) {
    this.newCodeModalRef.nativeElement.click( )
  }

  onSubmit( ) {
    this.formSubmitted.emit({
      form: this.form
    })
  }

  next( ) {
    this.modalOk.emit( )
  }

  resendCode( ) {
    this.newCode.emit( )
  }

}
