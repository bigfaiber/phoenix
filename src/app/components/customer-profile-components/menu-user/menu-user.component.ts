import { Component, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CustomerManagementService } from "../../../services/customerManagement/customer-management.service";
import { ProfileChangeNotifierService } from '../../../services/profile-change-notifier/profile-change-notifier.service'
import { UtilitiesService } from '../../../services/utilities-service/utilities.service'

@Component({
  selector: 'app-menu-user',
  templateUrl: './menu-user.component.html',
  styleUrls: ['./menu-user.component.scss'],
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
    ])
  ]
})
export class MenuUserComponent implements OnInit {

  constructor( private router: Router, private customerMangService: CustomerManagementService,
                private profileChaNot: ProfileChangeNotifierService, public uService: UtilitiesService ) { }

  private subscription: Subscription = new Subscription( );

  showMenu = false;

  user_data;
  session_data;

  @ViewChild( 'profile_pic' ) profile_pic_tag: any;
  @ViewChild( 'profile_pic2' ) profile_pic2_tag: any;

  @HostListener( 'document:click', [ '$event' ] ) clickedOutside( $event ) {
      this.showMenu = false
  }

  ngOnInit() {
    this.user_data = JSON.parse( localStorage.getItem( 'user_data' ) ).user_data
    this.session_data = JSON.parse( localStorage.getItem( 'user_data' ) ).session_data

    this.profileChaNot.userObs$.subscribe(
        res => {
            this.profile_pic_tag.nativeElement.src = this.customerMangService.API_path + res
            this.profile_pic2_tag.nativeElement.src = this.customerMangService.API_path + res
        }
    )
    
    if ( this.user_data.avatar.url == null ) {
        this.profile_pic_tag.nativeElement.src = "assets/images/client-profile/default_avatar.png"
        this.profile_pic2_tag.nativeElement.src = "assets/images/client-profile/default_avatar.png"
    }
    else {
        this.profile_pic_tag.nativeElement.src = this.customerMangService.API_path + this.user_data.avatar.url
        this.profile_pic2_tag.nativeElement.src = this.customerMangService.API_path + this.user_data.avatar.url
    }
  }

  signOut( ) {
      this.subscription.add(
          Observable.interval( 1000 ).subscribe( x => {
              localStorage.clear( )
              this.router.navigate( [ 'inicio' ] )
          })
      )
  }

  toggleMenu( $event: Event ) {
      $event.preventDefault( );
      $event.stopPropagation( );
      this.showMenu = !this.showMenu;
  }

  openSignOutModal( omb ) {
      this.showMenu = false
      omb.click( )
  }

  ngOnDestroy( ) {
      this.subscription.unsubscribe( );
  }

}
