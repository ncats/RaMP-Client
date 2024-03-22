import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  Analyte,
  ChemicalEnrichment,
  Classes,
  EntityCount,
  FisherResult,
  FishersDataframe,
  Metabolite,
  Ontology,
  OntologyList,
  Pathway,
  Properties,
  RampAPIResponse,
  RampChemicalEnrichmentAPIResponse,
  RampChemicalEnrichmentResponse, RampDataGeneric,
  RampPathwayEnrichmentAPIResponse,
  RampPathwayEnrichmentResponse,
  RampResponse,
  Reaction,
  SourceVersion
} from "@ramp/models/ramp-models";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
      .get<{ data: SourceVersion[] }>(`${this.url}source-versions`) // ,{responseType: 'text'})
      .pipe(
        map((response) => response.data),
        catchError(this.handleError('fetchSourceVersions', [])),
      );
  }

  fetchEntityCounts() {
    return this.http
      .get<{ data: {[p: string]: string}[] }>(`${this.url}entity-counts`) // ,{responseType: 'text'})
      .pipe(
        map((response: { data: {[p: string]: string}[] }) =>
          response.data.map((obj: {[p: string]: string}) => new EntityCount(obj)),
        ),
        catchError(this.handleError('fetchEntityCounts', [])),
      );
  }

  fetchSupportedIds(): Observable<
    { analyteType: string; idTypes: string[] }[]
  > {
    return this.http.get<{data: { analyteType: string; idTypes: string[] }[]}>(
      `${this.url}id-types`,
    )
      .pipe(
      map((response) => {
        return response.data;
      })
      )
  }

  fetchDatabaseUrl() {
    return this.http
      .get<{ data: string }>(`${this.url}current-db-file-url`)
      .pipe(
        map((response:{data:string}) => response.data),
      //  catchError(this.handleError('fetchAnalyteIntersects', [])),
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
      .get<{ data: { id: string; sets: string[]; size: number }[]; }>(
        `${this.url}analyte-intersects?analytetype=${param}&query_scope=global`,
      )
      .pipe(
        map((response: {data: { id: string; sets: string[]; size: number }[]}) => response.data),
        catchError(this.handleError('fetchAnalyteIntersects', [])),
      );
  }

  fetchPathwaysFromAnalytes(
    analytes: string[],
  ): Observable<RampResponse<Pathway>> {
    const options = {
      analytes: analytes,
    };
    return this.http
      .post<RampAPIResponse<Pathway>>(
        `${this.url}pathways-from-analytes`,
        options,
      ) // ,{responseType: 'text'})
      .pipe(
        map((response: RampAPIResponse<Pathway>) => {
          return {
            data: response.data.map((obj: Pathway) => new Pathway(obj)),
            query: {
              functionCall: response.function_call[0],
              numFoundIds: response.numFoundIds[0],
            },
            dataframe: response.data
          };
        }),
        //    catchError(this.handleError('pathways from analytes', of({})))
      );
  }

  fetchAnalytesFromPathways(
    pathways: string[],
  ): Observable<RampResponse<Analyte>> {
    const options = {
      pathway: pathways,
    };
    return this.http
      .post<RampAPIResponse<Analyte>>(
        `${this.url}analytes-from-pathways`,
        options,
      ) // ,{responseType: 'text'})
      .pipe(
        map((response: RampAPIResponse<Analyte>) => {
          return {
            data: response.data.map((obj: Partial<Analyte>) => new Analyte(obj)),
            query: {
              functionCall: response.function_call[0],
              numFoundIds: response.numFoundIds[0],
            },
            dataframe: response.data
          };
        }),
      );
  }

  fetchOntologiesFromMetabolites(
    analytes: string[],
  ): Observable<RampResponse<Ontology>> {
    const options = {
      metabolite: analytes,
    };
    return this.http
      .post<RampAPIResponse<Ontology>>(
        `${this.url}ontologies-from-metabolites`,
        options,
      ) // ,{responseType: 'text'})
      .pipe(
        map((response: RampAPIResponse<Ontology>) => {
          return {
            data: response.data.map((obj: unknown) => new Ontology(obj as {[key: string]: unknown})),
            query: {
              functionCall: response.function_call[0],
              numFoundIds: response.numFoundIds[0],
            },
            dataframe: response.data
          };
        }),
      );
  }

  fetchMetabolitesFromOntologies(
    ontologies: string[],
  ): Observable<RampResponse<Metabolite>> {
    const options = {
      ontology: ontologies, //.join(','),
    };
    return this.http
      .post<RampAPIResponse<Metabolite>>(
        `${this.url}metabolites-from-ontologies`,
        options,
      ) // ,{responseType: 'text'})
      .pipe(
        map((response: RampAPIResponse<Metabolite>) => {
          return {
            data: response.data.map((obj: Partial<Metabolite>) => new Metabolite(obj)),
            query: {
              functionCall: response.function_call[0],
              numFoundIds: response.numFoundIds[0],
            },
            dataframe: response.data
          };
        }),
      );
  }

  fetchOntologies(): Observable<RampResponse<OntologyList>> {
    return this.http
      .get<{ uniq_ontology_types: string[]; data: Ontology[] }>(
        `${this.url}ontology-types`,
      ) // ,{responseType: 'text'})
      .pipe(
        map((response: { uniq_ontology_types: string[]; data: Ontology[] }) => {
          const ontoMap: Map<string, OntologyList> = new Map<
            string,
            OntologyList
          >();
          response.uniq_ontology_types.forEach((onto: string) =>
            ontoMap.set(onto, { ontologyType: onto, values: [] }),
          );
          response.data.forEach((ontoType: Ontology) => {
            let cl: OntologyList | undefined = ontoMap.get(
              ontoType.HMDBOntologyType,
            );
            if (cl) {
              cl.values.push(new Ontology(<unknown>ontoType as {[key: string]: unknown}));
            } else {
              cl = new OntologyList({
                ontologyType: ontoType.HMDBOntologyType,
                values: [new Ontology(<unknown>ontoType as {[key: string]: unknown})],
              });
            }
            ontoMap.set(ontoType.HMDBOntologyType, cl);
          });
          return {
            data: [...ontoMap.values()],
            query: {},
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
      .post<
        string[]
      >(`${this.url}metabolites-from-ontologies`, params, HTTP_OPTIONS)
      .subscribe((response: unknown) => {
        this._downloadFile(
          response as Blob,
          'fetchMetabolitesFromOntologies-download.tsv',
        );
      });
  }

  fetchChemicalClass(
    metabolites: string[],
    biospecimen?: string,
    background?: File,
  ): Observable<RampResponse<Classes>> {
    const formData = new FormData();
    formData.set('metabolites', JSON.stringify(metabolites));
    if (biospecimen) {
      formData.set('biospecimen', JSON.stringify([biospecimen]));
    }
    if (background) {
      formData.set('file', background, background.name);
    }
    return this.http
      .post<RampAPIResponse<Classes>>(`${this.url}chemical-classes`, formData)
      .pipe(
        map((response: RampAPIResponse<Classes>) => {
          const tempResponse: {[key: string]: unknown}[] = <unknown>response.data as {[key: string]: unknown}[];
          let metClasses: Classes[] = [];
          const metabMap: Map<string, {[key: string]: unknown}> = new Map<string, {[key: string]: unknown}>();
          if (response.data && response.data.length) {
            tempResponse.forEach((chClass: {[key: string]: unknown}) => {
              let cl = metabMap.get(<string>chClass['sourceId']);
              if (cl) {
               const clArr: {[key: string]: unknown}[] = cl['levels'] as Array<{[key: string]: unknown}>;
                clArr.push(chClass);
                cl['levels'] = clArr;
              } else {
                cl = { sourceId: chClass['sourceId'], levels: [chClass] };
              }
              metabMap.set(<string>chClass['sourceId'], cl);
            });
            metClasses = [...metabMap.values()].map(
              (obj: { [key:string]: unknown }) => new Classes(obj ),
            );
          }
          return {
            data: metClasses,
            query: {
              functionCall: response.function_call[0],
              numFoundIds: response.numFoundIds[0],
            },
            dataframe: response.data as unknown[]
          };
        }),
      );
  }

  fetchPropertiesFromMetabolites(
    metabolites: string[],
  ): Observable<RampResponse<Properties>> {
    const options = {
      metabolites: metabolites,
    };
    return this.http
      .post<RampAPIResponse<Properties>>(
        `${this.url}chemical-properties`,
        options,
      ) // ,{responseType: 'text'})
      .pipe(
        map((response: RampAPIResponse<Properties>) => {
          return {
            data: response.data.map((obj: Partial<Properties>) => new Properties(obj)),
            query: {
              functionCall: response.function_call[0],
              numFoundIds: response.numFoundIds[0],
            },
            dataframe: response.data
          };
        }),
      );
  }

  fetchCommonReactionAnalytes(
    analytes: string[],
  ): Observable<RampResponse<Reaction>> {
    const options = {
      analyte: analytes,
    };
    return this.http
      .post<
        RampAPIResponse<Reaction>
      >(`${this.url}common-reaction-analytes`, options)
      .pipe(
        map((response: RampAPIResponse<Reaction>) => {
          return {
            data: response.data.map((obj: unknown) => new Reaction(obj as { [key:string]: unknown })),
            query: {
              functionCall: response.function_call[0],
              numFoundIds: response.numFoundIds[0],
            },
            dataframe: response.data
          };
        }),
      );
  }

  fetchEnrichmentFromMetabolites(
    metabolites: string[],
    biospecimen?: string,
    background?: File,
  ): Observable<RampChemicalEnrichmentResponse> {
    const formData = new FormData();
    formData.set('metabolites', JSON.stringify(metabolites));
    if (biospecimen) {
      formData.set('biospecimen', JSON.stringify([biospecimen]));
    }
    if (background) {
      formData.set('file', background, background.name);
    }
    return this.http
      .post<RampChemicalEnrichmentAPIResponse>(
        `${this.url}chemical-enrichment`,
        formData,
      )
      .pipe(
        map((response: RampChemicalEnrichmentAPIResponse) => {
          const retList: ChemicalEnrichment[] = [];
          const responseClone = response.data;
          //  delete responseClone.result_type;
          [...Object.values(responseClone)].forEach((val: unknown[]) => {
              if (typeof val[0] !== 'string') {
                val.forEach((cc: unknown) => {
                  retList.push(new ChemicalEnrichment(cc as { [key: string]: unknown }));
                })
              }
            }
          );
          return {
            data: response,
            enriched_chemical_class_list: retList,
          } as RampChemicalEnrichmentResponse;
        }),
        // catchError(this.handleError('chemical enrichment', [])),
      );
  }

  filterMetaboliteEnrichment(
    dataframe: RampChemicalEnrichmentResponse,
    pval_type?: string,
    pval_cutoff?: number,
  ) {
    return this.http
      .post<RampChemicalEnrichmentAPIResponse>(`${this.url}filter-fisher-test-results`, {
        fishers_results: dataframe.data,
        pval_type: pval_type,
        pval_cutoff: pval_cutoff,
      })
      .pipe(
        map((response:RampChemicalEnrichmentAPIResponse) => {
          const retList: ChemicalEnrichment[] = [];
          [...Object.values(response.data)].forEach((val: unknown[]) => {
           return  val.forEach((cc: unknown) => {
                if (cc != 'chemical_class_enrichment')
                  retList.push(new ChemicalEnrichment(cc as { [key: string]: unknown }));
              })
            }
          );
          return {
            data: response.data,
            enriched_chemical_class_list: retList,
          };
        }),
      );
  }

  fetchEnrichmentFromMetabolitesFile(data: ChemicalEnrichment[]) {
    /*    const enrichments: string[] = [];
    data.forEach((val: ChemicalEnrichment[]) => {
      val.forEach((v: string) => enrichments.push(v));
    });
    enrichments.pop();*/
    this._downloadFile(
      this._makeBlob(this._toTSV(data)),
      'fetchEnrichmentFromMetabolites-download.tsv',
    );
  }

  fetchEnrichmentFromPathways(
    analytes: string[],
    biospecimen?: string,
    background?: File,
  ): Observable<RampPathwayEnrichmentResponse> {
    const formData = new FormData();
    formData.set('analytes', JSON.stringify(analytes));
    if (biospecimen) {
      formData.set('biospecimen', JSON.stringify([biospecimen]));
    }
    if (background) {
      formData.set('file', background, background.name);
    }
    return this.http
      .post<RampPathwayEnrichmentAPIResponse>(
        `${this.url}combined-fisher-test`,
        formData,
      )
      .pipe(
        map((response: RampPathwayEnrichmentAPIResponse) => {
          return {
            data: response.data.fishresults.map(
              (obj: Partial<FisherResult>) => new FisherResult(obj),
            ),
            combinedFishersDataframe: response.data as FishersDataframe,
            query: {
              functionCall: response.function_call
                ? response.function_call[0]
                : undefined,
            },
          } as RampPathwayEnrichmentResponse;
        }),
      );
  }

  filterPathwayEnrichment(
    dataframe: FishersDataframe,
    pval_type?: string,
    pval_cutoff?: number,
  ): Observable<RampPathwayEnrichmentResponse> {
    return this.http
      .post<RampPathwayEnrichmentAPIResponse>(
        `${this.url}filter-fisher-test-results`,
        {
          fishers_results: dataframe,
          pval_type: pval_type,
          pval_cutoff: pval_cutoff,
        },
      )
      .pipe(
        map((response: RampPathwayEnrichmentAPIResponse) => {
          return {
            data: response.data.fishresults.map(
              (obj: Partial<FisherResult>) => new FisherResult(obj),
            ),
            filteredFishersDataframe: response.data as FishersDataframe,
            query: {
              functionCall: response.function_call
                ? response.function_call[0]
                : undefined,
            },
          } as RampPathwayEnrichmentResponse;
        }),
      );
  }

  getClusterdData(
    dataframe: FishersDataframe,
    perc_analyte_overlap?: number,
    min_pathway_tocluster?: number,
    perc_pathway_overlap?: number,
  ):Observable<{ data: RampPathwayEnrichmentResponse, plot: string }> {
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
    dataframe: FishersDataframe,
    perc_analyte_overlap?: number,
    min_pathway_tocluster?: number,
    perc_pathway_overlap?: number,
  ): Observable<RampPathwayEnrichmentResponse> {
    return this.http
      .post<RampPathwayEnrichmentAPIResponse>(
        `${this.url}cluster-fisher-test-results`,
        {
          fishers_results: dataframe,
          perc_analyte_overlap: perc_analyte_overlap,
          min_pathway_tocluster: min_pathway_tocluster,
          perc_pathway_overlap: perc_pathway_overlap,
        },
      )
      .pipe(
        map((response: RampPathwayEnrichmentAPIResponse) => {
          return {
            data: response.data.fishresults.map(
              (obj: unknown) => new FisherResult(obj as Partial<FisherResult>),
            ),
            query: {},
            combinedFishersdataframe: response.data as FishersDataframe,
          } as RampPathwayEnrichmentResponse;
        }),
        // catchError(this.handleError('chemical enrichment', [])),
      );
  }

  fetchClusterPlot(
    dataframe: FishersDataframe,
    perc_analyte_overlap?: number,
    min_pathway_tocluster?: number,
    perc_pathway_overlap?: number,
  ): Observable<string> {
    if (!dataframe.fishresults || dataframe.fishresults.length >= 100) {
      //todo: check that this doesn't break
      return of(<string>'');
    } else {
      const body = {
        fishers_results: dataframe,
        text_size: 8,
        perc_analyte_overlap: perc_analyte_overlap,
        min_pathway_tocluster: min_pathway_tocluster,
        perc_pathway_overlap: perc_pathway_overlap,
        filename: Date.now() + '.svg',
      };
      return this.http
        .post(`${this.url}cluster-plot`, body, HTTP_TEXT_OPTIONS)
        .pipe(
          map((response: unknown) => {
            return <string>response;
          }),
        );
    }
  }

  fetchClusterImageFile(data: string) {
    this._downloadFile(
      this._makeBlob([data], 'image/svg+xml'),
      'fetchClusterImageFile-download.svg',
    );
  }

  private _toTSV<T extends RampDataGeneric>(data: unknown[]): string[] {
    // grab the column headings (separated by tabs)
    const headings: string = Object.keys(data[0] as string[]).join('\t');
    // iterate over the data
    const rows: string[] = <string[]><unknown>data
      .reduce(
        (acc: string[], c: unknown) => {
          // for each row object get its values and add tabs between them
          // then add them as a new array to the outgoing array
          const vals = Object.values(c as T);
          const row = vals.join('\t');
          return acc.concat(row);

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
    return (error: ErrorEvent): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
     // console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
       console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  _setUrl(url: string): void {
    this.url = url;
  }

  private _makeBlob(data: string[], type = 'text/tsv'): Blob {
    return new Blob([...data], { type: type });
  }

  private _downloadFile(blob: Blob, name: string) {
    const link = this.dom.createElement('a');
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${name}`);
      link.style.visibility = 'hidden';
      this.dom.body.appendChild(link);
      link.click();
      this.dom.body.removeChild(link);
    }
  }
}
