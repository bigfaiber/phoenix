import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerDreamComponent } from './create-customer-dream.component';

describe('CreateCustomerDreamComponent', () => {
  let component: CreateCustomerDreamComponent;
  let fixture: ComponentFixture<CreateCustomerDreamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCustomerDreamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomerDreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
