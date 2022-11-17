import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { SourceVersion } from "@ramp/models/ramp-models";
import { DataProperty } from "@ramp/shared/ui/ncats-datatable";
import { initAbout, RampFacade } from "@ramp/stores/ramp-store";
import { Subject, takeUntil, tap } from "rxjs";

@Component({
  selector: 'ramp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  /**
   * Behaviour subject to allow extending class to unsubscribe on destroy
   * @type {Subject<any>}
   */
  protected ngUnsubscribe: Subject<any> = new Subject();

  sourceVersions!: Array<SourceVersion>;
  dbVersion!: string;
  dbUpdated!: string;
  databaseUrl!: string;


  constructor(
    private changeDetector: ChangeDetectorRef,
    protected rampFacade: RampFacade
  ) {}

  ngOnInit(): void {
    this.rampFacade.dispatch(initAbout());
    this.rampFacade.allRampStore$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        tap((data) => {
          if (data.sourceVersions) {
            this.sourceVersions = data.sourceVersions;
            if(this.sourceVersions.length >0 ){
              const first = this.sourceVersions[0];
              if(first.ramp_db_version) {
                this.dbVersion = first.ramp_db_version;
              }
              if(first.db_mod_date) {
                this.dbUpdated = first.db_mod_date
              }
            }

            this.changeDetector.markForCheck();
          }
          if(data.databaseUrl) {
            this.databaseUrl = data.databaseUrl
          }
        })
      )
      .subscribe();
  }

  /**
   * clean up on leaving component
   */
  ngOnDestroy() {
    this.ngUnsubscribe.next("bye-bye");
    this.ngUnsubscribe.complete();
  }
}
