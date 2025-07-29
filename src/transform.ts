import { parseCSV } from "./csv";
import type { SubmitData } from "./Form";
import { CampaignFinanceTransaction } from "./xml";
import set from "lodash.set";

export interface TransformOptions {
  csv: string;
  filerId: string;
  contactIdDonorbox: string;
  contactIdStripe: string;
  contactIdPaypal: string;
  transactionsOnly: boolean;
}

const cSet = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  c: any,
  path: string,
  value: string | number | boolean | null | undefined
) => {
  if (value) {
    set(c, path, value);
  }
};

export function transform({
  csv,
  filerId,
  contactIdDonorbox,
  contactIdStripe,
  contactIdPaypal,
  transactionsOnly,
}: SubmitData) {
  const data = parseCSV(csv);
  const t = new CampaignFinanceTransaction(filerId);

  for (const row of data) {
    const contactId = row["Existing Donor Id"] || row["Donor Id"];
    const eventDate = new Date(row["Donated At"]).toISOString().slice(0, 10);

    if (!transactionsOnly && row["First Donation"]) {
      const c = t.addContact({ $: { id: contactId } });

      cSet(c, "type", "I");
      cSet(c, "contact-name.individual-name.first", row["Donor's First Name"]);
      cSet(c, "contact-name.individual-name.last", row["Donor's Last Name"]);

      cSet(c, "address.street1", row.Address);
      cSet(c, "address.street2", row["Address 2"]);
      cSet(c, "address.city", row.City);
      cSet(c, "address.state", row["State / Province"]);
      cSet(c, "address.zip", row["Postal Code"]);
      if (row["Country"]) {
        if (["United States", "US"].includes(row["Country"])) {
          cSet(c, "address.country-code", "US");
        } else {
          cSet(c, "address.country-code", "UNKNOWN_COUNTRY_CODE");
        }
      }

      // Occupations
      const occupation = row.Occupation || row.Occupation_1;
      const employmentStatus = row["Employment Status"];
      if (employmentStatus === "Not Employed") {
        cSet(c, "employment.not-employed", "Yes");
      } else if (employmentStatus === "Self-Employed") {
        cSet(c, "occupation", occupation);
        cSet(c, "employment.self-employed", "Yes");
      } else if (employmentStatus == "Employee") {
        cSet(c, "occupation", occupation);
        cSet(c, "employment.employer-name", row["Employer's Name"]);
        cSet(c, "employment.city", row["Employer's City"]);
        cSet(c, "employment.state", row["Employer's State"]);
      }
    }

    const tId = row["Stripe Charge Id"] || row["Pay Pal Transaction Id"];
    // Donation Transaction
    const t1 = t.addTransaction({ $: { id: tId } });
    cSet(t1, "operation.add", true);
    cSet(t1, "contact-id", contactId);
    cSet(t1, "type", "C");
    cSet(t1, "sub-type", "CA");
    cSet(t1, "amount", row.Amount);
    cSet(t1, "date", eventDate);

    // Platform Fee
    if (row["Platform Fee"]) {
      const plt = t.addTransaction({
        $: { id: tId + "-2" },
      });
      cSet(plt, "operation.add", true);
      cSet(plt, "contact-id", contactIdDonorbox);
      cSet(plt, "type", "E");
      cSet(plt, "sub-type", "CE");
      cSet(plt, "tran-purpose", "G");
      cSet(plt, "description", "Platform processing fee");
      cSet(plt, "amount", row["Platform Fee"]);
      cSet(plt, "payment-method", "EFT");
      cSet(plt, "date", eventDate);
    }

    // Processing Fee
    const contactProcessingID = row["Stripe Charge Id"]
      ? contactIdStripe
      : contactIdPaypal;
    if (row["Processing Fee"]) {
      const pf = t.addTransaction({
        $: { id: tId + "-3" },
      });
      cSet(pf, "operation.add", true);
      cSet(pf, "contact-id", contactProcessingID);
      cSet(pf, "type", "E");
      cSet(pf, "sub-type", "CE");
      cSet(pf, "tran-purpose", "G");
      cSet(pf, "description", "Processing fee");
      cSet(pf, "amount", row["Processing Fee"]);
      cSet(pf, "payment-method", "EFT");
      cSet(pf, "date", eventDate);
    }
  }

  return t.toXML();
}
