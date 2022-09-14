import { Dialog } from "@angular/cdk/dialog";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";

import { CompleteDialogComponent } from './complete-dialog.component';

describe('CompleteDialogComponent', () => {
  let component: CompleteDialogComponent;
  let fixture: ComponentFixture<CompleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        MatDialogModule,
        FlexLayoutModule,
        MatButtonModule
      ],
      declarations: [CompleteDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: {} }, { provide: MAT_DIALOG_DATA, useValue: "dfgdfg"  }]
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
