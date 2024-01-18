import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  Analyte,
  ChemicalEnrichment,
  Classes,
  EntityCount,
  FisherResult,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  Reaction,
  SourceVersion, Stats
} from "@ramp/models/ramp-models";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of, tap } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

const HTTP_OPTIONS = {
  headers: new HttpHeaders(),
  responseType: 'blob' as 'json',
};

const HTTP_TEXT_OPTIONS = {
  headers: new HttpHeaders(),
  responseType: 'text' as const,
};

@Injectable({
  providedIn: 'root',
})
export class RampService {
  private url!: string;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private dom: Document,
  ) {}

  loadAboutData() {
    return forkJoin({
      sourceVersions: this.fetchSourceVersions(),
      entityCounts: this.fetchEntityCounts(),
      metaboliteIntersects: this.fetchMetaboliteIntersects(),
      geneIntersects: this.fetchGeneIntersects(),
      supportedIds: this.fetchSupportedIds(),
      databaseUrl: this.fetchDatabaseUrl(),
    });
  }

  fetchSourceVersions(): Observable<SourceVersion[]> {
    return this.http
      .get<{ data: SourceVersion[] }>(`${this.url}source_versions`) // ,{responseType: 'text'})
      .pipe(
        map((response) => response.data),
        catchError(this.handleError('fetchSourceVersions', [])),
      );
  }

  fetchEntityCounts() {
    return this.http
      .get<{ data: any[] }>(`${this.url}entity_counts`) // ,{responseType: 'text'})
      .pipe(
        map((response) => response.data.map((obj) => new EntityCount(obj))),
        catchError(this.handleError('fetchEntityCounts', [])),
      );
  }

  fetchSupportedIds(): Observable<[{ analyteType: string; idTypes: string[] }] > {
    return this.http.get<[{ analyteType: string; idTypes: string[] }]>(`${this.url}id-types`);
  }

  fetchDatabaseUrl() {
    return this.http
      .get<{ data: any[] }>(`${this.url}current_db_file_url`)
      .pipe(
        map((response) => {
          return response.data;
        }),
        catchError(this.handleError('fetchAnalyteIntersects', [])),
      );
  }

  fetchMetaboliteIntersects() {
    return this.fetchAnalyteIntersects('metabolites');
  }

  fetchGeneIntersects() {
    return this.fetchAnalyteIntersects('genes');
  }

  fetchAnalyteIntersects(param: string) {
    return this.http
      .get<{ data: any[] }>(
        `${this.url}analyte_intersects?analytetype=${param}&query_scope=global`,
      )
      .pipe(
        map((response) => response.data),
        catchError(this.handleError('fetchAnalyteIntersects', [])),
      );
  }

  fetchPathwaysFromAnalytes(analytes: string[]): Observable<{
    pathways: Pathway[];
    functionCall: string;
    numFoundIds: number;
    dataframe: any;
  }> {
    const options = {
      analytes: analytes,
    };
    return this.http
      .post<string[]>(`${this.url}pathways-from-analytes`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            pathways: response.data.map((obj: any) => new Pathway(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
            dataframe: response.data,
          };
        }),
        //    catchError(this.handleError('pathways from analytes', of({})))
      );
  }

  fetchAnalytesFromPathways(pathways: string[]): Observable<{
    analytes: Analyte[];
    functionCall: string;
    numFoundIds: number;
    dataframe: any;
  }> {
    const options = {
      pathway: pathways,
    };
    return this.http
      .post<string[]>(`${this.url}analytes-from-pathways`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            analytes: response.data.map((obj: any) => new Analyte(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
            dataframe: response.data,
          };
        }),
      );
  }

  fetchOntologiesFromMetabolites(analytes: string[]): Observable<{
    ontologies: Ontology[];
    functionCall: string;
    numFoundIds: number;
    dataframe: any;
  }> {
    const options = {
      metabolite: analytes,
    };
    return this.http
      .post<string[]>(`${this.url}ontologies-from-metabolites`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            ontologies: response.data.map((obj: any) => new Ontology(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
            dataframe: response.data,
          };
        }),
      );
  }

  fetchMetabolitesFromOntologies(ontologies: string[]): Observable<{
    metabolites: Metabolite[];
    functionCall: string;
    numFoundIds: number;
    dataframe: any;
  }> {
    const options = {
      ontology: ontologies, //.join(','),
    };
    return this.http
      .post<string[]>(`${this.url}metabolites-from-ontologies`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            metabolites: response.data.map((obj: any) => new Metabolite(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
            dataframe: response.data,
          };
        }),
      );
  }

  fetchOntologies() {
    return this.http
      .get<string[]>(`${this.url}ontology-types`) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          const ontoMap: Map<
            string,
            { ontologyType: string; values: Ontology[] }
          > = new Map<string, { ontologyType: string; values: Ontology[] }>();
          response.uniq_ontology_types.forEach((onto: string) =>
            ontoMap.set(onto, { ontologyType: onto, values: [] }),
          );
          response.data.forEach((ontoType: any) => {
            let cl = ontoMap.get(ontoType.HMDBOntologyType);
            if (cl) {
              cl.values.push(new Ontology(ontoType));
            } else {
              cl = {
                ontologyType: ontoType.HMDBOntologyType,
                values: [new Ontology(ontoType)],
              };
            }
            ontoMap.set(ontoType.HMDBOntologyType, cl);
          });
          return {
            data: [...ontoMap.values()],
          };
        }),
        //  catchError(this.handleError('pathways from analytes', []))
      );
  }

  fetchMetabolitesFromOntologiesFile(ontologies: string[], format: string) {
    const params = {
      ontology: ontologies.join(','),
      format: format,
    };
    this.http
      .post<string[]>(
        `${this.url}metabolites-from-ontologies`,
        params,
        HTTP_OPTIONS,
      )
      .subscribe((response: any) =>
        this._downloadFile(
          response,
          'fetchMetabolitesFromOntologies-download.tsv',
        ),
      );
  }

  fetchChemicalClass(
    metabolites: string[],
    biospecimen?: string,
    background?: File,
  ): Observable<{
    metClasses: Classes[];
    functionCall: string;
    numFoundIds: number;
    dataframe: any;
  }> {
    const formData = new FormData();
    formData.set('metabolites', JSON.stringify(metabolites));
    if (biospecimen) {
      formData.set('biospecimen', JSON.stringify([biospecimen]));
    }
    if (background) {
      formData.set('file', background, background.name);
    }
    return this.http
      .post<string[]>(`${this.url}chemical-classes`, formData)
      .pipe(
        map((response: any) => {
          let metClasses: Classes[] = [];
          const metabMap: Map<string, any> = new Map<string, any>();
          if (response.data && response.data.length) {
            response.data.forEach((chClass: any) => {
              let cl = metabMap.get(chClass.sourceId);
              if (cl) {
                cl.levels.push(chClass);
              } else {
                cl = { sourceId: chClass.sourceId, levels: [chClass] };
              }
              metabMap.set(chClass.sourceId, cl);
            });
            metClasses = [...metabMap.values()].map(
              (obj: any) => new Classes(obj),
            );
          }
          return {
            metClasses: metClasses,
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
            dataframe: response.data,
          };
        }),
      );
  }

  fetchPropertiesFromMetabolites(metabolites: string[]): Observable<{
    properties: Properties[];
    functionCall: string;
    numFoundIds: number;
    dataframe: any;
  }> {
    const options = {
      metabolites: metabolites,
    };
    return this.http
      .post<string[]>(`${this.url}chemical-properties`, options) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          return {
            properties: response.data.map((obj: any) => new Properties(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
            dataframe: response.data,
          };
        }),
      );
  }

  fetchCommonReactionAnalytes(analytes: string[]): Observable<{
    reactions: Reaction[];
    functionCall: string;
    numFoundIds: number;
    dataframe: any;
  }> {
    const options = {
      analyte: analytes,
    };
    return this.http
      .post<string[]>(`${this.url}common-reaction-analytes`, options)
      .pipe(
        map((response: any) => {
          return {
            reactions: response.data.map((obj: any) => new Reaction(obj)),
            functionCall: response.function_call[0],
            numFoundIds: response.numFoundIds[0],
            dataframe: response.data,
          };
        }),
      );
  }

  fetchEnrichmentFromMetabolites(
    metabolites: string[],
    biospecimen?: string,
    background?: File,
  ) {
    const formData = new FormData();
    formData.set('metabolites', JSON.stringify(metabolites));
    if (biospecimen) {
      formData.set('biospecimen', JSON.stringify([biospecimen]));
    }
    if (background) {
      formData.set('file', background, background.name);
    }
    return this.http
      .post<string[]>(`${this.url}chemical-enrichment`, formData) // ,{responseType: 'text'})
      .pipe(
        map((response: any) => {
          const retList: ChemicalEnrichment[] = [];
          [...Object.values(response.data)].forEach((val: any) =>
            val.forEach((cc: any) => {
              if (cc != 'chemical_class_enrichment')
                retList.push(new ChemicalEnrichment(cc));
            }),
          );
          return {
            data: retList,
            enriched_chemical_class: response.data,
          };
        }),
        catchError(this.handleError('chemical enrichment', [])),
      );
  }

  filterMetaboliteEnrichment(
    dataframe: any,
    pval_type?: string,
    pval_cutoff?: number,
  ) {
    return this.http
      .post<string[]>(`${this.url}filter-fisher-test-results`, {
        fishers_results: dataframe,
        pval_type: pval_type,
        pval_cutoff: pval_cutoff,
      })
      .pipe(
        map((response: any) => {
          const retList: ChemicalEnrichment[] = [];
          [...Object.values(response.data)].forEach((val: any) =>
            val.forEach((cc: any) => {
              if (cc != 'chemical_class_enrichment')
                retList.push(new ChemicalEnrichment(cc));
            }),
          );
          return {
            data: retList,
            enriched_chemical_class: response.data,
          };
        }),
      );
  }

  fetchEnrichmentFromMetabolitesFile(data: any[]) {
    const enrichments: any = [];
    Object.values(data).forEach((val: any[]) => {
      val.forEach((v) => enrichments.push(v));
    });
    enrichments.pop();
    this._downloadFile(
      this._toTSV(enrichments),
      'fetchEnrichmentFromMetabolites-download.tsv',
    );
  }

  fetchEnrichmentFromPathways(
    analytes: string[],
    biospecimen?: string,
    background?: File,
  ): Observable<{
    data: FisherResult[];
    functionCall: string;
    combinedFishersDataframe: any;
  }> {
    const formData = new FormData();
    formData.set('analytes', JSON.stringify(analytes));
    if (biospecimen) {
      formData.set('biospecimen', JSON.stringify([biospecimen]));
    }
    if (background) {
      formData.set('file', background, background.name);
    }
    return this.http
      .post<string[]>(`${this.url}combined-fisher-test`, formData)
      .pipe(
        map((response: any) => {
          return {
            data: response.data.fishresults.map(
              (obj: any) => new FisherResult(obj),
            ),
            combinedFishersDataframe: response.data,
            functionCall: response.function_call[0],
          };
        }),
      );
  }

  filterPathwayEnrichment(
    dataframe: any,
    pval_type?: string,
    pval_cutoff?: number,
  ) {
    return this.http
      .post<string[]>(`${this.url}filter-fisher-test-results`, {
        fishers_results: dataframe,
        pval_type: pval_type,
        pval_cutoff: pval_cutoff,
      })
      .pipe(
        map((response: any) => {
          return {
            data: response.data.fishresults.map(
              (obj: any) => new FisherResult(obj),
            ),
            filteredFishersDataframe: response.data,
            functionCall: response.function_call[0],
          };
        }),
      );
  }

  getClusterdData(
    dataframe: any,
    perc_analyte_overlap?: number,
    min_pathway_tocluster?: number,
    perc_pathway_overlap?: number,
  ) {
    return forkJoin({
      data: this.clusterPathwayEnrichment(
        dataframe,
        perc_analyte_overlap,
        min_pathway_tocluster,
        perc_pathway_overlap,
      ),
      plot: this.fetchClusterPlot(
        dataframe,
        perc_analyte_overlap,
        min_pathway_tocluster,
        perc_pathway_overlap,
      ),
    });
  }

  clusterPathwayEnrichment(
    dataframe: any,
    perc_analyte_overlap?: number,
    min_pathway_tocluster?: number,
    perc_pathway_overlap?: number,
  ) {
    return this.http
      .post<string[]>(`${this.url}cluster-fisher-test-results`, {
        fishers_results: dataframe,
        perc_analyte_overlap: perc_analyte_overlap,
        min_pathway_tocluster: min_pathway_tocluster,
        perc_pathway_overlap: perc_pathway_overlap,
      })
      .pipe(
        map((response: any) => {
          return {
            data: response.data.fishresults.map(
              (obj: any) => new FisherResult(obj),
            ),
            combinedFishersDataframe: response.data,
          };
        }),
        catchError(this.handleError('chemical enrichment', [])),
      );
  }

  fetchClusterPlot(
    dataframe: any,
    perc_analyte_overlap?: number,
    min_pathway_tocluster?: number,
    perc_pathway_overlap?: number,
  ) {
    if (!dataframe.fishresults || dataframe.fishresults.length >= 100) {
      return '';
    } else {
      const body = {
        fishers_results: dataframe,
        text_size: 8,
        perc_analyte_overlap: perc_analyte_overlap,
        min_pathway_tocluster: min_pathway_tocluster,
        perc_pathway_overlap: perc_pathway_overlap,
        filename: Date.now() + '.svg',
      };
      const options: Object = { responseType: 'text' as const };
      return this.http
        .post<string[]>(`${this.url}cluster-plot`, body, options)
        .pipe(
          map((response: any) => {
            return response.toString();
          }),
          catchError(this.handleError('chemical enrichment', [])),
        );
    }
  }

  fetchClusterImageFile(data: any) {
    this._downloadFile(
      data,
      'fetchClusterImageFile-download.svg',
      'image/svg+xml',
    );
  }

  private _toTSV(data: any[]): any[] {
    // grab the column headings (separated by tabs)
    const headings: string = Object.keys(data[0]).join('\t');
    // iterate over the data
    const rows: string[] = data
      .reduce(
        (acc, c) => {
          // for each row object get its values and add tabs between them
          // then add them as a new array to the outgoing array
          return acc.concat([Object.values(c).join('\t')]);

          // finally joining each row with a line break
        },
        [headings],
      )
      .join('\n');
    return rows;
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
      // console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  _setUrl(url: string): void {
    this.url = url;
  }

  private _downloadFile(data: any, name: string, type: string = 'text/tsv') {
    const file = new Blob([data], { type: type });
    const link = this.dom.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(file);
      link.setAttribute('href', url);
      link.setAttribute('download', `${name}`);
      link.style.visibility = 'hidden';
      this.dom.body.appendChild(link);
      link.click();
      this.dom.body.removeChild(link);
    }
  }
}
