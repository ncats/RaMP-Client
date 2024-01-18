import {
  ChangeDetectorRef,
  Component, DestroyRef, inject,
  OnInit
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Actions } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { SourceVersion } from '@ramp/models/ramp-models';
import { LoadRampActions, RampSelectors } from "@ramp/stores/ramp-store";
import { map, tap } from "rxjs";
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@angular/flex-layout/flex';


@Component({
    selector: 'ramp-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [
        FlexModule,
        MatCardModule,
        MatButtonModule,
        RouterLink,
        NgIf,
        NgFor,
    ],
})
export class HomeComponent implements OnInit {
  private readonly store = inject(Store);
  private actions$ = inject(Actions);

  destroyRef = inject(DestroyRef);

  sourceVersions!: Array<SourceVersion>;
  dbVersion!: string;
  dbUpdated!: string;
  databaseUrl!: string;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(LoadRampActions.loadRampStats())
    this.store
      .pipe(
        select(RampSelectors.getAllRamp),
        takeUntilDestroyed(this.destroyRef),
        map((data) => {
          if (data.sourceVersions) {
            this.sourceVersions = data.sourceVersions;
            if (this.sourceVersions.length > 0) {
              const first = this.sourceVersions[0];
              if (first.ramp_db_version) {
                this.dbVersion = first.ramp_db_version;
              }
              if (first.db_mod_date) {
                this.dbUpdated = first.db_mod_date;
              }
            }

            this.changeDetector.markForCheck();
          }
          if (data.databaseUrl) {
            this.databaseUrl = data.databaseUrl;
          }
        }),
      )
      .subscribe();
  }
}
