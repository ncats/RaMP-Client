import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { RampFacade, StoresRampStoreModule } from '@ramp/stores/ramp-store';

import { CommonReactionAnalytesComponent } from './common-reaction-analytes.component';

describe('CommonReactionAnalytesComponent', () => {
  let component: CommonReactionAnalytesComponent;
  let fixture: ComponentFixture<CommonReactionAnalytesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonReactionAnalytesComponent],
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule,
        StoresRampStoreModule,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
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
    fixture = TestBed.createComponent(CommonReactionAnalytesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
