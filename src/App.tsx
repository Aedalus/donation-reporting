import XMLViewer from "react-xml-viewer";
import { Form, type SubmitData } from "./Form";
import { useState } from "react";
import { transform } from "./transform";

const requiredCSVFields = [
  "Donor's First Name",
  "Donor's Last Name",
  "Donated At",
  "Address",
  "Address 2",
  "City",
  "State / Province",
  "Postal Code",
  "Country",
  "Stripe Charge Id",
  "Amount",
  "Platform Fee",
  "Processing Fee",
];
function App() {
  const [data, setData] = useState<SubmitData>();
  const xml = data?.csv ? transform(data) : "";

  const downloadTxtFile = () => {
    const dateString = new Date().toLocaleDateString("en-CA");

    const element = document.createElement("a");
    const file = new Blob([xml], { type: "text/xml" });
    element.href = URL.createObjectURL(file);
    element.download = `donations-report.${dateString}.xml`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "0 10%" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ marginTop: "30px" }}>Donorbox &rarr; ORESTAR Reporting</h1>
        <p style={{ maxWidth: "800px", marginBottom: "" }}>
          This software is provided under the{" "}
          <a href="https://opensource.org/license/mit">MIT License</a>. Accuracy
          cannot be guaranteed. Please ensure that any files created match your
          input data. No data is stored and all files are processed in your
          local browser.
        </p>
        <p>
          The following fields are expected in the CSV. These must match
          exactly, though the columns can be in any order:
        </p>
        <ul style={{ display: "flex", flexWrap: "wrap" }}>
          {requiredCSVFields.map((field) => (
            <li
              style={{
                width: "10em",
                display: "inline",
                backgroundColor: "lightgray",
                padding: "3px 10px",
                margin: "5px",
                borderRadius: "5px",
              }}
            >
              {field}
            </li>
          ))}
        </ul>
        An optional
        <li
          style={{
            width: "10em",
            display: "inline",
            backgroundColor: "lightgray",
            padding: "3px 10px",
            margin: "5px",
            borderRadius: "5px",
          }}
        >
          Existing Donor Id
        </li>
        field is supported, which will be used in place of Donor Id if supplied.
      </div>

      <Form OnSubmit={(data) => setData(data)} />

      {xml && (
        <>
          <button
            className="btn btn-success"
            style={{ marginTop: "40px" }}
            onClick={downloadTxtFile}
          >
            Download XML
          </button>
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              border: "2px solid black",
              marginBottom: "100px",
              overflowY: "scroll",
              maxHeight: "80vh",
            }}
          >
            <XMLViewer xml={xml} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
