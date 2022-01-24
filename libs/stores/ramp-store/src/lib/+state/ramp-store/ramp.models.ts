import {
  Analyte,
  Classes,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  Reaction,
  SourceVersion,
  RampQuery
} from "@ramp/models/ramp-models";

/**
 * Interface for the 'RampStore' data
 */
export interface RampEntity {
  id: string | number; // Primary ID
  name: string;
  supportedIds?: {
    metabolites: string[],
    genes: string[]
  }
  sourceVersions?: SourceVersion[];
  entityCounts?: any;
  metaboliteIntersects?:[];
  geneIntersects?:[];
  ontologiesList?: any[];

  ontology?: {
    data: Ontology[],
    query: RampQuery
  };

  analytes?: {
    data: Analyte[],
    query: RampQuery
  }

  pathways?: {
    data: Pathway[],
    query: RampQuery
  }

  reactions?: {
    data: Reaction[],
    query: RampQuery
  };

  metClasses?: {
    data: Classes[],
    query: RampQuery
  }

  metabolites?: {
    data: Metabolite[],
    query: RampQuery
  };

  properties?: {
    data: Properties[],
    query: RampQuery
  };

  chemicalEnrichments?: any;
  pathwayEnrichments?: any;
}
