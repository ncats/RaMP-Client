import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Analyte, Ontology, Pathway, Reaction, SourceVersion} from "@ramp/models/ramp-models";
import {
  fetchClassesFromMetabolitesFile,
  fetchCommonReactionAnalytesFile, fetchOntologiesFromMetabolitesFile,
  fetchPathwaysFromAnalytesFile,
  RampService
} from '@ramp/stores/ramp-store';
import {mergeMap, of, tap,} from "rxjs";
import {catchError, map} from "rxjs/operators";

import * as RampActions from './ramp.actions';

@Injectable()
export class RampEffects {

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.init),
      mergeMap((action) =>
        this.rampService.fetchSupportedIds()
          .pipe(
            map((ret) => {
              return RampActions.initSuccess({ ...ret })
              },
              catchError((error:ErrorEvent) => of(RampActions.initFailure({error})))
            )
          )
      )
    )
  );

  initAbout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.initAbout),
      mergeMap((action) =>
        this.rampService.loadAboutData()
          .pipe(
            map((ret) => {
              return RampActions.loadRampAboutSuccess({ data: ret })
              },
              catchError((error:ErrorEvent) => of(RampActions.loadSourceVersionsFailure({error})))
            )
          )
      )
    )
  );

  setSourceVersions = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.loadSourceVersions),
      mergeMap((action) =>
           this.rampService.fetchSourceVersions()
             .pipe(
               map((ret: SourceVersion[]) => RampActions.loadSourceVersionsSuccess({ versions: ret }),
            catchError((error:ErrorEvent) => of(RampActions.loadSourceVersionsFailure({error})))
               )
             )
      )
    )
  );

  fetchOntologiesFromMetabolites = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchOntologiesFromMetabolites),
      mergeMap((action) =>
        this.rampService.fetchOntologiesFromMetabolites(action.analytes)
          .pipe(
            map((ret: {ontologies: Ontology[], functionCall: string, numFoundIds: number}) =>
                RampActions.fetchOntologiesFromMetabolitesSuccess(
                  {
                    data: ret.ontologies,
                    query: {
                      functionCall: ret.functionCall,
                      numFoundIds: ret.numFoundIds
                    }
                  }
                  ),
              catchError((error:ErrorEvent) => of(RampActions.fetchOntologiesFromMetabolitesFailure({error})))
            )
          )
      )
    )
  )

  fetchOntologiesFromMetabolitesFile = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchOntologiesFromMetabolitesFile),
      tap((action) =>
        this.rampService.fetchOntologiesFromMetabolitesFile(action.metabolite, action.format)
      )
    ), {dispatch: false}
  )

fetchMetabolitesFromOntologies = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchMetabolitesFromOntologies),
      mergeMap((action) =>
        this.rampService.fetchMetabolitesFromOntologies(action.ontologies)
          .pipe(
            map((ret: {metabolites: any[], functionCall: string, numFoundIds: number}) =>
                RampActions.fetchMetabolitesFromOntologiesSuccess(
                  {
                    data: ret.metabolites,
                    query: {
                      functionCall: ret.functionCall,
                      numFoundIds: ret.numFoundIds
                    }
                  }),
              catchError((error:ErrorEvent) => of(RampActions.fetchMetaboliteFromOntologiesFailure({error})))
            )
          )
      )
    )
  )


  fetchOntologies = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchOntologies),
      mergeMap(() =>
        this.rampService.fetchOntologies()
          .pipe(
            map((ret:any) => RampActions.fetchOntologiesSuccess({ ontologies: ret }),
              catchError((error:ErrorEvent) => of(RampActions.fetchOntologiesFailure({error})))
            )
          )
      )
    )
  )

  fetchAnalytesFromPathways = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchAnalytesFromPathways),
      mergeMap((action) =>
        this.rampService.fetchAnalytesFromPathways(action.pathways)
          .pipe(
            map((ret: {analytes: Analyte[], functionCall: string, numFoundIds: number}) =>
              RampActions.fetchAnalytesFromPathwaysSuccess({
                data: ret.analytes,
                  query: {
                    functionCall: ret.functionCall,
                    numFoundIds: ret.numFoundIds
                  }
                })
            ),
            catchError((error:ErrorEvent) => of(RampActions.fetchAnalytesFromPathwaysFailure({error})))
          )
      )
    )
  )

  fetchAnalytesFromPathwaysFile = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchAnalytesFromPathwaysFile),
      tap((action) =>
        this.rampService.fetchAnalytesFromPathwaysFile(action.pathways, action.format)
      )
    ), {dispatch: false}
  )

fetchPathwaysFromAnalytes = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchPathwaysFromAnalytes),
      mergeMap((action) =>
        this.rampService.fetchPathwaysFromAnalytes(action.analytes)
          .pipe(
            map((ret: {pathways: Pathway[], functionCall: string, numFoundIds: number}) => {
              console.log(ret);
              return RampActions.fetchPathwaysFromAnalytesSuccess(
                {
                  data: ret.pathways,
                  query: {
                    functionCall: ret.functionCall,
                    numFoundIds: ret.numFoundIds
                  }
                })
            }),
            catchError((error:ErrorEvent) => {
              console.log(error);
              return of(RampActions.fetchPathwaysFromAnalytesFailure({error}))
            })
          )
      )
    )
  )

  fetchPathwaysFromAnalytesFile = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchPathwaysFromAnalytesFile),
      tap((action) =>
        this.rampService.fetchPathwaysFromAnalytesFile(action.analytes, action.format)
      )
    ), {dispatch: false}
  )

  fetchCommonReactionAnalytes = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchCommonReactionAnalytes),
      mergeMap((action) =>
        this.rampService.fetchCommonReactionAnalytes(action.analytes)
          .pipe(
            map((ret: {reactions: Reaction[], functionCall: string, numFoundIds: number}) =>
                RampActions.fetchCommonReactionAnalytesSuccess(
                  {
                    data: ret.reactions,
                    query: {
                      functionCall: ret.functionCall,
                      numFoundIds: ret.numFoundIds
                    }
                  }
                ),
              catchError((error:ErrorEvent) => of(RampActions.fetchCommonReactionAnalytesFailure({error})))
            )
          )
      )
    )
  )

  fetchCommonReactionAnalytesFile = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchCommonReactionAnalytesFile),
      tap((action) =>
        this.rampService.fetchCommonReactionAnalytesFile(action.analytes, action.format)
      )
    ), {dispatch: false}
  )

  fetchClassesFromMetabolites = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchClassesFromMetabolites),
      mergeMap((action) =>
        this.rampService.fetchChemicalClass(action.metabolites)
          .pipe(
            map((ret: {metClasses: any[], functionCall: string, numFoundIds: number}) =>
                 RampActions.fetchClassesFromMetabolitesSuccess(
                  {
                data: ret.metClasses,
                  query: {
                functionCall: ret.functionCall,
                  numFoundIds: ret.numFoundIds
                   }
                }
                ),
              catchError((error:ErrorEvent) => of(RampActions.fetchClassesFromMetabolitesFailure({error})))
            )
          )
      )
    )
  )

  fetchClassesFromMetabolitesFile = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchClassesFromMetabolitesFile),
      tap((action) =>
        this.rampService.fetchClassesFromMetabolitesFile(action.metabolites, action.format)
      )
    ), {dispatch: false}
  )

  fetchPropertiesFromMetabolitesFile = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchPropertiesFromMetabolitesFile),
      tap((action) =>
        this.rampService.fetchPropertiesFromMetabolitesFile(action.metabolites, action.format)
      )
    ), {dispatch: false}
  )

  fetchPropertiesFromMetabolites = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchPropertiesFromMetabolites),
      mergeMap((action) =>
        this.rampService.fetchPropertiesFromMetabolites(action.metabolites)
          .pipe(
            map((ret: {properties: any[], functionCall: string, numFoundIds: number}) => {
             return RampActions.fetchPropertiesFromMetabolitesSuccess({
               data: ret.properties,
               query: {
                 functionCall: ret.functionCall,
                 numFoundIds: ret.numFoundIds
               }})
              },
              catchError((error:ErrorEvent) => of(RampActions.fetchPropertiesFromMetabolitesFailure({error})))
            )
          )
      )
    )
  )

fetchChemicalAnalysis = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchEnrichmentFromAnalytes),
      mergeMap((action) =>
        this.rampService.fetchEnrichmentFromAnalytes(action.analytes)
          .pipe(
            map((ret: any) => {
              console.log(ret);
             return RampActions.fetchEnrichmentFromAnalytesSuccess({ chemicalEnrichments: ret })
              },
              catchError((error:ErrorEvent) => of(RampActions.fetchEnrichmentFromAnalytesFailure({error})))
            )
          )
      )
    )
  )

fetchPathwayAnalysis = createEffect(() =>
    this.actions$.pipe(
      ofType(RampActions.fetchEnrichmentFromPathways),
      mergeMap((action) =>
        this.rampService.fetchEnrichmentFromPathways(action.pathways, action.p_holmadj_cutoff, action.p_fdradj_cutoff)
          .pipe(
            map((ret: any) => {
              console.log(ret);
             return RampActions.fetchEnrichmentFromPathwaysSuccess({ pathwayEnrichments: ret })
              },
              catchError((error:ErrorEvent) => of(RampActions.fetchEnrichmentFromPathwaysFailure({error})))
            )
          )
      )
    )
  )



  constructor(
    private readonly actions$: Actions,
    private rampService: RampService
  ) {}
}
