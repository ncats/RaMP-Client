export class ChemicalEnrichment {
  adjP_BH!: number;
  category!: string;
  class_name!: string;
  met_hits!: number;
  met_size!: number;
  p_value!: number;
  pop_hits!: number;
  pop_size!: number;

  constructor(obj: any) {
    if(obj.adjP_BH) {
      this.adjP_BH = obj.adjP_BH;
    }
    if(obj.category) {
      this.category = obj.category;
    }
    if(obj.class_name) {
      this.class_name = obj.class_name;
    }
    if(obj.met_hits) {
      this.met_hits = obj.met_hits;
    }
    if(obj.met_size) {
      this.met_size = obj.met_size;
    }
    if(obj['p-value']) {
      this.p_value = obj['p-value'];
    }
    if(obj.pop_hits) {
      this.pop_hits = obj.pop_hits;
    }
    if(obj.pop_size) {
      this.pop_size = obj.pop_size;
    }
  }
}
