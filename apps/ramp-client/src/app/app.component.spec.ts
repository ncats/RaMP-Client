import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {  provideEffects } from "@ngrx/effects";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { RampEffects, rampReducer } from "@ramp/stores/ramp-store";
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        AppComponent
      ],
      providers: [
        provideStore({
          rampStore: rampReducer
        }),
        provideEffects([RampEffects]),
        provideStoreDevtools({ maxAge: 25, logOnly: false })
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ramp-client'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ramp-client');
  });
});
