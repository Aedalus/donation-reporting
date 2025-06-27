import { readFileSync } from "fs";
import { transform } from "./transform";

const anonymizedCSV = readFileSync("./data/anonymized.csv").toString();
const transformed = transform({ csv: anonymizedCSV });
console.log(transformed);
