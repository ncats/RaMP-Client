import { Injectable } from '@angular/core';
import {
  Analyte,
  Classes,
  EntityCount,
  Metabolite,
  Ontology,
  Pathway, Properties,
  Reaction,
  SourceVersion
} from "@ramp/models/ramp-models";
import {HttpClient} from '@angular/common/http';
import {combineLatest, forkJoin, Observable, of} from "rxjs";
import { catchError, map } from 'rxjs/operators';
import {ChemicalEnrichment} from "../../../../../models/ramp-models/src/lib/chemical-enrichment";
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

  fetchOntologiesFromMetabolites(analytes: string[]) {
    const options = {
        metabolite: analytes
    };
    return this.http
      .post<string[]>(`${this.url}ontologies-from-metabolites`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return response.data.map((obj: any) => new Ontology(obj))
        }),
        catchError(this.handleError('ontologies', []))
      );
  }

  fetchMetabolitesFromOntologies(ontologies: string[]) {
    const options = {
      ontology: ontologies.join(', ')
    };
    return this.http
      .post<string[]>(`${this.url}metabolites-from-ontologies`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return response.data.map((obj: any) => new Metabolite(obj))
        }),
        catchError(this.handleError('metabolites-from-ontologies', []))
      );
  }

  fetchOntologies(term: string) {
    console.log(term);
    const options = {
      params: {
        term: term
      }
    };
    return this.http
      .get<string[]>(`${this.url}ontology-types`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          console.log(response);
          return response.data //.map((obj: any) => new Pathway(obj))
        }),
        catchError(this.handleError('pathways from analytes', []))
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

fetchCommonReactionAnalytes(analytes: string[]) {
    const options = {
        analyte: analytes
    };
    return this.http
      .post<string[]>(`${this.url}common-reaction-analytes`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          console.log(response)
          return response.data.map((obj: any) => new Reaction(obj))
        }),
        catchError(this.handleError('common reaction analytes', []))
      );
  }

fetchChemicalClass(metabolites: string[]) {
    const options = {
        metabolites: metabolites
    };
    return this.http
      .post<string[]>(`${this.url}chemical-classes`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          const metabMap: Map<string, any> = new Map<string, any>();
          response.data.forEach((chClass: any) => {
            let cl = metabMap.get(chClass.sourceId);
            if (cl) {
              cl.levels.push(chClass);
            } else {
              cl = {sourceId: chClass.sourceId, levels: [chClass]}
            }
            metabMap.set(chClass.sourceId, cl);
          })
          return [...metabMap.values()].map((obj: any) => new Classes(obj));
        }),
        catchError(this.handleError('chemical class', []))
      );
  }

fetchChemicalProperties(metabolites: string[]) {
    const options = {
        metabolites: metabolites
    };
    return this.http
      .post<string[]>(`${this.url}chemical-properties`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          console.log(response)
          return response.data.map((obj: any) => new Properties(obj));
        }),
        catchError(this.handleError('chemical properties', []))
      );
  }

  fetchEnrichmentFromAnalytes(analytes: string[]) {
    const options = {
        analytes: analytes
    };
    return this.http
      .post<string[]>(`${this.url}chemical-properties`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          console.log(response)
          return response.data.map((obj: any) => new Properties(obj));
        }),
        catchError(this.handleError('chemical properties', []))
      );
  }
  fetchEnrichmentFromPathways(pathways: string[]) {
    const options = {
        pathways: pathways
    };
    return this.http
      .post<string[]>(`${this.url}chemical-properties`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          console.log(response)
          return response.data.map((obj: any) => obj);
        }),
        catchError(this.handleError('chemical properties', []))
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
