export class EntityCount {
  status_category!: string;
  hmdb!: number | string;
  lipidmaps?: number | string;
  reactome!: number | string;
  wiki?: number | string;
  chebi?: number | string;
  kegg?: number | string;

  constructor(obj: { [key: string]: string }) {
    if (obj['status_category']) {
      this.status_category = obj['status_category'];
    }
    if (obj['HMDB']) {
      this.hmdb = obj['HMDB'];
    }
    if (obj['LIPIDMAPS']) {
      this.lipidmaps = obj['LIPIDMAPS'];
    }
    if (obj['Reactome']) {
      this.reactome = obj['Reactome'];
    }
    if (obj['WikiPathways']) {
      this.wiki = obj['WikiPathways'];
    }
    if (obj['ChEBI']) {
      this.chebi = obj['ChEBI'];
    }
    if (obj['KEGG']) {
      this.kegg = obj['KEGG'];
    }
  }
}
