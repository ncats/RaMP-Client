import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathwayEnrichmentAnalysisComponent } from './pathway-enrichment-analysis.component';

describe('PathwayEnrichmentAnalysisComponent', () => {
  let component: PathwayEnrichmentAnalysisComponent;
  let fixture: ComponentFixture<PathwayEnrichmentAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathwayEnrichmentAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathwayEnrichmentAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
