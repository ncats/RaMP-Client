import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { LoadingService } from '../loading/loading.service';
import { OntologyColumns } from './ontology-columns.constant';
import { Ontology } from './ontology.model';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { COMMA, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';
import {environment} from "../../environments/environment";

@Component({
  selector: 'ramp-ontologies',
  templateUrl: './ontologies.component.html',
  styleUrls: ['./ontologies.component.scss']
})
export class OntologiesComponent implements OnInit, OnDestroy, AfterViewInit {
  identifiersInput: string;
  queryType: 'bioOnto' | 'originOnto' | 'metaFromOnto' = 'metaFromOnto';
  private ontoQueryType = {
    bioOnto: 'biological',
    originOnto: 'originOnto'
  };
  results: Array<Ontology>;
  ontologiesInputformControl = new FormControl('');
  selectedOntologies: Array<string> = [];
  ontologyGroupedOptions: Array<{ group: string; ontologies: Array<Ontology> }>;
  @ViewChild('ontologiesInput', { static: false }) ontologiesInput: ElementRef<HTMLInputElement>;

  // tables columns
  displayedColumns: Array<string>;
  columns = OntologyColumns;

  // paging
  pagedData: Array<any> = [];
  page = 0;
  pageSize = 10;

  identifiersParams: Array<string>;

  // utilities
  selectedIndex = 0;
  errorMessage: string;
  apiBaseUrl: string;
  numSubmittedIds: number;
  numFoundIds: number;
  detailsPanelOpen = false;
  rFunctionPanelOpen = false;
  separatorKeysCodes: number[] = [COMMA, SEMICOLON];
  isReturnNoOptions = false;
  isLoadingOptions = false;
  subscriptions: Array<Subscription> = [];

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  ngOnInit(): void {
    this.displayedColumns = OntologyColumns.map(item => item.value);

    const subscription = this.ontologiesInputformControl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      ).subscribe(input => {
        if (!this.selectedOntologies || this.selectedOntologies.length === 0 || this.selectedOntologies.indexOf(input) === -1) {
          this.isReturnNoOptions = false;
          this.loadAutoCompleteOptions(input);
        }
      });

    this.subscriptions.push(subscription);
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadAutoCompleteOptions(input): void {
    this.isLoadingOptions = true;
    const url = `${this.apiBaseUrl}ontology-summaries`;

    const options = {
      params: {
        contains: input
      }
    };

    this.ontologyGroupedOptions = null;

    this.http.get<Array<Ontology>>(url, options).pipe(
      map(ontologies => {
        const group = new Map();
        ontologies.forEach(ontology => {
          const key = ontology.biofluidORcellular;
          const collection = group.get(key);
          if (!collection) {
            group.set(key, [ontology]);
          } else {
            collection.push(ontology);
          }
        });
        return group;
      })
    ).subscribe((groupedOntologies) => {
      this.isLoadingOptions = false;
      if (groupedOntologies.size > 0) {
        this.ontologyGroupedOptions = Array.from(groupedOntologies, element => {
          return {
            group: element[0],
            ontologies: element[1]
          };
        });
      } else {
        this.isReturnNoOptions = true;
      }
    }, error => {
      this.isLoadingOptions = false;
    });
  }

  selectOntology(ontology: MatAutocompleteSelectedEvent): void {
    if (this.selectedOntologies.indexOf(ontology.option.value) === -1) {
      this.selectedOntologies.push(ontology.option.value);
    }
    this.ontologiesInputformControl.setValue('', { emitEvent: false });
    this.ontologiesInput.nativeElement.value = '';
    this.ontologyGroupedOptions = [];
  }

  processAutocompleteInputEnd(inputEvent: MatChipInputEvent): void {
    if (this.ontologyGroupedOptions.length > 0) {
      for (let groupIndex = 0; 0 < this.ontologyGroupedOptions.length; groupIndex++) {
        for (let ontologyIndex = 0; this.ontologyGroupedOptions[groupIndex].ontologies.length; ontologyIndex++) {
          const ontologyName = this.ontologyGroupedOptions[groupIndex].ontologies[ontologyIndex].Ontology.toLocaleLowerCase();
          if (ontologyName === inputEvent.value.toLowerCase() && this.selectedOntologies.indexOf(inputEvent.value) === -1) {
            this.selectedOntologies.push(inputEvent.value);
            return;
          }
        }
      }
      this.ontologyGroupedOptions = [];
    }
  }

  removeOntology(ontology: string): void {
    const index = this.selectedOntologies.indexOf(ontology);
    this.selectedOntologies.splice(index, 1);
  }

  submitQuery(): void {
    this.isReturnNoOptions = false;
    this.errorMessage = '';
    this.selectedIndex = 0;
 //   this.loadingService.setLoadingState(true);
    let url: string;

    const options = {
      params: {}
    };

    if (this.queryType === 'metaFromOnto') {
      url = `${this.apiBaseUrl}metabolites`;
      this.identifiersParams = this.selectedOntologies;
      // tslint:disable-next-line:no-string-literal
      options.params['ontology'] = this.identifiersParams;
    } else {
      url = `${this.apiBaseUrl}ontologies`;
      this.identifiersParams = this.identifiersInput.toString().split(/\r\n|\r|\n/g);
      // tslint:disable-next-line:no-string-literal
      options.params['metabolite'] = this.identifiersParams;
      // tslint:disable-next-line:no-string-literal
      options.params['type'] = "biological"; //this.ontoQueryType[this.queryType];
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

  closeErrorMessage(): void {
    this.errorMessage = null;
  }
}
