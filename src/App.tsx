import { useState } from "react";
import { getXML } from "./xml";
import XMLViewer from "react-xml-viewer";
import { type RJSFSchema } from "@rjsf/utils";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";

const schema: RJSFSchema = {
  title: "",
  type: "object",
  required: ["filerID", "file"],
  properties: {
    filerId: { type: "string", title: "Filer ID", default: "5276" },
    file: {
      type: "string",
      format: "data-url",
      title: "Upload CSV",
    },
  },
};

const log = (type: unknown) => console.log.bind(console, type);

function App() {
  // const [file, setFile] = useState();
  const [xml, setXml] = useState(getXML());

  // const fileReader = new FileReader();

  // const handleOnChange = (e) => {
  //   setFile(e.target.files[0]);
  // };

  // const handleOnSubmit = (e) => {
  //   e.preventDefault();

  //   if (file) {
  //     fileReader.onload = function (event) {
  //       const csvOutput = event.target.result;
  //     };

  //     fileReader.readAsText(file);
  //   }
  // };

  const downloadTxtFile = () => {
    const dateString = new Date().toLocaleDateString("en-CA");

    const element = document.createElement("a");
    const file = new Blob([xml], { type: "text/xml" });
    element.href = URL.createObjectURL(file);
    element.download = `ip28report.${dateString}.xml`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "0 10%" }}>
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ marginTop: "30px" }}>IP28 Reporting</h1>
        <p style={{ width: "" }}>
          This software is provided under the{" "}
          <a href="https://opensource.org/license/mit">MIT License</a>. Please
          ensure that any files created match your input data.
        </p>
      </div>
      <Form
        schema={schema}
        validator={validator}
        onChange={log("changed")}
        onSubmit={log("submitted")}
        onError={log("errors")}
      />
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
        }}
      >
        <XMLViewer xml={xml} />
      </div>
    </div>
  );
}

export default App;
