import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { LoadingService } from '../loading/loading.service';
import { AnalyteColumns, AnalyteMatchesColumns, pathwayColumns } from '../pathway-enrichment-analysis/analysis-colums.constant';
import { Analyte, AnalyteMatch } from '../pathway-enrichment-analysis/analyte.model';
import { analyteExampleInputs } from '../pathway-enrichment-analysis/examples.constant';
import { Pathway } from '../pathway-enrichment-analysis/pathway.model';
import { ReactionColumns } from './reaction-columns.constant';
import { Reaction } from './reaction.model';

@Component({
  selector: 'ramp-common-reaction-analytes',
  templateUrl: './common-reaction-analytes.component.html',
  styleUrls: ['./common-reaction-analytes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class CommonReactionAnalytesComponent implements OnInit {
  metabolitesInput: string;
  genesInput: string;
  pathwaySourceIds: Array<string>;
  analytes: Array<any>;

  // data for tables
  analyteMatches: Array<AnalyteMatch>;
  reactions: Array<Reaction>;

  // tables columns
  reactionDisplayedColumns: Array<string>;
  reactionColumns = ReactionColumns;
  analyteMatchesDisplayedColumns: Array<string>;
  analyteMatchesColumns = AnalyteMatchesColumns;
  analyteDisplayedColumns: Array<string>;
  analyteColumns = AnalyteColumns;

  // paging
  pagedData: Array<any> = [];
  page = 0;
  pageSize = 10;

  // For showing R package calls
  analytesParameters: Array<string>;

  // utilities
  selectedIndex = 0;
  errorMessage: string;
  apiBaseUrl: string;
  expandedElement: AnalyteMatch | null;
  detailsPanelOpen = false;
  rFunctionPanelOpen = false;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private configService: ConfigService
  ) {
    this.apiBaseUrl = configService.configData.apiBaseUrl;
  }

  ngOnInit(): void {
    this.reactionDisplayedColumns = this.reactionColumns.map(item => item.value);
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
        this.reactions = null;
      });
  }

  getCommonReactions(): void {
    this.errorMessage = '';
    this.loadingService.setLoadingState(true);
    const url = `${this.apiBaseUrl}common-reaction-analytes`;
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
      .subscribe((response: Array<Reaction>) => {
        this.reactions = response;
        setTimeout(() => {
          this.loadingService.setLoadingState(false);
        }, 5);
        setTimeout(() => {
          this.selectedIndex = 2;
        }, 15);
      }, error => {
        this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
        this.loadingService.setLoadingState(false);
      }, () => {});
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
        this.sortData(this.reactions, sort);
        break;
      }
    }
  }

  expandRow(row: AnalyteMatch): AnalyteMatch {
    console.log(row);
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
