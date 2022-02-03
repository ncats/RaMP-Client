import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Ontology, RampQuery} from "@ramp/models/ramp-models";
import {PageCoreComponent} from "@ramp/shared/ramp/page-core";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {
  fetchOntologiesFromMetabolites,
  fetchOntologiesFromMetabolitesFile,
  RampFacade
} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-ontologies-from-metabolites',
  templateUrl: './ontologies-from-metabolites.component.html',
  styleUrls: ['./ontologies-from-metabolites.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OntologiesFromMetabolitesComponent extends PageCoreComponent implements OnInit {
  ontologyColumns: DataProperty[] = [
/*    new DataProperty({
      label: "ID Type",
      field: "idType",
      sortable: true
    }),*/
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
  query!: RampQuery;
  dataAsDataProperty!: { [key: string]: DataProperty }[];
/*  supportedIds!: {
    metabolites: string[],
    genes: string[]
  } | undefined;*/

  constructor(
     private ref: ChangeDetectorRef,
     private rampFacade: RampFacade,
     protected route: ActivatedRoute
  ) {
    super(route);
  }


  ngOnInit(): void {
/*
    this.rampFacade.supportedIds$.subscribe(ids => {
      this.supportedIds = ids
      this.ref.markForCheck()
    })
*/

    this.rampFacade.ontologies$.subscribe((res: {data: Ontology[], query: RampQuery} | undefined) => {
      if (res && res.data) {
        this._mapData(res.data);
      }
      if (res && res.query) {
        this.query = res.query;
      }
      this.ref.markForCheck();
    })
  }

  fetchOntologies(event: string[]): void {
    this.rampFacade.dispatch(fetchOntologiesFromMetabolites({analytes: event}))
  }

  fetchOntologiesFile(event: string[]): void {
    this.rampFacade.dispatch(fetchOntologiesFromMetabolitesFile({metabolite: event, format: 'tsv'}))
  }

  private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((obj: Ontology) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(obj).map((value: any, index: any) => {
        newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
      });
      return newObj;
    })
  }
}
