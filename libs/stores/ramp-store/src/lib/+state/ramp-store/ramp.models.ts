import {
  Analyte,
  Classes,
  Metabolite,
  Ontology,
  Pathway,
  Properties,
  Reaction,
  SourceVersion
} from "@ramp/models/ramp-models";

/**
 * Interface for the 'RampStore' data
 */
export interface RampEntity {
  id: string | number; // Primary ID
  name: string;
  sourceVersions?: SourceVersion[];
  entityCounts?: any;
  metaboliteIntersects?:[];
  geneIntersects?:[];
  ontology?: Ontology[];
  analytes?: Analyte[];
  pathways?: Pathway[];
  metabolites?: Metabolite[];
  ontologiesTypeahead?: any[];
  reactions?: Reaction[];
  classes?: Classes[];
  properties?: Properties[];
  chemicalEnrichments?: any;
  pathwayEnrichments?: any;
}
