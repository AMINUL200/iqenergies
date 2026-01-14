import React, { forwardRef } from "react";
// import "./Invoice.css";

const Invoice = forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className="invoice">
      {/* Header */}
      <div className="header">
        <div>
          <h2>IQEnergies</h2>
          <p>Renewable Energy Solutions</p>
        </div>
        <div className="right">
          <h3>INVOICE</h3>
          <p>Invoice No: {order.invoiceNo}</p>
          <p>Date: {order.date}</p>
        </div>
      </div>

      {/* Seller & Buyer */}
      <div className="info">
        <div>
          <h4>Sold By</h4>
          <p>IQEnergies Pvt. Ltd.</p>
          <p>West Bengal, India</p>
          <p>GSTIN: 19XXXXXXXXXX</p>
        </div>

        <div>
          <h4>Bill To</h4>
          <p>{order.customer.name}</p>
          <p>{order.customer.address}</p>
          <p>{order.customer.phone}</p>
        </div>
      </div>

      {/* Product Table */}
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Price</th>
            <th>GST</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.qty}</td>
              <td>₹{item.price}</td>
              <td>{item.gst}%</td>
              <td>₹{item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="summary">
        <p>Subtotal: ₹{order.subtotal}</p>
        <p>GST: ₹{order.gstAmount}</p>
        <h3>Grand Total: ₹{order.grandTotal}</h3>
      </div>

      {/* Footer */}
      <p className="footer">
        This is a system generated invoice.  
        Thank you for choosing clean energy 🌱
      </p>
    </div>
  );
});

export default Invoice;
