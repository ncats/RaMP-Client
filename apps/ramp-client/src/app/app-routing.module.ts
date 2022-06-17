import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import rFunctions from '../assets/data/rFunctions.json';
import { environment } from '../environments/environment';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/ramp-home').then(
        (m) => m.FeaturesRampRampHomeModule
      ),
  },
  {
    path: 'home',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/ramp-home').then(
        (m) => m.FeaturesRampRampHomeModule
      ),
  },
  {
    path: 'about',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/ramp-about').then(
        (m) => m.FeaturesRampRampAboutModule
      ),
  },
  {
    path: 'api',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/ramp-api').then(
        (m) => m.FeaturesRampRampApiModule
      ),
  },
  {
    path: 'ontologies-from-metabolites',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/ontologies-from-metabolites').then(
        (m) => m.FeaturesRampOntologiesModule
      ),
    data: {
      ...rFunctions['ontologies-from-analytes'],
    },
  },
  {
    path: 'metabolites-from-ontologies',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/metabolites-from-ontologies').then(
        (m) => m.FeaturesRampMetabolitesFromOntologiesModule
      ),
    data: {
      ...rFunctions['metabolites-from-ontologies'],
    },
  },
  {
    path: 'analytes-from-pathways',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/analytes-from-pathways').then(
        (m) => m.FeaturesRampAnalytesFromPathwaysModule
      ),
    data: {
      ...rFunctions['analytes-from-pathways'],
    },
  },
  {
    path: 'pathways-from-analytes',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/pathways-from-analytes').then(
        (m) => m.FeaturesRampPathwaysFromAnalytesModule
      ),
    data: {
      ...rFunctions['pathways-from-analytes'],
    },
  },
  {
    path: 'common-reaction-analytes',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/common-reaction-analytes').then(
        (m) => m.FeaturesRampCommonReactionAnalytesModule
      ),
    data: {
      ...rFunctions['common-reaction-analytes'],
    },
  },
  {
    path: 'classes-from-metabolites',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/classes-from-metabolites').then(
        (m) => m.FeaturesRampClassesFromMetabolitesModule
      ),
    data: {
      ...rFunctions['classes-from-metabolites'],
    },
  },
  {
    path: 'properties-from-metabolites',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/properties-from-metabolites').then(
        (m) => m.FeaturesRampPropertiesFromMetabolitesModule
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
    loadChildren: () =>
      import('@ramp/features/ramp/chemical-enrichment').then(
        (m) => m.FeaturesRampChemicalEnrichmentModule
      ),
    data: {
      ...rFunctions['chemical-enrichment'],
    },
  },
  {
    path: 'pathway-enrichment',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/pathway-enrichment').then(
        (m) => m.FeaturesRampPathwayEnrichmentModule
      ),
    data: {
      ...rFunctions['pathway-enrichment'],
    },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
