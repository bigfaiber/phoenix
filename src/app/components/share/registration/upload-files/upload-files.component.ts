import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { style, state, animate, transition, trigger } from '@angular/core';
import { CustomerManagementService } from "../../../../services/customerManagement/customer-management.service";
import { DataService } from "../../../../services/data-service/data.service";
import * as FileSaver from 'file-saver';
import { UtilitiesService } from "../../../../services/utilities-service/utilities.service";
import { InvestorManagementService } from '../../../../services/investor-management/investor-management.service';
import { CustomerRegistrationService } from '../../../../services/customer-registration/customer-registration.service';
import { InvestorRegistrationService } from '../../../../services/investor-registration/investor-registration.service';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss'],
  animations: [
      trigger('fadeInOut', [
        transition(':enter', [
          style({opacity:0,height:0}),
          animate(100, style({opacity:1,height:'*'}))
        ]),
        transition(':leave', [
          animate(100, style({opacity:0,height:0}))
        ])
    ])
  ]
})
export class UploadFilesComponent implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription( );

  constructor( private router: Router, private customerMangService: CustomerManagementService,
      private investorMangService: InvestorManagementService, private dataService: DataService,
        private customerRegService: CustomerRegistrationService, private investorRegService: InvestorRegistrationService, ) {
        this.user_data = dataService.user_data_value
        dataService.user_data$.subscribe( val => {
          this.user_data = val
        })
      }

  requestSent1 = false
  requestSent2 = false
  requestSent3 = false
  requestSent4 = false

  @ViewChild( 'id_file_input' ) id_file_input: any;
  @ViewChild( 'incomes_file_input' ) incomes_file_input: any;
  @ViewChild( 'bank_statements_file_input' ) bank_statements_file_input: any;
  @ViewChild( 'incomes_certification_file_input' ) incomes_certification_file_input: any;

  @ViewChild( 'pdf_viewer' ) pdf_viewer: any;

  safeFlag1 = true
  safeFlag2 = true
  safeFlag3 = true
  safeFlag4 = true

  user_data;

  allBankStatements = []
  allIds = []
  allIncomesCertifications = []
  allIncomes = []

  @Input( ) rolType: string
  @Input( ) isRegistration: boolean

  registration_data_parsed;

  ngOnInit() {
      if ( this.isRegistration ) {
        if ( this.rolType == 'customer' ) {
          this.dataService.onInit( `Registro Cliente: Paso 4` )
          var registration_data = localStorage.getItem( 'customer_registration_process' )

          /* Force step (for testing) */
          // localStorage.setItem( 'customer_registration_process', JSON.stringify({
          //     current_step: 1
          // }))

          /* First time in registration */
          if ( registration_data == null ) {
              localStorage.setItem( 'customer_registration_process', JSON.stringify({
                  current_step: 1
              }))
              this.router.navigate( [ 'formulario-cliente','paso-1' ] )
          } /* A registration process already started */
          else {
              this.registration_data_parsed = JSON.parse( registration_data )
              switch ( this.registration_data_parsed.current_step ) {
                  case 1:
                      UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                      this.router.navigate( [ 'formulario-cliente','paso-1' ] )
                      break;
                  case 2:
                      UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                      this.router.navigate( [ 'formulario-cliente','paso-2' ] )
                      break;
                  // case 3:
                  //     UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                  //     this.router.navigate( [ 'formulario-cliente','paso-3' ] )
                  //     break;
              }

              UtilitiesService.debug( this.user_data )
              /* TODO: Verify if token is alive */
          }
        }
        else {
          this.dataService.onInit( `Registro Inversionista: Paso 4` )
          var registration_data = localStorage.getItem( 'investor_registration_process' )

          /* Force step (for testing) */
          // localStorage.setItem( 'investor_registration_process', JSON.stringify({
          //     current_step: 1
          // }))

          /* First time in registration */
          if ( registration_data == null ) {
              localStorage.setItem( 'investor_registration_process', JSON.stringify({
                  current_step: 1
              }))
              this.router.navigate( [ 'formulario-inversionista','paso-1' ] )
          } /* A registration process already started */
          else {
              this.registration_data_parsed = JSON.parse( registration_data )
              switch ( this.registration_data_parsed.current_step ) {
                  case 1:
                      UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                      this.router.navigate( [ 'formulario-inversionista','paso-1' ] )
                      break;
                  case 2:
                      UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                      this.router.navigate( [ 'formulario-inversionista','paso-2' ] )
                      break;
                  case 3:
                      UtilitiesService.debug( `A registration process already started, redirecting to step ${this.registration_data_parsed.current_step}...` )
                      this.router.navigate( [ 'formulario-inversionista','paso-3' ] )
                      break;
              }
          }
        }
      } else {
        this.dataService.onInit( `Subir Archivos` )
      }

      this.updateFilesArrays( )
      UtilitiesService.debug( this.user_data )
      // console.log( this.user_data )
  }

  ngOnDestroy( ) {
      this.subscription.unsubscribe( );
  }

  updateFilesArrays( ) {
      this.allBankStatements = []
      for ( var i = 0 ; i < this.user_data.documents.length; i++ ) {
          if ( this.user_data.documents[ i ].document_type == "extractos" )
              this.allBankStatements.push( this.user_data.documents[ i ] )
      }
      this.allIncomesCertifications = []
      for ( var i = 0 ; i < this.user_data.documents.length; i++ ) {
          if ( this.user_data.documents[ i ].document_type == "ingresos" )
              this.allIncomesCertifications.push( this.user_data.documents[ i ] )
      }
      this.allIncomes = []
      for ( var i = 0 ; i < this.user_data.documents.length; i++ ) {
          if ( this.user_data.documents[ i ].document_type == "renta" )
              this.allIncomes.push( this.user_data.documents[ i ] )
      }
      this.allIds = []
      for ( var i = 0 ; i < this.user_data.documents.length; i++ ) {
          if ( this.user_data.documents[ i ].document_type == "cc" )
              this.allIds.push( this.user_data.documents[ i ] )
      }
  }

  isFormValid( ) {
      if ( !this.requestSent1 && !this.requestSent2  && !this.requestSent3  && !this.requestSent4 )
              return true
      return false
  }

  onSubmit( ) {
      if ( this.isFormValid( ) ) {
          UtilitiesService.debug( "Post data!!" )
      }
  }

  id_current_index = -1
  openIdFileInput( index, file ) {
    if ( !file.document ) {
      this.id_current_index = index
      this.id_file_input.nativeElement.click( )
    }
  }

  catchIdFile( ) {
      if ( this.id_file_input.nativeElement.files[ 0 ] != undefined ) {
          this.allIds[ this.id_current_index ].file = this.id_file_input.nativeElement.files[ 0 ]
          this.allIds[ this.id_current_index ].already_uploaded = false
          UtilitiesService.debug( this.allIds )
          this.safeFlag1 = false
      }
  }

  incomes_current_index = -1
  openIncomesFileInput( index, file ) {
    if ( !file.document ) {
      this.incomes_current_index = index
      this.incomes_file_input.nativeElement.click( )
    }
  }

  catchIncomesFile( ) {
      if ( this.incomes_file_input.nativeElement.files[ 0 ] != undefined ) {
          this.allIncomes[ this.incomes_current_index ].file = this.incomes_file_input.nativeElement.files[ 0 ]
          this.allIncomes[ this.incomes_current_index ].already_uploaded = false
          this.safeFlag2 = false
      }
  }

  bank_statements_current_index = -1
  openBankStatementsFileInput( index, file ) {
    if ( !file.document ) {
      this.bank_statements_current_index = index
      this.bank_statements_file_input.nativeElement.click( )
    }
  }

  catchBankStatementsFile( ) {
      if ( this.bank_statements_file_input.nativeElement.files[ 0 ] != undefined ) {
          this.allBankStatements[ this.bank_statements_current_index ].file = this.bank_statements_file_input.nativeElement.files[ 0 ]
          this.allBankStatements[ this.bank_statements_current_index ].already_uploaded = false
          UtilitiesService.debug( this.allBankStatements )
          this.safeFlag3 = false
      }
  }

  incomes_certification_current_index = -1
  openIncomesCertificationFileInput( index, file ) {
    if ( !file.document ) {
      this.incomes_certification_current_index = index
      this.incomes_certification_file_input.nativeElement.click( )
    }
  }

  catchIncomesCertificationFile( ) {
      if ( this.incomes_certification_file_input.nativeElement.files[ 0 ] != undefined ) {
          this.allIncomesCertifications[ this.incomes_certification_current_index ].file = this.incomes_certification_file_input.nativeElement.files[ 0 ]
          this.allIncomesCertifications[ this.incomes_certification_current_index ].already_uploaded = false
          this.safeFlag4 = false
      }
  }

  openModal1( om1 ) {
      if ( this.isFormValid( ) && ( !this.safeFlag1 || !this.safeFlag2 || !this.safeFlag3 || !this.safeFlag4 ) ) {
          this.requestSent1 = true
          this.dataService.updateShowBird( true )
          this.sendAllIds( 0, om1 )
      }
  }

  sendAllIds( index, om1 ) {
      if ( this.allIds.length > 0 && this.allIds[ index ].file != undefined && !this.allIds[ index ].already_uploaded ) {
          let postFile$ = this.rolType == 'customer' ?
            this.customerMangService.postFile( this.allIds[ index ], 'cc' ) :
              this.investorMangService.postFile( this.allIds[ index ], 'cc' )
          postFile$.subscribe(
              res4 => {
                  this.dataService.updateUserAndSessionData( res4.headers.get( 'token' ), null )

                  this.allIds[ index ].already_uploaded = true

                  let getById$ = this.rolType == 'customer' ?
                    this.customerMangService.getCustomerById( this.user_data.id ) :
                      this.investorMangService.getInvestorById( this.user_data.id )
                  getById$.subscribe(
                      res => {
                          var user_data: any = JSON.parse( localStorage.getItem( 'user_data' ) )
                          user_data.user_data = this.rolType == 'customer' ? res.json( ).client : res.json( ).investor
                          localStorage.setItem( 'user_data', JSON.stringify( user_data ) )
                          this.user_data = this.rolType == 'customer' ? res.json( ).client : res.json( ).investor

                          if ( index < this.allIds.length - 1 ) {
                              this.sendAllIds( index + 1, om1 )
                          } else {
                              this.safeFlag1 = true
                              this.requestSent1 = false
                              this.dataService.updateShowBird( false )
                              this.requestSent2 = true
                              this.dataService.updateShowBird( true )
                              this.sendAllIncomes( 0, om1 )
                          }
                      },
                      err => {
                          this.dataService.errorHandler( err, { userType: this.rolType == 'customer' ? 'Client' :'Investor' } )
                      },
                      () => {
                          UtilitiesService.debug( "Local user updated" )
                      }
                  )
              },
              err => {
                  this.dataService.errorHandler( err, { userType: this.rolType == 'customer' ? 'Client' :'Investor' } )
                  this.requestSent1 = false
              },
              () => {
                  UtilitiesService.debug( `Statements file at index ${index} posted` )
              }
          )
      } else {
          if ( index < this.allIds.length - 1 ) {
              this.sendAllIds( index + 1, om1 )
          } else {
              this.safeFlag1 = true
              this.requestSent1 = false
              this.dataService.updateShowBird( false )
              this.requestSent2 = true
              this.dataService.updateShowBird( true )
              this.sendAllIncomes( 0, om1 )
          }
      }
  }

  sendAllIncomes( index, om1 ) {
      if ( this.allIncomes.length > 0 && this.allIncomes[ index ].file != undefined && !this.allIncomes[ index ].already_uploaded ) {
          let postFile$ = this.rolType == 'customer' ?
            this.customerMangService.postFile( this.allIncomes[ index ], 'renta' ) :
              this.investorMangService.postFile( this.allIncomes[ index ], 'renta' )
          postFile$.subscribe(
              res4 => {
                  this.dataService.updateUserAndSessionData( res4.headers.get( 'token' ), null )
                  this.allIncomes[ index ].already_uploaded = true
                  let getById$ = this.rolType == 'customer' ?
                    this.customerMangService.getCustomerById( this.user_data.id ) :
                      this.investorMangService.getInvestorById( this.user_data.id )
                  getById$.subscribe(
                      res => {
                          var user_data: any = JSON.parse( localStorage.getItem( 'user_data' ) )
                          user_data.user_data = this.rolType == 'customer' ? res.json( ).client : res.json( ).investor
                          localStorage.setItem( 'user_data', JSON.stringify( user_data ) )
                          this.user_data = this.rolType == 'customer' ? res.json( ).client : res.json( ).investor

                          if ( index < this.allIncomes.length - 1 ) {
                              this.sendAllIncomes( index + 1, om1 )
                          } else {
                              this.safeFlag2 = true
                              this.requestSent2 = false
                              this.dataService.updateShowBird( false )
                              this.requestSent3 = true
                              this.dataService.updateShowBird( true )
                              this.sendAllBankStatements( 0, om1 )
                          }
                      },
                      err => {
                          this.dataService.errorHandler( err, { userType: this.rolType == 'customer' ? 'Client' :'Investor' } )
                      },
                      () => {
                          UtilitiesService.debug( "Local user updated" )
                      }
                  )
              },
              err => {
                  this.dataService.errorHandler( err, { userType: this.rolType == 'customer' ? 'Client' :'Investor' } )
                  this.requestSent2 = false
              },
              () => {
                  UtilitiesService.debug( `Statements file at index ${index} posted` )
              }
          )
      } else {
          if ( index < this.allIncomes.length - 1 ) {
              this.sendAllIncomes( index + 1, om1 )
          } else {
              this.safeFlag2 = true
              this.requestSent2 = false
              this.dataService.updateShowBird( false )
              this.requestSent3 = true
              this.dataService.updateShowBird( true )
              this.sendAllBankStatements( 0, om1 )
          }
      }
  }



  sendAllBankStatements( index, om1 ) {
      if ( this.allBankStatements.length > 0 && this.allBankStatements[ index ].file != undefined && !this.allBankStatements[ index ].already_uploaded ) {
          let postFile$ = this.rolType == 'customer' ?
            this.customerMangService.postFile( this.allBankStatements[ index ], 'extractos' ) :
              this.investorMangService.postFile( this.allBankStatements[ index ], 'extractos' )
          postFile$.subscribe(
              res4 => {
                  this.dataService.updateUserAndSessionData( res4.headers.get( 'token' ), null )
                  this.allBankStatements[ index ].already_uploaded = true
                  let getById$ = this.rolType == 'customer' ?
                    this.customerMangService.getCustomerById( this.user_data.id ) :
                      this.investorMangService.getInvestorById( this.user_data.id )
                  getById$.subscribe(
                      res => {
                          var user_data: any = JSON.parse( localStorage.getItem( 'user_data' ) )
                          user_data.user_data = this.rolType == 'customer' ? res.json( ).client : res.json( ).investor
                          localStorage.setItem( 'user_data', JSON.stringify( user_data ) )
                          this.user_data = this.rolType == 'customer' ? res.json( ).client : res.json( ).investor

                          if ( index < this.allBankStatements.length - 1 ) {
                              this.sendAllBankStatements( index + 1, om1 )
                          } else {
                              this.safeFlag3 = true
                              this.requestSent3 = false
                              this.dataService.updateShowBird( false )
                              this.requestSent4 = true
                              this.dataService.updateShowBird( true )
                              this.sendAllIncomesCertifications( 0, om1 )
                          }
                      },
                      err => {
                          this.dataService.errorHandler( err, { userType: this.rolType == 'customer' ? 'Client' :'Investor' } )
                      },
                      () => {
                          UtilitiesService.debug( "Local user updated" )
                      }
                  )
              },
              err => {
                  this.dataService.errorHandler( err, { userType: this.rolType == 'customer' ? 'Client' :'Investor' } )
                  this.requestSent3 = false
              },
              () => {
                  UtilitiesService.debug( `Statements file at index ${index} posted` )
              }
          )
      } else {
          if ( index < this.allBankStatements.length - 1 ) {
              this.sendAllBankStatements( index + 1, om1 )
          } else {
              this.safeFlag3 = true
              this.requestSent3 = false
              this.dataService.updateShowBird( false )
              this.requestSent4 = true
              this.dataService.updateShowBird( true )
              this.sendAllIncomesCertifications( 0, om1 )
          }
      }
  }

  sendAllIncomesCertifications( index, om1 ) {
      if ( this.allIncomesCertifications.length > 0 && this.allIncomesCertifications[ index ].file != undefined && !this.allIncomesCertifications[ index ].already_uploaded ) {
          let postFile$ = this.rolType == 'customer' ?
            this.customerMangService.postFile( this.allIncomesCertifications[ index ], 'ingresos' ) :
              this.investorMangService.postFile( this.allIncomesCertifications[ index ], 'ingresos' )
          postFile$.subscribe(
              res4 => {
                  this.dataService.updateUserAndSessionData( res4.headers.get( 'token' ), null )
                  this.allIncomesCertifications[ index ].already_uploaded = true
                  let getById$ = this.rolType == 'customer' ?
                    this.customerMangService.getCustomerById( this.user_data.id ) :
                      this.investorMangService.getInvestorById( this.user_data.id )
                  getById$.subscribe(
                      res => {
                          var user_data: any = JSON.parse( localStorage.getItem( 'user_data' ) )
                          user_data.user_data = this.rolType == 'customer' ? res.json( ).client : res.json( ).investor
                          localStorage.setItem( 'user_data', JSON.stringify( user_data ) )
                          this.user_data = this.rolType == 'customer' ? res.json( ).client : res.json( ).investor

                          if ( index < this.allIncomesCertifications.length - 1 ) {
                              this.sendAllIncomesCertifications( index + 1, om1 )
                          } else {
                              om1.click( )
                              this.updateFilesArrays( )
                              this.safeFlag4 = true
                              this.requestSent4 = false
                              this.dataService.updateShowBird( false )
                          }
                      },
                      err => {
                          this.dataService.errorHandler( err, { userType: this.rolType == 'customer' ? 'Client' :'Investor' } )
                      },
                      () => {
                          UtilitiesService.debug( "Local user updated" )
                      }
                  )
              },
              err => {
                  this.dataService.errorHandler( err, { userType: this.rolType == 'customer' ? 'Client' :'Investor' } )
                  this.requestSent4 = false
              },
              () => {
                  UtilitiesService.debug( `Statements file at index ${index} posted` )
              }
          )
      } else {
          if ( index < this.allIncomesCertifications.length - 1 ) {
              this.sendAllIncomesCertifications( index + 1, om1 )
          } else {
              let getById$ = this.rolType == 'customer' ?
                this.customerMangService.getCustomerById( this.user_data.id ) :
                  this.investorMangService.getInvestorById( this.user_data.id )
              getById$.subscribe(
                  res => {
                      this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), this.rolType == 'customer' ? res.json( ).client : res.json( ).investor )
                      this.updateFilesArrays( )
                      om1.click( )
                      this.safeFlag4 = true
                      this.requestSent4 = false
                  },
                  err => {
                      this.dataService.errorHandler( err, { userType: this.rolType == 'customer' ? 'Client' :'Investor' } )
                  },
                  () => {
                      UtilitiesService.debug( "Local user updated" )
                      this.dataService.updateShowBird( false )
                  }
              )
          }
      }
  }

  openModal2( om2 ) {
      if ( this.safeFlag1 && this.safeFlag2 && this.safeFlag3 && this.safeFlag4 )
          om2.click( )
  }

  the_name
  the_index
  on_view_doc_id
  showStatementDocument( omb, index, name ) {
      this.the_name = name
      this.the_index = index
      this.pdf_viewer.nativeElement.src = this.customerMangService.API_path + this.allBankStatements[ index ].document.url
      this.on_view_doc_id = this.allBankStatements[ index ].id
      omb.click( )
  }

  showIdDocument( omb, index, name ) {
      this.the_name = name
      this.the_index = index
      this.pdf_viewer.nativeElement.src = this.customerMangService.API_path + this.allIds[ index ].document.url
      this.on_view_doc_id = this.allIds[ index ].id
      omb.click( )
  }

  showIncomeDocument( omb, index, name ) {
      this.the_name = name
      this.the_index = index
      this.pdf_viewer.nativeElement.src = this.customerMangService.API_path + this.allIncomes[ index ].document.url
      this.on_view_doc_id = this.allIncomes[ index ].id
      omb.click( )
  }

  showIncomeCertificationDocument( omb, index, name ) {
      this.the_name = name
      this.the_index = index
      this.pdf_viewer.nativeElement.src = this.customerMangService.API_path + this.allIncomesCertifications[ index ].document.url
      this.on_view_doc_id = this.allIncomesCertifications[ index ].id
      omb.click( )
  }

  requestSent = false
  downloadDoc( ) {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          var index = this.getDocById( this.on_view_doc_id )
          if ( index < 0 )
              return
          var format = this.user_data.documents[ index ].document.url.split( "." )[ 1 ]
          let getBlob$ = this.rolType == 'customer' ?
            this.customerMangService.getDocumentBlob( this.user_data.documents[ index ].document.url ) :
              this.investorMangService.getDocumentBlob( this.user_data.documents[ index ].document.url )
          getBlob$.subscribe(
              res => {
                  FileSaver.saveAs( res.blob( ), this.the_name + "." + format )
                  this.requestSent = false
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
              },
              err => {
                  UtilitiesService.debug( err )
                  this.requestSent = false
                  this.dataService.updateShowBird( false )
              },
              () => {
                  UtilitiesService.debug( "Got a file" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
  }

  getDocById( id ) {
      for ( var i = 0; i < this.user_data.documents.length; i++ )
          if ( this.user_data.documents[ i ].id == id )
              return i
      return -1
  }

  nextStep( ) {
    if ( !this.isRegistration ) {
      this.subscription.add(
          Observable.interval( 1000 ).subscribe( x => {
              if ( this.rolType == 'customer' )
                this.router.navigate( [ localStorage.getItem( 'customer_came_from' ) ] )
              else
                this.router.navigate( [ localStorage.getItem( 'investor_came_from' ) ] )
          })
      )
    } else {
      if ( !this.requestSent ) {
          this.requestSent = true
          this.dataService.updateShowBird( true )
          let sendEmail$ = this.rolType == 'customer' ?
            this.customerRegService.sendFinalEmail( ) :
            this.investorRegService.sendFinalEmail( )
          sendEmail$.subscribe(
              res => {
                  this.dataService.updateUserAndSessionData( res.headers.get( 'token' ), null )
                  this.requestSent = false
                  setTimeout( () => {
                      ( <any> window ).ga( 'send', 'event', {
                        eventCategory: 'registration',
                        eventAction: this.rolType == 'customer' ? 'client registration' : 'investor registration'
                      });

                      if ( this.rolType == 'investor' ) {
                        localStorage.removeItem( 'investor_registration_process' )
                        localStorage.removeItem( 'investor_dream' )
                        this.router.navigate( [ 'inversionista', 'perfil' ] )
                      } else  {
                        this.router.navigate( [ 'cliente', 'perfil' ] )
                      }

                  }, 1000 )
              },
              err => {
                  this.requestSent = false
                  this.dataService.errorHandler( err, { userType: this.rolType == 'customer' ? 'Client' :'Investor' } )
              },
              () => {
                  UtilitiesService.debug( "Email sent" )
                  this.dataService.updateShowBird( false )
              }
          )
      }
    }
  }

  addBankFileInputLine( ) {
    this.allBankStatements.push({
      file: undefined,
      already_uploaded: false
    })
  }

  removeBankFileInputLine( index ) {
    this.allBankStatements = this.allBankStatements.slice( 0, index )
        .concat( this.allBankStatements
            .slice( index + 1, this.allBankStatements.length ) )
  }

  addIdFileInputLine( ) {
    this.allIds.push({
      file: undefined,
      already_uploaded: false
    })
  }

  removeIdFileInputLine( index ) {
    this.allIds = this.allIds.slice( 0, index )
        .concat( this.allIds
            .slice( index + 1, this.allIds.length ) )
  }

  addIncomeFileInputLine( ) {
    this.allIncomes.push({
      file: undefined,
      already_uploaded: false
    })
  }

  removeIncomeFileInputLine( index ) {
    this.allIncomes = this.allIncomes.slice( 0, index )
        .concat( this.allIncomes
            .slice( index + 1, this.allIncomes.length ) )
  }

  addIncomeCertificationFileInputLine( ) {
    this.allIncomesCertifications.push({
      file: undefined,
      already_uploaded: false
    })
  }

  removeIncomeCertificationFileInputLine( index ) {
    this.allIncomesCertifications = this.allIncomesCertifications.slice( 0, index )
        .concat( this.allIncomesCertifications
            .slice( index + 1, this.allIncomesCertifications.length ) )
  }

  getBack( ) {
      window.history.back( )
  }

}
