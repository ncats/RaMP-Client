import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, TitleCasePipe } from '@angular/common';

@Component({
    selector: 'ramp-input-row',
    templateUrl: './input-row.component.html',
    styleUrls: ['./input-row.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatFormFieldModule,
        MatInputModule,
        TextFieldModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        TitleCasePipe,
    ],
})
export class InputRowComponent implements OnInit {
  @Input() showInput = true;
  @Input() showDownload = true;
  @Input() input!: string;
  @Input() examples!: string;

  @Output() dataSearch: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() dataDownload: EventEmitter<string[]> = new EventEmitter<string[]>();

  inputFormCtrl: UntypedFormControl = new UntypedFormControl();
  public queryCount = 0;
  public retArr: string[] = [];

  ngOnInit(): void {
    this.inputFormCtrl.setValue(this.examples);
    if (!this.retArr) {
      this.parseInput();
    }
  }

  public parseInput() {
    if (this.inputFormCtrl.value && this.inputFormCtrl.value.length > 0) {
      if (Array.isArray(this.inputFormCtrl.value)) {
        this.retArr = this.inputFormCtrl.value.map(
          (val: string) => (val = val.trim()),
        );
      } else {
        this.retArr = this.inputFormCtrl.value
          .trim()
          .split(/[\t\n,;]+/)
          .map((val: string) => val.trim());
      }
    }
    this.queryCount = this.retArr.length;
  }

  fetchData() {
    this.parseInput();
    this.dataSearch.emit(this.retArr);
  }

  downloadData() {
    this.parseInput();
    this.dataDownload.emit(this.retArr);
  }
}
