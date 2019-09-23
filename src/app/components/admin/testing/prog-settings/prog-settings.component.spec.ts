import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgSettingsComponent } from './prog-settings.component';

describe('ProgSettingsComponent', () => {
  let component: ProgSettingsComponent;
  let fixture: ComponentFixture<ProgSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
