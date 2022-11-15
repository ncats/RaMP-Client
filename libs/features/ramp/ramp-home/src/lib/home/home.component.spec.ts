import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { RampFacade, StoresRampStoreModule } from "@ramp/stores/ramp-store";

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        RouterTestingModule,
        FlexLayoutModule,
        MatCardModule,
        MatButtonModule,
        StoresRampStoreModule,
        HttpClientTestingModule,
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
      providers: [RampFacade, { provide: ActivatedRoute, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
