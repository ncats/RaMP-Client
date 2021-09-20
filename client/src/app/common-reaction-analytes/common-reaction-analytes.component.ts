import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { LoadingService } from '../loading/loading.service';
import { AnalyteMatch } from '../analyte/analyte.model';
import { ReactionColumns } from './reaction-columns.constant';
import { Reaction } from './reaction.model';
import { AnalyteService } from '../analyte/analyte.service';
import { AnalyteQueryBase } from '../analyte/analyte-query.abstract';

@Component({
  selector: 'ramp-common-reaction-analytes',
  templateUrl: './common-reaction-analytes.component.html',
  styleUrls: ['./common-reaction-analytes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class CommonReactionAnalytesComponent extends AnalyteQueryBase implements OnInit {
  pathwaySourceIds: Array<string>;

  // data for tables
  reactions: Array<Reaction>;

  // tables columns
  reactionDisplayedColumns: Array<string>;
  reactionColumns = ReactionColumns;

  // paging
  pagedData: Array<any> = [];
  page = 0;
  pageSize = 10;

  // For showing R package calls
  analytesParameters: Array<string>;

  // utilities
  selectedIndex = 0;
  errorMessage: string;
  apiBaseUrl: string;
  expandedElement: AnalyteMatch | null;
  detailsPanelOpen = false;
  rFunctionPanelOpen = false;

  constructor(
    public http: HttpClient,
    private loadingService: LoadingService,
    public configService: ConfigService,
    public analyteService: AnalyteService
  ) {
    super(
      http,
      configService,
      analyteService
    );
    this.apiBaseUrl = configService.configData.apiBaseUrl;
  }

  ngOnInit(): void {
    this.reactionDisplayedColumns = this.reactionColumns.map(item => item.value);
    super.ngOnInit();
  }

  findAnalytes(): void {
    this.errorMessage = '';
    this.selectedIndex = 0;
    this.loadingService.setLoadingState(true);
    const analytes = (this.analytesInput ? this.analytesInput.toString().split(/\r\n|\r|\n/g) : []).filter(analyte => analyte !== '');
    this.analyteService.findAnalytes(analytes).subscribe((response: Array<AnalyteMatch>) => {
        this.analyteMatches = this.setSelectedAnalyteMatches(response);
        this.loadingService.setLoadingState(false);
        this.selectedIndex = 1;
      }, error => {
        this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
        this.loadingService.setLoadingState(false);
      }, () => {
        this.reactions = null;
      });
  }

  getCommonReactions(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    const url = `${this.apiBaseUrl}common-reaction-analytes`;
    // const analytes = this.analytesInput.toString().split(/\r\n|\r|\n/g);
    this.analytesParameters = [];
    this.analyteMatches.forEach(item => {
      if (item.analytes && item.analytes.length > 0) {
        item.analytes.forEach(analyte => {
          if (analyte.isSelected) {
            this.analytesParameters.push(analyte.sourceId);
          }
        });
      }
    });

    const options = {
      params: {
        analyte: this.analytesParameters,
      }
    };
    this.http.get<any>(url, options)
      .pipe(
        map(response => {
          return response;
        })
      )
      .subscribe((response: Array<Reaction>) => {
        this.reactions = response;
        setTimeout(() => {
          this.loadingService.setLoadingState(false);
        }, 5);
        setTimeout(() => {
          this.selectedIndex = 2;
        }, 15);
      }, error => {
        this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
        this.loadingService.setLoadingState(false);
      }, () => {});
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
    for (let i = startIndex; i < (startIndex + this.pageSize); i++) {
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
          direction: 'desc'
        };
        this.sortData(this.analyteMatches, sort);
        break;
      }
      case 2: {
        const sort: Sort = {
          active: this.analyteColumns[0].value,
          direction: 'asc'
        };
        this.sortData(this.reactions, sort);
        break;
      }
    }
  }

  expandRow(row: AnalyteMatch): AnalyteMatch {
    if (row.numAnalytes <= 1) {
      return null;
    } else {
      return this.expandedElement = this.expandedElement === row ? null : row;
    }
  }

  closeErrorMessage(): void {
    this.errorMessage = null;
  }

}
