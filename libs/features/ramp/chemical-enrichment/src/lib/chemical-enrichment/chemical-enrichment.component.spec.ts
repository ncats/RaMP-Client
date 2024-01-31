import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { RampEffects, rampReducer } from "@ramp/stores/ramp-store";


import { ChemicalEnrichmentComponent } from './chemical-enrichment.component';

describe('ChemicalEnrichmentComponent', () => {
  let component: ChemicalEnrichmentComponent;
  let fixture: ComponentFixture<ChemicalEnrichmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        ChemicalEnrichmentComponent
      ],
      providers: [
        provideStore({
          rampStore: rampReducer
        }),
        provideEffects([RampEffects]),
        provideStoreDevtools({ maxAge: 25, logOnly: false }),
      ],
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
