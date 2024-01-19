import { Routes } from '@angular/router';
import { StructureViewerComponent } from "@ramp/shared/ui/ncats-structure-viewer";
import rFunctions from "../assets/data/rFunctions.json";
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/ramp-home').then(
        (m) => m.HomeComponent)
  },
  {
    path: 'home',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/ramp-home').then(
        (m) => m.HomeComponent)
  },
  {
    path: 'about',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
  //    provideEffects([RampEffects]),
  //    provideState(RAMP_STORE_FEATURE_KEY, rampReducer)
    ],
    loadComponent: () =>
      import('@ramp/features/ramp/ramp-about').then(
        (m) => m.AboutComponent,
      ),
  },
  {
    path: 'api',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/ramp-api').then(
        (m) => m.RampApiComponent,
      ),
  },
  {
    path: 'ontologies-from-metabolites',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/ontologies-from-metabolites').then(
        (m) => m.OntologiesFromMetabolitesComponent,
      ),
    data: {
      ...rFunctions['ontologies-from-analytes'],
    },
  },
  {
    path: 'metabolites-from-ontologies',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/metabolites-from-ontologies').then(
        (m) => m.MetabolitesFromOntologiesComponent,
      ),
    data: {
      ...rFunctions['metabolites-from-ontologies'],
    },
  },
  {
    path: 'analytes-from-pathways',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
    //  provideEffects([RampEffects]),
    //  provideState(RAMP_STORE_FEATURE_KEY, rampReducer)
    ],
    loadComponent: () =>
      import('@ramp/features/ramp/analytes-from-pathways').then(
        (m) => m.AnalytesFromPathwaysComponent,
      ),
    data: {
      ...rFunctions['analytes-from-pathways'],
    },
  },
  {
    path: 'pathways-from-analytes',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
    //  provideEffects([RampEffects]),
    //  provideState(RAMP_STORE_FEATURE_KEY, rampReducer)
    ],
    loadComponent: () =>
      import('@ramp/features/ramp/pathways-from-analytes').then(
        (m) => m.PathwaysFromAnalytesComponent,
      ),
    data: {
      ...rFunctions['pathways-from-analytes'],
    },
  },
  {
    path: 'common-reaction-analytes',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/common-reaction-analytes').then(
        (m) => m.CommonReactionAnalytesComponent,
      ),
    data: {
      ...rFunctions['common-reaction-analytes'],
    },
  },
  {
    path: 'classes-from-metabolites',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/classes-from-metabolites').then(
        (m) => m.ClassesFromMetabolitesComponent,
      ),
    data: {
      ...rFunctions['classes-from-metabolites'],
    },
  },
  {
    path: 'properties-from-metabolites',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    providers: [
      { provide: StructureViewerComponent, useValue: StructureViewerComponent },
    ],
    loadComponent: () =>
      import('@ramp/features/ramp/properties-from-metabolites').then(
        (m) => m.PropertiesFromMetabolitesComponent,
      ),
    data: {
      ...rFunctions['properties-from-metabolites'],
      renderUrl: environment.rendererUrl,
    },
  },
  {
    path: 'chemical-enrichment',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/chemical-enrichment').then(
        (m) => m.ChemicalEnrichmentComponent,
      ),
    data: {
      ...rFunctions['chemical-enrichment'],
    },
  },
  {
    path: 'pathway-enrichment',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadComponent: () =>
      import('@ramp/features/ramp/pathway-enrichment').then(
        (m) => m.PathwayEnrichmentComponent,
      ),
    data: {
      ...rFunctions['pathway-enrichment'],
    },
  },
];
