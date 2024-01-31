import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideEffects } from "@ngrx/effects";
import { provideStore, StoreModule } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import {
  RampEffects,
  rampReducer,
} from '@ramp/stores/ramp-store';

import { AnalytesFromPathwaysComponent } from './analytes-from-pathways.component';

describe('AnalytesFromPathwaysComponent', () => {
  let component: AnalytesFromPathwaysComponent;
  let fixture: ComponentFixture<AnalytesFromPathwaysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        AnalytesFromPathwaysComponent,
        StoreModule
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
    fixture = TestBed.createComponent(AnalytesFromPathwaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
