export class Properties {
  chem_source_id!: string;
  iso_smiles!: string;
  inchi_key_prefix!: string;
  inchi_key!: string;
  inchi!: string;
  mw!: string;
  monoisotop_mass!: string;
  common_name!: string;
  mol_formula!: string;
  imageUrl!: string;

  constructor(obj: Partial<Properties>) {
    Object.assign(this, obj);
    this.imageUrl = this.iso_smiles;
  }
}
