import xml2js from "xml2js";

class Contact {
  $ = { id: "" };
  type = "";
  contactName: {
    committee?: {
      id: string;
    };
    individualName?: {
      first: string;
      last: string;
      title: string;
    };
    businessName?: string;
  } = {};
  address?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    zipPlus4?: string;
    county?: string;
  };
  occupation?: string;
  employment?: {
    employerName?: string;
    city?: string;
    state?: string;
  };
}

class Transaction {
  $ = { id: "" };
  operation = { add: true };
  contactId?: string;
  type?: string;
  subType?: string;
  description?: string;
  amount?: string;
  date?: string;
  checkNo?: string;
}

class CampaignFinanceTransaction {
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

  contact = new Array<Contact>();
  transaction = new Array<Transaction>();

  addContact(contact: Contact) {
    this.contact.push(contact);
  }

  addTransaction(transaction: Transaction) {
    this.transaction.push(transaction);
  }
}

export function getXML() {
  const t = new CampaignFinanceTransaction("5276");

  //   t.addContact();

  const builder = new xml2js.Builder({
    rootName: "campaign-finance-transactions",
  });
  const xml = builder.buildObject(t);
  return xml;
}
