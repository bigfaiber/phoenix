import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomerDreamComponent } from './admin-customer-dream.component';

describe('AdminCustomerDreamComponent', () => {
  let component: AdminCustomerDreamComponent;
  let fixture: ComponentFixture<AdminCustomerDreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCustomerDreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCustomerDreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
