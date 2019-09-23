import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRegistrationContainerComponent } from './customer-registration-container.component';

describe('CustomerRegistrationContainerComponent', () => {
  let component: CustomerRegistrationContainerComponent;
  let fixture: ComponentFixture<CustomerRegistrationContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRegistrationContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRegistrationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
