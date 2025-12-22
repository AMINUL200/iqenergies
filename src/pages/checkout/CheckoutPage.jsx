import React from "react";
import { ShieldCheck, ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-white py-16 md:py-24 md:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ================= HEADER ================= */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-6">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700 uppercase">
              Secure Checkout
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Complete Your Order
          </h1>

          <p className="text-lg text-gray-600 mt-4">
            Please review your product and share your details. Our team will
            contact you for confirmation and installation.
          </p>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ================= LEFT : CUSTOMER FORM ================= */}
          <div className="border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Customer Details
            </h2>

            <form className="space-y-6">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
              />

              <textarea
                placeholder="Installation Address"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Pincode"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                />

                <input
                  type="number"
                  placeholder="Avg Monthly Electricity (kWh)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                />
              </div>
            </form>
          </div>

          {/* ================= RIGHT : ORDER SUMMARY ================= */}
          <div className="border border-gray-200 rounded-2xl p-8 shadow-sm bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Product */}
            <div className="flex gap-4 items-center mb-6">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400"
                alt="Solar Panel"
                className="w-24 h-24 rounded-xl object-cover border"
              />

              <div>
                <h3 className="font-semibold text-gray-900">
                  High-Efficiency Solar Panel
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Quantity: <strong>1 Unit</strong>
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-700">
                <span>Product Price</span>
                <span>₹45,000</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Installation & Support</span>
                <span>Included</span>
              </div>

              <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>₹45,000</span>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => navigate("/order-success")}
              className="w-full mt-8 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
            >
              Place Order
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Trust */}
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mt-4">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              100% Secure & Trusted Process
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
