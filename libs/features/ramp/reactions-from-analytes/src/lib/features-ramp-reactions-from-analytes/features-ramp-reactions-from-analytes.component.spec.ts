import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideEffects } from "@ngrx/effects";
import { provideStore, StoreModule } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { RampEffects, rampReducer } from "@ramp/stores/ramp-store";
import { ReactionsFromAnalytesComponent } from './features-ramp-reactions-from-analytes.component';

describe('ReactionsFromAnalytesComponent', () => {
  let component: ReactionsFromAnalytesComponent;
  let fixture: ComponentFixture<ReactionsFromAnalytesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactionsFromAnalytesComponent,
        StoreModule
      ],
      providers: [
        provideStore({
          rampStore: rampReducer
        }),
        provideEffects([RampEffects]),
        provideStoreDevtools({ maxAge: 25, logOnly: false }),
      ],    }).compileComponents();

    fixture = TestBed.createComponent(
      ReactionsFromAnalytesComponent,
    );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
