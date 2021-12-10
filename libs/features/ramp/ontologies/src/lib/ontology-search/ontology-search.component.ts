import {COMMA, SEMICOLON} from "@angular/cdk/keycodes";
import {HttpClient} from "@angular/common/http";
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent} from "@angular/material/chips";
import {PageEvent} from "@angular/material/paginator";
import {Sort} from "@angular/material/sort";
import {fetchOntologiesFromMetabolites, RampFacade} from "@ramp/stores/ramp-store";
import {debounceTime, distinctUntilChanged, map, Subscription} from "rxjs";
import {environment} from "../../../../../../../apps/ramp-client/src/environments/environment";

export interface Ontology {
  IDtype?: string;
  Metabolites?: string;
  Ontology: string;
  biofluidORcellular: string;
  sourceId?: string;
}

export const OntologyColumns: Array<{ value: string; display: string }> = [
  {
    value: 'IDtype',
    display: 'Id Type'
  },
  {
    value: 'Metabolites',
    display: 'Metabolites'
  },
  {
    value: 'Ontology',
    display: 'Ontology'
  },
  {
    value: 'biofluidORcellular',
    display: 'Biofluid Or Cellular'
  },
  {
    value: 'sourceId',
    display: 'Source Id'
  }
];

@Component({
  selector: 'ramp-ontology-search',
  templateUrl: './ontology-search.component.html',
  styleUrls: ['./ontology-search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OntologySearchComponent implements OnInit {
  inputFormCtrl: FormControl = new FormControl();

  identifiersInput!: string;
  queryType: 'bioOnto' | 'originOnto' | 'metaFromOnto' = 'metaFromOnto';
  private ontoQueryType = {
    bioOnto: 'biological',
    originOnto: 'originOnto'
  };
  results!: Array<Ontology>;
  ontologiesInputformControl = new FormControl('');
  selectedOntologies: Array<string> = [];
  ontologyGroupedOptions!: Array<{ group: string; ontologies: Array<Ontology> }>;
  @ViewChild('ontologiesInput', { static: false }) ontologiesInput!: ElementRef<HTMLInputElement>;

  // tables columns
  displayedColumns!: Array<string>;
  columns = OntologyColumns;

  // paging
  pagedData: Array<any> = [];
  page = 0;
  pageSize = 10;

  identifiersParams!: Array<string>;

  // utilities
  selectedIndex = 0;
  apiBaseUrl: string;
  numSubmittedIds!: number;
  numFoundIds!: number;
  detailsPanelOpen = false;
  rFunctionPanelOpen = false;
  separatorKeysCodes: number[] = [COMMA, SEMICOLON];
  isReturnNoOptions = false;
  isLoadingOptions = false;
  subscriptions: Array<Subscription> = [];

  constructor(
    private rampFacade: RampFacade,
    private http: HttpClient
  ) {
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  ngOnInit(): void {
    console.log("yyyyy");
    this.rampFacade.ontologies$.subscribe(res => {
      console.log(res);
    })
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

  fetchOntologies():void {
    console.log(this.inputFormCtrl.value);

    let retArr: string[];
    if (Array.isArray(this.inputFormCtrl.value)) {
      retArr = this.inputFormCtrl.value.map((val:string)=> val = val.trim());
    } else {
      retArr = this.inputFormCtrl.value.trim().split(/[\t\n,;]+/).map((val:string) => val.trim());
    }

    console.log(retArr);

    this.rampFacade.dispatch(fetchOntologiesFromMetabolites({analytes: retArr}))

  }
  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  loadAutoCompleteOptions(input: any): void {
    this.isLoadingOptions = true;
    const url = `${this.apiBaseUrl}ontology-summaries`;

    const options = {
      params: {
        contains: input
      }
    };

    this.ontologyGroupedOptions = [];

    this.http.get<Array<Ontology>>(url, options).pipe(
      map((ontologies: any[]) => {
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
    this.selectedIndex = 0;
    let url: string;

    const options = {
      params: {}
    };

    if (this.queryType === 'metaFromOnto') {
      url = `${this.apiBaseUrl}metabolites`;
      this.identifiersParams = this.selectedOntologies;
      // tslint:disable-next-line:no-string-literal
      // @ts-ignore
      options.params['ontology'] = this.identifiersParams;
    } else {
      url = `${this.apiBaseUrl}ontologies`;
      this.identifiersParams = this.identifiersInput.toString().split(/\r\n|\r|\n/g);
      // tslint:disable-next-line:no-string-literal
      // @ts-ignore
      options.params['metabolite'] = this.identifiersParams;
      // tslint:disable-next-line:no-string-literal
      // @ts-ignore
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
      setTimeout(() => {
        this.selectedIndex = 1;
      }, 15);
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
}
