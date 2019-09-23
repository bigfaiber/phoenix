import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorHistoryComponent } from './investor-history.component';

describe('InvestorHistoryComponent', () => {
  let component: InvestorHistoryComponent;
  let fixture: ComponentFixture<InvestorHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
