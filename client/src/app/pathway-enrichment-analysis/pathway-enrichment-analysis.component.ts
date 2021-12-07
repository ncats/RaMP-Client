import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from '../loading/loading.service';
import { FisherTestResult, Cluster } from './analysis-result.model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import {
  ClusteringColumns,
  fisherTestBaseColumns,
  fisherTestSingleTypeColumns,
  fisherTestMultiTypeColumns,
  pathwayColumns
} from './analysis-colums.constant';
import { Decimal } from 'decimal.js';
import { _getOptionScrollPosition } from '@angular/material/core';
import { Pathway } from './pathway.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AnalyteMatch } from '../analyte/analyte.model';
import { MatDialog } from '@angular/material/dialog';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { AnalyteService } from '../analyte/analyte.service';
import { AnalyteQueryBase } from '../analyte/analyte-query.abstract';
import {environment} from "../../environments/environment";

@Component({
  selector: 'ramp-pathway-enrichment-analysis',
  templateUrl: './pathway-enrichment-analysis.component.html',
  styleUrls: ['./pathway-enrichment-analysis.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
  ]
})
export class PathwayEnrichmentAnalysisComponent extends AnalyteQueryBase implements OnInit  {

  // data for tables
  pathways: Array<Pathway>;
  fisherTestResults: Array<FisherTestResult>;
  filteredFisherTestResults: Array<FisherTestResult>;
  clusters: Array<Cluster>;

  // tables columns
  fisherTestDisplayedColumns: Array<string>;
  fisherTestColumns: Array<{ value: string; display: string }>;
  pathwayDisplayedColumns: Array<string>;
  pathwayColumns = pathwayColumns;
  clusteringDisplayedColumns: Array<string>;
  clusteringColumns = ClusteringColumns;

  // fisher test filter options
  pHolmAdjCutoffInput = 0.1;
  pfdrAdjCutoffInput: number;
  percAnalyteOverlap = 20;
  percPathwayOverlap = 20;
  minPathwayTocluster = 2;

  // clustering
  private clusteringResults: Array<FisherTestResult>;

  // For showing R package calls
  analytesParameters: Array<string>;

  // paging
  pagedData: Array<any> = [];
  page = 0;
  pageSize = 10;

  // utilities
  selectedIndex = 0;
  errorMessage: string;
  showPlots = false;
  expandedElement: AnalyteMatch;
  apiBaseUrl: string;
  detailsPanelOpen = false;
  rFunctionPanelOpen = false;

  fisherTestResultsResponse: {
    fishresults: Array<FisherTestResult>,
    analyte_type: Array<string>
  };

  filteredFisherTestResultsResponse: {
    fishresults: Array<FisherTestResult>,
    analyte_type: Array<string>
  };

  constructor(
    public http: HttpClient,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    public analyteService: AnalyteService
  ) {
    super(
      http,
      analyteService
    );
    this.apiBaseUrl = environment.apiBaseUrl;
  }

  ngOnInit(): void {
    this.pathwayDisplayedColumns = pathwayColumns.map(item => item.value);
    this.clusteringDisplayedColumns = this.clusteringColumns.map(item => item.value);
    super.ngOnInit();
  }

  findAnalytes(): void {
    this.errorMessage = '';
    this.selectedIndex = 0;
    this.loadingService.setLoadingState(true);
    const analytes = (this.analytesInput ? this.analytesInput.toString().split(/\r\n|\r|\n/g) : []).filter(analyte => analyte !== '');

    this.analyteService.findAnalytes(analytes).subscribe((response: Array<AnalyteMatch>) => {
        this.analyteMatches = this.setSelectedAnalyteMatches(response);
        this.loadingService.setLoadingState(false);
        this.selectedIndex = 1;
      }, error => {
        this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
        this.loadingService.setLoadingState(false);
      }, () => {
        this.pathways = null;
        this.fisherTestResults = null;
        this.filteredFisherTestResults = null;
        this.clusters = null;
        this.clusteringResults = null;
        this.showPlots = false;
      });
  }

  mapAnalytesToPathways(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    const url = `${this.apiBaseUrl}pathways`;
    // const analytes = this.analytesInput.toString().split(/\r\n|\r|\n/g);
    this.analytesParameters = [];
    this.analyteMatches.forEach(item => {
      if (item.analytes && item.analytes.length > 0) {
        item.analytes.forEach(analyte => {
          if (analyte.isSelected) {
            this.analytesParameters.push(analyte.sourceId);
          }
        });
      }
    });

    const options = {
      params: {
        analyte: this.analytesParameters,
      }
    };
    this.http.get<any>(url, options)
      .pipe(
        map(response => {
          return response;
        })
      )
      .subscribe((response: Array<Pathway>) => {
        this.pathways = response;
        this.loadingService.setLoadingState(false);
        this.selectedIndex = 2;
      }, error => {
        this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
        this.loadingService.setLoadingState(false);
      }, () => {
        this.fisherTestResults = null;
        this.filteredFisherTestResults = null;
        this.clusters = null;
        this.clusteringResults = null;
        this.showPlots = false;
      });
  }

  runCombinedFisherTest(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    const url = `${this.apiBaseUrl}combined-fisher-test`;
    this.http.post<any>(url, this.pathways)
      .pipe(
        map(response => {
          if (response.fishresults != null) {
            response.fishresults.forEach(resultsObject => {
              Object.keys(resultsObject).forEach(key => {
                if (key.indexOf('.') > -1) {
                  const newKey = key.replace(/\./g, '');
                  resultsObject[newKey] = resultsObject[key];
                  delete resultsObject[key];
                }
              });
            });
          }
          return response;
        })
      )
      .subscribe(
        (response: {
          fishresults: Array<FisherTestResult>,
          analyte_type: Array<string>
        }) => {
          this.fisherTestColumns = fisherTestBaseColumns;
          this.fisherTestDisplayedColumns = fisherTestBaseColumns.map(item => item.value);
          if (response.analyte_type && response.analyte_type.length > 0) {
            if (response.analyte_type[0] === 'both') {
              this.fisherTestColumns = this.fisherTestColumns.concat(fisherTestMultiTypeColumns);
              this.fisherTestDisplayedColumns = this.fisherTestDisplayedColumns.concat(fisherTestMultiTypeColumns.map(item => item.value));
            } else {
              this.fisherTestColumns = this.fisherTestColumns.concat(fisherTestSingleTypeColumns);
              this.fisherTestDisplayedColumns = this.fisherTestDisplayedColumns.concat(fisherTestSingleTypeColumns.map(item => item.value));
            }
          }
          this.fisherTestResultsResponse = response;
          if (response.fishresults != null) {
            this.fisherTestResults = response.fishresults;
          } else {
            this.fisherTestResults = [];
          }
          this.loadingService.setLoadingState(false);
          this.selectedIndex = 3;
        }, error => {
          this.errorMessage = 'There was a problem processing your request.';
          this.loadingService.setLoadingState(false);
        }, () => {
          this.filteredFisherTestResults = null;
          this.clusters = null;
          this.clusteringResults = null;
          this.showPlots = false;
        });
  }

  filterFisherTestResults(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    const url = `${this.apiBaseUrl}filter-fisher-test-results`;
    const options = {
      params: {}
    };

    // tslint:disable-next-line:no-string-literal
    options.params['p_holmadj_cutoff'] = this.pHolmAdjCutoffInput;

    if (this.pfdrAdjCutoffInput != null) {
      // tslint:disable-next-line:no-string-literal
      options.params['p_fdradj_cutoff'] = this.pfdrAdjCutoffInput;
    }

    this.http.post<any>(url, this.fisherTestResultsResponse, options)
      .pipe(
        map(response => {
          if (response.fishresults != null) {
            response.fishresults.forEach(resultsObject => {
              Object.keys(resultsObject).forEach(key => {
                if (key.indexOf('.') > -1) {
                  const newKey = key.replace(/\./g, '');
                  resultsObject[newKey] = resultsObject[key];
                  delete resultsObject[key];
                }
              });
            });
          }
          return response;
        })
      ).subscribe(
        (response: {
          fishresults: Array<FisherTestResult>,
          analyte_type: Array<string>
        }) => {
          this.filteredFisherTestResultsResponse = response;
          if (response.fishresults != null) {
            this.filteredFisherTestResults = response.fishresults;
          } else {
            this.fisherTestResults = [];
          }
          this.loadingService.setLoadingState(false);
          this.selectedIndex = 4;
        }, error => {
          this.errorMessage = 'There was a problem processing your request.';
          this.loadingService.setLoadingState(false);
        }, () => {
          this.clusters = null;
          this.clusteringResults = null;
          this.showPlots = false;
        });
  }

  clusterFilteredFisherResults(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    this.showPlots = false;
    const url = `${this.apiBaseUrl}cluster-fisher-test-results`;

    const options = {
      params: {}
    };

    const analytes = [];
    this.analyteMatches.forEach(item => {
      if (item.analytes && item.analytes.length > 0) {
        item.analytes.forEach(analyte => {
          if (analyte.isSelected) {
            analytes.push(analyte.sourceId);
          }
        });
      }
    });

    // tslint:disable-next-line:no-string-literal
    options.params['analyte_source_id'] = analytes;

    // tslint:disable-next-line:no-string-literal
    options.params['perc_analyte_overlap'] = Decimal.div(this.percAnalyteOverlap, 100).toNumber();

    // tslint:disable-next-line:no-string-literal
    options.params['perc_pathway_overlap'] = Decimal.div(this.percPathwayOverlap, 100).toNumber();

    // tslint:disable-next-line:no-string-literal
    options.params['min_pathway_tocluster'] = this.minPathwayTocluster;

    this.http.post<any>(url, this.filteredFisherTestResultsResponse, options)
      .pipe(
        map(response => {
          if (response.fishresults != null) {
            response.fishresults.forEach(resultsObject => {
              Object.keys(resultsObject).forEach(key => {
                if (key.indexOf('.') > -1) {
                  const newKey = key.replace(/\./g, '');
                  resultsObject[newKey] = resultsObject[key];
                  delete resultsObject[key];
                }
              });
            });
          }
          return response;
        })
      )
      .subscribe((response: {
        fishresults: Array<FisherTestResult>,
        analyte_type: string,
        cluster_list: { [rampId: string]: Array<string> },
        pathway_matrix: Array<Array<number>>;
      }) => {
        if (response.fishresults && response.fishresults.length > 0) {
          const group = new Map();

          response.fishresults.map(item => {

            if (item.Pval != null || item.Pval_combined != null) {
              const pVal = item.Pval != null ? item.Pval : item.Pval_combined;
              item.negativeLogPVal = Decimal.log10(new Decimal(1).dividedBy(pVal)).toNumber();
            }

            const keys = item.cluster_assignment.split(', ');
            keys.forEach(key => {
              const collection = group.get(key);
              if (!collection) {
                group.set(key, [item.pathwayName]);
              } else {
                collection.push(item.pathwayName);
              }
            });
          });

          this.clusters = Array.from(group, element => {
            return {
              cluster: element[0],
              pathways: element[1].join(', ')
            };
          });
        }
        this.clusteringResults = response.fishresults;
        this.loadingService.setLoadingState(false);
        this.selectedIndex = 5;
      }, error => {
        this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers.';
        this.loadingService.setLoadingState(false);
      });
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
    for (let i = startIndex; i < (startIndex + this.pageSize); i++) {
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

  compare(a: number | string = '', b: number | string = '', isAsc: boolean) {
    return a.toString().localeCompare(b.toString(), undefined, {numeric: true}) * (isAsc ? 1 : -1);
  }

  selectedTabChange(matTabChangeEvent: MatTabChangeEvent): void {
    this.errorMessage = '';
    this.detailsPanelOpen = false;
    this.rFunctionPanelOpen = false;
    this.selectedIndex = matTabChangeEvent.index;
    switch (matTabChangeEvent.index) {
      case 1: {
        const sort: Sort = {
          active: 'numAnalytes',
          direction: 'desc'
        };
        this.sortData(this.analyteMatches, sort);
        break;
      }
      case 2: {
        const sort: Sort = {
          active: this.analyteColumns[0].value,
          direction: 'asc'
        };
        this.sortData(this.pathways, sort);
        break;
      }
      case 3: {
        const sort: Sort = {
          active: this.fisherTestColumns[0].value,
          direction: 'asc'
        };
        this.sortData(this.fisherTestResults, sort);
        break;
      }
      case 4: {
        const sort: Sort = {
          active: this.fisherTestColumns[0].value,
          direction: 'asc'
        };
        this.sortData(this.filteredFisherTestResults, sort);
        break;
      }
      case 5: {
        const sort: Sort = {
          active: this.clusteringColumns[0].value,
          direction: 'asc'
        };
        this.sortData(this.clusters, sort);
        break;
      }
    }
  }

  barClicked(barEvent: any): void {
    const pathways = [];
    this.clusteringResults.forEach(item => {
      if (item.cluster_assignment === barEvent.xValue) {
        pathways.push(item);
      }
    });
    this.dialog.open(TableDialogComponent, {
      data: {
        title: `Pathways in Cluster ${barEvent.xValue}`,
        tableData: pathways,
        columns: this.clusteringColumns
      },
      width: '600px'
    });
  }

  upSetBarClicked(barEvent: any): void {
    const pathways = [];
    barEvent.values.forEach(pathwaysourceId => {
      const pathway = this.pathways.find(_pathway => _pathway.pathwaysourceId === pathwaysourceId);
      pathways.push(pathway);
    });
    this.dialog.open(TableDialogComponent, {
      data: {
        title: `Pathways in Instersection of ${barEvent.name}`,
        tableData: pathways,
        columns: this.pathwayColumns.filter(column => column.value !== 'commonName')
      },
      width: '600px'
    });
  }

  expandRow(row: AnalyteMatch): void {
    if (row.numAnalytes > 1) {
      this.expandedElement = this.expandedElement === row ? null : row;
    }
  }

  closeErrorMessage(): void {
    this.errorMessage = null;
  }
}
