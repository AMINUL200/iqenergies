import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Download,
  Printer,
  X,
  FileText,
  Mail,
} from "lucide-react";

const InvoiceGenerator = ({ order, onClose, isOpen }) => {
  const invoiceRef = useRef();

  // Format currency
  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [day, month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Download PDF with fix for OKLCH colors
  const downloadPDF = async () => {
    try {
      const element = invoiceRef.current;
      if (!element) return;

      // Create a clone of the element with inline styles to avoid OKLCH issue
      const clonedElement = element.cloneNode(true);
      
      // Convert Tailwind classes to inline styles
      convertTailwindToInline(clonedElement);
      
      // Hide the clone
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      document.body.appendChild(clonedElement);

      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        // Add ignoreElements to skip problematic elements
        ignoreElements: (element) => {
          // Skip elements with problematic styles
          const style = window.getComputedStyle(element);
          const bgColor = style.backgroundColor;
          return bgColor.includes('oklch');
        }
      });

      // Remove the clone
      document.body.removeChild(clonedElement);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10; // Add some margin at top

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save(`Invoice_${order.order_number}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Helper function to convert Tailwind classes to inline styles
  const convertTailwindToInline = (element) => {
    // Define a mapping of Tailwind classes to CSS styles
    const tailwindMap = {
      // Background colors
      'bg-white': 'background-color: #ffffff',
      'bg-gray-50': 'background-color: #f9fafb',
      'bg-gray-100': 'background-color: #f3f4f6',
      'bg-green-100': 'background-color: #d1fae5',
      'bg-green-600': 'background-color: #059669',
      // Text colors
      'text-green-600': 'color: #059669',
      'text-gray-600': 'color: #4b5563',
      'text-gray-800': 'color: #1f2937',
      'text-gray-500': 'color: #6b7280',
      // Borders
      'border': 'border: 1px solid #e5e7eb',
      'border-t': 'border-top: 1px solid #e5e7eb',
      // Padding
      'p-2': 'padding: 0.5rem',
      'p-3': 'padding: 0.75rem',
      'p-4': 'padding: 1rem',
      'p-6': 'padding: 1.5rem',
      'px-3': 'padding-left: 0.75rem; padding-right: 0.75rem',
      'py-2': 'padding-top: 0.5rem; padding-bottom: 0.5rem',
      // Margin
      'mb-2': 'margin-bottom: 0.5rem',
      'mb-4': 'margin-bottom: 1rem',
      'mb-6': 'margin-bottom: 1.5rem',
      'mt-2': 'margin-top: 0.5rem',
      'mt-4': 'margin-top: 1rem',
      'mt-6': 'margin-top: 1.5rem',
      'mr-2': 'margin-right: 0.5rem',
      // Text styles
      'font-bold': 'font-weight: bold',
      'text-sm': 'font-size: 0.875rem',
      'text-lg': 'font-size: 1.125rem',
      'text-xl': 'font-size: 1.25rem',
      'text-2xl': 'font-size: 1.5rem',
      'text-center': 'text-align: center',
      'text-left': 'text-align: left',
      'text-right': 'text-align: right',
      // Flexbox
      'flex': 'display: flex',
      'items-center': 'align-items: center',
      'justify-between': 'justify-content: space-between',
      'justify-center': 'justify-content: center',
      // Grid
      'grid': 'display: grid',
      'grid-cols-2': 'grid-template-columns: repeat(2, minmax(0, 1fr))',
      // Border radius
      'rounded': 'border-radius: 0.25rem',
      'rounded-lg': 'border-radius: 0.5rem',
      // Width/Height
      'w-full': 'width: 100%',
      'h-6': 'height: 1.5rem',
      'h-8': 'height: 2rem',
      // Gap
      'gap-2': 'gap: 0.5rem',
      'gap-4': 'gap: 1rem',
      'gap-6': 'gap: 1.5rem',
      // Hover effects
      'hover:bg-gray-50': '',
      'hover:bg-green-700': '',
    };

    // Apply styles to the element
    if (element.className) {
      const classes = element.className.split(' ');
      let inlineStyles = '';
      
      classes.forEach(className => {
        if (tailwindMap[className]) {
          inlineStyles += tailwindMap[className] + '; ';
        }
      });
      
      if (inlineStyles) {
        element.style.cssText += inlineStyles;
      }
    }

    // Process children recursively
    for (let child of element.children) {
      convertTailwindToInline(child);
    }
  };

  // Simple print function (no html2canvas issues)
  const printInvoice = () => {
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 10px;">
            <img src="/image/logo.png" alt="IQEnergies Logo" style="height: 60px;" />
            <div style="text-align: left;">
              <h2 style="color: #059669; margin: 0; font-size: 24px;">IQEnergies</h2>
              <p style="color: #666; margin: 5px 0; font-size: 14px;">Renewable Energy Solutions</p>
            </div>
          </div>
          <h3 style="margin: 20px 0; font-size: 18px;">TAX INVOICE</h3>
          <p style="color: #666; font-size: 12px;">GSTIN: 27ABCDE1234F1Z5</p>
        </div>
        
        <!-- Removed From section and only showing Bill To -->
        <div style="margin-bottom: 30px;">
          <div style="width: 100%;">
            <h4 style="margin: 0 0 10px 0;">Bill To:</h4>
            <div style="background: #f9fafb; padding: 15px; border-radius: 5px;">
              <p style="margin: 5px 0; font-weight: bold;">${order.customer?.name || 'N/A'}</p>
              <p style="margin: 5px 0; font-size: 14px;">${order.customer?.email || 'N/A'}</p>
              <p style="margin: 5px 0; font-size: 14px;">${order.customer?.mobile || 'N/A'}</p>
              <p style="margin: 5px 0; font-size: 14px;">${order.customer?.address || 'N/A'}</p>
              <p style="margin: 5px 0; font-size: 14px;">${order.customer?.state || 'N/A'} - ${order.customer?.pincode || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${order.order_number}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(order.order_date)}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> ${order.payment_status === 'paid' ? 'PAID' : 'PENDING'}</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f3f4f6;">
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">#</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Item</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Qty</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Price</th>
              <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items?.map((item, index) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 10px;">${index + 1}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${item.title}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 10px;">${formatCurrency(item.base_price)}</td>
                <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">${formatCurrency(item.total)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div style="text-align: right; margin-top: 30px;">
          <div style="display: inline-block; text-align: left;">
            <p style="margin: 5px 0;">Subtotal: ${formatCurrency(order.amounts?.subtotal || 0)}</p>
            ${order.amounts?.cgst > 0 ? `<p style="margin: 5px 0;">CGST (9%): ${formatCurrency(order.amounts.cgst)}</p>` : ''}
            ${order.amounts?.sgst > 0 ? `<p style="margin: 5px 0;">SGST (9%): ${formatCurrency(order.amounts.sgst)}</p>` : ''}
            ${order.amounts?.igst > 0 ? `<p style="margin: 5px 0;">IGST (18%): ${formatCurrency(order.amounts.igst)}</p>` : ''}
            <div style="border-top: 2px solid #059669; margin-top: 10px; padding-top: 10px;">
              <p style="margin: 0; font-size: 18px; font-weight: bold;">
                Total: ${formatCurrency(order.amounts?.total || 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 14px;">
          <p>Thank you for your business!</p>
          <p>For queries: support@iqenergies.com | +91 98765 43210</p>
        </div>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${order.order_number}</title>
          <style>
            @media print {
              @page { margin: 20mm; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Send Email
  const sendEmail = () => {
    alert(`Invoice will be sent to ${order.customer?.email}`);
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Invoice #{order.order_number}
              </h2>
              <p className="text-sm text-gray-600">
                Order Date: {formatDate(order.order_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={sendEmail}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <Mail size={16} />
              <span className="hidden sm:inline">Email</span>
            </button>
            <button
              onClick={printInvoice}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-gray-100"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Invoice Content - Using basic styles to avoid OKLCH */}
        <div className="flex-1 overflow-auto p-4">
          <div ref={invoiceRef} className="bg-white p-6" style={{
            backgroundColor: '#ffffff',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {/* Invoice Header with Logo */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '15px', 
                marginBottom: '10px' 
              }}>
                <img 
                  src="/image/logo.png" 
                  alt="IQEnergies Logo" 
                  style={{ 
                    height: '60px',
                    maxWidth: '100%'
                  }} 
                />
                <div style={{ textAlign: 'left' }}>
                  <h1 style={{ color: '#059669', margin: 0, fontSize: '24px' }}>
                    IQEnergies
                  </h1>
                  <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>
                    Renewable Energy Solutions
                  </p>
                </div>
              </div>
              <h2 style={{ margin: '20px 0', fontSize: '18px' }}>TAX INVOICE</h2>
              <p style={{ color: '#666', fontSize: '12px' }}>GSTIN: 27ABCDE1234F1Z5</p>
            </div>

            {/* Only Bill To section (removed From section) */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Bill To:</h3>
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '5px' }}>
                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>{order.customer?.name || 'N/A'}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>{order.customer?.email || 'N/A'}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>{order.customer?.mobile || 'N/A'}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>{order.customer?.address || 'N/A'}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  {order.customer?.state || 'N/A'} - {order.customer?.pincode || 'N/A'}
                </p>
              </div>
            </div>

            {/* Invoice Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Invoice #</p>
                <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{order.order_number}</p>
              </div>
              <div>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Invoice Date</p>
                <p style={{ fontWeight: 'bold', margin: '5px 0' }}>{formatDate(order.order_date)}</p>
              </div>
            </div>

            {/* Items Table */}
            <div style={{ marginBottom: '30px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6' }}>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>#</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Description</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Qty</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Unit Price</th>
                    <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr key={item.product_id}>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.title}</td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>{item.quantity}</td>
                      <td style={{ border: '1px solid #ddd', padding: '10px' }}>{formatCurrency(item.base_price)}</td>
                      <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold' }}>
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'inline-block', textAlign: 'left' }}>
                <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                  <span style={{ color: '#666' }}>Subtotal:</span>
                  <span>{formatCurrency(order.amounts?.subtotal || 0)}</span>
                </p>
                {parseFloat(order.amounts?.cgst || 0) > 0 && (
                  <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                    <span style={{ color: '#666' }}>CGST (9%):</span>
                    <span>{formatCurrency(order.amounts.cgst)}</span>
                  </p>
                )}
                {parseFloat(order.amounts?.sgst || 0) > 0 && (
                  <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                    <span style={{ color: '#666' }}>SGST (9%):</span>
                    <span>{formatCurrency(order.amounts.sgst)}</span>
                  </p>
                )}
                {parseFloat(order.amounts?.igst || 0) > 0 && (
                  <p style={{ margin: '5px 0', display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                    <span style={{ color: '#666' }}>IGST (18%):</span>
                    <span>{formatCurrency(order.amounts.igst)}</span>
                  </p>
                )}
                <div style={{ borderTop: '2px solid #059669', marginTop: '10px', paddingTop: '10px' }}>
                  <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', gap: '30px' }}>
                    <span>Total Amount:</span>
                    <span>{formatCurrency(order.amounts?.total || 0)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div style={{ marginTop: '30px', padding: '15px', background: '#f9fafb', borderRadius: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Payment Method</p>
                  <p style={{ fontWeight: 'bold', margin: '5px 0' }}>
                    {order.payment_method === "cod" ? "Cash on Delivery" : "Online Payment"}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Payment Status</p>
                  <span style={{
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    backgroundColor: order.payment_status === "paid" ? '#d1fae5' : '#fef3c7',
                    color: order.payment_status === "paid" ? '#065f46' : '#92400e'
                  }}>
                    {order.payment_status === "paid" ? "PAID" : "PENDING"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #ddd', textAlign: 'center', color: '#666', fontSize: '14px' }}>
              <p>Thank you for your business!</p>
              <p>For queries: support@iqenergies.com | +91 98765 43210</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Invoice #{order.order_number}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={downloadPDF}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;