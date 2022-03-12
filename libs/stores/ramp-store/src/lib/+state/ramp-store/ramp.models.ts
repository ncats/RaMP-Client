import {
  Analyte,
  Classes,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  Reaction,
  SourceVersion,
  RampQuery, FisherResult
} from "@ramp/models/ramp-models";

/**
 * Interface for the 'RampStore' data
 */
export interface RampEntity {
  id: string | number; // Primary ID
  name: string;
  supportedIds?: [{ analyteType: string, idTypes: string[]}];
  sourceVersions?: SourceVersion[];
  entityCounts?: any;
  metaboliteIntersects?: [];
  geneIntersects?: [];
  ontologiesList?: any[];

  ontology?: {
    data: Ontology[];
    query: RampQuery;
  };

  analytes?: {
    data: Analyte[];
    query: RampQuery;
  };

  pathways?: {
    data: Pathway[];
    query: RampQuery;
  };

  reactions?: {
    data: Reaction[];
    query: RampQuery;
  };

  metClasses?: {
    data: Classes[];
    query: RampQuery;
    dataframe: any;
  };

  metabolites?: {
    data: Metabolite[];
    query: RampQuery;
  };

  properties?: {
    data: Properties[];
    query: RampQuery;
  };

  chemicalEnrichments?: any;
  pathwayEnrichments?: {
    data: FisherResult[];
    query: RampQuery;
  };

  enriched_chemical_class?: any;
  combined_fishers_dataframe?: any;
  filtered_fishers_dataframe?: any;
  clusterPlot?: any;
}
