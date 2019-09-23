import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataService } from '../data-service/data.service';
import { UtilitiesService } from "../utilities-service/utilities.service";

@Injectable()
export class InvestorRegistrationService {

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

  postStepOneData( formData, additional_data ) {
      var user = {
          investor: {
              name: formData.names,
              lastname: formData.last_names,
              identification: formData.id,
              phone: formData.phone_code + formData.phone,
              address: formData.address,
              birthday: formData.date,
              email: formData.email,
              city: formData.city,
              password: formData.password,
              password_confirmation: formData.password_confirmation,
              money_invest: additional_data.investment,
              month: additional_data.time,
              monthly_payment: additional_data.payments,
              profitability: additional_data.efectiveness
          }
      }

      UtilitiesService.debug( user )

      const headers = new Headers( { 'Content-Type': 'application/json' } );
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + '/investors', JSON.stringify( user ), options )
          .map( ( res: Response ) => res );
  }

  signInUser( email, password ) {
    var user = {
        email: email,
        password: password,
        type: 'Investor'
    }

    const headers = new Headers( { 'Content-Type': 'application/json' } );
    const options = new RequestOptions( { headers: headers } );

    return this.http.post( this.API_path + '/login', JSON.stringify( user ), options )
        .map( ( res: Response ) => res );
  }

  resendCode( ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + '/investors/new-code', options )
          .map( ( res: Response ) => res );
  }

  verifyCode( code ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + '/investors/verification?code=' + code, options )
        .map( ( res: Response ) => res );
  }

  postStep3Data( labor, education, rent_tax, career, technical_career ) {

      var toBePosted: any = { investor: {} }

      toBePosted.investor.education = Number( education )
      toBePosted.investor.employment_status = Number( labor )
      toBePosted.investor.rent_tax = rent_tax
      toBePosted.investor.technical_career = toBePosted.investor.education == 5 ? technical_career : undefined
      toBePosted.investor.career = career ? Number( career ) : undefined

      UtilitiesService.debug( toBePosted )

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      var userData = JSON.parse( localStorage.getItem( 'user_data' ) ).user_data

      return this.http.put( this.API_path + '/investors/' + userData.id, JSON.stringify( toBePosted ), options )
              .map( ( res: Response ) => res );
  }

  postFacebookPhoto( url ) {
      var toBePosted: any = {
        avatar: url
      }

      UtilitiesService.debug( toBePosted )

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      var userData = JSON.parse( localStorage.getItem( 'user_data' ) ).user_data

      return this.http.post( this.API_path + '/investors/upload-facebook-avatar', JSON.stringify( toBePosted ), options )
              .map( ( res: Response ) => res )
  }

  acceptTerms( id ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      var toBePosted: any = { investor: {} }
      toBePosted.investor.terms_and_conditions = 1

      return this.http.put( this.API_path + '/investors/' + id, JSON.stringify( toBePosted ), options )
        .map( ( res: Response ) => res )
  }

  postStep5Data( cardType, formData, month, year ) {

      var toBePosted: any = { payment: {} }

      toBePosted.payment.name = formData.names
      toBePosted.payment.lastname = formData.last_names
      toBePosted.payment.card_number = formData.card
      toBePosted.payment.card_type =  cardType
      if ( cardType == 0 )
          toBePosted.payment.ccv = formData.sec_numb
      else
          toBePosted.payment.ccv = ""
      toBePosted.payment.month = month
      toBePosted.payment.year = year

      UtilitiesService.debug( toBePosted )

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + '/investors/create-payment', JSON.stringify( toBePosted ), options )
        .map( ( res: Response ) => res )

  }

  postFile( f1, type ) {

      let ccData: FormData = new FormData( );
      ccData.append( 'file', f1.file, f1.file.name );
      ccData.append( 'type', type );

      let headers = new Headers( );
      headers.append( 'enctype', 'multipart/form-data' );
      headers.append( 'Accept', 'application/json' );
      headers.append( 'Authorization', 'Bearer ' + this.auth_token );

      let options = new RequestOptions({ headers: headers });

      if ( f1.id != undefined )
          return this.http.put( this.API_path + '/documents/' + f1.id + '/replace-document', ccData, options )
                  .map( ( res: Response ) => res );

      return this.http.post( this.API_path + '/investors/upload-document', ccData, options )
              .map( ( res: Response ) => res );
  }

  sendFinalEmail( ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + '/investors/end-sign-up', options )
          .map( ( res: Response ) => res );
  }

  updateStep( id, step ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    var toBePosted: any = { investor: {} }
    toBePosted.investor.step = step

    return this.http.put( this.API_path + '/investors/' + id, JSON.stringify( toBePosted ), options )
        .map( ( res: Response ) => res );
  }

}
