export class Reaction {
  inputAnalyte!: string;
  inputCommonNames!: string;
  rxnPartnerCommonName!: string;
  rxnPartnerIds!: string[];
  rxnPartnerIdsString!: string;
  queryRelation!: string;

  constructor(obj: { [key:string]: unknown }) {
    if (obj['input_analyte']) {
      this.inputAnalyte = <string>obj['input_analyte'];
    }

    if (obj['query_relation']) {
      this.queryRelation = <string>obj['query_relation'];
    }

    if (obj['input_common_names']) {
      this.inputCommonNames = <string>obj['input_common_names'];
    }

    if (obj['rxn_partner_common_name']) {
      this.rxnPartnerCommonName = <string>obj['rxn_partner_common_name'];
    }

    if (obj['rxn_partner_ids']) {
      this.rxnPartnerIdsString = (<string>obj['rxn_partner_ids']).replace(/,/g, ', ');
      console.log(obj['rxn_partner_ids'])
      console.log(this.rxnPartnerIdsString)
      this.rxnPartnerIds = this.rxnPartnerIdsString.split(',');
    }
  }
}
