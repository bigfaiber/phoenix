import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvestorProjectComponent } from './admin-investor-project.component';

describe('AdminInvestorProjectComponent', () => {
  let component: AdminInvestorProjectComponent;
  let fixture: ComponentFixture<AdminInvestorProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvestorProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvestorProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
