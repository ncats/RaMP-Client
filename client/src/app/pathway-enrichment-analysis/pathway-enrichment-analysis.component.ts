import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../loading/loading.service';
import { FisherTestResult, ClusteringCoordinates } from './analysis-result.model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { AnalyteColumns, AnalyteMatchesColumns, ClusteringColumns, fisherTestColumns, pathwayColumns } from './analysis-colums.constant';
import { Decimal } from 'decimal.js';
import { _getOptionScrollPosition } from '@angular/material/core';
import { Pathway } from './pathway.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AnalyteMatch, Analyte } from './analyte.model';
import { analyteExampleInputs } from './examples.constant';
import { MatDialog } from '@angular/material/dialog';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';
import { path } from 'd3';
import { ConfigService } from '../config/config.service';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'ramp-pathway-enrichment-analysis',
  templateUrl: './pathway-enrichment-analysis.component.html',
  styleUrls: ['./pathway-enrichment-analysis.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class PathwayEnrichmentAnalysisComponent implements OnInit {

  // analytes
  metabolitesInput: string;
  genesInput: string;
  pathwaySourceIds: Array<string>;
  analytes: Array<any>;

  // data for tables
  analyteMatches: Array<AnalyteMatch>;
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
  analyteMatchesDisplayedColumns: Array<string>;
  analyteMatchesColumns = AnalyteMatchesColumns;
  analyteDisplayedColumns: Array<string>;
  analyteColumns = AnalyteColumns;

  // fisher test filter options
  pHolmAdjCutoffInput = 1;
  pfdrAdjCutoffInput: number;
  percAnalyteOverlap = 20;
  percPathwayOverlap = 20;
  minPathwayTocluster = 2;

  // clustering
  clusterCoordinates: Array<ClusteringCoordinates>;

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
  expandedElement: AnalyteMatch | null;
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
    private http: HttpClient,
    private loadingService: LoadingService,
    public dialog: MatDialog,
    private configService: ConfigService
  ) {
    this.apiBaseUrl = configService.configData.apiBaseUrl;
  }

  ngOnInit(): void {
    this.fisherTestDisplayedColumns = fisherTestColumns.map(item => item.value);
    this.pathwayDisplayedColumns = pathwayColumns.map(item => item.value);
    this.clusteringDisplayedColumns = this.clusteringColumns.map(item => item.value);
    this.analyteMatchesDisplayedColumns = this.analyteMatchesColumns.map(item => item.value);
    this.analyteDisplayedColumns = this.analyteColumns.map(item => item.value);
    this.analyteDisplayedColumns.unshift('isSelected');
  }

  findAnalytes(): void {
    this.errorMessage = '';
    this.selectedIndex = 0;
    this.loadingService.setLoadingState(true);
    const url = `${this.apiBaseUrl}source/analytes`;
    const metabolites = this.metabolitesInput ? this.metabolitesInput.toString().split(/\r\n|\r|\n/g) : [];
    const genes = this.genesInput ? this.genesInput.toString().split(/\r\n|\r|\n/g) : [];
    const analytes = metabolites.concat(genes).filter(analyte => analyte !== '');
    const options = {
      params: {
        identifier: analytes,
      }
    };
    this.http.get<any>(url, options)
      .pipe(
        map((response: Array<Analyte>) => {

          const analyteMatches: Array<AnalyteMatch> = [];
          const analytesLower: Array<string> = [];

          analytes.forEach(analyteItendifier => {

            const analyteLower = analyteItendifier.toLowerCase();
            analytesLower.push(analyteLower);
            const analyteMatch: AnalyteMatch = {
              input: analyteItendifier,
              rampIdList: [],
              idTypesList: [],
              idTypes: '',
              typesList: [],
              types: '',
              numAnalytes: 0,
              commonName: '',
              analytes: []
            };

            analyteMatches.push(analyteMatch);
          });

          response.forEach(analyte => {
            let index = analytesLower.indexOf(analyte.sourceId.toLowerCase());
            if (index === -1) {
              index = analytesLower.indexOf(analyte.commonName.toLowerCase());
            }
            if (index === -1 && analyte.synonym) {
              index = analytesLower.indexOf(analyte.synonym.toLowerCase());
            }
            if (index > -1) {
              if (analyteMatches[index].rampIdList.indexOf(analyte.rampId) === -1) {
                analyteMatches[index].rampIdList.push(analyte.rampId);
                analyteMatches[index].numAnalytes++;
                analyte.idTypesList = [analyte.IDtype];
                analyteMatches[index].analytes.push(analyte);
                if (analyteMatches[index].commonName === '') {
                  analyteMatches[index].commonName = analyte.commonName;
                } else if (analyteMatches[index].commonName !== analyte.commonName) {
                  analyteMatches[index].commonName = 'multiple - click to view';
                }
              } else {
                const existingAnalyite = analyteMatches[index].analytes.find(x => x.rampId === analyte.rampId);
                if (existingAnalyite.idTypesList.indexOf(analyte.IDtype) === -1) {
                  existingAnalyite.idTypesList.push(analyte.IDtype);
                }
              }
              if (analyteMatches[index].idTypesList.indexOf(analyte.IDtype) === -1) {
                analyteMatches[index].idTypesList.push(analyte.IDtype);
              }
              if (analyteMatches[index].typesList.indexOf(analyte.geneOrCompound) === -1) {
                analyteMatches[index].typesList.push(analyte.geneOrCompound);
              }
            }
          });

          analyteMatches.map(analyteMatch => {
            analyteMatch.idTypes = analyteMatch.idTypesList.join(', ');
            analyteMatch.types = analyteMatch.typesList.join(', ');
            analyteMatch.analytes.map(analyte => {
              analyte.idTypes = analyte.idTypesList.join(', ');
              return analyte;
            });
            return analyteMatch;
          });

          return analyteMatches;
        })
      )
      .subscribe((response: Array<AnalyteMatch>) => {
        this.analyteMatches = response.map(item => {
          if (item.analytes && item.analytes.length > 0) {
            let selected = false;
            if (item.analytes.length > 1) {
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < item.analytes.length; i++){
                if (
                  item.analytes[i].commonName === item.input
                  || item.analytes[i].sourceId === item.input
                  || (item.analytes[i].synonym && item.analytes[i].synonym === item.input)) {
                  item.analytes[i].isSelected = true;
                  selected = true;
                  break;
                }
              }
            }
            if (!selected) {
              item.analytes[0].isSelected = true;
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
      }, error => {
        this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
        this.loadingService.setLoadingState(false);
      }, () => {
        this.pathways = null;
        this.fisherTestResults = null;
        this.filteredFisherTestResults = null;
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
        setTimeout(() => {
          this.loadingService.setLoadingState(false);
        }, 5);
        setTimeout(() => {
          this.selectedIndex = 2;
        }, 15);
      }, error => {
        this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
        this.loadingService.setLoadingState(false);
      }, () => {
        this.fisherTestResults = null;
        this.filteredFisherTestResults = null;
        this.clusteringResults = null;
        this.showPlots = false;
      });
  }

  runCombinedFisherTest(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    const url = `${this.apiBaseUrl}combined-fisher-test`;
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
          this.selectedIndex = 3;
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
          this.selectedIndex = 4;
        }, 15);
        setTimeout(() => {
          this.loadingService.setLoadingState(false);
        }, 5);
      }, error => {
        this.errorMessage = 'There was a problem processing your request.';
        this.loadingService.setLoadingState(false);
      }, () => {
        this.clusteringResults = null;
        this.showPlots = false;
      });
  }

  clusterFilteredFisherResults(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    this.showPlots = false;
    const url = `${this.apiBaseUrl}cluster-fisher-test-results-extended`;
    // const url = `/assets/test-data/pathway_enrichment_analysis.json`;

    // const analytes = this.analytesInput.toString().split(/\r\n|\r|\n/g);

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
      .subscribe((response: {
        fishresults: Array<FisherTestResult>,
        clusterCoordinates: Array<ClusteringCoordinates>,
        analytes: Array<any>
      }) => {
        if (response.fishresults && response.fishresults.length > 0) {
          this.pathwaySourceIds = [];
          response.fishresults.map(item => {

            this.pathwaySourceIds.push(item.pathwaysourceId);

            if (item.cluster_assignment) {
              this.showPlots = true;
            }

            if (item.Pval != null || item.Pval_combined != null) {
              const pVal = item.Pval != null ? item.Pval : item.Pval_combined;
              item.negativeLogPVal = new Decimal(1).dividedBy(Decimal.log10(pVal)).toNumber();
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
          response.analytes = response.analytes.map(item => {
            item.pathways = item.pathways && item.pathways.split(',') || ''; return item;
          });
        }
        this.clusteringResults = response.fishresults;
        this.clusterCoordinates = response.clusterCoordinates;
        this.analytes = response.analytes;
        // this.getGroupedAnalytes();
        setTimeout(() => {
          this.selectedIndex = 5;
        }, 10);
        setTimeout(() => {
          this.loadingService.setLoadingState(false);
        }, 15);
      }, error => {
        this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers.';
        this.loadingService.setLoadingState(false);
      });
  }

  getGroupedAnalytes(): void {

    const url = `${this.apiBaseUrl}analytes`;

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

  insertSample(inputType: 'metabolites' | 'genes', sampleType: 'ids' | 'names'): void {
    if (inputType === 'metabolites') {
      this.metabolitesInput = analyteExampleInputs[inputType][sampleType];
    } else {
      this.genesInput = analyteExampleInputs[inputType][sampleType];
    }
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
          active: this.fisherTestColumns[0].value,
          direction: 'asc'
        };
        this.sortData(this.clusteringResults, sort);
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

  expandRow(row: AnalyteMatch): AnalyteMatch {
    if (row.numAnalytes <= 1) {
      return null;
    } else {
      return this.expandedElement = this.expandedElement === row ? null : row;
    }
  }

  closeErrorMessage(): void {
    this.errorMessage = null;
  }
}
