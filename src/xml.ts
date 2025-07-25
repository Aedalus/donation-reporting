import xml2js from "xml2js";

export class CampaignFinanceTransaction {
  $ = {
    xmlns: "http://www.state.or.us/sos/ebs2/ce/dataobject",
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsi:schemaLocation":
      "http://www.sos.state.or.us/elections/pages/cand/campaign_finance/cf.xsd",
    "filer-id": "UNKNOWN",
  };

  constructor(filerId: string) {
    this.$["filer-id"] = filerId;
  }

  contact = new Array<object>();
  transaction = new Array<object>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addContact(contact: any = {}): any {
    this.contact.push(contact);
    return contact;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addTransaction(transaction: any = {}): any {
    this.transaction.push(transaction);
    return transaction;
  }

  toXML() {
    return new xml2js.Builder({
      rootName: "campaign-finance-transactions",
      headless: true,
    }).buildObject(this);
  }
}
