import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalAnalysisComponent } from './chemical-analysis.component';

describe('ChemicalAnalysisComponent', () => {
  let component: ChemicalAnalysisComponent;
  let fixture: ComponentFixture<ChemicalAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemicalAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
