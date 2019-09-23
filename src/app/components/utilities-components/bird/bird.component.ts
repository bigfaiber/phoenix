import { Component, OnInit } from '@angular/core';
import { style, state, animate, transition, trigger } from '@angular/core';
import { DataService } from "../../../services/data-service/data.service";

@Component({
  selector: 'app-bird',
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss'],
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
export class BirdComponent implements OnInit {

  requestSent = false
  timeout = false
  currentTimeout = undefined

  constructor( private dataService: DataService ) {
    dataService.showBird$.subscribe(
        val => {
            this.requestSent = val
            this.timeout = false
            if ( this.requestSent == true ) {
                this.currentTimeout = setTimeout( ( ) => {
                    this.timeout = true
                }, 6000 )
            }
            else {
                window.clearTimeout( this.currentTimeout )
            }
        }
    )
  }

  ngOnInit( ) {
  }

  reloadPage( ) {
      window.location.reload( )
  }

}
