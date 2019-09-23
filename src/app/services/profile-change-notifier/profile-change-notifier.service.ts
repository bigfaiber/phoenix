import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ProfileChangeNotifierService {

  private profile_path = new Subject<any>( );
  userObs$ = this.profile_path.asObservable( );

  search_code = new Subject<any>( );
  searchCode$ = this.search_code.asObservable( );

  constructor( ) { }

  updateUserData( data ) {
      this.profile_path.next( data )
  }

  updateSearchCode( data ) {
      this.search_code.next( data )
  }

}
