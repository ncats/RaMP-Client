export const PathwayMatchesColumns: Array<{ value: string; display: string }> =
  [
    {
      value: 'input',
      display: 'Input',
    },
    {
      value: 'pathwaySources',
      display: 'Sources',
    },
    {
      value: 'pathwayCategories',
      display: 'Categories',
    },
    {
      value: 'numPathways',
      display: '# Pathways Found',
    },
    {
      value: 'pathwayName',
      display: 'Name',
    },
  ];

export const PathwayColumns: Array<{ value: string; display: string }> = [
  {
    value: 'pathwaySources',
    display: 'Sources',
  },
  {
    value: 'pathwayCategory',
    display: 'Category',
  },
  {
    value: 'pathwayName',
    display: 'Name',
  },
];

export const AnalyteColumns: Array<{ value: string; display: string }> = [
  {
    value: 'pathwayName',
    display: 'Pathway Name',
  },
  {
    value: 'pathwayType',
    display: 'Pathway Source Database',
  },
  {
    value: 'compoundName',
    display: 'Analyte Name',
  },
  {
    value: 'sourceCompoundIDs',
    display: 'Analyte IDs',
  },
  {
    value: 'geneOrCompound',
    display: 'Analyte Type',
  },
];
