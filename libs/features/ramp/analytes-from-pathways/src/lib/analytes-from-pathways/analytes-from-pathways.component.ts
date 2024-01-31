import { TitleCasePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { select } from '@ngrx/store';
import { Analyte, RampResponse } from '@ramp/models/ramp-models';
import { InputRowComponent } from '@ramp/shared/ramp/input-row';
import { PageCoreComponent } from '@ramp/shared/ramp/page-core';
import { QueryPageComponent } from '@ramp/shared/ramp/query-page';
import { DescriptionComponent } from '@ramp/shared/ui/description-panel';
import { FeedbackPanelComponent } from '@ramp/shared/ui/feedback-panel';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import {
  AnalyteFromPathwayActions,
  RampSelectors,
} from '@ramp/stores/ramp-store';
import { map } from 'rxjs';

@Component({
  selector: 'ramp-analytes-from-pathways',
  templateUrl: './analytes-from-pathways.component.html',
  styleUrls: ['./analytes-from-pathways.component.scss'],
  standalone: true,
  imports: [
    DescriptionComponent,
    InputRowComponent,
    FeedbackPanelComponent,
    QueryPageComponent,
    TitleCasePipe,
  ],
})
export class AnalytesFromPathwaysComponent
  extends PageCoreComponent
  implements OnInit
{
  analyteColumns: DataProperty[] = [
    new DataProperty({
      label: 'Pathway Name',
      field: 'pathwayName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway Type',
      field: 'pathwayType',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte Name',
      field: 'analyteName',
      sortable: true,
    }),
    new DataProperty({
      label: 'Source Analyte ID',
      field: 'sourceAnalyteIDs',
      sortable: true,
    }),
    new DataProperty({
      label: 'Analyte Class',
      field: 'geneOrCompound',
      sortable: true,
    }),
    new DataProperty({
      label: 'Pathway ID',
      field: 'pathwayId',
      sortable: true,
    }),
  ];

  override fuzzy = true;

  constructor(private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit(): void {
    this._getSupportedIds();
    this.store
      .pipe(
        select(RampSelectors.getAnalytes),
        takeUntilDestroyed(this.destroyRef),
        map((res: RampResponse<Analyte> | undefined) => {
          if (res && res.data) {
            this._mapData(res.data);
            this.matches = Array.from(
              new Set(
                res.data.map((analyte: Analyte) =>
                  analyte.pathwayName.toLocaleLowerCase(),
                ),
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
                'fetchAnalytesFromPathways-download.tsv',
              );
              this.downloadQueued = false;
            }
          }
          this.ref.markForCheck();
        }),
      )
      .subscribe();
  }

  fetchAnalytes(event: string[]): void {
    this.inputList = event.map((item) => item.toLocaleLowerCase());
    this.store.dispatch(
      AnalyteFromPathwayActions.fetchAnalytesFromPathways({ pathways: event }),
    );
  }

  fetchAnalytesFile(event: string[]): void {
    if (!this.dataframe) {
      this.fetchAnalytes(event);
      this.downloadQueued = true;
    } else {
      this._downloadFile(
        this._toTSV(this.dataframe),
        'fetchAnalytesFromPathways-download.tsv',
      );
    }
  }
}
