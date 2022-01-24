import {SelectionModel} from "@angular/cdk/collections";
import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'ramp-filter-panel',
  templateUrl: './filter-panel.component.html',
  styleUrls: ['./filter-panel.component.scss']
})
export class FilterPanelComponent implements OnInit {
  @Input() displayColumns = ['select', 'value', 'count'];
  @Input() label?: string;
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
  fieldSelection = new SelectionModel<any>(true,[]);


  constructor() { }

  ngOnInit() {
    this._data.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    //  this.dataSource.data = data
    });

    this.fieldSelection.changed.subscribe(change => {
console.log(change.source.selected);
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
    this.isAllSelected() ?
      this.fieldSelection.clear() :
      this.dataSource.data.forEach(row => this.fieldSelection.select(row.key));
  }

}

