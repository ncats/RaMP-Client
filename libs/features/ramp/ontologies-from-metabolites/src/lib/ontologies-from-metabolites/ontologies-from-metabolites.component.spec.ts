import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { RampEffects, rampReducer } from "@ramp/stores/ramp-store";

import { OntologiesFromMetabolitesComponent } from './ontologies-from-metabolites.component';

describe('OntologiesFromMetabolitesComponent', () => {
  let component: OntologiesFromMetabolitesComponent;
  let fixture: ComponentFixture<OntologiesFromMetabolitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        OntologiesFromMetabolitesComponent,
        BrowserAnimationsModule
      ],
      providers: [
        provideStore({
          rampStore: rampReducer
        }),
        provideEffects([RampEffects]),
        provideStoreDevtools({ maxAge: 25, logOnly: false }),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OntologiesFromMetabolitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
