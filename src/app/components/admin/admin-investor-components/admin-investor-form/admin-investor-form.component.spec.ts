import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvestorFormComponent } from './admin-investor-form.component';

describe('AdminInvestorFormComponent', () => {
  let component: AdminInvestorFormComponent;
  let fixture: ComponentFixture<AdminInvestorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvestorFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvestorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
