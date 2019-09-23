import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoolProjectLinkComponent } from './cool-project-link.component';

describe('CoolProjectLinkComponent', () => {
  let component: CoolProjectLinkComponent;
  let fixture: ComponentFixture<CoolProjectLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoolProjectLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoolProjectLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
