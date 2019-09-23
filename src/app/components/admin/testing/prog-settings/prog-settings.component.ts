import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";
import { Router } from '@angular/router';
import { DataService } from "../../../../services/data-service/data.service";

@Component({
  selector: 'app-prog-settings',
  templateUrl: './prog-settings.component.html',
  styleUrls: ['./prog-settings.component.scss']
})
export class ProgSettingsComponent implements OnInit {

  constructor( private router: Router, private dataService: DataService ) { }

  checked: Boolean[] = [];
  display: Boolean = true;

  ngOnInit( ) {
    this.checked[ 0 ] = UtilitiesService.debugging
    this.checked[ 1 ] = this.dataService.consoleClearing
    this.checked[ 2 ] = this.dataService.modalClearing
    this.checked[ 3 ] = this.dataService.windowScrolling
  }

  changeValue( event, index ) {
    if ( !this.display ) {
      switch ( index ) {
        case 0:
          UtilitiesService.debugSwitch( event.checked )
          break
        case 1:
          this.dataService.switchConsoleClearing( event.checked )
          break
        case 2:
          this.dataService.switchModalClearing( event.checked )
          break
        case 3:
          this.dataService.switchTopScroll( event.checked )
          break
      }
    } else {
      this.leave( )
    }
  }

  clearLocalStorage( ) {
    if ( !this.display ) {
      localStorage.clear( )
    } else {
      this.leave( )
    }
  }

  leave( ) {
    this.router.navigate( [ 'admin', 'match' ] )
  }

  verifyCredentials( value, event ) {
    if ( event instanceof KeyboardEvent ) {
      if ( event.keyCode != 13 )
        return
    }
    if ( value == "deivid911" )
      this.display = false
  }

}
