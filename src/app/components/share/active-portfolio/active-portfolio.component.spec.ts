import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePortfolioComponent } from './active-portfolio.component';

describe('ActivePortfolioComponent', () => {
  let component: ActivePortfolioComponent;
  let fixture: ComponentFixture<ActivePortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivePortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
