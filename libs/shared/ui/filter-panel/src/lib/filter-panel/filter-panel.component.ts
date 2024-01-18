import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { HighlightPipe } from '../../../../highlight/src/lib/highlight.pipe';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf } from '@angular/cdk/scrolling';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

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
export class FilterPanelComponent implements OnInit {
  @Input() displayColumns = ['select', 'value', 'count'];
  @Input() label?: string;
  @Input() globalFilter?: string;
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();
  filteredData!: any[];

  filterFormCtrl: UntypedFormControl = new UntypedFormControl();

  /**
   * object field to display
   */
  @Input() field?: string;

  /**
   * initialize a private variable _data, it's a BehaviorSubject
   * @type {BehaviorSubject<any>}
   * @private
   */
  protected _data = new BehaviorSubject<any>(null);

  /**
   * pushes changed data to {BehaviorSubject}
   * @param value
   */
  @Input()
  set data(value: any[]) {
    this._data.next(value);
  }

  /**
   * returns value of {BehaviorSubject}
   * @returns UpsetData[]
   */
  get data(): any[] {
    return this._data.getValue();
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  // todo load selected
  fieldSelection = new SelectionModel<any>(true, []);

  ngOnInit() {
    this._data.subscribe((data) => {
      this.filteredData = data;
    });

    this.fieldSelection.changed.subscribe((change) => {
      this.selectionChange.emit(change);
    });

    this.filterFormCtrl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((term) => {
        if (term && term.length > 0) {
          this.filteredData = this.data.filter((obj) =>
            obj.value.toLowerCase().includes(term),
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

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.fieldSelection.clear()
      : this.dataSource.data.forEach((row) =>
          this.fieldSelection.select(row.key),
        );
  }

  /**
   * detects scrolling of the options div
   * @param event
   */
  scrollDetected(event: any) {
    if (
      event.target.scrollHeight -
        event.target.offsetHeight -
        event.target.scrollTop <=
      5
    ) {
      if (this.data.values.length < this.data.length) {
        // this.fetchAllFilterOptions();
      }
    }
  }

  /**
   * fetches all the filter options for the component's facet
   */
  // fetchAllFilterOptions() {}
}
