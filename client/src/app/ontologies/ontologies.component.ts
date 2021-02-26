import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ConfigService } from '../config/config.service';
import { LoadingService } from '../loading/loading.service';
import { OntologyColumns } from './ontology-columns.constant';
import { Ontology } from './ontology.model';

@Component({
  selector: 'ramp-ontologies',
  templateUrl: './ontologies.component.html',
  styleUrls: ['./ontologies.component.scss']
})
export class OntologiesComponent implements OnInit {
  identifiersInput: string;
  queryType: 'ontoFromMeta' | 'metaFromOnto' = 'ontoFromMeta';
  results: Array<Ontology>;

  // tables columns
  displayedColumns: Array<string>;
  columns = OntologyColumns;

  // paging
  pagedData: Array<any> = [];
  page = 0;
  pageSize = 10;

  // utilities
  selectedIndex = 0;
  errorMessage: string;
  apiBaseUrl: string;
  numSubmittedIds: number;
  numFoundIds: number;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private configService: ConfigService
  ) {
    this.apiBaseUrl = configService.configData.apiBaseUrl;
  }

  ngOnInit(): void {
    this.displayedColumns = OntologyColumns.map(item => item.value);
  }

  submitQuery(): void {
    this.errorMessage = '';
    this.selectedIndex = 0;
    this.loadingService.setLoadingState(true);
    let url: string;
    const identifiers = this.identifiersInput.toString().split(/\r\n|\r|\n/g);

    const options = {
      params: {}
    };

    if (this.queryType === 'metaFromOnto') {
      url = `${this.apiBaseUrl}metabolites`;
      // tslint:disable-next-line:no-string-literal
      options.params['ontology'] = identifiers;
    } else {
      url = `${this.apiBaseUrl}ontologies`;
      // tslint:disable-next-line:no-string-literal
      options.params['metabolite'] = identifiers;
    }
    this.http.get<any>(url, options).subscribe(response => {
      this.numSubmittedIds =  response.numSubmittedIds;
      this.numFoundIds = response.numFoundIds;
      this.results = response.data;
      const sort: Sort = {
        active: 'Ontology',
        direction: 'asc'
      };
      this.sortData(sort);
      setTimeout(() => {
        this.loadingService.setLoadingState(false);
      }, 5);
      setTimeout(() => {
        this.selectedIndex = 1;
      }, 15);
    }, error => {
      this.errorMessage = 'There was a problem processing your request. Please review your input try again.';
      this.loadingService.setLoadingState(false);
    }, () => {
      this.loadingService.setLoadingState(false);
    });
  }

  pageChange(pageEvent?: PageEvent): void {

    if (pageEvent != null) {
      this.page = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    } else {
      this.page = 0;
    }
    const pagedData = [];
    const startIndex = this.page * this.pageSize;
    for (let i = startIndex; i < (startIndex + this.pageSize); i++) {
      if (this.results[i] != null) {
        pagedData.push(this.results[i]);
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

    this.results = this.results.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });

    this.pageChange();
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
