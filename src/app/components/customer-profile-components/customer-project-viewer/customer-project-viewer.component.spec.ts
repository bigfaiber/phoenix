import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProjectViewerComponent } from './customer-project-viewer.component';

describe('CustomerProjectViewerComponent', () => {
  let component: CustomerProjectViewerComponent;
  let fixture: ComponentFixture<CustomerProjectViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerProjectViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerProjectViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
