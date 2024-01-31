import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { RampEffects, rampReducer } from "@ramp/stores/ramp-store";

import { PropertiesFromMetabolitesComponent } from './properties-from-metabolites.component';

describe('PropertiesFromComponent', () => {
  let component: PropertiesFromMetabolitesComponent;
  let fixture: ComponentFixture<PropertiesFromMetabolitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        PropertiesFromMetabolitesComponent
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
    fixture = TestBed.createComponent(PropertiesFromMetabolitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
