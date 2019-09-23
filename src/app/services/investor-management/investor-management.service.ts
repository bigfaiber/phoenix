import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ResponseContentType } from '@angular/http';
import { DataService } from '../data-service/data.service';

@Injectable()
export class InvestorManagementService {

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

  getInvestorById( id ) {
      return this.http.get( this.API_path + '/investors/' + id )
          .map( ( res: Response ) => res )
  }

  getProjects( page ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + '/projects/by-investors?page=' + page, options )
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

  editProfile( id, names, lastname, address ) {
      var user = {
          investor: {
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

      return this.http.put( this.API_path + '/investors/' + id, JSON.stringify( user ), options )
          .map( ( res: Response ) => res )
  }

  editAvatar( profile_pic ) {
      let headers2 = new Headers( );

      let ccData: FormData = new FormData( );
      if ( profile_pic != undefined ) {
          ccData.append( 'avatar', profile_pic, profile_pic.name );
          headers2.append( 'enctype', 'multipart/form-data' );
          headers2.append( 'Accept', 'application/json' );
          headers2.append( 'Authorization', 'Bearer ' + this.auth_token );
      }

      let options2 = new RequestOptions({ headers: headers2 });

      return this.http.post( this.API_path + '/investors/upload-avatar', ccData, options2 )
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

  deleteFile( file_id ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.delete( this.API_path + '/documents/' + file_id, options )
          .map( ( res: Response ) => res )
  }

  getDocumentBlob( url ) {
      var op = {
          responseType: ResponseContentType.Blob,
      }
      return this.http.get( this.API_path + url, op )
        .map( ( res: Response ) => res )
  }

  getAllProjects( page ) {
    return this.http.get( this.API_path + '/projects?page=' + page )
      .map( ( res: Response ) => res )
  }

  searchProjects( moneyLower, moneyUpper, interestLower, interestUpper, termLower, termUpper, page ) {
      var path = this.API_path + '/projects?'
      path = path + 'price_start=' + Number( moneyLower ) * 1000000 + '&'
      path = path + 'price_end=' + Number( moneyUpper ) * 1000000 + '&'
      path = path + 'interest_start=' + interestLower + '&'
      path = path + 'interest_end=' + interestUpper + '&'
      path = path + 'time_start=' + termLower + '&'
      path = path + 'time_end=' + termUpper + '&'
      path = path + 'page=' + page

      return this.http.get( path )
        .map( ( res: Response ) => res )
  }

  likeProject( project_id ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + '/projects/' + project_id +'/like', null, options )
          .map( ( res: Response ) => res )
  }

  getAmortizationTable( project_id ) {
      let headers = new Headers( );
      headers.append( 'Authorization', 'Bearer ' + this.auth_token );

      let options = new RequestOptions({ headers: headers });

      return this.http.get( this.API_path + '/projects/' + project_id + '/amortization-table', options )
          .map( ( res: Response ) => res )
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

  getGraphs( id ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + `/investors/${id}/graphs`, options )
        .map( ( res: Response ) => res );
  }

  getAccounts( ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + '/inv_accounts', options )
        .map( ( res: Response ) => res )
  }

  postNewAccount( data ) {
    var toBePosted = {
      bank: {
        account_type: Number( data.account_type ) - 1,
        account_number: data.account_number,
        bank: data.bank
      }
    }

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.post( this.API_path + '/inv_accounts', toBePosted, options )
        .map( ( res: Response ) => res )
  }

  updateAccount( data, id ) {
    var toBePosted = {
      bank: {
        account_type: Number( data.account_type ) - 1,
        account_number: data.account_number,
        bank: data.bank
      }
    }

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.put( this.API_path + `/inv_accounts/${id}`, toBePosted, options )
        .map( ( res: Response ) => res )
  }

  linkAccount( new_flag, project_id, account_id, data ) {
    var toBePosted = {
      new_account: new_flag,
      bank: new_flag ? {
        account_type: Number( data.account_type ) - 1,
        account_number: data.account_number,
        bank: data.bank
      } : undefined,
      project: !new_flag ? { account: account_id } : undefined
    }

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.post( this.API_path + `/projects/${project_id}/add-inv-account`, toBePosted, options )
        .map( ( res: Response ) => res )
  }

  getProfitabilities( ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + `/profitabilities`, options )
        .map( ( res: Response ) => res )
  }

}
