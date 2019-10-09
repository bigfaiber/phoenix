import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ResponseContentType } from '@angular/http';
import { DataService } from '../data-service/data.service';
import { UtilitiesService } from "../utilities-service/utilities.service";

@Injectable()
export class AdminManagementService {

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

  getMatches( page ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + '/matches?page=' + page, options )
        .map( ( res: Response ) => res );
  }

  getGroupedMatches( page ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + '/matches/grouped?page=' + page, options )
        .map( ( res: Response ) => res );
  }

  getApprovedMatches( page ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + '/matches/current-projects?page=' + page, options )
        .map( ( res: Response ) => res );
  }

  getFinishedMatches( page ) {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );

    return this.http.get( this.API_path + '/projects/historical?page=' + page, options )
        .map( ( res: Response ) => res );
  }

  getCustomer( customer_id ) {
      return this.http.get( this.API_path + '/clients/' + customer_id, this.headers() )
          .map( ( res: Response ) => res );
  }

  headers(){
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth_token
    });
    const options = new RequestOptions( { headers: headers } );
      return options;
  }

  getInvestor( investor_id ) {
      return this.http.get( this.API_path + '/investors/' + investor_id )
          .map( ( res: Response ) => res );
  }

  getAllInvestors( ) {
      return this.http.get( this.API_path + '/investors' )
          .map( ( res: Response ) => res );
  }

  getNewCustomers( page ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + '/clients/new-clients?page=' + page, options )
          .map( ( res: Response ) => res );
  }

  getOldCustomers( page ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + '/clients/old-clients?page=' + page, options )
          .map( ( res: Response ) => res );
  }

  postNewScore( customer_id, score ) {
      var data = {
          client: {
              rating: score
          }
      }

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.put( this.API_path + '/clients/' + customer_id, data, options )
          .map( ( res: Response ) => res );
  }

  updateProject( project_id, data ) {

      var toBePosted: any = { project: {} }
      toBePosted.project.dream = data.dream
      toBePosted.project.description = data.description
      toBePosted.project.money = data.needings
      toBePosted.project.monthly_payment = data.payment
      toBePosted.project.warranty = data.warranty
      toBePosted.project.initial_payment = data.initial_payment
      toBePosted.project.approved_date = data.approved_date

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.put( this.API_path + '/projects/' + project_id, JSON.stringify( toBePosted ), options )
          .map( ( res: Response ) => res )
  }

  createCustomerProject( data ) {

      var toBePosted: any = { project: {} }
      toBePosted.project.dream = data.dream
      toBePosted.project.description = data.description
      toBePosted.project.money = data.needings
      toBePosted.project.monthly_payment = data.payment
      toBePosted.project.month = data.months
      toBePosted.project.warranty = data.warranty
      toBePosted.project.interest_rate = data.rate
      toBePosted.project.approved_date = data.approved_date

      toBePosted.project.client_id = data.c_id
      toBePosted.project.investor_id = data.inv_id

      toBePosted.bank = {
        bank: data.bank,
        account_type: data.account_type,
        account_number: data.account_number
      }

      UtilitiesService.debug( toBePosted )

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + '/projects/create-by-admin', JSON.stringify( toBePosted ), options )
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

  updateInterestRate( project_id, rate ) {
      var toBePosted: any = { project: {} }
      toBePosted.project.rate = rate

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + '/projects/' + project_id + '/change-interest', JSON.stringify( toBePosted ), options )
          .map( ( res: Response ) => res )
  }

  approveProject( project_id ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + '/projects/' + project_id + '/approve-project', {}, options )
          .map( ( res: Response ) => res )
  }

  getNewInvestors( page ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + '/investors/new-investors?page=' + page, options )
          .map( ( res: Response ) => res );
  }

  getOldInvestors( page ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + '/investors/old-investors?page=' + page, options )
          .map( ( res: Response ) => res );
  }

  getUnfit( page ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + '/clients/not-valid?client[type]=unfit' + '&page=' + page, options )
          .map( ( res: Response ) => res );
  }

  getOnEvalulation( page ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + '/clients/not-valid?client[type]=evaluation' + '&page=' + page, options )
          .map( ( res: Response ) => res );
  }

  getAmortizationTable( project_id ) {
      let headers = new Headers( );
      headers.append( 'Authorization', 'Bearer ' + this.auth_token );

      let options = new RequestOptions({ headers: headers });

      return this.http.get( this.API_path + '/projects/' + project_id + '/amortization-table', options )
          .map( ( res: Response ) => res )
  }

  getProjectById( id ) {
      return this.http.get( this.API_path + '/projects/' + id )
          .map( ( res: Response ) => res );
  }

  approveMatch( investor_id, project_id ) {
      let headers = new Headers( );
      headers.append( 'Authorization', 'Bearer ' + this.auth_token );

      let options = new RequestOptions({ headers: headers });

      return this.http.post( this.API_path + '/investors/' + investor_id + '/projects/' + project_id + '/match', {}, options )
          .map( ( res: Response ) => res )
  }

  updateCustomer( customer_id, formData, rent, real_state, arrear ) {
      let headers = new Headers( );
      headers.append( 'Authorization', 'Bearer ' + this.auth_token );
      headers.append( 'Content-Type', 'application/json' );

      let options = new RequestOptions({ headers: headers });

      var toBePosted: any = { client: {} }

      toBePosted.client.job_position = formData.job
      toBePosted.client.patrimony = formData.patrimony
      toBePosted.client.max_capacity = formData.max_capacity
      toBePosted.client.current_debt = formData.debt
      toBePosted.client.income = formData.income
      toBePosted.client.payment_capacity = formData.payment_cap

      let education = Number( formData.education_level )
      let career = Number( formData.career )

      var user = {
          client: {
              name: formData.names,
              lastname: formData.last_names,
              identification: formData.id,
              phone: "+57" + formData.phone,
              address: formData.address,
              birthday: formData.date,
              email: formData.email,
              city: formData.city,

              employment_status: Number( formData.labor_options ) - 1,
              people: Number( formData.family_options ) - 1,
              education: Number( formData.education_level ) - 1,
              marital_status: Number( formData.civil_status ) - 1,
              household_type: Number( formData.household_type ) - 1,
              career: career ? career - 1 : undefined,
              rent_tax: rent,
              real_estate: real_state,

              payments_in_arrears: arrear,
              payments_in_arrears_time: arrear ? formData.payments_in_arrears_time : undefined,
              payments_in_arrears_value: arrear ? formData.payments_in_arrears_value : undefined,

              technical_career: education == 5 ? formData.technical_career : undefined,

              market_expenses: formData.market_expenses,
              transport_expenses: formData.transport_expenses,
              public_service_expenses: formData.public_service_expenses,
              bank_obligations: formData.bank_obligations,
              rent_payment: formData.monthly_payment,
          }
      }

      // console.log( user )

      return [
          this.http.post( this.API_path + '/clients/' + customer_id + '/add-additional-data', JSON.stringify( toBePosted ), options )
              .map( ( res: Response ) => res ),
          this.http.put( this.API_path + '/clients/' + customer_id, JSON.stringify( user ), options )
            .map( ( res: Response ) => res )
      ]
  }


    updateInvestor( investor_id, data, formData ) {
        let headers = new Headers( );
        headers.append( 'Authorization', 'Bearer ' + this.auth_token );
        headers.append( 'Content-Type', 'application/json' );

        let options = new RequestOptions({ headers: headers });

        let education = Number( formData.education_level )
        let career = Number( formData.career )

        var user = {
            investor: {
                name: formData.names,
                lastname: formData.last_names,
                identification: formData.id,
                phone: "+57" + formData.phone,
                address: formData.address,
                birthday: formData.date,
                email: formData.email,
                city: formData.city,

                employment_status: Number( data.labor ),
                people: Number( data.family ),
                education: Number( data.education ),
                marital_status: Number( data.civil_status ),
                career: data.career ? Number( data.career ) : undefined,
                rent: data.rent,

                technical_career: education == 5 ? formData.technical_career : undefined,
            }
        }

        // console.log( user )

        return this.http.put( this.API_path + '/investors/' + investor_id, JSON.stringify( user ), options )
              .map( ( res: Response ) => res )
    }

    projectSeen( project_id ) {
        let headers = new Headers( );
        headers.append( 'Authorization', 'Bearer ' + this.auth_token );

        let options = new RequestOptions({ headers: headers });

        return this.http.post( this.API_path + '/projects/' + project_id + '/new-project', {}, options )
            .map( ( res: Response ) => res )
    }

    deleteCustomer( customer_id ) {
        let headers = new Headers( );
        headers.append( 'Authorization', 'Bearer ' + this.auth_token );

        let options = new RequestOptions({ headers: headers });

        return this.http.delete( this.API_path + '/clients/' + customer_id, options )
            .map( ( res: Response ) => res )
    }

    deleteInvestor( investor_id ) {
        let headers = new Headers( );
        headers.append( 'Authorization', 'Bearer ' + this.auth_token );

        let options = new RequestOptions({ headers: headers });

        return this.http.delete( this.API_path + '/investors/' + investor_id, options )
            .map( ( res: Response ) => res )
    }

    getDocumentBlob( url ) {
        var op = {
            responseType: ResponseContentType.Blob,
        }
        return this.http.get( this.API_path + url, op )
          .map( ( res: Response ) => res )
    }

    uploadAT( f1, project_id ) {
        let ccData: FormData = new FormData( );
        ccData.append( 'table', f1, f1.name );

        let headers = new Headers( );
        headers.append( 'enctype', 'multipart/form-data' );
        headers.append( 'Accept', 'application/json' );
        headers.append( 'Authorization', 'Bearer ' + this.auth_token );

        let options = new RequestOptions({ headers: headers });

        return this.http.post( this.API_path + '/projects/' + project_id + '/add-table', ccData, options )
                .map( ( res: Response ) => res );
    }

    uploadWarranty( f1, project_id ) {
        let ccData: FormData = new FormData( );
        ccData.append( 'file', f1, f1.name );

        let headers = new Headers( );
        headers.append( 'enctype', 'multipart/form-data' );
        headers.append( 'Accept', 'application/json' );
        headers.append( 'Authorization', 'Bearer ' + this.auth_token );

        let options = new RequestOptions({ headers: headers });

        return this.http.post( this.API_path + '/projects/' + project_id + '/add-warranty', ccData, options )
                .map( ( res: Response ) => res );
    }

    deleteProject( project_id ) {
        let headers = new Headers( );
        headers.append( 'Authorization', 'Bearer ' + this.auth_token );

        let options = new RequestOptions({ headers: headers });

        return this.http.delete( this.API_path + '/projects/' + project_id, options )
            .map( ( res: Response ) => res )
    }

    finishProject( project_id ) {
        let headers = new Headers( );
        headers.append( 'Authorization', 'Bearer ' + this.auth_token );

        let options = new RequestOptions({ headers: headers });

        return this.http.post( this.API_path + '/projects/' + project_id + '/finish', {}, options )
            .map( ( res: Response ) => res )
    }

    getProjectByCode( code ) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth_token
        });
        const options = new RequestOptions( { headers: headers } );

        return this.http.get( this.API_path + '/projects/by-code?code=' + code, options )
            .map( ( res: Response ) => res );
    }

    rateReceipt( receipt_id, days ) {

        var toBePosted = {
            receipt: {
                days: days
            }
        }

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth_token
        });
        const options = new RequestOptions( { headers: headers } );

        return this.http.post( this.API_path + '/receipts/' + receipt_id + '/grade', JSON.stringify( toBePosted ), options )
            .map( ( res: Response ) => res );
    }

    globalRate( client_id, grade ) {
        var toBePosted = {
            client: {
                global: grade
            }
        }

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth_token
        });
        const options = new RequestOptions( { headers: headers } );

        return this.http.post( this.API_path + '/clients/' + client_id + '/grade', JSON.stringify( toBePosted ), options )
            .map( ( res: Response ) => res );
    }

    getOpinions( id, userType ) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth_token
        });
        const options = new RequestOptions( { headers: headers } );

        if ( userType == 'client' )
          return this.http.get( this.API_path + `/clients/${id}/opinions`, options )
              .map( ( res: Response ) => res );
        else
          return this.http.get( this.API_path + `/investors/${id}/opinion_invs`, options )
              .map( ( res: Response ) => res );
    }

    createOpinion( opinion, type, id, userType ) {
        var toBePosted = {
            opinion: {
                opinion: opinion,
                opinion_status: type == 'pros' ? 0 : 1
            }
        }

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth_token
        });
        const options = new RequestOptions( { headers: headers } );

        if ( userType == 'client' )
          return this.http.post( this.API_path + '/clients/' + id + '/opinions', JSON.stringify( toBePosted ), options )
              .map( ( res: Response ) => res );
        else
          return this.http.post( this.API_path + '/investors/' + id + '/opinion_invs', JSON.stringify( toBePosted ), options )
              .map( ( res: Response ) => res );
    }

    updateOpinion( opinion, id, userType ) {
        var toBePosted = {
            opinion: {
                opinion: opinion
            }
        }

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth_token
        });
        const options = new RequestOptions( { headers: headers } );

        if ( userType == 'client' )
          return this.http.put( this.API_path + '/opinions/' + id, JSON.stringify( toBePosted ), options )
              .map( ( res: Response ) => res );
        else
          return this.http.put( this.API_path + '/opinion_invs/' + id, JSON.stringify( toBePosted ), options )
              .map( ( res: Response ) => res );
    }

    deleteOpinion( id, userType ) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth_token
        });
        const options = new RequestOptions( { headers: headers } );

        if ( userType == 'client' )
          return this.http.delete( this.API_path + '/opinions/' + id, options )
              .map( ( res: Response ) => res );
        else
          return this.http.delete( this.API_path + '/opinion_invs/' + id, options )
              .map( ( res: Response ) => res );
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

    postMonthBalance( id, form_data ) {
        var toBePosted = {
            project: {
                year: Number( form_data.year ),
                month: Number( form_data.month ),
                interest: Number( form_data.interest ),
                debt: Number( form_data.debt )
            }
        }

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.auth_token
        });
        const options = new RequestOptions( { headers: headers } );

        return this.http.post( this.API_path + '/projects/' + id + '/add-month-balance', JSON.stringify( toBePosted ), options )
            .map( ( res: Response ) => res );
    }

    getAccounts( inv_id ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + `/investors/${inv_id}/inv_accounts`, options )
          .map( ( res: Response ) => res )
    }

    postNewAccount( data, inv_id ) {
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

      return this.http.post( this.API_path + `/investors/${inv_id}/inv_accounts`, toBePosted, options )
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

    getProfitabilities( ) {
      // const headers = new Headers({
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer ' + this.auth_token
      // });
      // const options = new RequestOptions( { headers: headers } );

      return this.http.get( this.API_path + `/profitabilities` )
          .map( ( res: Response ) => res )
    }

    postNewProfitability( data ) {
      var toBePosted = {
        profitability: {
          name: data.name,
          percentage: data.percentage
        }
      }

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + `/profitabilities`, toBePosted, options )
          .map( ( res: Response ) => res )
    }

    updateProfitability( data, id ) {
      var toBePosted = {
        profitability: {
          name: data.name,
          percentage: data.percentage
        }
      }

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.put( this.API_path + `/profitabilities/${id}`, toBePosted, options )
          .map( ( res: Response ) => res )
    }

    deleteProfitability( id ) {
      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.delete( this.API_path + `/profitabilities/${id}`, options )
          .map( ( res: Response ) => res )
    }

    updateInvestorMaximum( id, maximum ) {
      var toBePosted = {
        investor: {
          maximun: String( maximum )
        }
      }
      // console.log( toBePosted )

      const headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.auth_token
      });
      const options = new RequestOptions( { headers: headers } );

      return this.http.post( this.API_path + `/investors/${id}/change-maximum`, toBePosted, options )
          .map( ( res: Response ) => res )
    }

}
