import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LoadingService } from '../loading/loading.service';
import { AnalysisResult } from './analysis-result.model';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'ramp-pathway-enrichment-analysis',
  templateUrl: './pathway-enrichment-analysis.component.html',
  styleUrls: ['./pathway-enrichment-analysis.component.scss']
})
export class PathwayEnrichmentAnalysisComponent implements OnInit {
  analytesInput: string;
  identifierTypesInput = 'names';
  pHolmAdjCutoffInput = 0.5;
  pfdrAdjCutoffInput: number;
  analysisResults: Array<AnalysisResult>;
  paged: Array<AnalysisResult>;
  page = 0;
  pageSize = 10;
  displayedColumns = [
    'Pval',
    'Num_In_Path',
    'Total_In_Path',
    'Pval_FDR',
    'Pval_Holm',
    'pathwayName',
    'pathwaysourceId',
    'pathwaysource'
  ];
  columns: Array<{ value: string; display: string }> = [
    {
      value: 'Pval',
      display: 'P Value'
    },
    {
      value: 'Num_In_Path',
      display: '# in Path'
    },
    {
      value: 'Total_In_Path',
      display: 'Total in Path'
    },
    {
      value: 'Pval_FDR',
      display: 'FDR P Value'
    },
    {
      value: 'Pval_Holm',
      display: 'Holm P Value'
    },
    {
      value: 'pathwayName',
      display: 'Pathway Name'
    },
    {
      value: 'pathwaysourceId',
      display: 'Pathway Source Id'
    },
    {
      value: 'pathwaysource',
      display: 'Pathway Source'
    }
  ];
  selectedIndex = 0;
  errorMessage: string;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  ngOnInit(): void {
  }

  submitAnalytes(): void {
    this.errorMessage = '';
    this.selectedIndex = 0;
    this.loadingService.setLoadingState(true);
    const url = `${environment.apiBaseUrl}pathway_enrichment_analysis`;

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


    this.http.get<any>(url, options).subscribe((response: { fishresults: Array<AnalysisResult>,  analyte_type: Array<string>}) => {
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
