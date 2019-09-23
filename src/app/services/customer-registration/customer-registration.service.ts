import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { DataService } from '../data-service/data.service';
import { UtilitiesService } from "../utilities-service/utilities.service";

@Injectable()
export class CustomerRegistrationService {

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

  output( ) {
      UtilitiesService.debug( "I am the service" )
  }

  postStepOneData( formData ) {
      var user = {
          client: {
              name: formData.names,
              lastname: formData.last_names,
              identification: formData.id,
              phone: formData.phone_code + formData.phone,
              address: formData.address,
              birthday: formData.date,
              email: formData.email,
              city: formData.city,
              password: formData.password,
              password_confirmation: formData.password_confirmation
          }
      }

      const headers = new Headers( { 'Content-Type': 'application/json' } );
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + '/clients', JSON.stringify( user ), options )
          .map( ( res: Response ) => res );
  }

  signInUser( email, password ) {
    var user = {
        email: email,
        password: password,
        type: 'Client'
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

      return this.http.get( this.API_path + '/clients/new-code', options )
          .map( ( res: Response ) => res );
  }

  verifyCode( code ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + '/clients/verification?code=' + code, options )
        .map( ( res: Response ) => res );
  }

  postStep3Data( propertyArray, vehicleArray, form_data, rent ) {

      var goods: any = { goods: [] }
      for ( var i = 0; i < propertyArray.length; i++ ) {
          goods.goods.push({
              price: String( propertyArray[ i ].value ),
              type: "Estates"
          })
      }
      for ( var i = 0; i < vehicleArray.length; i++ ) {
          goods.goods.push({
              price: String( vehicleArray[ i ].value ),
              plate: String( vehicleArray[ i ].plate ),
              type: "Vehicles"
          })
      }
      UtilitiesService.debug( JSON.stringify( goods ) )

      var toBePosted: any = { client: {} }

      toBePosted.client.rent_tax = rent
      toBePosted.client.rent_payment = form_data.monthly_payment
      toBePosted.client.people = Number( form_data.family_options ) - 1

      let education = Number( form_data.education_level )
      toBePosted.client.education = education - 1
      toBePosted.client.marital_status = Number( form_data.civil_status ) - 1
      toBePosted.client.employment_status = Number( form_data.labor ) - 1
      toBePosted.client.household_type = Number( form_data.household_type ) - 1

      let career = Number( form_data.career )
      toBePosted.client.career = education == 3 || education == 4 ? career - 1 : undefined
      toBePosted.client.technical_career = education == 5 ? form_data.technical_career : undefined

      toBePosted.client.market_expenses = form_data.market_expenses
      toBePosted.client.transport_expenses = form_data.transport_expenses
      toBePosted.client.public_service_expenses = form_data.public_service_expenses
      toBePosted.client.bank_obligations = form_data.bank_obligations

      UtilitiesService.debug( toBePosted )

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      var userData = JSON.parse( localStorage.getItem( 'user_data' ) ).user_data

      return [
          this.http.put( this.API_path + '/clients/' + userData.id, JSON.stringify( toBePosted ), options )
            .map( ( res: Response ) => res ),
          goods.goods.length > 0 ?
            this.http.post( this.API_path + '/clients/create-goods', JSON.stringify( goods ), options )
              .map( ( res: Response ) => res ) : null
      ];
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

      return this.http.post( this.API_path + '/clients/upload-facebook-avatar', JSON.stringify( toBePosted ), options )
              .map( ( res: Response ) => res )
  }

  acceptTerms( id ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      var toBePosted: any = { client: {} }
      toBePosted.client.terms_and_conditions = 1

      return this.http.put( this.API_path + '/clients/' + id, JSON.stringify( toBePosted ), options )
        .map( ( res: Response ) => res )
  }

  postFile( f1, type ) {

      let ccData: FormData = new FormData( );
      ccData.append( 'file', f1, f1.name );
      ccData.append( 'type', type );

      let headers = new Headers( );
      headers.append( 'enctype', 'multipart/form-data' );
      headers.append( 'Accept', 'application/json' );
      headers.append( 'Authorization', 'Bearer ' + this.auth_token );

      let options = new RequestOptions({ headers: headers });

      return this.http.post( this.API_path + '/clients/upload-document', ccData, options )
              .map( ( res: Response ) => res );
  }

  sendFinalEmail( ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + '/clients/end-sign-up', options )
          .map( ( res: Response ) => res );
  }

  updateStep( id, step ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    var toBePosted: any = { client: {} }
    toBePosted.client.step = step

    return this.http.put( this.API_path + '/clients/' + id, JSON.stringify( toBePosted ), options )
        .map( ( res: Response ) => res );
  }

}
