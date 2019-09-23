import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCustomerFilesComponent } from './update-customer-files.component';

describe('UpdateCustomerFilesComponent', () => {
  let component: UpdateCustomerFilesComponent;
  let fixture: ComponentFixture<UpdateCustomerFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCustomerFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCustomerFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
