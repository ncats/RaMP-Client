import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { LoadingService } from '../loading/loading.service';
import { Analyte } from './analyte.model';
import { Pathway } from '../pathway-enrichment-analysis/pathway.model';
import { PathwayMatch } from './pathway-match.model';
import { pathwayExampleInputs } from './pathways-examples.constant';
import {
  PathwayMatchesColumns,
  PathwayColumns,
  AnalyteColumns,
} from './pathway-columns.constant';

@Component({
  selector: 'ramp-analytes-from-pathway',
  templateUrl: './analytes-from-pathway.component.html',
  styleUrls: ['./analytes-from-pathway.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
      transition(
        'expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AnalytesFromPathwayComponent implements OnInit {
  // API parameters
  pathwaysInput!: string;
  pathwayCommonNames!: Array<string>;

  // for showing R function
  pathwaysParameters!: Array<string>;

  // data for tables
  pathwayMatches!: Array<PathwayMatch>;
  pathways!: Array<Pathway>;
  analytes!: Array<Analyte> | null;

  // tables columns
  pathwayMatchesDisplayedColumns!: Array<string>;
  pathwayMatchesColumns = PathwayMatchesColumns;
  pathwayDisplayedColumns!: Array<string>;
  pathwayColumns = PathwayColumns;
  analyteDisplayedColumns!: Array<string>;
  analyteColumns = AnalyteColumns;

  // paging
  pagedData: Array<any> = [];
  page = 0;
  pageSize = 10;

  // utilities
  selectedIndex = 0;
  errorMessage!: string | null;
  apiBaseUrl: string | undefined;
  expandedElement!: PathwayMatch | null;
  detailsPanelOpen = false;
  rFunctionPanelOpen = false;
  numFoundIds!: number;
  numSubmittedIds!: number;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private configService: ConfigService
  ) {
    this.apiBaseUrl = configService.configData.apiBaseUrl;
  }

  ngOnInit(): void {
    this.pathwayMatchesDisplayedColumns = this.pathwayMatchesColumns.map(
      (item) => item.value
    );
    this.pathwayDisplayedColumns = this.pathwayColumns.map(
      (item) => item.value
    );
    this.pathwayDisplayedColumns.unshift('isSelected');
    this.analyteDisplayedColumns = this.analyteColumns.map(
      (item) => item.value
    );
  }

  findPathways(): void {
    this.errorMessage = '';
    this.selectedIndex = 0;
    this.loadingService.setLoadingState(true);
    const url = `${this.apiBaseUrl}source/pathways`;
    const pathways = (
      this.pathwaysInput
        ? this.pathwaysInput.toString().split(/\r\n|\r|\n/g)
        : []
    ).filter((pathway) => pathway !== '');
    this.numSubmittedIds = pathways.length;
    const options = {
      params: {
        identifier: pathways,
      },
    };
    this.http
      .get<any>(url, options)
      .pipe(
        map((response: Array<Pathway>) => {
          this.numFoundIds = 0;
          const pathwayMatches: Array<PathwayMatch> = [];
          const pathwaysLower: Array<string> = [];

          pathways.forEach((pathwayItendifier) => {
            const pathwayLower = pathwayItendifier.toLowerCase();
            pathwaysLower.push(pathwayLower);
            const analyteMatch: PathwayMatch = {
              input: pathwayItendifier,
              pathwayRampIdList: [],
              pathwaySourceList: [],
              pathwaySources: '',
              pathwayCategoryList: [],
              pathwayCategories: '',
              numPathways: 0,
              pathwayName: '',
              pathways: [],
            };

            pathwayMatches.push(analyteMatch);
          });

          response.forEach((pathway) => {
            let index = pathwaysLower.indexOf(
              pathway.pathwaysourceId.toLowerCase()
            );
            if (index === -1) {
              index = pathwaysLower.indexOf(pathway.pathwayName.toLowerCase());
            }
            if (index > -1) {
              this.numFoundIds++;
              if (
                pathwayMatches[index].pathwayRampIdList.indexOf(
                  pathway.pathwayRampId
                ) === -1
              ) {
                pathwayMatches[index].pathwayRampIdList.push(
                  pathway.pathwayRampId
                );
                pathwayMatches[index].numPathways++;
                pathway.pathwaySourceList = [pathway.pathwaysource];
                pathwayMatches[index].pathways.push(pathway);
                if (pathwayMatches[index].pathwayName === '') {
                  pathwayMatches[index].pathwayName = pathway.pathwayName;
                } else if (
                  pathwayMatches[index].pathwayName !== pathway.pathwayName
                ) {
                  pathwayMatches[index].pathwayName =
                    'multiple - click to view';
                }
              } else {
                const existingPathway = pathwayMatches[index].pathways.find(
                  (x) => x.pathwayRampId === pathway.pathwayRampId
                );

                //todo fix error
                // @ts-ignore
                if (
                  existingPathway.pathwaySourceList.indexOf(
                    pathway.pathwaysource
                  ) === -1
                ) {
                  //todo fix error
                  // @ts-ignore
                  existingPathway.pathwaySourceList.push(pathway.pathwaysource);
                }
              }
              if (
                pathwayMatches[index].pathwaySourceList.indexOf(
                  pathway.pathwaysource
                ) === -1
              ) {
                pathwayMatches[index].pathwaySourceList.push(
                  pathway.pathwaysource
                );
              }
              //todo fix error
              // @ts-ignore
              if (
                pathwayMatches[index].pathwayCategoryList.indexOf(
                  pathway.pathwayCategory
                ) === -1
              ) {
                //todo fix error
                // @ts-ignore
                pathwayMatches[index].pathwayCategoryList.push(
                  pathway.pathwayCategory
                );
              }
            }
          });

          pathwayMatches.map((pathwayMatch) => {
            pathwayMatch.pathwaySources =
              pathwayMatch.pathwaySourceList.join(', ');
            pathwayMatch.pathwayCategories =
              pathwayMatch.pathwayCategoryList.join(', ');
            pathwayMatch.pathways.map((pathway) => {
              //todo fix error
              // @ts-ignore
              pathway.pathwaySources = pathway.pathwaySourceList.join(', ');
              return pathway;
            });
            return pathwayMatch;
          });

          return pathwayMatches;
        })
      )
      .subscribe(
        (response: Array<PathwayMatch>) => {
          this.pathwayMatches = response.map((item) => {
            if (item.pathways && item.pathways.length > 0) {
              let selected = false;
              if (item.pathways.length > 1) {
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < item.pathways.length; i++) {
                  if (
                    item.pathways[i].pathwayName === item.input ||
                    item.pathways[i].pathwaysourceId === item.input
                  ) {
                    item.pathways[i].isSelected = true;
                    selected = true;
                    break;
                  }
                }
              }
              if (!selected) {
                item.pathways[0].isSelected = true;
              }
            }
            return item;
          });
          setTimeout(() => {
            this.loadingService.setLoadingState(false);
          }, 5);
          setTimeout(() => {
            this.selectedIndex = 1;
          }, 15);
        },
        (error) => {
          this.errorMessage =
            'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
          this.loadingService.setLoadingState(false);
        },
        () => {
          this.analytes = null;
        }
      );
  }

  mapPathwaysToAnalytes(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    const url = `${this.apiBaseUrl}analytes`;
    // const analytes = this.analytesInput.toString().split(/\r\n|\r|\n/g);
    this.pathwaysParameters = [];
    this.pathwayMatches.forEach((item) => {
      if (item.pathways && item.pathways.length > 0) {
        item.pathways.forEach((pathway) => {
          if (pathway.isSelected) {
            this.pathwaysParameters.push(pathway.pathwayName);
          }
        });
      }
    });

    const options = {
      params: {
        pathway: this.pathwaysParameters,
      },
    };
    this.http
      .get<any>(url, options)
      .pipe(
        map((response) => {
          return response;
        })
      )
      .subscribe(
        (response: Array<Analyte>) => {
          this.analytes = response;
          setTimeout(() => {
            this.loadingService.setLoadingState(false);
          }, 5);
          setTimeout(() => {
            this.selectedIndex = 2;
          }, 15);
        },
        (error) => {
          this.errorMessage =
            'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
          this.loadingService.setLoadingState(false);
        },
        () => {}
      );
  }

  insertSample(sampleType: 'ids' | 'names' | 'combined' = 'combined'): void {
    this.pathwaysInput = pathwayExampleInputs[sampleType];
  }

  pageChange(data: Array<any> = [], pageEvent?: PageEvent): void {
    if (pageEvent != null) {
      this.page = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    } else {
      this.page = 0;
    }
    const pagedData = [];
    const startIndex = this.page * this.pageSize;
    for (let i = startIndex; i < startIndex + this.pageSize; i++) {
      if (data[i] != null) {
        pagedData.push(data[i]);
      } else {
        break;
      }
    }
    this.pagedData = pagedData;
  }

  sortData(allData: Array<any> = [], sort: Sort) {
    this.expandedElement = null;

    if (!sort.active || sort.direction === '') {
      return;
    }

    allData = allData.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });

    this.pageChange(allData);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  selectedTabChange(matTabChangeEvent: MatTabChangeEvent): void {
    this.errorMessage = '';
    this.detailsPanelOpen = false;
    this.rFunctionPanelOpen = false;
    switch (matTabChangeEvent.index) {
      case 1: {
        const sort: Sort = {
          active: 'numAnalytes',
          direction: 'desc',
        };
        this.sortData(this.pathwayMatches, sort);
        break;
      }
      case 2: {
        const sort: Sort = {
          active: this.analyteColumns[0].value,
          direction: 'asc',
        };

        //todo fix error
        // @ts-ignore
        this.sortData(this.analytes, sort);
        break;
      }
    }
  }

  expandRow(row: PathwayMatch): PathwayMatch | null {
    if (row.numPathways <= 1) {
      return null;
    } else {
      return (this.expandedElement = this.expandedElement === row ? null : row);
    }
  }

  closeErrorMessage(): void {
    this.errorMessage = null;
  }
}
