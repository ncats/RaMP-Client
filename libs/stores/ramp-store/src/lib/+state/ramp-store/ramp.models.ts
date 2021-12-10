import {SourceVersion} from "@ramp/models/ramp-models";

/**
 * Interface for the 'RampStore' data
 */
export interface RampEntity {
  id: string | number; // Primary ID
  name: string;
  sourceVersions?: SourceVersion[];
  entityCounts?: any;
  analyteIntersects?: {compounds: [], genes: []};
}
