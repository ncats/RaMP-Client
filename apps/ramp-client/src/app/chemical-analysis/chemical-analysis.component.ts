import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AnalyteQueryBase } from '../analyte/analyte-query.abstract';
import { AnalyteMatch } from '../analyte/analyte.model';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading/loading.service';
import { ConfigService } from '../config/config.service';
import { AnalyteService } from '../analyte/analyte.service';
import { map } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  ChemicalAnalysisConstantColumns,
  ChemicalAnalysisDynamicColumns,
} from './chemical-analysis-columns.constant';
import {
  availableChemicalProperties,
  columnsToChemprops,
} from './availabe-chemical-properties.constant';

@Component({
  selector: 'ramp-chemical-analysis',
  templateUrl: './chemical-analysis.component.html',
  styleUrls: ['./chemical-analysis.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ChemicalAnalysisComponent
  extends AnalyteQueryBase
  implements OnInit
{
  availableChemicalProperties = availableChemicalProperties.slice();
  selectedProperties: Array<string> = [];
  missedQueryElements: Array<string> = [];

  // For showing R package calls
  metabolitesParameters!: Array<string>;
  chemicalPropertiesParameters: Array<string> = [];

  // data for tables
  chemicalProperties!: Array<any> | null;

  // tables columns
  displayedColumns!: Array<string>;
  activeColumns!: Array<{ value: string; display: string }>;
  constantColumns = ChemicalAnalysisConstantColumns;
  dynamicColumns = ChemicalAnalysisDynamicColumns;

  // paging
  pagedData: Array<any> = [];
  page = 0;
  pageSize = 10;

  // utilities
  selectedIndex = 0;
  errorMessage!: string | null;
  apiBaseUrl: string | undefined;
  expandedElement!: AnalyteMatch | null;
  detailsPanelOpen = false;
  rFunctionPanelOpen = false;
  missedElementsPanelOpen = false;

  constructor(
    public http: HttpClient,
    private loadingService: LoadingService,
    public configService: ConfigService,
    public analyteService: AnalyteService
  ) {
    super(http, configService, analyteService);
    this.apiBaseUrl = configService.configData.apiBaseUrl;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.selectedProperties = this.availableChemicalProperties.map(
      (item) => item.value
    );
  }

  findAnalytes(): void {
    this.errorMessage = '';
    this.selectedIndex = 0;
    this.loadingService.setLoadingState(true);
    const analytes = (
      this.analytesInput
        ? this.analytesInput.toString().split(/\r\n|\r|\n/g)
        : []
    ).filter((analyte) => analyte !== '');
    this.analyteService.findAnalytes(analytes, 'compound').subscribe(
      (response: Array<AnalyteMatch>) => {
        this.analyteMatches = this.setSelectedAnalyteMatches(response);
        this.loadingService.setLoadingState(false);
        this.selectedIndex = 1;
      },
      (error) => {
        this.errorMessage =
          'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
        this.loadingService.setLoadingState(false);
      },
      () => {
        this.chemicalProperties = null;
      }
    );
  }

  getChemicalProperties(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    const url = `${this.apiBaseUrl}metabolites/chemical-properties`;
    this.metabolitesParameters = [];
    this.setColumns();
    this.analyteMatches.forEach((item) => {
      if (item.analytes && item.analytes.length > 0) {
        item.analytes.forEach((analyte) => {
          if (analyte.isSelected) {
            //todo fix error
            // @ts-ignore
            this.metabolitesParameters = this.metabolitesParameters.concat(
              analyte.sourceIdsList
            );
          }
        });
      }
    });
    const options = {
      params: {
        metabolite: this.metabolitesParameters,
        property: this.selectedProperties,
      },
    };
    this.http
      .get<any>(url, options)
      .pipe(
        map((response) => {
          return response;
        })
      )
      .subscribe(
        (response: Array<any>) => {
          //todo fix error
          // @ts-ignore
          // tslint:disable-next-line:no-string-literal
          this.chemicalProperties = response['chem_props'] || [];
          //todo fix error
          // @ts-ignore
          this.chemicalProperties.map((prop) => {
            //todo fix error
            // @ts-ignore
            prop.input = this.analyteMatches.find(
              (match) => match.sourceIdsList.indexOf(prop.chem_source_id) > -1
            ).input;
            return prop;
          });
          //todo fix error
          // @ts-ignore
          // tslint:disable-next-line:no-string-literal
          this.missedQueryElements =
            response['query_report'] &&
            response['query_report']['missed_query_elements'];
          this.loadingService.setLoadingState(false);
          this.selectedIndex = 2;
        },
        (error) => {
          this.errorMessage =
            'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
          this.loadingService.setLoadingState(false);
        },
        () => {}
      );
  }

  setColumns(): void {
    this.activeColumns = this.constantColumns.slice();

    if (this.selectedProperties.length === 0) {
      this.activeColumns = this.activeColumns.concat(this.dynamicColumns);
    } else {
      const selectedColumns = this.dynamicColumns.filter(
        (column) =>
          this.selectedProperties.indexOf(columnsToChemprops[column.value]) > -1
      );
      this.activeColumns = this.activeColumns.concat(selectedColumns);
    }
    this.displayedColumns = this.activeColumns.map((item) => item.value);
  }

  pageChange(data: Array<any> = [], pageEvent?: PageEvent): void {
    if (pageEvent != null) {
      this.page = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    } else {
      this.page = 0;
    }
    const pagedData = [];
    const startIndex = this.page * this.pageSize;
    for (let i = startIndex; i < startIndex + this.pageSize; i++) {
      if (data[i] != null) {
        pagedData.push(data[i]);
      } else {
        break;
      }
    }
    this.pagedData = pagedData;
  }

  sortData(allData: Array<any> = [], sort: Sort) {
    this.expandedElement = null;

    if (!sort.active || sort.direction === '') {
      return;
    }

    allData = allData.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });

    this.pageChange(allData);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  selectedTabChange(matTabChangeEvent: MatTabChangeEvent): void {
    this.errorMessage = '';
    this.detailsPanelOpen = false;
    this.rFunctionPanelOpen = false;
    switch (matTabChangeEvent.index) {
      case 1: {
        const sort: Sort = {
          active: 'numAnalytes',
          direction: 'desc',
        };
        this.sortData(this.analyteMatches, sort);
        break;
      }
      case 2: {
        const sort: Sort = {
          active: 'input',
          direction: 'asc',
        };
        //todo fix error
        // @ts-ignore
        this.sortData(this.chemicalProperties, sort);
        break;
      }
    }
  }

  expandRow(row: AnalyteMatch): AnalyteMatch | null {
    if (row.numAnalytes <= 1) {
      return null;
    } else {
      return (this.expandedElement = this.expandedElement === row ? null : row);
    }
  }

  closeErrorMessage(): void {
    this.errorMessage = null;
  }
}
