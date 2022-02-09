import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TREE_VIEWER_COMPONENT} from "@ramp/features/ramp/chemical-enrichment";
import {ChemicalEnrichment, Classes, RampQuery} from "@ramp/models/ramp-models";
import {PageCoreComponent} from "@ramp/shared/ramp/page-core";
import {DataProperty} from "@ramp/shared/ui/ncats-datatable";
import {fetchClassesFromMetabolites, fetchEnrichmentFromMetabolites, RampFacade} from "@ramp/stores/ramp-store";

@Component({
  selector: 'ramp-chemical-enrichment',
  templateUrl: './chemical-enrichment.component.html',
  styleUrls: ['./chemical-enrichment.component.scss']
})
export class ChemicalEnrichmentComponent extends PageCoreComponent implements OnInit {
  enrichmentRaw!: ChemicalEnrichment[];
  enrichmentColumns: DataProperty[] = [
    new DataProperty({
      label: "Pathway Name",
      field: "pathwayName",
      sortable: true
    }),
    /*    new DataProperty({
          label: "Pathway Category",
          field: "pathwayCategory",
          sortable: true
        }),*/
    new DataProperty({
      label: "Pathway Type",
      field: "pathwayType",
      sortable: true
    }),
    new DataProperty({
      label: "enrichment Name",
      field: "enrichmentName",
      sortable: true
    }),
    new DataProperty({
      label: "Source enrichment ID",
      field: "sourceenrichmentIDs",
      sortable: true
    }),
    new DataProperty({
      label: "enrichment Class",
      field: "geneOrCompound",
      sortable: true
    }),
  ];
  classesColumns: DataProperty[] = [
    //todo this isn't sortable
    new DataProperty({
      label: "Source ID",
      field: "sourceId"
    }),
    new DataProperty({
      label: "ClassyFire Classes",
      field: "classyFireTree",
      customComponent: TREE_VIEWER_COMPONENT
    }),
    new DataProperty({
      label: "LIPIDMAPS Classes",
      field: "lipidMapsTree",
      customComponent: TREE_VIEWER_COMPONENT
    })
  ];
  classesLoading = false;
  enrichmentLoading = false;

  query!: RampQuery;

  matches = 0;
  dataAsDataProperty!: { [key: string]: DataProperty }[];
  classesAsDataProperty!: { [key: string]: DataProperty }[];

  constructor(
    private ref: ChangeDetectorRef,
    private rampFacade: RampFacade,
    protected route: ActivatedRoute
  ) {
    super(route);
  }


  ngOnInit(): void {
    this.rampFacade.chemicalEnrichment$.subscribe((res: ChemicalEnrichment[] | undefined) => {
      if (res && res.length) {
        this.enrichmentRaw = res;
        //  this.matches = new Set([...res.map(obj => obj.pathwayName)]).size
        this.dataAsDataProperty = res.map((enrichment: ChemicalEnrichment) => {
          const newObj: { [key: string]: DataProperty } = {};
          Object.entries(enrichment).map((value: any, index: any) => {
            newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
          });
          return newObj;
        })
        this.enrichmentLoading = false;
        this.ref.markForCheck()
      }
    })

    this.rampFacade.classes$.subscribe((res: {data: Classes[], query: RampQuery} | undefined) => {
      if (res && res.data) {
        this._mapClasses(res.data);
      }
      if (res && res.query) {
        this.query = res.query;
      }
      this.classesLoading = false;
      this.ref.markForCheck();
    })

  }

  fetchEnrichment(event: string[]): void {
    this.classesLoading = true;
    this.rampFacade.dispatch(fetchClassesFromMetabolites({metabolites: event}))
    this.enrichmentLoading = true;
    this.rampFacade.dispatch(fetchEnrichmentFromMetabolites({metabolites: event}))
  }

  private _mapClasses(data: any): void {
    this.classesAsDataProperty = data.map((obj: Classes) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(obj).map((value: any, index: any) => {
        newObj[value[0]] = new DataProperty({name: value[0], label: value[0], value: value[1]});
      });
      return newObj;
    })
  }

}
