import React from "react";
import { CheckCircle, Shield, Zap, ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const reviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    comment:
      "Excellent solar panel quality. Installation was smooth and performance is outstanding.",
  },
  {
    name: "Ananya Das",
    rating: 4,
    comment: "Good efficiency and solid build quality. Value for money.",
  },
  {
    name: "Mohammed Ali",
    rating: 5,
    comment: "Reduced my electricity bill significantly. Highly recommended!",
  },
];

const ProductDetails = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-white py-16 md:py-24 md:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ================= PRODUCT SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ================= IMAGE ================= */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&fit=crop"
                alt="High Efficiency Solar Panel"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* ================= DETAILS ================= */}
          <div className="space-y-8">
            {/* Category */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700 uppercase">
                Solar Product
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              High-Efficiency Solar Panel
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Premium monocrystalline solar panel designed for maximum energy
              generation, durability, and long-term reliability.
            </p>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">₹45,000</span>
              <span className="text-sm text-gray-500">(Per Unit)</span>
            </div>

            {/* ================= FEATURES ================= */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "22%+ Energy Efficiency",
                "25 Years Performance Warranty",
                "Weather Resistant Design",
                "On-Grid & Off-Grid Compatible",
              ].map((item, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>

            {/* ================= BUY BOX ================= */}
            <div className="border border-gray-200 rounded-2xl p-6 space-y-6 bg-gray-50">
              {/* Quantity */}
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Quantity</span>
                <span className="font-semibold text-gray-900">1 Unit</span>
              </div>

              {/* Buy Now */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
              >
                Buy Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

             

              {/* Trust */}
              <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4 text-green-600" />
                Secure & Trusted Checkout
              </div>
            </div>
          </div>
        </div>

        {/* ================= PRODUCT INFO ================= */}
        <div className="mt-20 max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Product Information
          </h2>
          <p className="text-gray-600 leading-relaxed">
            IQ Energies solar panels are manufactured using advanced
            photovoltaic technology to ensure high efficiency and long
            operational life. Ideal for residential, commercial, and industrial
            installations.
          </p>
        </div>

        {/* ================= REVIEWS ================= */}
        <div className="mt-20 border-t border-gray-200 pt-12 max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Customer Reviews
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-600 mb-4">“{review.comment}”</p>

                {/* Name */}
                <span className="font-semibold text-gray-900">
                  {review.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
