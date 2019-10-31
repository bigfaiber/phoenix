import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable()
export class DataService {

  // API_path = 'http://localhost:3000';
  API_path = 'https://api.phx.com.co';

  show_bird = new Subject<any>( );
  showBird$ = this.show_bird.asObservable( );

  private auth_token = new Subject<any>( );
  auth_token$ = this.auth_token.asObservable( );
  auth_token_value: String

  private user_data = new Subject<any>( );
  user_data$ = this.user_data.asObservable( );
  user_data_value: any

  consoleClearing: Boolean = false
  modalClearing: Boolean = true
  windowScrolling: Boolean = true

  month_data = {
    "1": 'Enero',
    "2": 'Febrero',
    "3": 'Marzo',
    "4": 'Abril',
    "5": 'Mayo',
    "6": 'Junio',
    "7": 'Julio',
    "8": 'Agosto',
    "9": 'Septiembre',
    "10": 'Octubre',
    "11": 'Noviembre',
    "12": 'Diciembre'
  }

  constructor( private router: Router, private titleService: Title ) {
    this.show_bird.next( false )
    var user_data: any = JSON.parse( localStorage.getItem( 'user_data' ) )
    if ( user_data != null && user_data.session_data != null && user_data.session_data.auth_token != null ) {
      this.updateUserAndSessionData( user_data.session_data.auth_token, user_data.user_data )
    }
    else {
      // console.log( "No auth_token found!" )
    }
    let psets = localStorage.getItem( 'progSettings' )
    if ( psets ) {
      psets = JSON.parse( psets )
      this.consoleClearing = ( <any> psets ).consoleClearing
      this.modalClearing = ( <any> psets ).modalClearing
      this.windowScrolling = ( <any> psets ).windowScrolling
    }
  }

  updateShowBird( data ) {
      this.show_bird.next( data )
  }

  updateUserAndSessionData( auth_token, user_data_param ) {
      if ( auth_token != null && auth_token != undefined ) {
          this.auth_token.next( auth_token )
          this.auth_token_value = auth_token
          localStorage.setItem( 'user_data', JSON.stringify({
            user_data: this.user_data_value,
            session_data: {
              auth_token: this.auth_token_value
            }
          }))
      }
      if ( user_data_param != null && user_data_param != undefined ) {
          this.user_data.next( user_data_param )
          this.user_data_value = user_data_param
          localStorage.setItem( 'user_data', JSON.stringify({
            user_data: this.user_data_value,
            session_data: {
              auth_token: this.auth_token_value
            }
          }))
      }
  }

  updateUserData( value ) {
      if ( value != null && value != undefined ) {
          this.user_data.next( value )
          localStorage.setItem( 'user_data', JSON.stringify( value ) )
      }
  }

  errorHandler( err, options ) {
      console.error( err )
      this.updateUserAndSessionData( err.headers.get( 'token' ), null )
      this.updateShowBird( false )
      switch ( err.status ) {
        case 401:
          this.logout( )
          if ( options.userType && options.userType == 'Admin' )
            this.router.navigate( [ 'admin-login' ] )
          else
            this.router.navigate( [ 'iniciar-sesion' ] )
          break
        case 500:
          console.error( "FATAL: 500" )
          break
        default:
          if ( !options.validations ) {

          }
          else
            this.updateShowBird( false )
      }
      // console.log( status )
      return null
  }

  dateParser( s: String ) {
    var data = s.slice( 1, s.length - 1 ).split( ',' ).map( x => x.trim( ) )
    return this.month_data[ data[ 1 ] ].slice( 0, 3 ) + '<br>' + data[ 0 ]
  }

  logout( ) {
      this.auth_token.next( 'invalid' )
      localStorage.clear( )
      this.router.navigate( [ 'login' ] )
  }

  setTitle( text ) {
    this.titleService.setTitle( 'Phoenix - ' + text )
  }

  switchConsoleClearing( value : Boolean ) {
    this.consoleClearing = value
    this.saveProgSettings( )
  }

  switchModalClearing( value : Boolean ) {
    this.modalClearing = value
    this.saveProgSettings( )
  }

  switchTopScroll( value : Boolean ) {
    this.windowScrolling = value
    this.saveProgSettings( )
  }

  saveProgSettings( ) {
    let debugging = false
    let psets = localStorage.getItem( 'progSettings' )
    if ( psets )
      debugging = JSON.parse( psets ).debugging
    localStorage.setItem( 'progSettings', JSON.stringify({
      consoleClearing: this.consoleClearing,
      modalClearing: this.modalClearing,
      windowScrolling: this.windowScrolling,
      debugging: debugging
    }))
  }

  onInit( title? ) {
    if ( this.modalClearing ) {
      /* Cleaning all shity bootstrap modal stuff */
      if ( document.body.classList.contains( 'modal-open' ) ) {
        document.body.classList.remove( 'modal-open' )
        document.body.style.paddingRight = '0px'
      }
      let elem = document.querySelector( ".modal-backdrop" )
      if ( elem ) {
        elem.remove( )
      }
    }

    if ( this.consoleClearing ) {
      console.clear( )
    }

    if ( this.windowScrolling ) {
      window.scrollTo( 0, 0 )
    }

    if ( title )
      this.setTitle( title )
  }

}
