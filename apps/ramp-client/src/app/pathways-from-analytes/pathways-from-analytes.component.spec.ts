import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwaysFromAnalytesComponent } from './pathways-from-analytes.component';

describe('PathwaysFromAnalytesComponent', () => {
  let component: PathwaysFromAnalytesComponent;
  let fixture: ComponentFixture<PathwaysFromAnalytesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PathwaysFromAnalytesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwaysFromAnalytesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
