import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ResponseContentType } from '@angular/http';
import { DataService } from '../data-service/data.service';

@Injectable()
export class CustomerManagementService {

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

  getCustomerById( id ) {
      return this.http.get( this.API_path + '/clients/' + id )
          .map( ( res: Response ) => res )
  }

  editProfile( id, names, lastname, address ) {
      var user = {
          client: {
              name: names,
              lastname: lastname,
              address: address,
          }
      }

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.put( this.API_path + '/clients/' + id, JSON.stringify( user ), options )
          .map( ( res: Response ) => res )
  }

  editAvatar( profile_pic ) {

      let ccData: FormData = new FormData( );
      let headers2 = new Headers( );

      ccData.append( 'avatar', profile_pic, profile_pic.name );
      headers2.append( 'enctype', 'multipart/form-data' );
      headers2.append( 'Accept', 'application/json' );
      headers2.append( 'Authorization', 'Bearer ' + this.auth_token );

      let options2 = new RequestOptions({ headers: headers2 });

      return this.http.post( this.API_path + '/clients/upload-avatar', ccData, options2 )
          .map( ( res: Response ) => res )
  }

  createProject( data ) {

      var toBePosted: any = { project: {} }
      toBePosted.project.dream = data.dream
      toBePosted.project.description = data.description
      toBePosted.project.money = data.needings
      toBePosted.project.monthly_payment = data.payment
      toBePosted.project.month = data.months
      toBePosted.project.warranty = data.warranty

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + '/projects', JSON.stringify( toBePosted ), options )
          .map( ( res: Response ) => res )
  }

  updateProject( project_id, data ) {

      var toBePosted: any = { project: {} }
      toBePosted.project.warranty = data.warranty

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.put( this.API_path + '/projects/' + project_id, JSON.stringify( toBePosted ), options )
          .map( ( res: Response ) => res )
  }

  addAccount( project_id, data ) {

      var toBePosted: any = { bank: {} }
      toBePosted.bank.bank = data.bank
      toBePosted.bank.account_type = data.account_type
      toBePosted.bank.account_number = data.account_number

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + '/projects/' + project_id + '/add-account', JSON.stringify( toBePosted ), options )
          .map( ( res: Response ) => res )
  }

  getProjects( page ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + '/projects/by-clients?page=' + page, options )
        .map( ( res: Response ) => res )
  }

  getFinishedProjects( page ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + '/projects/historical?page=' + page, options )
        .map( ( res: Response ) => res );
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

      return this.http.post( this.API_path + '/clients/upload-document', ccData, options )
              .map( ( res: Response ) => res );
  }

  getDocumentBlob( url ) {
      var op = {
          responseType: ResponseContentType.Blob,
      }
      return this.http.get( this.API_path + url, op )
        .map( ( res: Response ) => res )
  }

  getAmortizationTable( project_id ) {
      let headers = new Headers( );
      headers.append( 'Authorization', 'Bearer ' + this.auth_token );

      let options = new RequestOptions({ headers: headers });

      return this.http.get( this.API_path + '/projects/' + project_id + '/amortization-table', options )
          .map( ( res: Response ) => res )
  }

  uploadReceipt( project_id, data, f1 ) {
    let ccData: FormData = new FormData( );
    ccData.append( 'receipt[month]', data.month );
    ccData.append( 'receipt[year]', data.year );
    ccData.append( 'receipt[day]', data.day );
    ccData.append( 'receipt[receipt]', f1, f1.name );

    let headers = new Headers( );
    headers.append( 'enctype', 'multipart/form-data' );
    headers.append( 'Accept', 'application/json' );
    headers.append( 'Authorization', 'Bearer ' + this.auth_token );

    let options = new RequestOptions({ headers: headers });

    return this.http.post( this.API_path + '/projects/' + project_id + '/add-receipt', ccData, options )
            .map( ( res: Response ) => res );
  }

  getReceipts( project_id ) {
    return this.http.get( this.API_path + '/projects/' + project_id )
        .map( ( res: Response ) => res )
  }

  downloadReceipt( receipt_url ) {
      var op = {
          responseType: ResponseContentType.Blob,
      }
      return this.http.get( this.API_path + receipt_url, op )
        .map( ( res: Response ) => res )
  }

  getProjectById( id ) {
      return this.http.get( this.API_path + '/projects/' + id )
          .map( ( res: Response ) => res );
  }

  getGraphValues( client_id ) {
    return this.http.get( this.API_path + '/clients/' + client_id + '/graph-values' )
        .map( ( res: Response ) => res )
  }

  getOpinionsByClient( id ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + `/clients/${id}/opinions`, options )
          .map( ( res: Response ) => res );
  }

}
