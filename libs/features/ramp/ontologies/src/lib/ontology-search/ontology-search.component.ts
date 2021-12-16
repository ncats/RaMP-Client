import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import {Ontology} from "@ramp/models/ramp-models";
import {QueryPageComponent} from "@ramp/shared/ramp/query-page";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchOntologiesFromMetabolites, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-ontology-search',
  templateUrl: './ontology-search.component.html',
  styleUrls: ['./ontology-search.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OntologySearchComponent extends QueryPageComponent implements OnInit {

  ontologyRaw!: Ontology[];
  ontologyColumns: DataProperty[] = [
    new DataProperty({
      label: "ID Type",
      field: "idType",
      sortable: true
    }),
    new DataProperty({
      label: "Metabolites",
      field: "metabolites",
      sortable: true
    }),
    new DataProperty({
      label: "Ontology",
      field: "ontology",
      sortable: true
    }),
    new DataProperty({
      label: "Ontology Type",
      field: "HMDBOntologyType",
      sortable: true
    }),
    new DataProperty({
      label: "Source ID",
      field: "sourceId",
      sortable: true
    }),
  ]

  constructor(
     route: ActivatedRoute,
     sanitizer: DomSanitizer,
     private ref: ChangeDetectorRef,
     private rampFacade: RampFacade
  ) {
    super(route, sanitizer);
  }


  ngOnInit(): void {
    super.ngOnInit();

    this.rampFacade.ontologies$.subscribe((res: Ontology[] | undefined) => {
      if (res && res.length) {
        this.ontologyRaw = res;
        this.matches = new Set([...res.map(ont => ont.sourceId)]).size
        this.dataAsDataProperty = res.map((ontology: Ontology) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(ontology).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        this.ref.markForCheck()
      }
    })
  }

  fetchOntologies(): void {
    this.parseInput();
    this.rampFacade.dispatch(fetchOntologiesFromMetabolites({analytes: this.retArr}))
  }
}
