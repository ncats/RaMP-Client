import {Analyte, Ontology, Pathway, SourceVersion} from "@ramp/models/ramp-models";

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
}
