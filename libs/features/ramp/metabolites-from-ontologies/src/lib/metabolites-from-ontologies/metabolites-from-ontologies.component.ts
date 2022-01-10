import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Metabolite, RampQuery} from "@ramp/models/ramp-models";
import {QueryPageComponent} from "@ramp/shared/ramp/query-page";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchMetabolitesFromOntologies, fetchOntologies, RampFacade} from "@ramp/stores/ramp-store";
import {debounceTime, distinctUntilChanged, map} from "rxjs";

@Component({
  selector: 'ramp-metabolites-from-ontologies',
  templateUrl: './metabolites-from-ontologies.component.html',
  styleUrls: ['./metabolites-from-ontologies.component.scss']
})
export class MetabolitesFromOntologiesComponent implements OnInit {
  metaboliteRaw!: Metabolite[];
  metaboliteColumns: DataProperty[] = [
    new DataProperty({
      label: "Ontology",
      field: "ontology",
      sortable: true
    }),
    new DataProperty({
      label: "Ontology Type",
      field: "hmdbOntologyType",
      sortable: true
    }),
    new DataProperty({
      label: "Metabolite",
      field: "metabolites",
      sortable: true
    }),
    new DataProperty({
      label: "Source ID",
      field: "sourceId",
      sortable: true
    })
  ]
  query!: RampQuery;
  dataAsDataProperty!: { [key: string]: DataProperty }[];

  typeaheadCtrl: FormControl = new FormControl();

  constructor(
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade
  ) {
  }


  ngOnInit(): void {
    this.rampFacade.dispatch(fetchOntologies());
   /* this.typeaheadCtrl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(term => this.rampFacade.dispatch(fetchOntologies()));
*/
    this.rampFacade.ontologiesList$.pipe(
      map(res => {
        console.log(res);
        return res;
    })).subscribe();

    this.rampFacade.metabolites$.subscribe((res: {data: Metabolite[], query: RampQuery }| undefined) => {
      if (res && res.data) {
        this.metaboliteRaw = res.data;
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

  fetchMetabolites(event: string[]): void {
    this.rampFacade.dispatch(fetchMetabolitesFromOntologies({ontologies: event}))
  }
}
