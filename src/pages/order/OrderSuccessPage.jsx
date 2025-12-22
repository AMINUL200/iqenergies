import React from "react";
import { CheckCircle, Phone, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white min-h-screen flex items-center justify-center px-6 py-6 md:pt-40 ">
      <div className="max-w-3xl w-full text-center">

        {/* ================= ICON ================= */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* ================= TITLE ================= */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Order Placed Successfully 🎉
        </h1>

        {/* ================= MESSAGE ================= */}
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6">
          Thank you for choosing <strong>IQ Energies</strong>.  
          Your request has been received and our expert team will contact you
          shortly to confirm installation details.
        </p>

        {/* ================= ORDER INFO ================= */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 text-left max-w-xl mx-auto">
          <div className="flex justify-between mb-3">
            <span className="text-gray-600">Order Status</span>
            <span className="font-semibold text-green-600">Confirmed</span>
          </div>

          <div className="flex justify-between mb-3">
            <span className="text-gray-600">Product</span>
            <span className="font-medium text-gray-900">
              High-Efficiency Solar Panel
            </span>
          </div>

          <div className="flex justify-between mb-3">
            <span className="text-gray-600">Quantity</span>
            <span className="font-medium text-gray-900">1 Unit</span>
          </div>

          <div className="flex justify-between border-t pt-3">
            <span className="text-gray-600">Total Amount</span>
            <span className="font-bold text-gray-900">₹45,000</span>
          </div>
        </div>

        {/* ================= NEXT STEPS ================= */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 max-w-xl mx-auto">
          <h3 className="font-semibold text-green-700 mb-3">
            What happens next?
          </h3>
          <ul className="text-gray-700 space-y-2 text-left">
            <li>✔ Our solar expert will call you within 24 hours</li>
            <li>✔ Site survey & system planning</li>
            <li>✔ Installation scheduling</li>
          </ul>
        </div>

        {/* ================= CTA BUTTONS ================= */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-gray-300 font-semibold text-gray-800 hover:bg-gray-100 transition"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>

          <a
            href="tel:+918276863844"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-lg hover:shadow-green-500/30 transition"
          >
            <Phone className="w-5 h-5" />
            Call Support
          </a>
        </div>

      </div>
    </section>
  );
};

export default OrderSuccessPage;
