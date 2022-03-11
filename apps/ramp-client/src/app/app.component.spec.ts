import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FeaturesRampRampHeaderModule } from '@ramp/features/ramp/ramp-header';
import { SharedNcatsNcatsFooterModule } from "@ramp/shared/ncats/ncats-footer";
import { SharedUiLoadingSpinnerModule } from '@ramp/shared/ui/loading-spinner';
import { RampFacade, StoresRampStoreModule } from '@ramp/stores/ramp-store';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        SharedUiLoadingSpinnerModule,
        FeaturesRampRampHeaderModule,
        SharedNcatsNcatsFooterModule,
        MatDialogModule,
        StoresRampStoreModule,
        StoreModule.forRoot(
          {},
          {
            metaReducers: !environment.production ? [] : [],
            runtimeChecks: {
              strictActionImmutability: true,
              strictStateImmutability: true,
            },
          }
        ),
        EffectsModule.forRoot([]),
      ],
      providers: [RampFacade],
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
