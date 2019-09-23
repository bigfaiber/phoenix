import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerDocsComponent } from './admin-customer-docs.component';

describe('AdminCustomerDocsComponent', () => {
  let component: AdminCustomerDocsComponent;
  let fixture: ComponentFixture<AdminCustomerDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCustomerDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCustomerDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
