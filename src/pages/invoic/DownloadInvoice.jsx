import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import Invoice from "./Invoice";
import "./invoice.css";

const DownloadInvoice = ({ order }) => {
  const invoiceRef = useRef();

  const downloadPDF = () => {
    html2pdf()
      .from(invoiceRef.current)
      .set({
        margin: 10,
        filename: `IQEnergies_Invoice_${order.invoiceNo}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <>
      {/* Hidden invoice */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <Invoice ref={invoiceRef} order={order} />
      </div>

      <button onClick={downloadPDF} className="btn">
        Download Invoice
      </button>
    </>
  );
};

export default DownloadInvoice;
