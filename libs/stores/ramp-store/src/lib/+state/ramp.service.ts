import { Injectable } from '@angular/core';
import {Analyte, EntityCount, Ontology, Pathway, SourceVersion} from "@ramp/models/ramp-models";
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, of} from "rxjs";
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class RampService {
  private url!: string;

  constructor(private http: HttpClient) {}

  loadAboutData() {
    return forkJoin({
      sourceVersions: this.fetchSourceVersions(),
      entityCounts: this.fetchEntityCounts(),
      metaboliteIntersects: this.fetchMetaboliteIntersects(),
      geneIntersects: this.fetchGeneIntersects()
    });
  }

  fetchSourceVersions(): Observable<SourceVersion[]> {
    return this.http
      .get<{data: SourceVersion[]}>(`${this.url}source_versions`) // ,{responseType: 'text'})
      .pipe(
        map((response) => response.data),
        catchError(this.handleError('fetchSourceVersions', []))
      );
  }

  fetchEntityCounts() {
    return this.http
      .get<{data: any[]}>(`${this.url}entity_counts`) // ,{responseType: 'text'})
      .pipe(
        map((response) => response.data.map(obj => new EntityCount(obj))),
        catchError(this.handleError('fetchEntityCounts', []))
      );
  }

  fetchMetaboliteIntersects(){
    return this.fetchAnalyteIntersects('mets');
  }

  fetchGeneIntersects(){
    return this.fetchAnalyteIntersects('genes');
  }

  fetchAnalyteIntersects(param: string) {
    return this.http
      .get<{data: any[]}>(`${this.url}analyte_intersects?analytetype=${param}`) // ,{responseType: 'text'})
      .pipe(
        map((response) => response.data),
        catchError(this.handleError('fetchAnalyteIntersects', []))
      );
  }
/*
  fetchAnalyteIntersects() {
    return this.http
      .get(`${this.url}analyte_intersects`) // ,{responseType: 'text'})
      .pipe(
        map((response) => {
          const ret = { compounds: [], genes: [] };
          Object.keys(response).map(
            (key: string) =>
              //todo: fix the ts-ignore
              // @ts-ignore
              (ret[key] = response[key].map((val, i) => {
                val.id = i;
                if (typeof val.sets === 'string') {
                  val.sets = [val.sets];
                }
                return val;
              }))
          );
          return response;
        }),
        catchError(this.handleError('fetchAnalyteIntersects', []))
      );
  }
*/

  fetchOntologiesFromMetabolites(analytes: string[]) {
    const options = {
        metabolite: analytes
    };
    return this.http
      .post<string[]>(`${this.url}ontologies`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return response.data.map((obj: any) => new Ontology(obj))
        }),
        catchError(this.handleError('ontologies', []))
      );
  }

  fetchAnalytesFromPathways(pathways: string[]) {
    const options = {
        pathway: pathways
    };
    return this.http
      .post<string[]>(`${this.url}analytes-from-pathways`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return response.data.map((obj: any) => new Analyte(obj))
        }),
        catchError(this.handleError('analytes-from-pathways', []))
      );
  }

  fetchPathwaysFromAnalytes(analytes: string[]) {
    const options = {
        analyte: analytes
    };
    return this.http
      .post<string[]>(`${this.url}pathways-from-analytes`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return response.data.map((obj: any) => new Pathway(obj))
        }),
        catchError(this.handleError('pathways from analytes', []))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  _setUrl(url: string): void {
    this.url = url;
  }
}
