import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchVisualizerComponent } from './match-visualizer.component';

describe('MatchVisualizerComponent', () => {
  let component: MatchVisualizerComponent;
  let fixture: ComponentFixture<MatchVisualizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatchVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
