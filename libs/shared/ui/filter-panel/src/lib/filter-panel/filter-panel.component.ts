import { SelectionChange, SelectionModel } from "@angular/cdk/collections";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import {  MatCheckboxModule } from "@angular/material/checkbox";
import {
  CdkVirtualScrollViewport,
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
} from '@angular/cdk/scrolling';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { HighlightPipe } from "@ramp/shared/ui/highlight";

export interface FilterValue {
  count?: number;
  label?: string;
  value?: string;
  key?: string;
}

@Component({
  selector: 'ramp-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CdkVirtualScrollViewport,
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    MatCheckboxModule,
    HighlightPipe,
  ],
})
export class FilterPanelComponent<T extends FilterValue> implements OnInit {
  @Input() displayColumns = ['select', 'value', 'count'];
  @Input() label?: string;
  @Input() globalFilter?: string;
  @Output() selectionChange: EventEmitter<SelectionChange<T>> = new EventEmitter<SelectionChange<T>>();
  filteredData!: T[];

  filterFormCtrl: UntypedFormControl = new UntypedFormControl();

  /**
   * object field to display
   */
  @Input() field?: string;

  /**
   * initialize a private variable _data, it's a BehaviorSubject
   * @type {BehaviorSubject<unknown>}
   * @private
   */
  protected _data = new BehaviorSubject<T[]>([]);

  /**
   * pushes changed data to {BehaviorSubject}
   * @param value
   */
  @Input()
  set data(value: T[]) {
    this._data.next(value);
  }

  /**
   * returns value of {BehaviorSubject}
   * @returns UpsetData[]
   */
  get data(): T[] {
    return this._data.getValue();
  }

  dataSource: MatTableDataSource<T[]> = new MatTableDataSource<T[]>();
  fieldSelection = new SelectionModel<T>(true, []);

  ngOnInit() {
    this._data.subscribe((data: T[]) => {
      this.filteredData = data;
    });

    this.fieldSelection.changed.subscribe((change:SelectionChange<T>) => {
      this.selectionChange.emit(change);
    });

    this.filterFormCtrl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((term) => {
        if (term && term.length > 0) {
          this.filteredData = this.data.filter((obj: T) => {
            if(obj['value']) {
              return obj['value'].toLowerCase().includes(term)
            } else return 0
            }
          );
        } else {
          this.filteredData = this.data;
        }
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.fieldSelection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

/*  /!** Selects all rows if they are not all selected; otherwise clear selection. *!/
  masterToggle() {
    this.isAllSelected()
      ? this.fieldSelection.clear()
      : this.dataSource.data.forEach((row:T[]) =>
          this.fieldSelection.select(row.key),
        );
  }*/
}
