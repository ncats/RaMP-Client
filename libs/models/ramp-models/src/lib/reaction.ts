export class Reaction {
  inputAnalyte!: string;
  inputCommonNames!: string;
  rxnPartnerCommonName!: string;
  rxnPartnerIds!: string[];
  rxnPartnerIdsString!: string;
  queryRelation!: string;

  constructor(obj: any) {
    if (obj.input_analyte) {
      this.inputAnalyte = obj.input_analyte;
    }

    if (obj.query_relation) {
      this.queryRelation = obj.query_relation;
    }

    if (obj.input_common_names) {
      this.inputCommonNames = obj.input_common_names;
    }

    if (obj.rxn_partner_common_name) {
      this.rxnPartnerCommonName = obj.rxn_partner_common_name;
    }

    if (obj.rxn_partner_ids) {
      this.rxnPartnerIdsString = obj.rxn_partner_ids;
      this.rxnPartnerIds = obj.rxn_partner_ids.split('; ');
    }
  }
}
