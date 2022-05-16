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
    dataframe: any;
  };

  analytes?: {
    data: Analyte[];
    query: RampQuery;
    dataframe: any;
  };

  pathways?: {
    data: Pathway[];
    query: RampQuery;
    dataframe: any;
  };

  reactions?: {
    data: Reaction[];
    query: RampQuery;
    dataframe: any;
  };

  metClasses?: {
    data: Classes[];
    query: RampQuery;
    dataframe: any;
  };

  metabolites?: {
    data: Metabolite[];
    query: RampQuery;
    dataframe: any;
  };

  properties?: {
    data: Properties[];
    query: RampQuery;
    dataframe: any;
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
