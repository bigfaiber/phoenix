import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerOpinionComponent } from './admin-customer-opinion.component';

describe('AdminCustomerOpinionComponent', () => {
  let component: AdminCustomerOpinionComponent;
  let fixture: ComponentFixture<AdminCustomerOpinionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCustomerOpinionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCustomerOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
