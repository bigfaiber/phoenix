import { Component, OnInit, OnDestroy, HostListener, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { ProfileChangeNotifierService } from "../../../services/profile-change-notifier/profile-change-notifier.service";
import { Subscription } from 'rxjs/Subscription';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.scss'],
  animations: [
      trigger('fadeInOut', [
        transition(':enter', [
          style({opacity:0}),
          animate(150, style({opacity:1}))
        ]),
        transition(':leave', [
          animate(150, style({opacity:0}))
        ])
    ]),
    trigger('fadeInOutHiAdmin', [
      transition(':enter', [
        style({opacity:0}),
        animate(5, style({opacity:1}))
      ]),
      transition(':leave', [
        animate(5, style({opacity:0}))
      ])
    ]),
    trigger('slideIn', [
        state('*', style({ 'overflow-y': 'hidden' })),
        state('void', style({ 'overflow-y': 'hidden' })),
        transition('* => void', [
            style({ height: '*' }),
            animate(150, style({ height: 0}))
        ]),
        transition('void => *', [
            style({ height: '0' }),
            animate(150, style({ height: '*' }))
        ])
    ]),
    trigger('slideInFromSide', [
        transition('* => void', [
            style({ width: '*' }),
            animate(150, style({ width: 0}))
        ]),
        transition('void => *', [
            style({ width: '0' }),
            animate(150, style({ width: '*' }))
        ])
    ])
  ]
})
export class MenuAdminComponent implements OnInit, OnDestroy {

  constructor( private router: Router, private profileChangeNotifierService: ProfileChangeNotifierService ) { }

  @ViewChild( 'right_menu' ) right_menu: any;

  @HostListener( 'document:click', [ '$event' ] ) clickedOutside( $event ) {
    this.showMenu = false;
    this.right_menu.nativeElement.style.transform = 'translateX(100%)'
    this.right_menu.nativeElement.style.opacity = '0'
  }

  private subscription: Subscription = new Subscription( );

  showMenu = false;

  ngOnInit( ) {
    UtilitiesService.debug( window.location.pathname )
  }

  showSearchBar( ) {
      return window.location.pathname == '/admin/proyectos' || window.location.pathname == '/admin/historial'
  }

  signOut( ) {
      this.subscription.add(
          Observable.interval( 1000 ).subscribe( x => {
              localStorage.clear( )
              this.router.navigate( [ 'inicio' ] )
          })
      )
  }

  toggleMenu( $event: Event, flag? ) {
      $event.preventDefault( );
      $event.stopPropagation( );

      if ( flag != null )
        this.showMenu = flag
      else
        this.showMenu = !this.showMenu;

      if ( !this.showMenu ) {
        this.right_menu.nativeElement.style.transform = 'translateX(100%)'
        this.right_menu.nativeElement.style.opacity = '0'
      } else {
        this.right_menu.nativeElement.style.transform = 'translateX(0%)'
        this.right_menu.nativeElement.style.opacity = '1'
      }
  }

  openSignOutModal( omb ) {
      this.showMenu = false
      omb.click( )
  }

  updateSearchCode( value ) {
      this.profileChangeNotifierService.updateSearchCode( value )
  }

  ngOnDestroy( ) {
      this.subscription.unsubscribe( );
  }

}
