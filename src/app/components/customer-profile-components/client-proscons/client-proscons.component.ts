import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { style, state, animate, transition, trigger } from '@angular/core';
import { CustomerManagementService } from "../../../services/customerManagement/customer-management.service";
import { MyCurrencyPipe } from "../../../pipes/currency/my-currency.pipe";
import { DataService } from "../../../services/data-service/data.service";

@Component({
  selector: 'app-client-proscons',
  templateUrl: './client-proscons.component.html',
  styleUrls: ['./client-proscons.component.scss']
})
export class ClientProsconsComponent implements OnInit {

  constructor( private router: Router, private customerMangService: CustomerManagementService,
                 private cuPipe: MyCurrencyPipe, private dataService: DataService ) {
                   this.user_data = dataService.user_data_value
                   dataService.user_data$.subscribe( val => {
                     this.user_data = val
                   })
                 }

  user_data;
  opinions = []

  ngOnInit( ) {
    this.dataService.onInit( `Pros y Contras` )
  }

}
