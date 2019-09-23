import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminInvestorDocsComponent } from './admin-investor-docs.component';

describe('AdminInvestorDocsComponent', () => {
  let component: AdminInvestorDocsComponent;
  let fixture: ComponentFixture<AdminInvestorDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminInvestorDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminInvestorDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
