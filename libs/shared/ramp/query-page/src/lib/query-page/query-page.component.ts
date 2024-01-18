import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChange,
} from '@angular/core';
import { DataProperty } from '@ramp/shared/ui/ncats-datatable';
import { NcatsDatatableComponent } from '../../../../../ui/ncats-datatable/src/lib/ncats-datatable/ncats-datatable.component';
import { FlexModule } from '@angular/flex-layout/flex';
import { NgIf } from '@angular/common';

@Component({
    selector: 'ramp-query-page',
    templateUrl: './query-page.component.html',
    styleUrls: ['./query-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        FlexModule,
        NcatsDatatableComponent,
    ],
})
export class QueryPageComponent implements OnChanges {
  @Input() dataColumns!: DataProperty[];
  @Input() dataAsDataProperty!: { [key: string]: DataProperty }[];
  noDataArr = false;

  ngOnChanges(change: { [n: string]: SimpleChange }) {
    if (change['dataAsDataProperty'] && !change['dataAsDataProperty'].firstChange) {
      if (
        !this.dataAsDataProperty.length ||
        this.dataAsDataProperty.length === 0
      ) {
        this.noDataArr = true;
      }
    }
  }
}
