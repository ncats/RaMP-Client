import { ComponentFixture, TestBed } from '@angular/core/testing';
import {FlexLayoutModule} from "@angular/flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatTooltipModule} from "@angular/material/tooltip";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { InputRowComponent } from './input-row.component';

describe('InputRowComponent', () => {
  let component: InputRowComponent;
  let fixture: ComponentFixture<InputRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputRowComponent ],
      imports: [
        BrowserAnimationsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatTooltipModule,
        MatInputModule,
        MatIconModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
