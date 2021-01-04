import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalytesComponent } from './analytes.component';

describe('AnalytesComponent', () => {
  let component: AnalytesComponent;
  let fixture: ComponentFixture<AnalytesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalytesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalytesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
