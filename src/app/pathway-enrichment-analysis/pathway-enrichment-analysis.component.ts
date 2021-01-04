import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../loading/loading.service';
import { FisherTestResult, ClusteringCoordinates } from './analysis-result.model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { ClusteringColumns, fisherTestColumns, pathwayColumns } from './analysis-colums.constant';
import { Decimal } from 'decimal.js';
import { _getOptionScrollPosition } from '@angular/material/core';
import { Pathway } from './pathway.model';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'ramp-pathway-enrichment-analysis',
  templateUrl: './pathway-enrichment-analysis.component.html',
  styleUrls: ['./pathway-enrichment-analysis.component.scss']
})
export class PathwayEnrichmentAnalysisComponent implements OnInit {

  // analytes
  analytesInput: string;
  pathwaySourceIds: Array<string>;
  analytes: Array<any>;

  // data for tables
  pathways: Array<Pathway>;
  fisherTestResults: Array<FisherTestResult>;
  filteredFisherTestResults: Array<FisherTestResult>;
  clusteringResults: Array<FisherTestResult>;

  // tables columns
  fisherTestDisplayedColumns: Array<string>;
  fisherTestColumns = fisherTestColumns;
  pathwayDisplayedColumns: Array<string>;
  pathwayColumns = pathwayColumns;
  clusteringDisplayedColumns: Array<string>;
  clusteringColumns = ClusteringColumns;

  // fisher test filter options
  pHolmAdjCutoffInput = 1;
  pfdrAdjCutoffInput: number;
  percAnalyteOverlap = 20;
  percPathwayOverlap = 20;
  minPathwayTocluster = 2;

  // clustering
  clusterCoordinates: Array<ClusteringCoordinates>;

  // paging
  pagedData: Array<any> = [];
  page = 0;
  pageSize = 10;

  // utilities
  selectedIndex = 0;
  errorMessage: string;
  showPlots = false;

  fisherTestResultsResponse: {
    fishresults: Array<FisherTestResult>,
    analyte_type: Array<string>
  };

  filteredFisherTestResultsResponse: {
    fishresults: Array<FisherTestResult>,
    analyte_type: Array<string>
  };

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.fisherTestDisplayedColumns = fisherTestColumns.map(item => item.value);
    this.pathwayDisplayedColumns = pathwayColumns.map(item => item.value);
    this.clusteringDisplayedColumns = this.clusteringColumns.map(item => item.value);
  }

  mapAnalytesToPathways(): void {
    this.errorMessage = '';
    this.selectedIndex = 0;
    this.loadingService.setLoadingState(true);
    const url = `${environment.apiBaseUrl}pathways`;
    const analytes = this.analytesInput.toString().split(/\r\n|\r|\n/g);

    const options = {
      params: {
        analyte: analytes,
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
        setTimeout(() => {
          this.loadingService.setLoadingState(false);
        }, 5);
        setTimeout(() => {
          this.selectedIndex = 1;
        }, 15);
    }, error => {
      this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
      this.loadingService.setLoadingState(false);
    }, () => {
      this.fisherTestResults = null;
      this.filteredFisherTestResults = null;
      this.clusteringResults = null;
    });
  }

  runCombinedFisherTest(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    const url = `${environment.apiBaseUrl}combined-fisher-test`;
    this.http.post<any>(url, this.pathways).subscribe(
      (response: {
        fishresults: Array<FisherTestResult>,
        analyte_type: Array<string>
      }) => {
        this.fisherTestResultsResponse = response;
        if (response.fishresults != null) {
          this.fisherTestResults = response.fishresults;
        } else {
          this.fisherTestResults = [];
        }
        setTimeout(() => {
          this.selectedIndex = 2;
        }, 15);
        setTimeout(() => {
          this.loadingService.setLoadingState(false);
        }, 5);
    }, error => {
      this.errorMessage = 'There was a problem processing your request.';
      this.loadingService.setLoadingState(false);
    }, () => {
      this.filteredFisherTestResults = null;
      this.clusteringResults = null;
    });
  }

  filterFisherTestResults(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    const url = `${environment.apiBaseUrl}filter-fisher-test-results`;
    const options = {
      params: {}
    };

    // tslint:disable-next-line:no-string-literal
    options.params['p_holmadj_cutoff'] = this.pHolmAdjCutoffInput;

    if (this.pfdrAdjCutoffInput != null) {
      // tslint:disable-next-line:no-string-literal
      options.params['p_fdradj_cutoff'] = this.pfdrAdjCutoffInput;
    }

    this.http.post<any>(url, this.fisherTestResultsResponse, options).subscribe(
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
        setTimeout(() => {
          this.selectedIndex = 3;
        }, 15);
        setTimeout(() => {
          this.loadingService.setLoadingState(false);
        }, 5);
        console.log(response);
    }, error => {
      this.errorMessage = 'There was a problem processing your request.';
      this.loadingService.setLoadingState(false);
    }, () => {
      this.clusteringResults = null;
    });
  }

  clusterFilteredFisherResults(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    this.showPlots = false;
    const url = `${environment.apiBaseUrl}cluster-fisher-test-results`;
    // const url = `/assets/test-data/pathway_enrichment_analysis.json`;

    const analytes = this.analytesInput.toString().split(/\r\n|\r|\n/g);

    const options = {
      params: {}
    };

    // tslint:disable-next-line:no-string-literal
    options.params['perc_analyte_overlap'] = Decimal.div(this.percAnalyteOverlap, 100).toNumber();

    // tslint:disable-next-line:no-string-literal
    options.params['perc_pathway_overlap'] = Decimal.div(this.percPathwayOverlap, 100).toNumber();

    // tslint:disable-next-line:no-string-literal
    options.params['min_pathway_tocluster'] = this.minPathwayTocluster;

    this.http.post<any>(url, this.filteredFisherTestResultsResponse, options)
      .pipe(
        map(response => {
          if (response.fishresults && response.fishresults.length > 0) {
            this.pathwaySourceIds = [];
            response.fishresults.map(item => {

              this.pathwaySourceIds.push(item.pathwaysourceId);

              if (item.cluster_assignment) {
                this.showPlots = true;
              }

              if (item.Pval != null || item.Pval_combined != null) {
                const pVal = item.Pval != null ? item.Pval : item.Pval_combined;
                item.negativeLogPVal =  new Decimal(1).dividedBy(Decimal.log10(pVal)).toNumber();
              }
              Object.keys(item).forEach(key => {
                if (key.indexOf('.') > -1) {
                  item[key.split('.')[0]] = item[key];
                  delete item[key];
                }
              });
            });
          }
          if (response.analytes && response.analytes.length > 0) {
            response.analytes = response.analytes.map(item => { item.pathways = item.pathways.split(','); return item; });
          }
          return response;
        })
      )
      .subscribe((response: {
        fishresults: Array<FisherTestResult>,
        // clusterCoordinates: Array<ClusteringCoordinates>,
        // analytes: Array<any>
      }) => {
      this.clusteringResults = response.fishresults;
      // this.clusterCoordinates = response.clusterCoordinates;
      // this.analytes = response.analytes;
      // this.getGroupedAnalytes();
      setTimeout(() => {
        this.selectedIndex = 4;
      }, 10);
      setTimeout(() => {
        this.loadingService.setLoadingState(false);
      }, 15);
    }, error => {
      this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
      this.loadingService.setLoadingState(false);
    });
  }

  getGroupedAnalytes(): void {

    const url = `${environment.apiBaseUrl}analytes`;

    const options = {
      params: {
        pathwaySourceId: this.pathwaySourceIds,
      }
    };
    this.http.get<any>(url, options)
      .pipe(
        map(response => {
          response = response.map(item => { item.analytes = item.analytes.split(','); return item; });
          return response;
        })
      ).subscribe(response => {
      this.analytes = response;
    });
  }

  pageChange(data: Array<any>, pageEvent?: PageEvent): void {

    if (pageEvent != null) {
      this.page = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    } else {
      this.page = 0;
    }
    const pagedData = [];
    console.log(pagedData);
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

  sortData(allData: Array<any>, sort: Sort) {

    if (!sort.active || sort.direction === '') {
      return;
    }

    const data = allData.slice();

    allData = data.sort((a, b) => {
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
    switch (matTabChangeEvent.index) {
      case 1: {
        this.pageChange(this.pathways);
        break;
      }
      case 2: {
        this.pageChange(this.fisherTestResults);
        break;
      }
      case 3: {
        this.pageChange(this.filteredFisherTestResults);
        break;
      }
      case 4: {
        this.pageChange(this.clusteringResults);
        break;
      }
    }
  }

}
