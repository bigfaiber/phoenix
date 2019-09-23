import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingDocsComponent } from './missing-docs.component';

describe('MissingDocsComponent', () => {
  let component: MissingDocsComponent;
  let fixture: ComponentFixture<MissingDocsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
