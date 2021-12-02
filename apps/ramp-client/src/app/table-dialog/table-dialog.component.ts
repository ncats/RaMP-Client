import { Component, Inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TableDialogData } from './table-dialog-data.model';

@Component({
  selector: 'ramp-table-dialog',
  templateUrl: './table-dialog.component.html',
  styleUrls: ['./table-dialog.component.scss'],
})
export class TableDialogComponent implements OnInit {
  title: string;
  tableData: Array<any>;
  displayedColumns: Array<string>;
  columns: Array<{ value: string; display: string }>;

  // paging
  pagedData: Array<any> = [];
  page = 0;
  pageSize = 10;

  constructor(
    public dialogRef: MatDialogRef<TableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: TableDialogData
  ) {
    this.title = data.title;
    this.tableData = data.tableData;
    this.columns = data.columns;
    this.displayedColumns = this.columns.map((item) => item.value);
    this.pageChange();
  }

  ngOnInit(): void {}

  pageChange(pageEvent?: PageEvent): void {
    if (pageEvent != null) {
      this.page = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    } else {
      this.page = 0;
    }
    const pagedData = [];
    const startIndex = this.page * this.pageSize;
    for (let i = startIndex; i < startIndex + this.pageSize; i++) {
      if (this.tableData[i] != null) {
        pagedData.push(this.tableData[i]);
      } else {
        break;
      }
    }
    this.pagedData = pagedData;
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') {
      return;
    }

    this.tableData = this.tableData.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });

    this.pageChange();
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
