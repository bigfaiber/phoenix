import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { trigger, state, style, animate, transition, stagger, query, keyframes } from '@angular/animations';
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";
import { DataService } from "../../../services/data-service/data.service";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss'],
  animations: [
    trigger('stepState', [
      transition(':enter', [
        style({opacity:0,transform:'translateX(-100%)',height:0}),
        animate(200, style({opacity:1,transform:'translateX(0)',height:'*'}))
      ])
    ]),
    trigger('appearingAnimNoDelay', [
      transition(':enter', [
        style({opacity:0,transform:'scale(0)',height:0,width:0}),
        animate(300, style({opacity:1,transform:'scale(1.2)',height:'*',width:'*'})),
        animate(280, style({transform:'scale(1)'}))
      ]),
      transition(':leave', [
        animate(280, style({transform:'scale(1.2)',height:'*',width:'*'})),
        animate(300, style({opacity:0,transform:'scale(0)',height:0,width:0}))
      ])
    ])
  ]
})
export class AboutUsComponent implements OnInit {

  constructor( private dataService: DataService ) { }

  @HostListener("window:scroll", [])
  onWindowScroll( ) {
    if ( UtilitiesService.elementInViewport( this.steps_container.nativeElement, .2 ) ) {
      this.showSteps( 0 )
    }
    if ( UtilitiesService.elementInViewport( this.stats_container.nativeElement.childNodes[ 1 ].childNodes[ 3 ], .3 ) ) {
      this.animFlags[ 0 ] = true
    }
    if ( UtilitiesService.elementInViewport( this.stats_container.nativeElement.childNodes[ 1 ].childNodes[ 7 ], .3 ) ) {
      this.animFlags[ 1 ] = true
    }
    if ( UtilitiesService.elementInViewport( this.stats_container.nativeElement.childNodes[ 3 ].childNodes[ 1 ], .3 ) ) {
      this.animFlags[ 2 ] = true
    }
    if ( UtilitiesService.elementInViewport( this.stats_container.nativeElement.childNodes[ 3 ].childNodes[ 3 ], .3 ) ) {
      this.animFlags[ 3 ] = true
    }
  }

  @ViewChild( 'top_video' ) top_video: any;
  @ViewChild( 'steps_container' ) steps_container: any;
  @ViewChild( 'stats_container' ) stats_container: any;

  animFlags = [
    false,
    false,
    false,
    false
  ]

  left_stats = [
    {
      name: 'Administradores',
      amount: 27
    },
    {
      name: 'Ingenieros',
      amount: 15
    },
    {
      name: 'Salud',
      amount: 11
    },
    {
      name: 'Economía',
      amount: 8
    },
    {
      name: 'Cuidado Animal',
      amount: 8
    },
    {
      name: 'Contabilidad',
      amount: 4
    },
    {
      name: 'Mercadeo',
      amount: 4
    },
    {
      name: 'Derecho',
      amount: 4
    },
    {
      name: 'Arquitectura',
      amount: 4
    },
    {
      name: 'Diseño',
      amount: 4
    },
    {
      name: 'Otro',
      amount: 11
    },
  ]

  left_stats2 = [
    {
      name: 'Administradores',
      amount: 50
    },
    {
      name: 'Ingenieros',
      amount: 25
    },
    {
      name: 'Salud',
      amount: 25
    },
  ]

  clients_age = [
    {
      legend: '18-22',
      left: 0,
      right: 0
    },
    {
      legend: '23-28',
      left: 0,
      right: 2
    },
    {
      legend: '29-32',
      left: 3,
      right: 6
    },
    {
      legend: '33-38',
      left: 4,
      right: 2
    },
    {
      legend: '39-42',
      left: 2,
      right: 0
    },
    {
      legend: '43-48',
      left: 1,
      right: 1
    },
    {
      legend: '49-52',
      left: 2,
      right: 1
    },
    {
      legend: '53-58',
      left: 0,
      right: 0
    },
    {
      legend: '59-62',
      left: 1,
      right: 0
    },
    {
      legend: '63-68',
      left: 0,
      right: 1
    },
  ]

  investors_age = [
    {
      legend: '18-22',
      left: 0,
      right: 0
    },
    {
      legend: '23-28',
      left: 0,
      right: 0
    },
    {
      legend: '29-32',
      left: 0,
      right: 2
    },
    {
      legend: '33-38',
      left: 0,
      right: 1
    },
    {
      legend: '39-42',
      left: 0,
      right: 0
    },
    {
      legend: '43-48',
      left: 1,
      right: 0
    },
    {
      legend: '49-52',
      left: 0,
      right: 0
    },
    {
      legend: '53-58',
      left: 0,
      right: 0
    },
    {
      legend: '59-62',
      left: 0,
      right: 0
    },
    {
      legend: '63-68',
      left: 0,
      right: 0
    },
  ]

  stepsShowing = {
    step1: false,
    step2: false,
    step3: false
  }

  ngOnInit() {
      this.dataService.onInit( `Quiénes Somos` )
      if ( UtilitiesService.elementInViewport( this.steps_container.nativeElement, .2 ) ) {
        this.showSteps( 0 )
      }
  }

  showSteps( i ) {
    if ( i == 0 ) {
      setTimeout( () => {
        switch ( i ) {
          case 0:
            this.stepsShowing.step1 = true
            break
          case 1:
            this.stepsShowing.step2 = true
            break
          case 2:
            this.stepsShowing.step3 = true
            break
        }
        if ( i < 2 )
          this.showSteps( i + 1 )
      }, 200 )
    } else {
      setTimeout( () => {
        switch ( i ) {
          case 0:
            this.stepsShowing.step1 = true
            break
          case 1:
            this.stepsShowing.step2 = true
            break
          case 2:
            this.stepsShowing.step3 = true
            break
        }
        if ( i < 2 )
          this.showSteps( i + 1 )
      }, 700 )
    }
  }

  stopVideo( ) {
      this.top_video.nativeElement.src = ''
  }

  resetTopVideo( ovb ) {
      ( <any> window ).ga( 'send', 'event', {
        eventCategory: 'videos',
        eventAction: 'home about us video click',
      });
      this.top_video.nativeElement.src = "https://www.youtube.com/embed/U88gcVPHUNY?showinfo=0&rel=0&autoplay=1"
      ovb.click( )
  }

}
