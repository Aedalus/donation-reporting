import { parseCSV } from "./csv";
import { CampaignFinanceTransaction } from "./xml";
import set from "lodash.set";

export interface TransformOptions {
  csv: string;
  filerId: string;
}

const cSet = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  c: any,
  path: string,
  value: string | number | boolean | null
) => {
  if (value) {
    set(c, path, value);
  }
};
export function transform({ csv, filerId }: TransformOptions) {
  const data = parseCSV(csv);
  const t = new CampaignFinanceTransaction(filerId);

  for (const row of data) {
    const contactId = row["Donor Id"];
    const c = t.addContact({ $: { id: contactId } });
    const eventDate = new Date(row["Donated At"]).toISOString().slice(0, 10);

    cSet(c, "contact-name.individual-name.first", row["Donor's First Name"]);
    cSet(c, "contact-name.individual-name.last", row["Donor's Last Name"]);

    cSet(c, "address.street1", row.Address);
    cSet(c, "address.street2", row["Address 2"]);
    cSet(c, "address.city", row.City);
    cSet(c, "address.state", row["State / Province"]);
    cSet(c, "address.zip", row["Postal Code"]);
    if (row["Country"] === "United States") {
      cSet(c, "address.country-code", "US");
    }

    // Donation Transaction
    const t1 = t.addTransaction({ $: { id: row["Stripe Charge Id"] } });
    cSet(t1, "operation.add", true);
    cSet(t1, "contact-id", contactId);
    cSet(t1, "type", "C");
    cSet(t1, "sub-type", "CA");
    cSet(t1, "amount", row.Amount);
    cSet(t1, "date", eventDate);

    // Platform Fee
    if (row["Platform Fee"]) {
      const plt = t.addTransaction({
        $: { id: row["Stripe Charge Id"] + "-plt" },
      });
      cSet(plt, "operation.add", true);
      cSet(plt, "contact-id", contactId);
      cSet(plt, "type", "E");
      cSet(plt, "sub-type", "CE");
      cSet(plt, "tran-purpose", "F");
      cSet(plt, "payment-method", "EFT");
      cSet(plt, "description", "Platform processing fee");
      cSet(plt, "amount", row["Platform Fee"]);
      cSet(plt, "date", eventDate);
    }

    // Processing Fee
    if (row["Processing Fee"]) {
      const pf = t.addTransaction({
        $: { id: row["Stripe Charge Id"] + "-pf" },
      });
      cSet(pf, "operation.add", true);
      cSet(pf, "contact-id", contactId);
      cSet(pf, "type", "E");
      cSet(pf, "sub-type", "CE");
      cSet(pf, "tran-purpose", "F");
      cSet(pf, "payment-method", "EFT");
      cSet(pf, "description", "Processing fee");
      cSet(pf, "amount", row["Processing Fee"]);
      cSet(pf, "date", eventDate);
    }
  }

  return t.toXML();
}
