import { Component, OnInit, Input } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-missing-account',
  templateUrl: './missing-account.component.html',
  styleUrls: ['./missing-account.component.scss'],
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
export class MissingAccountComponent implements OnInit {

  constructor( private router: Router ) { }

  @Input( )
  user_data: any

  highlight: Boolean = false

  ngOnInit( ) {
  }

  show( ) {
    return UtilitiesService.missingAccount( this.user_data ) > 0
  }

}
