import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedRampInputRowModule } from '@ramp/shared/ramp/input-row';
import { SharedRampPageCoreModule } from '@ramp/shared/ramp/page-core';
import { SharedRampQueryPageModule } from '@ramp/shared/ramp/query-page';
import { SharedUiDescriptionPanelModule } from '@ramp/shared/ui/description-panel';
import { SharedUiFeedbackPanelModule } from "@ramp/shared/ui/feedback-panel";
import { SharedUiLoadingSpinnerModule } from '@ramp/shared/ui/loading-spinner';
import { SharedUiObjectTreeModule } from '@ramp/shared/ui/object-tree';
import { RampFacade, StoresRampStoreModule } from '@ramp/stores/ramp-store';

import { ChemicalEnrichmentComponent } from './chemical-enrichment.component';

describe('ChemicalEnrichmentComponent', () => {
  let component: ChemicalEnrichmentComponent;
  let fixture: ComponentFixture<ChemicalEnrichmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChemicalEnrichmentComponent],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        StoresRampStoreModule,
        HttpClientTestingModule,
        SharedRampQueryPageModule,
        SharedRampPageCoreModule,
        SharedRampInputRowModule,
        SharedUiLoadingSpinnerModule,
        SharedUiObjectTreeModule,
        SharedUiDescriptionPanelModule,
        FlexLayoutModule,
        MatTabsModule,
        MatFormFieldModule,
        SharedUiFeedbackPanelModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatInputModule,
        StoreModule.forRoot(
          {},
          {
            metaReducers: [],
            runtimeChecks: {
              strictActionImmutability: true,
              strictStateImmutability: true,
            },
          }
        ),
        EffectsModule.forRoot([]),
      ],
      providers: [
        RampFacade,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                title: 'Analytes From Pathways',
                input: 'pathways',
                function:
                  'analytes <- RaMP::getAnalyteFromPathway(pathway="###REPLACE###")',
                examples:
                  'De Novo Triacylglycerol Biosynthesis, sphingolipid metabolism',
                description:
                  'Analytes (genes, proteins, metabolites) can be retrieve by pathway. Enter a list of exact pathway names.',
              },
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalEnrichmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
