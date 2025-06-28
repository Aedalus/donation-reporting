import { readFileSync } from "fs";
import { transform } from "./transform";

const anonymizedCSV = readFileSync("./data/anonymized.csv").toString();
const transformed = transform({ csv: anonymizedCSV, filerId: "5276" });
console.log(transformed);
