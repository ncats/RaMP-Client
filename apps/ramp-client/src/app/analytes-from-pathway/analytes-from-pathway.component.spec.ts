import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalytesFromPathwayComponent } from './analytes-from-pathway.component';

describe('AnalytesFromPathwayComponent', () => {
  let component: AnalytesFromPathwayComponent;
  let fixture: ComponentFixture<AnalytesFromPathwayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalytesFromPathwayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalytesFromPathwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
