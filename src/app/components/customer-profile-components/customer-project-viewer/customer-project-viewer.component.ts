import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { style, state, animate, transition, trigger } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyCurrencyFormatterDirective } from "../../../directives/currency/my-currency-formatter.directive";
import { MyCurrencyPipe } from "../../../pipes/currency/my-currency.pipe";
import { CustomerManagementService } from "../../../services/customerManagement/customer-management.service";
import { DataService } from "../../../services/data-service/data.service";
import { UtilitiesService } from "../../../services/utilities-service/utilities.service";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-customer-project-viewer',
  templateUrl: './customer-project-viewer.component.html',
  styleUrls: ['./customer-project-viewer.component.scss']
})
export class CustomerProjectViewerComponent implements OnInit {

  constructor( private router: Router, private cuPipe: MyCurrencyPipe,
                 private customerMangService: CustomerManagementService, private dataService: DataService,
                    private dp: DecimalPipe ) { }

   @ViewChild( 'dream' ) dream_input: any;
   @ViewChild( 'description' ) description_input: any;
   @ViewChild( 'needings' ) needings_input: any;
   @ViewChild( 'payment' ) payment_input: any;
   @ViewChild( 'months' ) months_input: any;
   @ViewChild( 'rate_input' ) rate_input: any;

   @ViewChild( 'warranties' ) warranties: any;
   @ViewChild( 'banks' ) bank: any;
   @ViewChild( 'account_type' ) account_type: any;
   @ViewChild( 'account_input' ) account_input: any;

  project_data;

  ngOnInit( ) {
      this.dataService.onInit( `Proyecto Aprobado` )
      var temp = localStorage.getItem( 'view_data_project' )
      if ( temp != null ) {
        this.project_data = JSON.parse( temp )
      } else {
          UtilitiesService.debug( "No project found, redirecting..." )
          this.router.navigate( [ 'cliente', 'perfil' ] )
      }
  }

  ngAfterViewInit( ) {
      this.dream_input.nativeElement.value = this.project_data.dream
      this.description_input.nativeElement.value = this.project_data.description
      this.needings_input.nativeElement.value = this.cuPipe.transform( this.project_data.money )
      this.payment_input.nativeElement.value = this.cuPipe.transform( this.project_data.monthly_payment )
      this.months_input.nativeElement.value = this.project_data.month

      switch ( this.project_data.warranty ) {
          case "Prenda":
              this.warranties.nativeElement.value = "1"
              break
          case "Hipoteca":
              this.warranties.nativeElement.value = "2"
              break
          case "Pagare":
              this.warranties.nativeElement.value = "3"
              break
      }

      this.bank.nativeElement.value = this.project_data.account.bank
      this.account_type.nativeElement.value = this.project_data.account.account_type == "Ahorros" ? "1" : "2"
      this.account_input.nativeElement.value = this.project_data.account.account_number

      this.rate_input.nativeElement.value = this.dp.transform( this.project_data.interest_rate, '1.0-1' ) + "%"
  }

  ngOnDestroy( ) {
      localStorage.removeItem( 'view_data_project' )
      this.router.navigate( [ 'cliente', 'perfil' ] )
  }

  getBack( ) {
      window.history.back( )
  }

}
