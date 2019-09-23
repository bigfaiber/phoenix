import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProfileWrapperComponent } from './customer-profile-wrapper.component';

describe('CustomerProfileWrapperComponent', () => {
  let component: CustomerProfileWrapperComponent;
  let fixture: ComponentFixture<CustomerProfileWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerProfileWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProfileWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
