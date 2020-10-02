import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../loading/loading.service';
import { AnalysisResult } from './analysis-result.model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { analysisColumns } from './analysis-colums.constant';
import { Decimal } from 'decimal.js';

@Component({
  selector: 'ramp-pathway-enrichment-analysis',
  templateUrl: './pathway-enrichment-analysis.component.html',
  styleUrls: ['./pathway-enrichment-analysis.component.scss']
})
export class PathwayEnrichmentAnalysisComponent implements OnInit {
  analytesInput: string;
  identifierTypesInput = 'names';
  pHolmAdjCutoffInput = 1;
  pfdrAdjCutoffInput: number;
  analysisResults: Array<AnalysisResult>;
  paged: Array<AnalysisResult>;
  page = 0;
  pageSize = 10;
  displayedColumns: Array<string>;
  columns = analysisColumns;
  selectedIndex = 0;
  errorMessage: string;
  showPlots = false;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
    this.displayedColumns = analysisColumns.map(item => item.value);
  }

  submitAnalytes(): void {
    this.errorMessage = '';
    this.selectedIndex = 0;
    this.loadingService.setLoadingState(true);
    this.showPlots = false;
    // const url = `${environment.apiBaseUrl}pathway_enrichment_analysis`;
    const url = `/assets/test-data/pathway_enrichment_analysis.json`;

    const analytes = this.analytesInput.toString().split(/\r\n|\r|\n/g);

    const options = {
      params: {
        analyte: analytes,
      }
    };


    // tslint:disable-next-line:no-string-literal
    options.params['identifier_type'] = this.identifierTypesInput;
    // tslint:disable-next-line:no-string-literal
    options.params['p_holmadj_cutoff'] = this.pHolmAdjCutoffInput;

    if (this.pfdrAdjCutoffInput != null) {
      // tslint:disable-next-line:no-string-literal
      options.params['p_fdradj_cutoff'] = this.pfdrAdjCutoffInput;
    }


    this.http.get<any>(url, options)
      .pipe(
        map(response => {
          if (response.fishresults && response.fishresults.length > 0) {
            response.fishresults.map(item => {

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
          return response;
        })
      )
      .subscribe((response: { fishresults: Array<AnalysisResult>,  analyte_type: Array<string>}) => {
      this.analysisResults = response.fishresults;
      this.pageChange();
      this.loadingService.setLoadingState(false);
      setTimeout(() => {
        this.selectedIndex = 1;
      }, 10);
    }, error => {
      this.errorMessage = 'There was a problem processing your request. Please review your input and make sure you entered the correct analyte identifiers and selected the correct options';
      this.loadingService.setLoadingState(false);
    });
  }

  pageChange(pageEvent?: PageEvent): void {

    if (pageEvent != null) {
      this.page = pageEvent.pageIndex;
      this.pageSize = pageEvent.pageSize;
    } else {
      this.page = 0;
    }
    this.paged = [];
    const startIndex = this.page * this.pageSize;
    for (let i = startIndex; i < (startIndex + this.pageSize); i++) {
      if (this.analysisResults[i] != null) {
        this.paged.push(this.analysisResults[i]);
      } else {
        break;
      }
    }
  }

  sortData(sort: Sort) {

    if (!sort.active || sort.direction === '') {
      return;
    }

    const data = this.analysisResults.slice();

    this.analysisResults = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      return this.compare(a[sort.active], b[sort.active], isAsc);
    });

    this.pageChange();
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
