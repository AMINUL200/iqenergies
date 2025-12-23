import React from "react";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  TrendingUp,
  Leaf,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  "End-to-end clean energy solutions",
  "Industry-certified components",
  "Smart monitoring & optimization",
  "Scalable for residential to utility scale",
  "Long-term performance & reliability",
];

const ServicesDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-[#1F2933]">
      {/* ================= HERO ================= */}
      <section className="relative bg-[#0A1A2F] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4CAF50]/20 to-[#0F766E]/20"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4CAF50]/20 border border-[#4CAF50]/30 text-[#4CAF50] font-semibold text-sm">
            <Zap className="w-4 h-4" />
            Our Services
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-white max-w-3xl leading-tight">
            Smart & Sustainable Energy Services
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#0F766E]">
              Designed for a Greener Tomorrow
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-3xl">
            IQEnergies delivers cutting-edge renewable energy services —
            from solar and wind deployment to hybrid systems and intelligent
            energy management — ensuring efficiency, reliability, and long-term value.
          </p>

          {/* <button
            onClick={() => navigate("/contact")}
            className="mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-xl
                       text-white font-semibold
                       bg-gradient-to-r from-[#4CAF50] to-[#0F766E]
                       hover:from-[#0F766E] hover:to-[#065F46]
                       transition-all shadow-lg"
          >
            Get a Free Consultation
            <ArrowRight className="w-5 h-5" />
          </button> */}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose IQEnergies?
            </h2>

            <p className="text-gray-600 text-lg mb-8">
              We combine innovation, engineering excellence, and sustainability
              to deliver energy solutions that power growth while reducing
              environmental impact.
            </p>

            <ul className="space-y-4">
              {features.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#4CAF50]" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right – Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Leaf, title: "Clean Energy Focus" },
              { icon: Shield, title: "Quality & Safety" },
              { icon: TrendingUp, title: "High Performance" },
              { icon: Settings, title: "Smart Technology" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-gray-200
                             hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#4CAF50]/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#4CAF50]" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Engineered solutions built to meet modern energy demands
                    with maximum efficiency.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default ServicesDetails;
