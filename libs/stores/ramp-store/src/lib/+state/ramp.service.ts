import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class RampService {
  private url!: string;

  constructor(private http: HttpClient) {}

  fetchSourceVersions(): Observable<any> {
    return this.http
      .get(this.url) // ,{responseType: 'text'})
      .pipe(
        map((response) => {
          console.log(response);
          return response;
        }),
        catchError(this.handleError('getData', []))
      );
  }

  fetchEntityCounts() {}

  fetchAnalyteIntersects() {}

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
