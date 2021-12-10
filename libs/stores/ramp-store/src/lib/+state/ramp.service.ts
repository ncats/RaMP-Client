import { Injectable } from '@angular/core';
import {EntityCount, SourceCount, SourceVersion} from "@ramp/models/ramp-models";
import {HttpClient, HttpParamsOptions} from '@angular/common/http';
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
      analyteIntersects: this.fetchAnalyteIntersects()
    });
  }

  fetchSourceVersions(): Observable<SourceVersion[]> {
    return this.http
      .get<SourceVersion[]>(`${this.url}source_versions`) // ,{responseType: 'text'})
      .pipe(
        map((response: SourceVersion[]) => response),
        catchError(this.handleError('fetchSourceVersions', []))
      );
  }

  fetchEntityCounts() {
    return this.http
      .get<SourceCount[]>(`${this.url}entity_counts`) // ,{responseType: 'text'})
      .pipe(
        map((response) => {
          console.log(response);
          const group: Map<string, EntityCount> = new Map<string, EntityCount>();
          response.forEach((sourceCount: SourceCount) => {
            const key = sourceCount.entity;
            const collection: EntityCount | undefined = group.get(key);
            if (!collection) {
              const countDict: EntityCount = {category: key};
              countDict[sourceCount.entitySourceId] = sourceCount.entityCount;
              group.set(key, countDict);
            } else {
              collection[sourceCount.entitySourceId] = sourceCount.entityCount;
              group.set(key, collection);
            }
          });
          return Array.from(group.values());
        }),
        catchError(this.handleError('fetchEntityCounts', []))
      );
  }

  fetchAnalyteIntersects() {
    return this.http
      .get(`${this.url}analyte_intersects`) // ,{responseType: 'text'})
      .pipe(
        map((response) => {
          const ret = { compounds: [], genes: [] };
          console.log(response);
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

  fetchOntologiesFromMetabolites(analytes: string[]) {
    console.log(analytes);
    const options = {
      params: {
        metabolite: analytes
      }
    };

    return this.http
      .get<string[]>(`${this.url}ontologies`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any[]) => {
          console.log(response)
          return response
        }),
        catchError(this.handleError('fetchSourceVersions', []))
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
    console.log(url);
    this.url = url;
  }
}
