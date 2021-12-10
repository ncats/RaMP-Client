import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologySearchComponent } from './ontology-search.component';

describe('OntologySearchComponent', () => {
  let component: OntologySearchComponent;
  let fixture: ComponentFixture<OntologySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OntologySearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OntologySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
