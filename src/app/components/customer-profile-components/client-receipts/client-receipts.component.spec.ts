import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientReceiptsComponent } from './client-receipts.component';

describe('ClientReceiptsComponent', () => {
  let component: ClientReceiptsComponent;
  let fixture: ComponentFixture<ClientReceiptsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientReceiptsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientReceiptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
