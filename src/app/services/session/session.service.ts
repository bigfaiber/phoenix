import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { DataService } from '../data-service/data.service';

@Injectable()
export class SessionService {

  constructor( private http: Http, private dataService: DataService ) {
    this.auth_token = dataService.auth_token_value
    this.API_path = dataService.API_path
    dataService.auth_token$.subscribe(
      res => {
        this.auth_token = res
      }
    )
  }

  API_path: String
  auth_token: String

  signIn( email, password, type ) {
      var user = {
          email: email,
          password: password,
          type: type
      }

      const headers = new Headers( { 'Content-Type': 'application/json' } );
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + '/login', JSON.stringify( user ), options )
          .map( ( res: Response ) => res );
  }

  isSessionActive( rol ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      if ( rol == 'Client' )
          return [ this.http.get( this.API_path + '/clients/by-token', options )
              .map( ( res: Response ) => res ), rol ]
      else if ( rol == 'Investor' )
          return [ this.http.get( this.API_path + '/investors/by-token', options )
              .map( ( res: Response ) => res ), rol ]
      else if ( rol == 'Admin' )
          return [ this.http.get( this.API_path + '/admins/by-token', options )
              .map( ( res: Response ) => res ), rol ]
  }

  requestPassword( rol, email ) {
      if ( rol == "Investor" )
          return this.http.get( this.API_path + '/investors/reset-password?email=' + email )
              .map( ( res: Response ) => res )
      else
          return this.http.get( this.API_path + '/clients/reset-password?email=' + email )
              .map( ( res: Response ) => res )
  }

  resetPassword( token, email, pass, passc, rol ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

      var data = {
          token: token,
          password: pass,
          password_confirmation: passc,
          email: email
      }

      let options = new RequestOptions({ headers: headers });

      return this.http.post( this.API_path + '/' + ( rol == "client" ? "clients" : "investors" ) + '/new-password', JSON.stringify( data ), options )
          .map( ( res: Response ) => res )
  }

}
