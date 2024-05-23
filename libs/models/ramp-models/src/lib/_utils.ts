import { ChemicalEnrichment } from './chemical-enrichment';
import { FisherResult, FishersDataframe } from './fisher-result';
import { RampQuery } from './ramp-query';

export class RampDataGeneric {
}

export interface RampAPIResponse<T extends RampDataGeneric> {
  data: Array<T>;
  function_call: string[];
  numFoundIds: number[];
}

export interface RampResponse<T extends RampDataGeneric> {
  data: Array<T>;
  query: RampQuery;
  dataframe?: unknown[];
}

export interface RampPathwayEnrichmentAPIResponse {
  data: {
    analyte_type: string[];
    cluster_list?: { [key: string]: string[] };
    fishresults: FisherResult[];
    pathway_matrix?: { [key: string]: string }[];
    result_type?: string[];
  };
  function_call?: string[];
}

export interface RampPathwayEnrichmentResponse {
  data: FisherResult[];
  query: RampQuery;
  filteredFishersDataframe?: FishersDataframe;
  combinedFishersDataframe?: FishersDataframe;
}

export interface RampChemicalEnrichmentAPIResponse {
  data: {
    ClassyFire_class?: ChemicalEnrichment[];
    ClassyFire_sub_class?: ChemicalEnrichment[];
    ClassyFire_super_class?: ChemicalEnrichment[];
    result_type?: string[];
  };
  function_call?: string[];
}

export interface RampChemicalEnrichmentResponse {
  //  data: ChemicalEnrichment[];
  data: {
    ClassyFire_class?: ChemicalEnrichment[];
    ClassyFire_sub_class?: ChemicalEnrichment[];
    ClassyFire_super_class?: ChemicalEnrichment[];
    result_type?: string[];
  };
  enriched_chemical_class_list: ChemicalEnrichment[];
  query?: RampQuery;
  openModal?: boolean;
}
