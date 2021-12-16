import { ComponentFixture, TestBed } from '@angular/core/testing';
import {ActivatedRoute} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";

import { QueryPageComponent } from './query-page.component';

describe('QueryPageComponent', () => {
  let component: QueryPageComponent;
  let fixture: ComponentFixture<QueryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryPageComponent ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              data: {
                title: "Analytes From Pathways",
                input: "pathways",
                function: "analytes <- RaMP::getAnalyteFromPathway(pathway=\"###REPLACE###\")",
                examples: "De Novo Triacylglycerol Biosynthesis, sphingolipid metabolism",
                description: "Analytes (genes, proteins, metabolites) can be retrieve by pathway. Enter a list of exact pathway names."
              }
            }
          }
        }
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
