import { inject } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  Analyte,
  Classes,
  FishersDataframe,
  Metabolite,
  Ontology,
  OntologyList,
  Pathway,
  Properties,
  RampAPIResponse,
  RampChemicalEnrichmentResponse,
  RampPathwayEnrichmentResponse,
  RampResponse,
  Reaction,
  Stats,
} from '@ramp/models/ramp-models';
import {
  AnalyteFromPathwayActions,
  ClassesFromMetabolitesActions,
  CommonReactionAnalyteActions,
  LoadRampActions,
  MetaboliteEnrichmentsActions,
  MetaboliteFromOntologyActions,
  OntologyFromMetaboliteActions,
  PathwayEnrichmentsActions,
  PathwayFromAnalyteActions,
  PropertiesFromMetaboliteActions,
} from './ramp.actions';
import { RampService } from '../ramp.service';
import { exhaustMap, mergeMap, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  getChemicalEnrichment,
  getClusterPlot,
  getCombinedFishersDataframe,
  // getEnrichedChemicalClass,
  getFilteredFishersDataframe,
} from './ramp.selectors';

export const init$ = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
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
        );
      }),
    );
  },
  { functional: true },
);

export const fetchStats = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(LoadRampActions.loadRampStats),
      exhaustMap((action) => {
        return rampService.loadAboutData().pipe(
          map(
            (ret: unknown) => {
              const data: Stats = ret as Stats;
              if (data) {
                return LoadRampActions.loadRampStatsSuccess({ data: data });
              } else {
                return LoadRampActions.loadRampStatsFailure({
                  error: 'No Stats Available',
                });
              }
            },
            catchError((error: ErrorEvent) =>
              of(LoadRampActions.loadRampStatsFailure({ error })),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchPathwaysFromAnalytes = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(
        PathwayFromAnalyteActions.fetchPathwaysFromAnalytes,
        PathwayEnrichmentsActions.fetchPathwaysFromAnalytes,
      ),
      exhaustMap((action) => {
        return rampService.fetchPathwaysFromAnalytes(action.analytes).pipe(
          map(
            (ret: RampResponse<Pathway>) => {
              return PathwayFromAnalyteActions.fetchPathwaysFromAnalytesSuccess(
                ret,
              );
            },
            catchError((error: ErrorEvent) => {
              return of(
                PathwayFromAnalyteActions.fetchPathwaysFromAnalytesFailure({
                  error,
                }),
              );
            }),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchAnalytesFromPathways = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(AnalyteFromPathwayActions.fetchAnalytesFromPathways),
      exhaustMap((action) => {
        return rampService.fetchAnalytesFromPathways(action.pathways).pipe(
          map(
            (ret: RampResponse<Analyte>) => {
              return AnalyteFromPathwayActions.fetchAnalytesFromPathwaysSuccess(
                { ...ret },
              );
            },
            catchError((error: ErrorEvent) =>
              of(
                AnalyteFromPathwayActions.fetchAnalytesFromPathwaysFailure({
                  error,
                }),
              ),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchOntologiesFromMetabolites = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(OntologyFromMetaboliteActions.fetchOntologiesFromMetabolites),
      exhaustMap((action) => {
        return rampService
          .fetchOntologiesFromMetabolites(action.metabolites)
          .pipe(
            map(
              (ret: RampResponse<Ontology>) => {
                return OntologyFromMetaboliteActions.fetchOntologiesFromMetabolitesSuccess(
                  { ...ret },
                );
              },
              catchError((error: ErrorEvent) =>
                of(
                  OntologyFromMetaboliteActions.fetchOntologiesFromMetabolitesFailure(
                    { error },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchOntologies = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(MetaboliteFromOntologyActions.fetchOntologies),
      exhaustMap((action) => {
        return rampService.fetchOntologies().pipe(
          map(
            (ret: RampResponse<OntologyList>) => {
              return MetaboliteFromOntologyActions.fetchOntologiesSuccess(ret);
            },
            catchError((error: ErrorEvent) =>
              of(
                MetaboliteFromOntologyActions.fetchOntologiesFailure({ error }),
              ),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchMetabolitesFromOntologies = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(MetaboliteFromOntologyActions.fetchMetabolitesFromOntologies),
      exhaustMap((action) => {
        return rampService
          .fetchMetabolitesFromOntologies(action.ontologies)
          .pipe(
            map(
              (ret: RampResponse<Metabolite>) =>
                MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesSuccess(
                  ret,
                ),
              catchError((error: ErrorEvent) =>
                of(
                  MetaboliteFromOntologyActions.fetchMetaboliteFromOntologiesFailure(
                    { error },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchMetabolitesFromOntologiesFile = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(MetaboliteFromOntologyActions.fetchMetabolitesFromOntologiesFile),
      tap((action) =>
        rampService.fetchMetabolitesFromOntologiesFile(
          action.ontologies,
          action.format,
        ),
      ),
    );
  },
  { functional: true, dispatch: false },
);

export const fetchClassesFromMetabolites = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(
        ClassesFromMetabolitesActions.fetchClassesFromMetabolites,
        MetaboliteEnrichmentsActions.fetchClassesFromMetabolites,
      ),
      exhaustMap((action) => {
        return rampService
          .fetchChemicalClass(
            action.metabolites,
            action.biospecimen,
            action.background,
          )
          .pipe(
            map(
              (ret: RampResponse<Classes>) =>
                ClassesFromMetabolitesActions.fetchClassesFromMetabolitesSuccess(
                  ret,
                ),
              catchError((error: ErrorEvent) =>
                of(
                  ClassesFromMetabolitesActions.fetchClassesFromMetabolitesFailure(
                    { error },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchPropertiesFromMetabolites = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolites),
      exhaustMap((action) => {
        return rampService
          .fetchPropertiesFromMetabolites(action.metabolites)
          .pipe(
            map(
              (ret: RampResponse<Properties>) =>
                PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolitesSuccess(
                  { ...ret },
                ),
              catchError((error: ErrorEvent) =>
                of(
                  PropertiesFromMetaboliteActions.fetchPropertiesFromMetabolitesFailure(
                    { error },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchCommonReactionAnalytes = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(CommonReactionAnalyteActions.fetchCommonReactionAnalytes),
      exhaustMap((action) => {
        return rampService.fetchCommonReactionAnalytes(action.analytes).pipe(
          map(
            (ret: RampResponse<Reaction>) =>
              CommonReactionAnalyteActions.fetchCommonReactionAnalytesSuccess({
                ...ret,
              }),
            catchError((error: ErrorEvent) =>
              of(
                CommonReactionAnalyteActions.fetchCommonReactionAnalytesFailure(
                  { error },
                ),
              ),
            ),
          ),
        );
      }),
    );
  },
  { functional: true },
);

export const fetchPathwayAnalysis = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
    return actions$.pipe(
      ofType(PathwayEnrichmentsActions.fetchEnrichmentFromPathways),
      exhaustMap((action) => {
        return rampService
          .fetchEnrichmentFromPathways(
            action.analytes,
            action.biospecimen,
            action.background,
          )
          .pipe(
            map(
              (ret: RampPathwayEnrichmentResponse) => {
                return PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysSuccess(
                  ret,
                );
              },
              catchError((error: ErrorEvent) =>
                of(
                  PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysFailure({
                    error,
                  }),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const filterEnrichedPathways = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(
        PathwayEnrichmentsActions.filterEnrichmentFromPathways,
        PathwayEnrichmentsActions.fetchEnrichmentFromPathwaysSuccess,
      ),
      concatLatestFrom((action) => store.select(getCombinedFishersDataframe)),
      mergeMap(([action, dataframe]) => {
        if (dataframe) {
          return rampService
            .filterPathwayEnrichment(
              dataframe,
              action.pval_type,
              action.pval_cutoff,
            )
            .pipe(
              map(
                (ret: RampPathwayEnrichmentResponse) => {
                  return PathwayEnrichmentsActions.filterEnrichmentFromPathwaysSuccess(
                    {
                      ...ret,
                    },
                  );
                },
                catchError((error: ErrorEvent) =>
                  of(
                    PathwayEnrichmentsActions.filterEnrichmentFromPathwaysFailure(
                      { error },
                    ),
                  ),
                ),
              ),
            );
        } else {
          return of(
            PathwayEnrichmentsActions.filterEnrichmentFromPathwaysFailure({
              error: 'no dataframe available',
            }),
          );
        }
      }),
    );
  },
  { functional: true },
);

export const fetchPathwayCluster = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(
        PathwayEnrichmentsActions.filterEnrichmentFromPathwaysSuccess,
        PathwayEnrichmentsActions.fetchClusterFromEnrichment,
      ),
      concatLatestFrom((action) => store.select(getFilteredFishersDataframe)),
      mergeMap(([action, dataframe]) => {
        if (dataframe) {
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
                  return PathwayEnrichmentsActions.fetchClusterFromEnrichmentSuccess(
                    {
                      data: ret.data.data,
                      plot: ret.plot,
                      query: ret.query,
                      dataframe: ret.data.data,
                    },
                  );
                },
                catchError((error: ErrorEvent) =>
                  of(
                    PathwayEnrichmentsActions.fetchClusterFromEnrichmentFailure(
                      { error },
                    ),
                  ),
                ),
              ),
            );
        } else
          return of(
            PathwayEnrichmentsActions.fetchClusterFromEnrichmentFailure({
              error: 'no dataframe available',
            }),
          );
      }),
    );
  },
  { functional: true },
);

export const fetchClusterImageFile = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(PathwayEnrichmentsActions.fetchClusterImageFile),
      concatLatestFrom((action) => store.select(getClusterPlot)),
      tap(([action, plot]) => {
        if (plot) {
          return rampService.fetchClusterImageFile(plot);
        }
      }),
    );
  },
  { functional: true, dispatch: false },
);

export const fetchChemicalAnalysis = createEffect(
  (actions$ = inject(Actions), rampService = inject(RampService)) => {
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
                return MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesSuccess(
                  {
                    ...ret,
                  },
                );
              },
              catchError((error: ErrorEvent) =>
                of(
                  MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesFailure(
                    { error },
                  ),
                ),
              ),
            ),
          );
      }),
    );
  },
  { functional: true },
);

export const filterEnrichedChemicalClasses = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(
        MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesSuccess,
        MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolites,
      ),
      concatLatestFrom((action) => store.select(getChemicalEnrichment)),
      mergeMap(([action, dataframe]) => {
        if (dataframe) {
          return rampService
            .filterMetaboliteEnrichment(
              dataframe,
              action.pval_type,
              action.pval_cutoff,
            )
            .pipe(
              map(
                (ret: RampChemicalEnrichmentResponse) => {
                  return MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesSuccess(
                    { data: ret },
                  );
                },
                catchError((error: ErrorEvent) =>
                  of(
                    MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesFailure(
                      { error },
                    ),
                  ),
                ),
              ),
            );
        } else {
          return of(
            MetaboliteEnrichmentsActions.filterEnrichmentFromMetabolitesFailure(
              { error: 'No dataframe available' },
            ),
          );
        }
      }),
    );
  },
  { functional: true },
);

export const fetchEnrichmentFromMetabolitesFile = createEffect(
  (
    actions$ = inject(Actions),
    rampService = inject(RampService),
    store = inject(Store),
  ) => {
    return actions$.pipe(
      ofType(MetaboliteEnrichmentsActions.fetchEnrichmentFromMetabolitesFile),
      concatLatestFrom((action) => store.select(getChemicalEnrichment)),
      tap(([action, dataframe]) => {
        if (dataframe) {
          rampService.fetchEnrichmentFromMetabolitesFile(
            dataframe.enriched_chemical_class_list,
          );
        }
      }),
    );
  },
  { functional: true, dispatch: false },
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
