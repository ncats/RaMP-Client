import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {Metabolite, RampQuery} from "@ramp/models/ramp-models";
import {PageCoreComponent} from "@ramp/shared/ramp/page-core";
import {QueryPageComponent} from "@ramp/shared/ramp/query-page";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchMetabolitesFromOntologies, fetchOntologies, RampFacade} from "@ramp/stores/ramp-store";
import {debounceTime, distinctUntilChanged, map} from "rxjs";

@Component({
  selector: 'ramp-metabolites-from-ontologies',
  templateUrl: './metabolites-from-ontologies.component.html',
  styleUrls: ['./metabolites-from-ontologies.component.scss']
})
export class MetabolitesFromOntologiesComponent extends PageCoreComponent implements OnInit {
  metaboliteRaw!: Metabolite[];
  allOntoFilterCtrl: FormControl = new FormControl();
  metaboliteColumns: DataProperty[] = [
    new DataProperty({
      label: "Ontology",
      field: "ontology",
      sortable: true
    }),
    new DataProperty({
      label: "Ontology Type",
      field: "ontologyCategory",
      sortable: true
    }),
    new DataProperty({
      label: "Metabolite",
      field: "metabolites",
      sortable: true
    }),
    new DataProperty({
      label: "Metabolite IDs",
      field: "metIds",
      sortable: true
    })
  ]
  query!: RampQuery;
  dataAsDataProperty!: { [key: string]: DataProperty }[];
  ontologies!: any[];
  allOntologies!: any[];
  selectedOntologies: any [] = [];
  globalFilter?: string;

//  columns = ['select', 'ontology', 'count'];

  constructor(
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade,
    protected route: ActivatedRoute
  ) {
    super(route);
  }


  ngOnInit(): void {
    console.log(this);
    this.rampFacade.dispatch(fetchOntologies());
   /* this.typeaheadCtrl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(term => this.rampFacade.dispatch(fetchOntologies()));
*/
    this.allOntoFilterCtrl.valueChanges.pipe(
      distinctUntilChanged()
    )
      .subscribe(term => {
        console.log(term)
        if(term.trim() && term.trim().length > 0) {
          this.ontologies = [];
          var matcher = new RegExp(term.trim(), "i");
          this.allOntologies.forEach(onto => {
            const newVal = {...onto}
            newVal.values = newVal.values.filter((val: { value: any; }) => matcher.test(val.value));
            if (newVal.values && newVal.values.length > 0) {
              this.ontologies.push(newVal);
            }
          })
          this.globalFilter = term;
          this.ref.markForCheck();
        } else {
          this.ontologies = this.allOntologies;
        }
      })

    this.rampFacade.ontologiesList$.pipe(
      map((res: any) => {
        if (res && res.data) {
          this.ontologies = res.data.map((ont: { ontologyType: string; values: any[], count: number }) => {
            return {
            ontologyType: ont.ontologyType,
            values: ont.values.map(val => val = {value: val.ontology, source: ont.ontologyType, count: val.count})
              .sort((a,b) => b.count - a.count)
          }});
          this.allOntologies = this.ontologies;
          this.ref.markForCheck();
        }
    })).subscribe();

    this.rampFacade.metabolites$.subscribe((res: {data: Metabolite[], query: RampQuery }| undefined) => {
      if (res && res.data) {
        this.dataAsDataProperty = res.data.map((metabolite: Metabolite) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(metabolite).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
      }
      if (res && res.query) {
        this.query = res.query;
      }
      this.ref.markForCheck();
    })
  }

  setValues(values: any) {
    if(values.added) {
      this.selectedOntologies = Array.from(new Set(this.selectedOntologies.concat(values.added)));
    }
    if(values.removed) {
      values.removed.forEach((val: { value: any; })=> this.selectedOntologies = this.selectedOntologies.filter(ont => ont.value !== val.value))
    }
      console.log(this.selectedOntologies);
  }

  fetchMetabolites(event: string[]): void {
    const ontologiesList = this.selectedOntologies.map(ont => ont.value)
    console.log(ontologiesList);
    this.rampFacade.dispatch(fetchMetabolitesFromOntologies({ontologies: ontologiesList}))
  }
}
