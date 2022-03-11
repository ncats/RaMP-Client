import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { TREE_VIEWER_COMPONENT } from '@ramp/features/ramp/chemical-enrichment';
import {
  ChemicalEnrichment,
  Classes,
  RampQuery,
} from '@ramp/models/ramp-models';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  fetchClassesFromMetabolites,
  fetchClassesFromMetabolitesFile,
  fetchEnrichmentFromMetabolites,
  fetchEnrichmentFromMetabolitesFile,
  filterEnrichmentFromMetabolites,
  filterEnrichmentFromPathways,
  RampFacade
} from "@ramp/stores/ramp-store";
import { takeUntil } from "rxjs";

@Component({
  selector: 'ramp-chemical-enrichment',
  templateUrl: './chemical-enrichment.component.html',
  styleUrls: ['./chemical-enrichment.component.scss'],
})
export class ChemicalEnrichmentComponent
  extends PageCoreComponent
  implements OnInit
{
  pValueFormCtrl: FormControl = new FormControl(0.2);
  pValueTypeFormCtrl: FormControl = new FormControl('fdr');

  enrichmentColumns: DataProperty[] = [
    new DataProperty({
      label: 'Category',
      field: 'category',
      sortable: true,
      sorted: 'asc'
    }),
    new DataProperty({
      label: 'Class Name',
      field: 'class_name',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite Hits',
      field: 'met_hits',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pop hits',
      field: 'pop_hits',
      sortable: true,
    }),
    new DataProperty({
      label: 'Metabolite Count',
      field: 'met_size',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pop Count',
      field: 'pop_size',
      sortable: true,
    }),
    new DataProperty({
      label: 'P Value',
      field: 'p_value',
      sortable: true,
      displayType: 'string'
    }),
    new DataProperty({
      label: 'adjP_BH',
      field: 'adjP_BH',
      sortable: true,
      displayType: 'string'
    })
  ];
  classesColumns: DataProperty[] = [
    new DataProperty({
      label: 'Source IDs',
      field: 'sourceId',
      sortable: true
    }),
    new DataProperty({
      label: 'Names',
      field: 'commonNames'
    }),
    new DataProperty({
      label: 'ClassyFire Super Class',
      field: 'classyFireSuperClass',
      sortable: true
    }),
    new DataProperty({
      label: 'ClassyFire Class',
      field: 'classyFireClass',
      sortable: true
    }),
    new DataProperty({
      label: 'ClassyFire Sub Class',
      field: 'classyFireSubClass',
      sortable: true
    }),
    new DataProperty({
      label: 'LIPIDMAPS Category',
      field: 'lipidMapsCategory',
      sortable: true
    }),
    new DataProperty({
      label: 'LIPIDMAPS Main Class',
      field: 'lipidMapsMainClass',
      sortable: true
    }),
    new DataProperty({
      label: 'LIPIDMAPS Sub Class',
      field: 'lipidMapsSubClass',
      sortable: true
    }),
  ];
  classesLoading = false;
  enrichmentLoading = false;

  classesAsDataProperty: { [key: string]: DataProperty }[] = [];

  constructor(
    private ref: ChangeDetectorRef,
    protected rampFacade: RampFacade,
    protected route: ActivatedRoute
  ) {
    super(route, rampFacade);
  }

  ngOnInit(): void {
    this.rampFacade.chemicalEnrichment$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      (res: {data: ChemicalEnrichment[] }| undefined) => {
        if (res && res.data) {
          //  this.matches = new Set([...res.map(obj => obj.pathwayName)]).size
          this.dataAsDataProperty = res.data.map(
            (enrichment: ChemicalEnrichment) => {
              const newObj: { [key: string]: DataProperty } = {};
              Object.entries(enrichment).map((value: any, index: any) => {
                newObj[value[0]] = new DataProperty({
                  name: value[0],
                  label: value[0],
                  value: value[1]
                });
              });
              return newObj;
            }
          );
          this.enrichmentLoading = false;
          this.ref.markForCheck();
        }
      }
    );

    this.rampFacade.classes$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      (res: { data: Classes[]; query: RampQuery } | undefined) => {
        if (res && res.data) {
          this._mapClasses(res.data);
          this.matches = Array.from(new Set(res.data.map(classes => classes.sourceId.toLocaleLowerCase())));
          this.noMatches = this.inputList.filter((p:string) => !this.matches.includes(p.toLocaleLowerCase()));
        }
        if (res && res.query) {
          this.query = res.query;
        }
        this.classesLoading = false;
        this.ref.markForCheck();
      }
    );
  }

  fetchEnrichment(event: string[]): void {
    this.classesLoading = true;
    this.inputList = event.map(item => item.toLocaleLowerCase());
    this.rampFacade.dispatch(
      fetchClassesFromMetabolites({ metabolites: event })
    );
    this.enrichmentLoading = true;
    this.rampFacade.dispatch(
      fetchEnrichmentFromMetabolites({ metabolites: event })
    );
  }

  fetchClassesFile(): void {
    this.rampFacade.dispatch(
      fetchClassesFromMetabolitesFile({ metabolites: this.inputList, format: 'tsv' })
    );
  }

  fetchEnrichedClassesFile(): void {
    this.rampFacade.dispatch(
      fetchEnrichmentFromMetabolitesFile({ metabolites: this.inputList, format: 'tsv' })
    );
  }

  filterEnrichments() {
    this.enrichmentLoading = true;
    this.rampFacade.dispatch(
      filterEnrichmentFromMetabolites({
        pval_cutoff: this.pValueFormCtrl.value,
        pval_type: this.pValueTypeFormCtrl.value
      })
    )
  }

  private _mapClasses(data: any): void {
    this.classesAsDataProperty = data.map((obj: Classes) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(obj).map((value: any, index: any) => {
        newObj[value[0]] = new DataProperty({
          name: value[0],
          label: value[0],
          value: value[1],
        });
      });
      return newObj;
    });
  }
}
