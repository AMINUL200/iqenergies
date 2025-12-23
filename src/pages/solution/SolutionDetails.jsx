import React from "react";
import {
  Sun,
  Wind,
  Layers,
  Cpu,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  "High-efficiency renewable technologies",
  "Scalable from rooftop to utility scale",
  "Smart monitoring & control systems",
  "Grid-tied and off-grid compatibility",
  "Long-term reliability & performance",
];

const SolutionDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0A1A2F] text-white pt-20">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-green-700/10"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold text-green-400 tracking-wide">
                Solution Details
              </span>
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-bold leading-tight">
              Intelligent Energy Solutions
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Engineered for Performance
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-300">
              Our solutions are designed to deliver sustainable, reliable, and
              future-ready energy systems by integrating cutting-edge
              technologies across solar, wind, hybrid, and advanced renewable
              domains.
            </p>

            {/* <button
              onClick={() => navigate("/contact")}
              className="mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-xl
                         text-white font-semibold
                         bg-gradient-to-r from-green-500 to-green-600
                         hover:from-green-600 hover:to-green-700
                         transition-all shadow-lg"
            >
              Talk to Our Experts
              <ArrowRight className="w-5 h-5" />
            </button> */}
          </div>
        </div>
      </section>

      {/* ================= SOLUTION TYPES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Sun,
              title: "Solar PV Solutions",
              desc: "High-efficiency PV systems for rooftops and utility-scale projects.",
            },
            {
              icon: Wind,
              title: "Wind Energy Solutions",
              desc: "Reliable wind systems optimized for diverse wind conditions.",
            },
            {
              icon: Layers,
              title: "Hybrid Systems",
              desc: "Integrated solar, wind, and storage for uninterrupted power.",
            },
            {
              icon: Cpu,
              title: "Specialized Technologies",
              desc: "Advanced renewables like green hydrogen & waste-to-energy.",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white/5 backdrop-blur-xl
                           border border-white/10 hover:border-green-500/40
                           transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600
                                flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-green-400 transition-colors">
                  {item.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative py-20 bg-[#071527]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why Choose Our Solutions?
            </h2>

            <p className="text-gray-400 text-lg mb-8">
              Our renewable solutions are built with performance, longevity,
              and sustainability at their core — helping businesses and
              communities transition to clean energy confidently.
            </p>

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right – Highlight Card */}
          <div className="p-10 rounded-3xl bg-gradient-to-br from-green-500/20 to-green-700/10
                          border border-green-500/30 backdrop-blur-xl">
            <h3 className="text-2xl font-bold mb-4">
              Future-Ready Energy Architecture
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              Our solutions are designed to evolve with technology, regulations,
              and energy demand — ensuring long-term ROI and environmental
              impact reduction.
            </p>

            <button
              onClick={() => navigate("/solutions")}
              className="inline-flex items-center gap-2 text-green-400 font-semibold
                         hover:text-green-300 transition-colors"
            >
              View All Solutions
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default SolutionDetails;
