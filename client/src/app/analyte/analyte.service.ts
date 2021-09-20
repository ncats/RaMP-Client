import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '../config/config.service';
import { AnalyteMatch, Analyte } from './analyte.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyteService {
  apiBaseUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.apiBaseUrl = configService.configData.apiBaseUrl;
  }

  findAnalytes(analytes: Array<string>): Observable<Array<AnalyteMatch>> {
    const url = `${this.apiBaseUrl}source/analytes`;
    const options = {
      params: {
        identifier: analytes,
      }
    };
    return this.http.get<Array<Analyte>>(url, options)
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
              sourceIdsList: [],
              typesList: [],
              sourceIds: '',
              types: '',
              numAnalytes: 0,
              commonName: '',
              commonNameList: [],
              synonym: '',
              synonymList: [],
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
                analyte.sourceIdsList = [analyte.sourceId];
                analyte.idTypesList = [analyte.IDtype];
                analyte.commonNameList = [analyte.commonName];
                analyte.synonymList = analyte.synonym ? [analyte.synonym] : [];
                analyteMatches[index].analytes.push(analyte);
                analyteMatches[index].sourceIdsList.push(analyte.sourceId);
              } else {
                const existingAnalyte = analyteMatches[index].analytes.find(x => x.rampId === analyte.rampId);
                existingAnalyte.sourceIdsList.push(analyte.sourceId);
                if (existingAnalyte.idTypesList.indexOf(analyte.IDtype) === -1) {
                  existingAnalyte.idTypesList.push(analyte.IDtype);
                }
                if (existingAnalyte.commonNameList.indexOf(analyte.commonName) === -1) {
                  existingAnalyte.commonNameList.push(analyte.commonName);
                }
                if (analyte.synonym && existingAnalyte.synonymList.indexOf(analyte.synonym) === -1) {
                  existingAnalyte.synonymList.push(analyte.synonym);
                }
              }
              if (analyteMatches[index].commonNameList.indexOf(analyte.commonName) === -1) {
                analyteMatches[index].commonNameList.push(analyte.commonName);
              }
              if (analyte.synonym && analyteMatches[index].synonymList.indexOf(analyte.synonym) === -1) {
                analyteMatches[index].synonymList.push(analyte.synonym);
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
              analyte.sourceIds = analyte.sourceIdsList.join(', ');
              analyte.idTypes = analyte.idTypesList.join(', ');
              analyte.commonName = analyte.commonNameList.join('; ');
              analyte.synonym = analyte.synonymList.join('; ');
              return analyte;
            });
            if (analyteMatch.rampIdList.length > 1) {
              analyteMatch.commonName = 'multiple analytes - click to view';
              analyteMatch.synonym = 'multiple analytes - click to view';
              analyteMatch.sourceIds = 'multiple analytes - click to view';
            } else {
              analyteMatch.commonName = analyteMatch.commonNameList.join('; ');
              analyteMatch.synonym = analyteMatch.synonymList.join('; ');
              analyteMatch.sourceIds = analyteMatch.sourceIdsList.join(', ');
            }
            return analyteMatch;
          });

          return analyteMatches;
        })
      );
  }
}
