import React, { use, useState } from "react";
import {
  Sun,
  Wind,
  Droplets,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Leaf,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ================= PRODUCT DATA ================= */
const products = {
  sun: [
    {
      title: "High-Efficiency Solar Panels",
      image:
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      icon: Zap,
    },
    {
      title: "Rooftop Solar Systems",
      image:
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800",
      icon: Sun,
    },
    {
      title: "Utility-Scale Solar Plants",
      image:
        "https://images.unsplash.com/photo-1584270354949-c26b0d05cfa0?w=800",
      icon: TrendingUp,
    },
    {
      title: "Solar Inverter Solutions",
      image:
        "https://images.unsplash.com/photo-1624397640148-949b1732bbd3?w=800",
      icon: Shield,
    },
  ],
  wind: [
    {
      title: "Horizontal Axis Wind Turbines",
      image:
        "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800",
      icon: Wind,
    },
    {
      title: "Vertical Axis Wind Turbines",
      image:
        "https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800",
      icon: Wind,
    },
    {
      title: "Onshore Wind Farms",
      image:
        "https://images.unsplash.com/photo-1509390288600-9b9b1c3f7a8b?w=800",
      icon: Leaf,
    },
    {
      title: "Wind Energy Controllers",
      image:
        "https://images.unsplash.com/photo-1602526432604-029a709e131c?w=800",
      icon: Zap,
    },
  ],
  water: [
    {
      title: "Small Hydro Power Plants",
      image:
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800",
      icon: Droplets,
    },
    {
      title: "Micro Hydro Solutions",
      image:
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800",
      icon: Droplets,
    },
    {
      title: "Water Energy Turbines",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
      icon: Zap,
    },
    {
      title: "Hydro Energy Storage",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
      icon: Shield,
    },
  ],
};

/* ================= TABS ================= */
const tabs = [
  { key: "sun", label: "Solar Energy", icon: Sun },
  { key: "wind", label: "Wind Energy", icon: Wind },
  { key: "water", label: "Hydro Energy", icon: Droplets },
];

/* ================= THEME CONFIG ================= */
const themeConfig = {
  sun: {
    gradient: "from-amber-500 to-orange-600",
    border: "border-amber-500/30",
    light: "bg-amber-500/10",
    text: "text-amber-400",
  },
  wind: {
    gradient: "from-gray-200 to-white",
    border: "border-white/30",
    light: "bg-white/10",
    text: "text-gray-200",
  },
  water: {
    gradient: "from-blue-500 to-indigo-600",
    border: "border-blue-500/30",
    light: "bg-blue-500/10",
    text: "text-blue-400",
  },
};

const ProductSection = () => {
  const [activeTab, setActiveTab] = useState("sun");
  const theme = themeConfig[activeTab];
  const navigate = useNavigate();

  return (
    <section className="relative py-10 md:py-20 bg-[#0A1A2F]" id="products">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADER (LEFT ALIGNED) ================= */}
        <div className="max-w-4xl mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-green-400 tracking-wide">
              Our Products
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Sustainable Energy Products
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Built for the Future
            </span>
          </h2>
        </div>

        {/* ================= FILTER BUTTONS ================= */}
        <div className="flex flex-wrap gap-4 mb-12">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const tabTheme = themeConfig[tab.key];

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300
                  ${
                    isActive
                      ? `bg-gradient-to-r ${tabTheme.gradient} text-black shadow-lg`
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ================= PRODUCT GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products[activeTab].map((product, index) => {
            const Icon = product.icon;

            return (
              <div
                key={index}
                className={`group rounded-2xl overflow-hidden bg-white/5 border ${theme.border} transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Icon */}
                  <div
                    className={`absolute top-4 right-4 p-3 rounded-xl ${theme.light}`}
                  >
                    <Icon className={`w-5 h-5 ${theme.text}`} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-6">
                    {product.title}
                  </h3>

                  <button
                    onClick={() => navigate(`/product/${index + 1}`)}
                    className={`inline-flex items-center gap-2 font-semibold ${theme.text}`}
                  >
                    More Details
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= VIEW ALL BUTTON ================= */}
        <div className="mt-14 flex justify-center ">
          <button
            onClick={() => navigate("/products")}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl
               font-semibold text-white
               bg-gradient-to-r from-green-500 to-green-600
               hover:from-green-600 hover:to-green-700
               shadow-lg transition-all duration-300"
          >
            View All Products
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
