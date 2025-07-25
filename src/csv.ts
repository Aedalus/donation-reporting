import Papa from "papaparse";

export type DonationRecord = {
  Name: string;
  "Donating Company": string | null;
  "Donor's First Name": string;
  "Donor's Last Name": string;
  "Donor Email": string | null;
  "Make Donation Anonymous": "yes" | "no";
  Campaign: string;
  Amount: number;
  "Fair Market Value": number;
  "Fair Market Value Description": string | null;
  "Tax Deductible Amount": number;
  Currency: string;
  "Amount in USD": number;
  "Processing Fee": number;
  "Platform Fee": number;
  "Total Fee": number;
  "Net Amount": number;
  "Existing Donor Id": string | null;
  "Fee Covered": "yes" | "no";
  "Donor Comment": string | null;
  "Internal Notes": string | null;
  "Donated At": string; // Consider using `Date` if you'll parse it
  Phone: string | null;
  Address: string | null;
  "Address 2": string | null;
  City: string;
  "State / Province": string;
  "Postal Code": string | number;
  Country: string;
  Employer: string;
  Occupation: string;
  Designation: string | null;
  "Receipt Id": number;
  "Donation Type": "stripe" | "paypal" | string;
  "Card Type": string;
  "Last 4 Digits": string | null;
  "Stripe Charge Id": string | null;
  "Pay Pal Transaction Id": string | null;
  "Pay Pal Capture Id": string | null;
  "Recurring Donation": "yes" | "no";
  "Recurring Plan Id": number | null;
  "Recurring Start Date": string; // Or `Date`
  "Join Mailing List": "yes" | "no";
  "First Donation": string | null;
  Fundraiser: string | null;
  "Donor Id": number;
  Status: "paid" | "pending" | "failed" | string;
  "Employer City & State (or Country)": string;
};

export function parseCSV(csv: string): DonationRecord[] {
  return Papa.parse(csv, { header: true }).data as DonationRecord[];
}
