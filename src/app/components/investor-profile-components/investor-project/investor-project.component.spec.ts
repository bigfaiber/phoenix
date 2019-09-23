import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorProjectComponent } from './investor-project.component';

describe('InvestorProjectComponent', () => {
  let component: InvestorProjectComponent;
  let fixture: ComponentFixture<InvestorProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
