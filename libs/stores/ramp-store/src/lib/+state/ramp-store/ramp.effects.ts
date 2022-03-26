import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from "@ngrx/store";
import {
  Analyte,
  Ontology,
  Pathway,
  Reaction,
  SourceVersion,
} from '@ramp/models/ramp-models';
import {
 RampPartialState,
  RampService
} from "@ramp/stores/ramp-store";
import { mergeMap, of, tap, withLatestFrom } from "rxjs";
import { catchError, map } from 'rxjs/operators';

import * as RampActions from './ramp.actions';

@Injectable()
export class RampEffects {
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.init),
      mergeMap((action) =>
        this.rampService.fetchSupportedIds().pipe(
          map(
            (ret: any) => {
              return RampActions.initSuccess( {data: ret} );
            },
            catchError((error: ErrorEvent) =>
              of(RampActions.initFailure({ error }))
            )
          )
        )
      )
    )
  );

  initAbout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.initAbout),
      mergeMap((action) =>
        this.rampService.loadAboutData().pipe(
          map(
            (ret) => {
              return RampActions.loadRampAboutSuccess({ data: ret });
            },
            catchError((error: ErrorEvent) =>
              of(RampActions.loadSourceVersionsFailure({ error }))
            )
          )
        )
      )
    )
  );

  setSourceVersions = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.loadSourceVersions),
      mergeMap((action) =>
        this.rampService.fetchSourceVersions().pipe(
          map(
            (ret: SourceVersion[]) =>
              RampActions.loadSourceVersionsSuccess({ versions: ret }),
            catchError((error: ErrorEvent) =>
              of(RampActions.loadSourceVersionsFailure({ error }))
            )
          )
        )
      )
    )
  );

  fetchPathwaysFromAnalytes = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchPathwaysFromAnalytes),
      mergeMap((action) =>
        this.rampService.fetchPathwaysFromAnalytes(action.analytes).pipe(
          map(
            (ret: {
              pathways: Pathway[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) => {
              return RampActions.fetchPathwaysFromAnalytesSuccess({
                data: ret.pathways,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe
              });
            }
          ),
          catchError((error: ErrorEvent) => {
            console.log(error);
            return of(RampActions.fetchPathwaysFromAnalytesFailure({ error }));
          })
        )
      )
    )
  );

  fetchAnalytesFromPathways = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchAnalytesFromPathways),
      mergeMap((action) =>
        this.rampService.fetchAnalytesFromPathways(action.pathways).pipe(
          map(
            (ret: {
              analytes: Analyte[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) =>
              RampActions.fetchAnalytesFromPathwaysSuccess({
                data: ret.analytes,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe
              })
          ),
          catchError((error: ErrorEvent) =>
            of(RampActions.fetchAnalytesFromPathwaysFailure({ error }))
          )
        )
      )
    )
  );

  fetchOntologiesFromMetabolites = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchOntologiesFromMetabolites),
      mergeMap((action) =>
        this.rampService.fetchOntologiesFromMetabolites(action.analytes).pipe(
          map(
            (ret: {
              ontologies: Ontology[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) =>
              RampActions.fetchOntologiesFromMetabolitesSuccess({
                data: ret.ontologies,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe
              }),
            catchError((error: ErrorEvent) =>
              of(RampActions.fetchOntologiesFromMetabolitesFailure({ error }))
            )
          )
        )
      )
    )
  );

  fetchOntologies = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchOntologies),
      mergeMap(() =>
        this.rampService.fetchOntologies().pipe(
          map(
            (ret: any) =>
              RampActions.fetchOntologiesSuccess({ ontologies: ret }),
            catchError((error: ErrorEvent) =>
              of(RampActions.fetchOntologiesFailure({ error }))
            )
          )
        )
      )
    )
  );

  fetchMetabolitesFromOntologies = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchMetabolitesFromOntologies),
      mergeMap((action) =>
        this.rampService.fetchMetabolitesFromOntologies(action.ontologies).pipe(
          map(
            (ret: {
              metabolites: any[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) =>
              RampActions.fetchMetabolitesFromOntologiesSuccess({
                data: ret.metabolites,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe
              }),
            catchError((error: ErrorEvent) =>
              of(RampActions.fetchMetaboliteFromOntologiesFailure({ error }))
            )
          )
        )
      )
    )
  );

  fetchMetabolitesFromOntologiesFile = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RampActions.fetchMetabolitesFromOntologiesFile),
        tap((action) =>
          this.rampService.fetchMetabolitesFromOntologiesFile(
            action.ontologies,
            action.format
          )
        )
      ),
    { dispatch: false }
  );

  fetchClassesFromMetabolites = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchClassesFromMetabolites),
      mergeMap((action) =>
        this.rampService.fetchChemicalClass(
          action.metabolites,
          action.pop
        ).pipe(
          map(
            (ret: {
              metClasses: any[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) =>
              RampActions.fetchClassesFromMetabolitesSuccess({
                data: ret.metClasses,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe
              }),
            catchError((error: ErrorEvent) =>
              of(RampActions.fetchClassesFromMetabolitesFailure({ error }))
            )
          )
        )
      )
    )
  );

  fetchPropertiesFromMetabolites = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchPropertiesFromMetabolites),
      mergeMap((action) =>
        this.rampService
          .fetchPropertiesFromMetabolites(action.metabolites)
          .pipe(
            map(
              (ret: {
                properties: any[];
                functionCall: string;
                numFoundIds: number;
                dataframe: any;
              }) => {
                return RampActions.fetchPropertiesFromMetabolitesSuccess({
                  data: ret.properties,
                  query: {
                    functionCall: ret.functionCall,
                    numFoundIds: ret.numFoundIds,
                  },
                  dataframe: ret.dataframe
                });
              },
              catchError((error: ErrorEvent) =>
                of(RampActions.fetchPropertiesFromMetabolitesFailure({ error }))
              )
            )
          )
      )
    )
  );

  fetchCommonReactionAnalytes = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchCommonReactionAnalytes),
      mergeMap((action) =>
        this.rampService.fetchCommonReactionAnalytes(action.analytes).pipe(
          map(
            (ret: {
              reactions: Reaction[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) =>
              RampActions.fetchCommonReactionAnalytesSuccess({
                data: ret.reactions,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe
              }),
            catchError((error: ErrorEvent) =>
              of(RampActions.fetchCommonReactionAnalytesFailure({ error }))
            )
          )
        )
      )
    )
  );

  fetchPathwayAnalysis = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchEnrichmentFromPathways),
      mergeMap((action) =>
        this.rampService
          .fetchEnrichmentFromPathways(
            action.pathways,
            action.background
          )
          .pipe(
            map(
              (ret: any) => {
                return RampActions.fetchEnrichmentFromPathwaysSuccess({...ret});
              },
              catchError((error: ErrorEvent) =>
                of(RampActions.fetchEnrichmentFromPathwaysFailure({ error }))
              )
            )
          )
      )
    )
  );

  filterEnrichedPathways = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.filterEnrichmentFromPathways, RampActions.fetchEnrichmentFromPathwaysSuccess),
      withLatestFrom(this.store),
      mergeMap(([action, state]) => {
        return  this.rampService
            .filterPathwayEnrichment(
              state.rampStore.combined_fishers_dataframe,
              action.pval_type,
              action.pval_cutoff,
            )
            .pipe(
              map(
                (ret: any) => {
                  return RampActions.filterEnrichmentFromPathwaysSuccess({ ...ret });
                },
                catchError((error: ErrorEvent) =>
                  of(RampActions.fetchEnrichmentFromPathwaysFailure({ error }))
                )
              )
            )
        }
      )
    )
  );

  fetchPathwayCluster = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.filterEnrichmentFromPathwaysSuccess, RampActions.fetchClusterFromEnrichment),
      withLatestFrom(this.store),
      mergeMap(([action, state]) => {
        return  this.rampService
            .getClusterdData(
              state.rampStore.filtered_fishers_dataframe,
              action.perc_analyte_overlap,
              action.min_pathway_tocluster,
              action.perc_pathway_overlap
              )
            .pipe(
              map(
                (ret: any) => {
                  return RampActions.fetchClusterFromEnrichmentSuccess({
                    data: ret.data.data,
                    plot: ret.plot,
                    query: ret.query,
                    dataframe: ret.data.data
                  });
                },
                catchError((error: ErrorEvent) =>
                  of(RampActions.fetchEnrichmentFromPathwaysFailure({ error }))
                )
              )
            )
        }
      )
    )
  );

  fetchClusterImageFile = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RampActions.fetchClusterImageFile),
        withLatestFrom(this.store),
        tap(([action, state]) =>
          this.rampService.fetchClusterImageFile(
            state.rampStore.clusterPlot,
          )
        )
      ),
    { dispatch: false }
  );

  fetchChemicalAnalysis = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchEnrichmentFromMetabolites),
      mergeMap((action) =>
        this.rampService
          .fetchEnrichmentFromMetabolites(action.metabolites, action.pop)
          .pipe(
            map(
              (ret: any) => {
                return RampActions.fetchEnrichmentFromMetabolitesSuccess({...ret });
              },
              catchError((error: ErrorEvent) =>
                of(RampActions.fetchEnrichmentFromMetabolitesFailure({ error }))
              )
            )
          )
      )
    )
  );

  filterEnrichedChemicalClasses = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchEnrichmentFromMetabolitesSuccess, RampActions.filterEnrichmentFromMetabolites),
      withLatestFrom(this.store),
      mergeMap(([action, state]) => {
          return  this.rampService
            .filterMetaboliteEnrichment(
              state.rampStore.enriched_chemical_class,
              action.pval_type,
              action.pval_cutoff,
            )
            .pipe(
              map(
                (ret: any) => {
                  return RampActions.filterEnrichmentFromMetabolitesSuccess({ ...ret });
                },
                catchError((error: ErrorEvent) =>
                  of(RampActions.filterEnrichmentFromMetabolitesFailure({ error }))
                )
              )
            )
        }
      )
    )
  );

  fetchEnrichmentFromMetabolitesFile = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RampActions.fetchEnrichmentFromMetabolitesFile),
        withLatestFrom(this.store),
        tap(([action, state]) =>
          this.rampService.fetchEnrichmentFromMetabolitesFile(
            state.rampStore.enriched_chemical_class
          )
        )
      ),
    { dispatch: false }
  );


  constructor(
    private readonly actions$: Actions,
    private rampService: RampService,
    private store: Store<RampPartialState>
  ) {}
}
