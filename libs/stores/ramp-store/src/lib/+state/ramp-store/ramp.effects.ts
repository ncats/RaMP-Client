import { inject, Injectable } from "@angular/core";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from '@ngrx/store';
import {
  Analyte,
  Ontology,
  Pathway,
  Reaction,
  SourceVersion, Stats
} from "@ramp/models/ramp-models";
import {
  AnalyteFromPathwayActions,
  ClassesFromMetabolitesActions,
  CommonReactionAnalyteActions,
  FetchOntologiesActions,
  LoadRampActions,
  MetaboliteEnrichmentsActions,
  MetaboliteFromOntologyActions,
  OntologyFromMetaboliteActions,
  PathwayEnrichmentsActions,
  PathwayFromAnalyteActions,
  PropertiesFromMetaboliteActions
} from "./ramp.actions";
import { RampPartialState } from './ramp.reducer';
import { RampService } from '../ramp.service';
import { exhaustMap, mergeMap, Observable, of, tap, withLatestFrom } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import {
  getClusterPlot,
  getCombinedFishersDataframe,
  getEnrichedChemicalClass,
  getFilteredFishersDataframe
} from "./ramp.selectors";


export const init$ = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(LoadRampActions.loadRamp),
      exhaustMap((action) => {
          return rampService.fetchSupportedIds().pipe(
            map(
              (ret: [{ analyteType: string; idTypes: string[] }]) => {
                return LoadRampActions.loadRampSuccess({ data: ret });
              },
              catchError((error: ErrorEvent) =>
                of(LoadRampActions.loadRampFailure({ error })),
              ),
            ),
          )
        },
      )
    );
  },
  { functional: true }
);

export const fetchStats = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(LoadRampActions.loadRampStats),
      exhaustMap((action) => {
          return rampService.loadAboutData().pipe(
            map(
              (ret: unknown) => {
                const data: Stats = ret as Stats;
                if(data) {
                  return LoadRampActions.loadRampStatsSuccess({ data: data });
                } else {
                  return LoadRampActions.loadRampStatsFailure({error: "No Stats Available" })
                }
              },
              catchError((error: ErrorEvent) =>
                of(LoadRampActions.loadRampStatsFailure({ error })),
              ),
            ),
          )},
      )
    );
  },
  { functional: true }
);

export const fetchPathwaysFromAnalytes = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(PathwayFromAnalyteActions.fetchPathwaysFromAnalytes),
      exhaustMap((action) => {
        return rampService.fetchPathwaysFromAnalytes(action.analytes).pipe(
          map(
            (ret: {
              pathways: Pathway[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) => {
              return PathwayFromAnalyteActions.fetchPathwaysFromAnalytesSuccess({
                data: ret.pathways,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe,
              });
            },
          catchError((error: ErrorEvent) => {
            //   console.log(error);
            return of(PathwayFromAnalyteActions.fetchPathwaysFromAnalytesFailure({ error }));
          })
        )
        )
      })
  );
  },{ functional: true }
);

export const fetchAnalytesFromPathways = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(AnalyteFromPathwayActions.fetchAnalytesFromPathways),
      exhaustMap((action) => {
        return rampService.fetchAnalytesFromPathways(action.pathways).pipe(
          map(
            (ret: {
              analytes: Analyte[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) => {
              return AnalyteFromPathwayActions.fetchAnalytesFromPathwaysSuccess({
                data: ret.analytes,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe,
              });
            },
          catchError((error: ErrorEvent) =>
            of(AnalyteFromPathwayActions.fetchAnalytesFromPathwaysFailure({ error })),
          ),
        )
      )
      })
    )
  },{ functional: true }
);

export const fetchOntologiesFromMetabolites = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(OntologyFromMetaboliteActions.fetchOntologiesFromMetabolites),
      exhaustMap((action) => {
        return rampService.fetchOntologiesFromMetabolites(action.metabolites).pipe(
          map(
            (ret: {
              ontologies: Ontology[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) => {
              return OntologyFromMetaboliteActions.fetchOntologiesFromMetabolitesSuccess({
                data: ret.ontologies,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe,
              })
            },
          catchError((error: ErrorEvent) =>
            of(OntologyFromMetaboliteActions.fetchOntologiesFromMetabolitesFailure({ error })),
          ),
        )
      )
      })
    )
  },{ functional: true }
);

export const fetchOntologies = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(FetchOntologiesActions.fetchOntologies),
      exhaustMap((action) => {
        return rampService.fetchOntologies().pipe(
          map(
            (ret: any) =>
              FetchOntologiesActions.fetchOntologiesSuccess({ data: ret }),
            catchError((error: ErrorEvent) =>
              of(FetchOntologiesActions.fetchOntologiesFailure({ error })),
            ),
        )
      )
      })
    )
  },{ functional: true }
);

export const fetchMetabolitesFromOntologies = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(MetaboliteFromOntologyActions.fetchMetabolitesFromOntologies),
      exhaustMap((action) => {
        return rampService.fetchMetabolitesFromOntologies(action.ontologies).pipe(
          map(
            (ret: {
              metabolites: any[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) =>
              MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesSuccess({
                data: ret.metabolites,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe,
              }),
            catchError((error: ErrorEvent) =>
              of(MetaboliteFromOntologyActions.fetchMetaboliteFromOntologiesFailure({ error })),
            ),
          )
        )
      })
    )
  },{ functional: true }
);

export const fetchMetabolitesFromOntologiesFile = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesFile),
        tap((action) =>
          rampService.fetchMetabolitesFromOntologiesFile(
            action.ontologies,
            action.format,
          ),
        ),
      )
  },{ functional: true, dispatch: false }
);

export const fetchClassesFromMetabolites = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(ClassesFromMetabolitesActions.fetchClassesFromMetabolites),
      exhaustMap((action) => {
        return rampService
          .fetchChemicalClass(
            action.metabolites,
            action.biospecimen,
            action.background,
          ).pipe(
          map(
            (ret: {
              metClasses: any[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) =>
              ClassesFromMetabolitesActions.fetchClassesFromMetabolitesSuccess({
                data: ret.metClasses,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe,
              }),
            catchError((error: ErrorEvent) =>
              of(ClassesFromMetabolitesActions.fetchClassesFromMetabolitesFailure({ error })),
            ),
          )
        )
      })
    )
  },{ functional: true }
);

export const fetchPropertiesFromMetabolites = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolites),
      exhaustMap((action) => {
        return rampService
          .fetchPropertiesFromMetabolites(action.metabolites)
          .pipe(
          map(
            (ret: {
              properties: any[];
              functionCall: string;
              numFoundIds: number;
              dataframe: any;
            }) =>
              PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolitesSuccess({
                data: ret.properties,
                query: {
                  functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds,
                },
                dataframe: ret.dataframe,
              }),
        catchError((error: ErrorEvent) =>
          of(PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolitesFailure({ error })),
        ),
          )
        )
      })
    )
  },{ functional: true }
);

export const fetchCommonReactionAnalytes = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(CommonReactionAnalyteActions.fetchCommonReactionAnalytes),
      exhaustMap((action) => {
        return rampService.
        fetchCommonReactionAnalytes(action.analytes)
          .pipe(
            map(
              (ret: {
                reactions: Reaction[];
                functionCall: string;
                numFoundIds: number;
                dataframe: any;
              }) =>
                CommonReactionAnalyteActions.fetchCommonReactionAnalytesSuccess({
                  data: ret.reactions,
                  query: {
                    functionCall: ret.functionCall,
                    numFoundIds: ret.numFoundIds,
                  },
                  dataframe: ret.dataframe,
                }),
              catchError((error: ErrorEvent) =>
                of(CommonReactionAnalyteActions.fetchCommonReactionAnalytesFailure({ error })),
              ),
          )
        )
      })
    )
  },{ functional: true }
);

export const fetchPathwayAnalysis = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(PathwayEnrichmentsActions.fetchEnrichmentFromPathways),
      exhaustMap((action) => {
        return rampService
          .fetchEnrichmentFromPathways(
            action.analytes,
            action.biospecimen,
            action.background,
          ).pipe(
          map(
            (ret: any) => {
              return PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysSuccess({
                ...ret,
              });
            },
            catchError((error: ErrorEvent) =>
              of(PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysFailure({ error })),
            ),
          )
        )
      })
    )
  },{ functional: true }
);

export const filterEnrichedPathways = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(
        PathwayEnrichmentsActions.filterEnrichmentFromPathways,
        PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysSuccess,
      ),
      concatLatestFrom(action => store.select(getCombinedFishersDataframe)),
      mergeMap(([action, dataframe]) => {
        return rampService
          .filterPathwayEnrichment(
            dataframe,
            action.pval_type,
            action.pval_cutoff,
          ).pipe(
          map(
            (ret: any) => {
              return PathwayEnrichmentsActions.filterEnrichmentFromPathwaysSuccess({
                ...ret,
              });
            },
            catchError((error: ErrorEvent) =>
              of(PathwayEnrichmentsActions.filterEnrichmentFromPathwaysFailure({ error })),
            ),
          )
        )
      })
    )
  },{ functional: true }
);

export const fetchPathwayCluster = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(
        PathwayEnrichmentsActions.filterEnrichmentFromPathwaysSuccess,
        PathwayEnrichmentsActions.fetchClusterFromEnrichment,
      ),
      concatLatestFrom(action => store.select(getFilteredFishersDataframe)),
      mergeMap(([action, dataframe]) => {
        return rampService
          .getClusterdData(
           dataframe,
            action.perc_analyte_overlap,
            action.min_pathway_tocluster,
            action.perc_pathway_overlap,
          )
          .pipe(
          map(
            (ret: any) => {
              return PathwayEnrichmentsActions.fetchClusterFromEnrichmentSuccess({
                data: ret.data.data,
                plot: ret.plot,
                query: ret.query,
                dataframe: ret.data.data,
              });
            },
            catchError((error: ErrorEvent) =>
              of(PathwayEnrichmentsActions.fetchClusterFromEnrichmentFailure({ error })),
            ),
          )
        )
      })
    )
  },{ functional: true }
);

export const fetchClusterImageFile = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(PathwayEnrichmentsActions.fetchClusterImageFile),
      concatLatestFrom(action => store.select(getClusterPlot)),
      tap(([action, plot]) => {
          if (plot) {
            return rampService.fetchClusterImageFile(plot)
          }
        }
      ),
    )
  },{ functional: true, dispatch: false }
);

export const fetchChemicalAnalysis = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService)
  ) => {
    return actions$.pipe(
      ofType(MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolites),
      exhaustMap((action) => {
        return rampService
          .fetchEnrichmentFromMetabolites(
            action.metabolites,
            action.biospecimen,
            action.background,
          )
          .pipe(
            map(
              (ret: any) => {
                return MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesSuccess({
                  ...ret,
                });
              },
              catchError((error: ErrorEvent) =>
                of(MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesFailure({ error })),
              ),
            )
          )
      })
    )
  },{ functional: true }
);

export const filterEnrichedChemicalClasses = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(
        MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesSuccess,
        MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolites,
      ),
      concatLatestFrom(action => store.select(getEnrichedChemicalClass)),
      mergeMap(([action, dataframe]) => {
        return rampService
          .filterMetaboliteEnrichment(
            dataframe,
            action.pval_type,
            action.pval_cutoff,
          )
          .pipe(
            map(
              (ret: any) => {
                return MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesSuccess({
                  ...ret,
                });
              },
              catchError((error: ErrorEvent) =>
                of(MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesFailure({ error })),
              ),
            )
          )
      })
    )
  },{ functional: true }
);

export const fetchEnrichmentFromMetabolitesFile = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesFile),
      concatLatestFrom(action => store.select(getEnrichedChemicalClass)),
      tap(([action, dataframe]) => {
          if (dataframe) {
            return rampService.fetchEnrichmentFromMetabolitesFile(dataframe)
          }
        }
      ),
    )
  },{ functional: true, dispatch: false }
);

/*setSourceVersions = createEffect(() =>
   this.actions$.pipe(
     ofType(LoadRampActions.loadSourceVersions),
     mergeMap((action) =>
       this.rampService.fetchSourceVersions().pipe(
         map(
           (ret: SourceVersion[]) =>
             LoadRampActions.loadSourceVersionsSuccess({ versions: ret }),
           catchError((error: ErrorEvent) =>
             of(LoadRampActions.loadSourceVersionsFailure({ error })),
           ),
         ),
       ),
     ),
   ),
 );
*/
