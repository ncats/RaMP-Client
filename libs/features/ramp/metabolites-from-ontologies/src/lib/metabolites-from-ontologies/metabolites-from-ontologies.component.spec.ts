import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetabolitesFromOntologiesComponent } from './metabolites-from-ontologies.component';

describe('MetabolitesFromOntologiesComponent', () => {
  let component: MetabolitesFromOntologiesComponent;
  let fixture: ComponentFixture<MetabolitesFromOntologiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetabolitesFromOntologiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetabolitesFromOntologiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
