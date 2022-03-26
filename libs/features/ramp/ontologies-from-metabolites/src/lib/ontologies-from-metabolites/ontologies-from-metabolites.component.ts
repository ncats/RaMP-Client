import { DOCUMENT } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component, Inject,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Ontology, RampQuery } from '@ramp/models/ramp-models';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  fetchOntologiesFromMetabolites,
  RampFacade,
} from '@ramp/stores/ramp-store';
import { takeUntil } from "rxjs";

@Component({
  selector: 'ramp-ontologies-from-metabolites',
  templateUrl: './ontologies-from-metabolites.component.html',
  styleUrls: ['./ontologies-from-metabolites.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OntologiesFromMetabolitesComponent
  extends PageCoreComponent
  implements OnInit
{
  ontologyColumns: DataProperty[] = [
    new DataProperty({
      label: 'Metabolites',
      field: 'metabolites',
      sortable: true,
    }),
    new DataProperty({
      label: 'Ontology',
      field: 'ontology',
      sortable: true,
    }),
    new DataProperty({
      label: 'Ontology Type',
      field: 'HMDBOntologyType',
      sortable: true,
    }),
    new DataProperty({
      label: 'Source ID',
      field: 'sourceId',
      sortable: true,
    }),
  ];

  constructor(
    private ref: ChangeDetectorRef,
    protected rampFacade: RampFacade,
    protected route: ActivatedRoute,
    @Inject(DOCUMENT) protected dom: Document,
  ) {
    super(route, rampFacade, dom);
  }

  ngOnInit(): void {
    this.rampFacade.ontologies$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
      (res: { data: Ontology[]; query: RampQuery, dataframe: any } | undefined) => {
        if (res && res.data) {
          this._mapData(res.data);
          this.matches = Array.from(new Set(res.data.map(onto => onto.sourceId.toLocaleLowerCase())));
          this.noMatches = this.inputList.filter((p:string) => !this.matches.includes(p.toLocaleLowerCase()));
        }
        if (res && res.query) {
          this.query = res.query;
        }
        if (res && res.dataframe) {
          this.dataframe = res.dataframe;
          if (this.downloadQueued) {
            this._downloadFile(this._toTSV(this.dataframe), 'fetchOntologiesFromMetabolitesFile-download.tsv')
            this.downloadQueued = false;
          }
        }
        this.ref.markForCheck();
      }
    );
  }

  fetchOntologies(event: string[]): void {
    this.inputList = event.map(item => item.toLocaleLowerCase());
    this.rampFacade.dispatch(
      fetchOntologiesFromMetabolites({ analytes: event })
    );
  }

  fetchOntologiesFile(event: string[]): void {
    if(!this.dataframe) {
      this.fetchOntologies(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(this._toTSV(this.dataframe), 'fetchOntologiesFromMetabolitesFile-download.tsv')
    }
  }

  private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((obj: Ontology) => {
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
