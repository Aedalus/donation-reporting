import { parseCSV } from "./csv";
import { CampaignFinanceTransaction } from "./xml";
import _ from "lodash";

export interface TransformOptions {
  csv: string;
  filerId: string;
}

export function transform({ csv, filerId }: TransformOptions) {
  const data = parseCSV(csv);
  const t = new CampaignFinanceTransaction(filerId);

  for (const row of data) {
    const contactId = row["Donor Id"];
    const c = t.addContact({ $: { id: contactId } });
    const eventDate = new Date(row["Donated At"]).toISOString().slice(0, 10);

    _.set(c, "contact-name.individual-name.first", row["Donor's First Name"]);
    _.set(c, "contact-name.individual-name.last", row["Donor's Last Name"]);

    _.set(c, "address.street1", row.Address);
    _.set(c, "address.street2", row["Address 2"]);
    _.set(c, "address.city", row.City);
    _.set(c, "address.state", row["State / Province"]);
    _.set(c, "address.zip", row["Postal Code"]);
    if (row["Country"] === "United States") {
      _.set(c, "address.country-code", "US");
    }

    // Donation Transaction
    const t1 = t.addTransaction({ $: { id: row["Stripe Charge Id"] } });
    _.set(t1, "operation.add", true);
    _.set(t1, "contact-id", contactId);
    _.set(t1, "type", "C");
    _.set(t1, "sub-type", "CA");
    _.set(t1, "amount", row.Amount);
    _.set(t1, "date", eventDate);

    // Platform Fee
    const plt = t.addTransaction({
      $: { id: row["Stripe Charge Id"] + "-plt" },
    });
    _.set(plt, "operation.add", true);
    _.set(plt, "contact-id", contactId);
    _.set(plt, "type", "E");
    _.set(plt, "sub-type", "CE");
    _.set(plt, "tran-purpose", "F");
    _.set(plt, "payment-method", "EFT");
    _.set(plt, "description", "Platform processing fee");
    _.set(plt, "amount", row["Platform Fee"]);
    _.set(plt, "date", eventDate);

    // Processing Fee
    const pf = t.addTransaction({
      $: { id: row["Stripe Charge Id"] + "-pf" },
    });
    _.set(pf, "operation.add", true);
    _.set(pf, "contact-id", contactId);
    _.set(pf, "type", "E");
    _.set(pf, "sub-type", "CE");
    _.set(pf, "tran-purpose", "F");
    _.set(pf, "payment-method", "EFT");
    _.set(pf, "description", "Processing fee");
    _.set(pf, "amount", row["Processing Fee"]);
    _.set(pf, "date", eventDate);
  }

  return t.toXML();
}
