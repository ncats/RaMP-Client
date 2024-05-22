import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, ComponentRef, DestroyRef,
  EventEmitter, inject,
  Injector,
  Input,
  OnInit,
  Output,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { BehaviorSubject, Observable } from "rxjs";
import {
  MatRow,
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import {
  MatPaginator,
  PageEvent,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { CdkPortalOutletAttachedRef, ComponentPortal, PortalModule } from "@angular/cdk/portal";
import { SelectionModel } from '@angular/cdk/collections';
import { PageData } from './models/page-data';
import { DataProperty } from './models/data-property';
import { PropertyDisplayComponent } from './components/property-display/property-display.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgClass } from '@angular/common';


const _sortingDataAccessor = (
  data: { [key: string]: DataProperty },
  property: string,
) => {
  if (data[property] && data[property].value) {
    if (!isNaN(Number(data[property].value))) {
      return data[property].value;
    } else {
      return data[property].value.toLocaleUpperCase();
    }
  } else {
    return 0;
  }
};


/**
 * component to show flexible data consisting of multiple data types, custom components
 * also handles standard table operations, primarily with event emitters for the end user to react to
 */
@Component({
  selector: 'ncats-frontend-library-ncats-datatable',
  templateUrl: './ncats-datatable.component.html',
  styleUrl: './ncats-datatable.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' }),
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    NgClass,
    MatCheckboxModule,
    PropertyDisplayComponent,
    PortalModule
  ],
})

/**
 * Generic table Component that iterates over a list of options to display fields
 */
export class NcatsDatatableComponent
  implements OnInit
{
  destroyRef = inject(DestroyRef);

  /**
   * Table object
   */
  @ViewChild(MatTable) dataTable!: MatTable<unknown>;

  /**
   * initialize a private variable _data, it's a BehaviorSubject
   *
   */
  protected _data = new BehaviorSubject<{ [key: string]: DataProperty; }[]>([]);

  /**
   * pushes changed data to {BehaviorSubject}
   */
  @Input()
  set data(value: { [key: string]: DataProperty; }[]) {
    this._data.next(value);
  }

  /**
   * returns value of {BehaviorSubject}
   */
  get data(): { [key: string]: DataProperty; }[] {
    return this._data.getValue();
  }

  /**
   * sets up config fields as a behavior subject
   * @type {BehaviorSubject<DataProperty[]>}
   * @private
   */
  protected _fieldsConfig: BehaviorSubject<DataProperty[]> =
    new BehaviorSubject<DataProperty[]>([]);

  /**
   * pushes changed data to {BehaviorSubject}
   */
  @Input()
  set fieldsConfig(value: DataProperty[]) {
    this._fieldsConfig.next(value);
  }

  /**
   * returns value of {BehaviorSubject}
   */
  get fieldsConfig(): DataProperty[] {
    return this._fieldsConfig.getValue();
  }

  /**
   * sets up page data as a behavior subject
   * @type {BehaviorSubject<PageData>}
   * @private
   */
  protected _rowSelectConfig: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * pushes changed data to {BehaviorSubject}
   */
  @Input()
  set selectableRows(value: boolean) {
    this._rowSelectConfig.next(value);
    this.fetchTableFields();
  }

  /**
   * returns value of {BehaviorSubject}
   */
  get selectableRows(): boolean {
    return this._rowSelectConfig.getValue();
  }

  @Input() pageData?: PageData;
  /**
   * gets placeholder expanded row outlets
   */
  @ViewChildren('expandedRowOutlet', { read: ViewContainerRef })
  rowOutlet!: QueryList<ViewContainerRef>;

  /** boolean to toggle completion of page loading
   * todo: currently not used
   */
  loading = false;

  /**
   * show/hide the paginator
   */
  @Input() showPaginator = true;

  @Input() useInternalPaginator = false;

  /**
   * show/hide the bottom paginator
   */
  @Input() showBottomPaginator = false;

  /**
   * Sort object from Angular Material
   */
  @ViewChild(MatSort, { static: true }) _sort: MatSort = new MatSort();

  /**
   * generated string array of fields that are to be displayed in the table
   */
  displayColumns!: string[];

  /**
   * generated  array of DataProperties that are to be displayed in the table
   */
  displayFields!: DataProperty[];

  /**
   * whether or not to allow the user to change the size of the page/ show dropdown
   */
  @Input() hidePageSize = false;

  /**
   * Input to toggle if the table should have expandable rows
   * boolean
   */
  @Input() expandable = true;

  /**
   * This compares each row of the table to the "expanded element - if they are equal, the row is expanded
   *  todo: this only allows one open at a time, this might need to be a map to allow multiple expanded rows
   */
  expandedElement: unknown | null;

  /**
   * event that emits when the sort value or direction is changed. The parent component will be responsible for
   * fetching and returning the new sorted data
   */
  @Output() readonly sortChange: EventEmitter<Sort> = new EventEmitter<Sort>();

  /**
   * event that emits when the page is changed. The parent component will be responsible for
   * fetching and returning the new data
   */
  @Output() readonly pageChange: EventEmitter<PageEvent> =
    new EventEmitter<PageEvent>();

  /**
   * event that emits when the page is changed. The parent component will be responsible for
   * fetching and returning the new data
   */
  @Output() readonly rowClick: EventEmitter<MatRow> =
    new EventEmitter<MatRow>();

  /**
   * main table datasource
   * @type {MatTableDataSource<any>}
   */
  dataSource: MatTableDataSource<{[key: string]:DataProperty}> = new MatTableDataSource<{[key: string]: DataProperty}>();

  /**
   * whether to toggle the condensed class to make a more compact table
   * @type {boolean}
   */
  @Input() condensed = false;

  @Input() asDataSource = false;

  @Input() internalSort = false;

  @Output() rowSelectionChange: EventEmitter<SelectionModel<unknown>> =
    new EventEmitter<SelectionModel<unknown>>();

  selection = new SelectionModel<unknown>(true, []);

  /**
   * Paginator object from Angular Material
   *
   */
  @ViewChild(MatPaginator) set paginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  /*
  @ViewChild('paginatorTop') paginatorTop!: MatPaginator;
  @ViewChild('paginatorBottom') paginatorBottom!: MatPaginator;

*/

  /**
   * injector for custom data
   */
  constructor(
    private ref: ChangeDetectorRef,
    private _injector: Injector,
  ) {}
  /**
   * Init: get the columns to be displayed.
   * Table data is tracked by the data getter and setter
   */
  ngOnInit() {
    this._data
      // listen to data as long as term is undefined or null
      // Unsubscribe once term has value
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((res: {[key: string]: DataProperty}[]) => {
        if (res) {
          if (this.useInternalPaginator) {
            this.dataSource = new MatTableDataSource<{[key: string]: DataProperty}>(
              res
            //  res.map((val: Partial<DataProperty>) => new DataProperty(val)),
            );
            this.pageData = new PageData({ total: res.length });
          } else {
            this.dataSource.data = res;
            this.ref.detectChanges();
          }
          if (this.internalSort) {
            this.dataSource.sortingDataAccessor = _sortingDataAccessor;
            this.dataSource.sort = this._sort;
            this._sort.sortChange.subscribe(() => {
              if (this.dataSource.paginator) {
                this.dataSource.paginator.firstPage();
              }
            });
          }
          this.ref.detectChanges();
        }
      });

    this._fieldsConfig
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.fetchTableFields());

    this.selection.changed
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.ref.detectChanges();
        this.rowSelectionChange.emit(this.selection);
      });
  }

  /**
   * emit sort change events
   * @param sort
   */
  changeSort(sort: Sort): void {
    this.sortChange.emit(sort);
    this.ref.detectChanges();
    this.dataTable.renderRows();
  }

  /**
   * emit page change events or use internal paginator
   * @param $event
   */
  changePage($event: PageEvent): void {
    /*
    if(this.dataSource) {
      const previous: number = $event.previousPageIndex ? $event.previousPageIndex * $event.pageSize : 0;
      const page: number = $event.pageIndex * $event.pageSize;

      if((previous < page)){
      this.dataSource.data = this.data.slice(previous, page);
        this.dataTable.renderRows();
      } else {
        this.dataSource.data = this.data.slice(page, previous);
        this.dataTable.renderRows();
      }
      this.ref.markForCheck();
    }*/
    this.pageChange.emit($event);
  }

  /**
   * Returns readable label for a data field
   */
  getLabel(name: string): string {
    let ret = '';
    this.displayFields.forEach((field) => {
      if (field.field === name) {
        ret = field.label ? field.label : field.field;
      }
    });
    return ret;
  }

  getColSpan(): number {
    return this.displayFields ? this.displayFields.length + 2 : 2;
  }
  /**
   * Check to see if a column is designed to be sortable
   */
  isSortable(name: string): boolean {
    let ret = false;
    this.displayFields.forEach((field) => {
      if (field.field === name) {
        ret = !!field.sortable;
      }
    });
    return ret;
  }

  isArray(data: unknown) {
    return Array.isArray(data);
  }

  /**
   * sets a flat array of the {@link DataProperty} fields
   */
  fetchTableFields(): void {
    this.displayColumns = [];
    this.displayFields = this.fieldsConfig.filter((field) => !!field.visible);
    if (!this.displayFields.length) {
      this.displayFields = this.fieldsConfig;
    }
    if (this.selectableRows) {
      this.displayColumns = ['select'].concat(
        this.displayFields.map((field) => field.field),
      );
      this.ref.detectChanges();
    } else {
      this.displayColumns = this.displayFields.map((field) => field.field);
      this.ref.detectChanges();
    }
    const defaultSort: DataProperty[] = this.fieldsConfig.filter(
      (field) => field.sorted,
    );
    if (defaultSort.length > 0 && this.data) {
      this._sort.sort({
        id: defaultSort[0].field,
        start: defaultSort[0].sorted ? defaultSort[0].sorted : 'asc',
        disableClear: true,
      });
      this.dataTable.renderRows();
    }
  }

  /**
   * get display columns
   * todo - probably unnecessary after the removal of the default buttons column
   */
  fetchDisplayColumns(): string[] {
    return this.displayColumns;
  }

  /**
   * forces to boolean a check to see if a field has a custom component associated with it
   * @param field
   */
  checkCustomComponent(field: DataProperty): boolean {
    return !!field.customComponent;
  }

  /**
   * creates a custom component inside a table field currently the specific field data, substance object and expanded row
   * container are sent to the custom component
   * todo: the comtainer and object should be optional fields
   * todo: table injected components need to implement an interface to get the substance or container
   * @param field
   */
  getCustomComponent(
    field: DataProperty
  ): ComponentPortal<unknown> | null {
    if (this.rowOutlet && field.customComponent) {
      const comp = this._injector.get<Type<unknown>>(field.customComponent);
      return new ComponentPortal(comp);
    } else {
      return null;
    }
  }

  /**
   * this fires once the custom comoponent above is created. Here is where listeners can be added to react to requests
   * from the injected component
   * this gives access to the injected component instance
   * @param component
   * @param index
   * @param field
   */
  componentAttached(component: CdkPortalOutletAttachedRef, index: number, field: DataProperty) {
    if(component ) {
      const compRef: ComponentRef<Record<string, unknown>> = component as ComponentRef<Record<string, unknown>>;
      if (compRef.instance['data'] === null && this.data[index][field.field]) {
        const dataField: string = field.field;
        const dataPoint: {[p: string]: DataProperty} = this.data[index];
        compRef.instance['data'] = <unknown>dataPoint[dataField];
      }

      if (compRef.instance['object']) {
        compRef.instance['object'] = this.data[index];
      }
      if (compRef.instance['container']) {
        compRef.instance['container'] = this.rowOutlet.toArray()[index];
      }
      if (compRef.instance['parent']) {
        compRef.instance['parent'] = this.data[index];
      }
      if (compRef.instance['clickEvent']) {
        const clickRef: Observable<MatRow> = compRef.instance['clickEvent'] as Observable<MatRow>;
        clickRef.subscribe((res: MatRow) => {
          this.cellClicked(res);
        });
      }
      if (compRef.instance['ref']) {
        // todo this is still problematic because injected components are redrawn.
        this.ref.detach();
      }
    }
  }

  /**
   * expand row on cell click
   * @param {MatRow} row
   */
  cellClicked(row: MatRow): void {
    this.expandedElement = this.expandedElement === row ? null : row;
  }

  /**
   * emit row when clicked on
   * @param {MatRow} row
   */
  rowClicked(row: MatRow): void {
    this.rowClick.emit(row);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
    this.ref.detectChanges();
  }
}
