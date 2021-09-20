import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { analyteIdTypeColumns, analyteMatchesColumns, analyteColumns } from './analyte-tables-columns.constant';
import { AnalyteMatch } from './analyte.model';
import { AnalyteService } from './analyte.service';
import { analyteExampleInputs } from './examples.constant';

export abstract class AnalyteQueryBase implements OnInit {
    analytesInput: string;
    idTypes: Array<{ analyteType: string; idTypes: string }>;
    analyteMatches: Array<AnalyteMatch>;

    // tables columns
    idTypeDisplayedColumns: Array<string>;
    idTypeColumns = analyteIdTypeColumns;
    analyteMatchesDisplayedColumns: Array<string>;
    analyteMatchesColumns = analyteMatchesColumns;
    analyteDisplayedColumns: Array<string>;
  analyteColumns = analyteColumns;

    // utilities
    apiBaseUrl: string;

    constructor(
        public http: HttpClient,
        public configService: ConfigService,
        public analyteService: AnalyteService
    ) {
        this.apiBaseUrl = configService.configData.apiBaseUrl;
    }

    ngOnInit(): void {
        this.analyteMatchesDisplayedColumns = this.analyteMatchesColumns.map(item => item.value);
        this.idTypeDisplayedColumns = this.idTypeColumns.map(item => item.value);
        this.analyteDisplayedColumns = this.analyteColumns.map(item => item.value);
        this.analyteDisplayedColumns.unshift('isSelected');
        this.loadIdTypes();
    }

    loadIdTypes(): void {
        const url = `${this.apiBaseUrl}id-types`;
        this.http.get<Array<{ analyteType: string; idTypes: string }>>(url).subscribe(response => {
            this.idTypes = response;
        });
    }

    setSelectedAnalyteMatches(analyteMatches: Array<AnalyteMatch>): Array<AnalyteMatch> {
        analyteMatches.map(item => {
            if (item.analytes && item.analytes.length > 0) {
                let selected = false;
                if (item.analytes.length > 1) {
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < item.analytes.length; i++) {
                        if (
                            item.analytes[i].sourceId === item.input
                            || item.analytes[i].commonNameList.indexOf(item.input) > -1
                            || (item.analytes[i].synonymList.indexOf(item.input) > -1)) {
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
        return analyteMatches;
    }

    insertSample(): void {
        // tslint:disable-next-line:no-string-literal
        this.analytesInput = analyteExampleInputs['analytesCombined'];
    }
}
