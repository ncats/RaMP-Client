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
import {combineLatest, concat, forkJoin, Observable, of} from "rxjs";
import { catchError, map, mergeMap } from 'rxjs/operators';
import {ChemicalEnrichment} from "../../../../../models/ramp-models/src/lib/chemical-enrichment";
import {FisherResult} from "../../../../../models/ramp-models/src/lib/fisher-result";
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

  fetchOntologiesFromMetabolites(analytes: string[]): Observable<{ontologies: Ontology[], functionCall: string, numFoundIds: number}> {
    const options = {
        metabolite: analytes
    };
    return this.http
      .post<string[]>(`${this.url}ontologies-from-metabolites`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            ontologies: response.data.map((obj: any) => new Ontology(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0]
          }
        })
      );
  }

  fetchMetabolitesFromOntologies(ontologies: string[]): Observable<{metabolites: Metabolite[], functionCall: string, numFoundIds: number}> {
    const options = {
      ontology: ontologies.join(',')
    };
    return this.http
      .post<string[]>(`${this.url}metabolites-from-ontologies`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            metabolites: response.data.map((obj: any) => new Metabolite(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0]
          }
        })
      );
  }

  fetchOntologies() {
    return this.http
      .get<string[]>(`${this.url}ontology-types`) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          console.log(response);
          return response.data //.map((obj: any) => new Pathway(obj))
        }),
        catchError(this.handleError('pathways from analytes', []))
      );
  }

  fetchAnalytesFromPathways(pathways: string[]): Observable<{analytes: Analyte[], functionCall: string, numFoundIds: number}> {
    const options = {
        pathway: pathways
    };
    return this.http
      .post<string[]>(`${this.url}analytes-from-pathways`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            analytes: response.data.map((obj: any) => new Analyte(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0]
          }
        })
      );
  }

  fetchPathwaysFromAnalytes(analytes: string[]): Observable<{pathways: Pathway[], functionCall: string, numFoundIds: number}> {
    const options = {
        analyte: analytes
    };
    return this.http
      .post<string[]>(`${this.url}pathways-from-analytes`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            pathways: response.data.map((obj: any) => new Pathway(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0]
          }
        })
      );
  }

fetchCommonReactionAnalytes(analytes: string[]): Observable<{reactions: Reaction[], functionCall: string, numFoundIds: number}> {
    const options = {
        analyte: analytes
    };
    return this.http
      .post<string[]>(`${this.url}common-reaction-analytes`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          console.log(response)
          return {
            reactions: response.data.map((obj: any) => new Reaction(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0]
          }
        })
      );
  }

fetchChemicalClass(metabolites: string[]): Observable<{metClasses: Classes[], functionCall: string, numFoundIds: number}>{
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
          return {
            metClasses: [...metabMap.values()].map((obj: any) => new Classes(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0]
          }
        })
      );
  }

fetchChemicalProperties(metabolites: string[]): Observable<{properties: Properties[], functionCall: string, numFoundIds: number}> {
    const options = {
        metabolites: metabolites
    };
    return this.http
      .post<string[]>(`${this.url}chemical-properties`,  options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          console.log(response)
          return {
            properties: response.data.map((obj: any) => new Properties(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0]
          }
        })
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
  fetchEnrichmentFromPathways(analytes: string[], p_holmadj_cutoff: number, p_fdradj_cutoff: number) {
    return this.http
     // .post<string[]>(`${this.url}pathways-from-analytes`,  {analyte: analytes})
      .post<string[]>(`${this.url}combined-fisher-test`,  {pathways: analytes})
      .pipe(
        /* mergeMap((response: any) => {
           console.log(response);
           return this.http
             .post<string[]>(`${this.url}combined-fisher-test`,  {pathways: response.data})
         }),*/
         mergeMap((req: any) => {
           console.log(req);
           return this.http
             .post<string[]>(`${this.url}filter-fisher-test-results`,  {
               fishers_results: req.data.fishresults,
               p_holmadj_cutoff:  p_holmadj_cutoff,
               p_fdradj_cutoff: p_fdradj_cutoff
             })
         }),
  /*      mergeMap((req: any) => {
           console.log(req);
           return this.http
             .post<string[]>(`${this.url}cluster-fisher-test-results`,  {
               fishers_results: req.data.fishresults
             })
         }),*/
         map((response: any) => {
               console.log(response)
               return response.data.fishresults.map((obj: any) => new FisherResult(obj));
         })
       )
  }


fetchEnrichmentFromPathways2(analytes: string[]) {
       const pathways = this.fetchPathwaysFromAnalytes(analytes);
      return pathways
        .pipe(
         mergeMap(pathways => {
           console.log(pathways);
           const options = {
             pathways: pathways
           };
           return this.http
             .post<string[]>(`${this.url}combined-fisher-test`,  options)
         }),
         map((response: any) => {
               console.log(response)
               return response.data.fishresults.map((obj: any) => new FisherResult(obj));
         })
       )
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
