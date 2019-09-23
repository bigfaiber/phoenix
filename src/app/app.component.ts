import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data-service/data.service';
import { Router, NavigationEnd } from '@angular/router';
import { UtilitiesService } from './services/utilities-service/utilities.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor( private dataService: DataService, private router: Router, private uService: UtilitiesService ) {
    router.events.subscribe( event => {
      if ( event instanceof NavigationEnd ) {
        ( <any> window ).ga( 'set', 'page', event.urlAfterRedirects );
        ( <any> window ).ga( 'send', 'pageview' );
      }
    });
  }

  ngOnInit( ) {
    // sendEvent = () => {
    //   (<any>window).ga('send', 'event', {
    //     eventCategory: 'eventCategory',
    //     eventLabel: 'eventLabel',
    //     eventAction: 'eventAction',
    //     eventValue: 10
    //   });
    // }
  }
}
