import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideEffects } from "@ngrx/effects";
import { provideStore, StoreModule } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { RampEffects, rampReducer } from "@ramp/stores/ramp-store";
import { FeaturesRampReactionClassesFromAnalytesComponent } from './features-ramp-reaction-classes-from-analytes.component';

describe('FeaturesRampReactionClassesFromAnalytesComponent', () => {
  let component: FeaturesRampReactionClassesFromAnalytesComponent;
  let fixture: ComponentFixture<FeaturesRampReactionClassesFromAnalytesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FeaturesRampReactionClassesFromAnalytesComponent,
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

    fixture = TestBed.createComponent(
      FeaturesRampReactionClassesFromAnalytesComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
