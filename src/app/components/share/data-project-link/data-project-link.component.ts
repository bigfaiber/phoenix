import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-data-project-link',
  templateUrl: './data-project-link.component.html',
  styleUrls: ['./data-project-link.component.scss']
})
export class DataProjectLinkComponent implements OnInit {

  constructor() { }

  @Input( )
  money: number

  @Input( )
  data: [{
    label: string,
    value: string,
    prefix: string,
    sufix: string
  }]

  @Input( )
  bgColor: string

  @Input( )
  notification: { message: String, color: String }

  ngOnInit( ) {
  }

}
