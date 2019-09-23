import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-data',
  templateUrl: './project-data.component.html',
  styleUrls: ['./project-data.component.scss']
})
export class ProjectDataComponent implements OnInit {

  constructor() { }

  /*
    0 for customer (default)
    1 for investor
    2 both for customer & investor
  */
  @Input( )
  dataProjectType = 0

  @Input( )
  topButtons: [ { text: string, enable: boolean } ]

  @Input( )
  bottomButtons: [ { text: string, enable: boolean } ]

  @Input( )
  project: any

  @Output( )
  topButtonClicked = new EventEmitter( )

  @Output( )
  bottomButtonClicked = new EventEmitter( )

  @Output( )
  profileButtonClicked = new EventEmitter( )

  ngOnInit( ) {
  }

  onClick( index, type ) {
    if ( type == 'top' )
      this.topButtonClicked.emit( index )
    else
      this.bottomButtonClicked.emit( index )
  }

  leftPadding( ) {
    if ( this.dataProjectType > 0 )
      return {
        'padding-left': '20px'
      }
    return {}
  }

  formatBankNumb( n : String ) {
      var finalString = ""
      var index = 0
      var cnt = 0
      while ( index < n.length ) {
          if ( cnt == 3 ) {
              finalString += "-"
              cnt = 0
          }
          finalString += n.charAt( index )
          cnt++
          index++
      }
      return finalString
  }

  showProfileButton( ) {
    let arr: String[] = window.location.pathname.split( '/' )
    return arr[ arr.length - 2 ] == 'inversionista' && arr[ arr.length - 1 ] == 'inversion'
  }

  emitProfileClick( ) {
    this.profileButtonClicked.emit( )
  }

}
