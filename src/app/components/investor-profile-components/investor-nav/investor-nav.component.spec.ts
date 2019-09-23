import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorNavComponent } from './investor-nav.component';

describe('InvestorNavComponent', () => {
  let component: InvestorNavComponent;
  let fixture: ComponentFixture<InvestorNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestorNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestorNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
