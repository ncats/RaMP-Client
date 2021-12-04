import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
/*  {
    path: '/',
    loadChildren: () =>
      import('@ramp/features/ramp/ramp-home').then(
        (m) => m.FeaturesRampRampHomeModule
      ),
  },*/
  {
    path: '',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/ramp-about').then(
        (m) => m.FeaturesRampRampAboutModule
      ),
  },{
    path: 'about',
    pathMatch: 'full',
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    loadChildren: () =>
      import('@ramp/features/ramp/ramp-about').then(
        (m) => m.FeaturesRampRampAboutModule
      ),
  } //,
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
