import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cool-project-link',
  templateUrl: './cool-project-link.component.html',
  styleUrls: ['./cool-project-link.component.scss']
})
export class CoolProjectLinkComponent implements OnInit {

  constructor() { }

  /*
    'approved' - Approved project
    'match' - project with match
    'created' - Created project
  */
  @Input( )
  state: String

  @Input( )
  dream: String

  @Input( )
  money: String

  @Input( )
  notification: { message: String, color: String }

  ngOnInit( ) {
  }

}
