import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import  rFunctions from '../assets/data/rFunctions.json';

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
    path: 'ontologies',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/ontologies').then(
        (m) => m.FeaturesRampOntologiesModule
      ),
    data: {
     ...rFunctions.ontologies
    }
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
     ...rFunctions["analytes-from-pathways"]
    }
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
     ...rFunctions["pathways-from-analytes"]
    }
  }
  //,
/*  {
    path: 'pathway-enrichment-analysis',
    component: PathwayEnrichmentAnalysisComponent,
    data: {
      id: 'pea',
      display: 'Pathway enrichment analysis',
      order: 2,
      isMainNav: true,
    },
  },
  {
    path: 'analytes-from-pathways',
    component: AnalytesFromPathwayComponent,
    data: {
      id: 'afp',
      display: 'Analytes from pathways',
      order: 3,
      isMainNav: true,
    },
  },
  {
    path: 'pathways-from-analytes',
    component: PathwaysFromAnalytesComponent,
    data: {
      id: 'pfa',
      display: 'Pathways from analytes',
      order: 4,
      isMainNav: true,
    },
  },
  {
    path: 'common-reaction-analytes',
    component: CommonReactionAnalytesComponent,
    data: {
      id: 'cra',
      display: 'Common reaction analytes',
      order: 5,
      isMainNav: true,
    },
  },
  {
    path: 'ontologies',
    component: OntologiesComponent,
    data: {
      id: 'ontologies',
      display: 'Ontologies',
      order: 6,
      isMainNav: true,
    },
  },
  {
    path: 'chemical-analysis',
    component: ChemicalAnalysisComponent,
    data: {
      id: 'chemicalAnalysis',
      display: 'Chemical Analysis',
      order: 7,
      isMainNav: true,
    },
  },*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
