import { Component, OnInit, Input } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/core';
import { Router } from '@angular/router';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-missing-docs',
  templateUrl: './missing-docs.component.html',
  styleUrls: ['./missing-docs.component.scss'],
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
export class MissingDocsComponent implements OnInit {

  constructor( private router: Router ) { }

  @Input( )
  user_data: any

  @Input( )
  type: any

  highlight: Boolean = false

  ngOnInit( ) {
  }

  show( ) {
    return UtilitiesService.allDocumentsComplete( this.user_data )
  }

  redirect( ) {
    if ( this.type == 'investor' ) {
      localStorage.setItem( 'investor_came_from', window.location.pathname )
      this.router.navigate( [ 'inversionista', 'subir-archivos' ] )
    } else {
      localStorage.setItem( 'customer_came_from', window.location.pathname )
      this.router.navigate( [ 'cliente', 'subir-archivos' ] )
    }
  }

  blink( ) {
    if ( window.innerWidth > 575 )
      window.scrollTo( 0, 0 )
    else
      window.scrollTo( 0, 500 )
    this.highlight = true
    setTimeout( () => {
      this.highlight = false
    }, 120 )
  }

}
