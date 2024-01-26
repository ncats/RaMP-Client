import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from '@ngrx/store';
import { Pathway, RampResponse } from '@ramp/models/ramp-models';
import { InputRowComponent } from '@ramp/shared/ramp/input-row';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { QueryPageComponent } from '@ramp/shared/ramp/query-page';
import { DescriptionComponent } from '@ramp/shared/ui/description-panel';
import { FeedbackPanelComponent } from '@ramp/shared/ui/feedback-panel';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  PathwayFromAnalyteActions,
  RampSelectors,
} from '@ramp/stores/ramp-store';
import { map } from 'rxjs';

@Component({
  selector: 'ramp-pathways-from-analytes',
  templateUrl: './pathways-from-analytes.component.html',
  styleUrls: ['./pathways-from-analytes.component.scss'],
  standalone: true,
  imports: [
    DescriptionComponent,
    InputRowComponent,
    FeedbackPanelComponent,
    QueryPageComponent,
    TitleCasePipe,
  ],
})
export class PathwaysFromAnalytesComponent
  extends PageCoreComponent
  implements OnInit
{
  pathwayColumns: DataProperty[] = [
    new DataProperty({
      label: 'Input ID',
      field: 'inputId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway',
      field: 'pathwayName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Source',
      field: 'pathwaySource',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Source ID',
      field: 'pathwayId',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte Name',
      field: 'commonName',
      sortable: true,
    }),
  ];

  constructor() {
    super();
  }

  ngOnInit(): void {
    this._getSupportedIds();
    this.store
      .pipe(
        select(RampSelectors.getPathways),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Pathway> | undefined) => {
          if (res && res.data) {
            this._mapData(res.data);
            this.matches = Array.from(
              new Set(
                res.data.map((pathway) => pathway.inputId.toLocaleLowerCase()),
              ),
            );
            this.noMatches = this.inputList.filter(
              (p: string) => !this.matches.includes(p.toLocaleLowerCase()),
            );
          }
          if (res && res.query) {
            this.query = res.query;
          }
          if (res && res.dataframe) {
            this.dataframe = res.dataframe;
            if (this.downloadQueued) {
              this._downloadFile(
                this._toTSV(this.dataframe),
                'fetchPathwaysFromAnalytes-download.tsv',
              );
              this.downloadQueued = false;
            }
          }
        }),
      )
      .subscribe();
    this.changeRef.detectChanges();
  }

  fetchPathways(event: string[]): void {
    this.inputList = event.map((item) => (item = item.toLocaleLowerCase()));
    this.store.dispatch(
      PathwayFromAnalyteActions.fetchPathwaysFromAnalytes({ analytes: event }),
    );
  }

  fetchPathwaysFile(event: string[]): void {
    if (!this.dataframe) {
      this.fetchPathways(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(
        this._toTSV(this.dataframe),
        'fetchPathwaysFromAnalytes-download.tsv',
      );
    }
  }

  /*private _mapData(data: any): void {
    this.dataAsDataProperty = data.map((analyte: Pathway) => {
      const newObj: { [key: string]: DataProperty } = {};
      Object.entries(analyte).map((value: any) => {
        newObj[value[0]] = new DataProperty({
          name: value[0],
          label: value[0],
          value: value[1],
        });
      });
      return newObj;
    });
  }*/
}
