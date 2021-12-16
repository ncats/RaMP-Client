import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FlexLayoutModule} from "@angular/flex-layout";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ActivatedRoute} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {SharedUiHeaderTemplateModule} from "@ramp/shared/ui/header-template";

import { RampHeaderComponent } from './ramp-header.component';

describe('NcatsHeaderComponent', () => {
  let component: RampHeaderComponent;
  let fixture: ComponentFixture<RampHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RampHeaderComponent],
      imports: [
        FlexLayoutModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedUiHeaderTemplateModule
      ],
      providers: [
        {provide: ActivatedRoute, useValue: {}}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RampHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
