export const availableChemicalProperties: Array<{
  value: string;
  display: string;
}> = [
  {
    value: 'smiles',
    display: 'ISO SMILES',
  },
  {
    value: 'inchi_key',
    display: 'InChIKey',
  },
  {
    value: 'inchi_key_prefix',
    display: 'InChIKey prefix',
  },
  {
    value: 'inchi',
    display: 'InChI',
  },
  {
    value: 'mw',
    display: 'Molecular weight',
  },
  {
    value: 'monoisotop_mass',
    display: 'Monoisotopic Mass',
  },
  {
    value: 'formula',
    display: 'Molecular Formula',
  }, // ,
  // {
  //     value: 'commmon_name',
  //     display: 'Common Name'
  // }
];

export const columnsToChemprops: { [chemProp: string]: string } = {
  iso_smiles: 'smiles',
  inchi_key: 'inchi_key',
  inchi_key_prefix: 'inchi_key_prefix',
  inchi: 'inchi',
  mw: 'mw',
  monoisotop_mass: 'monoisotop_mass',
  mol_formula: 'formula',
  commmon_name: 'commmon_name',
};
