import React from "react";
import { Sun, Wind, Layers, Cpu, ArrowRight } from "lucide-react";

const solutions = [
  {
    title: "Solar PV Solutions",
    description:
      "Advanced solar power solutions for utility-scale and rooftop installations using high-efficiency PV technologies.",
    icon: Sun,
  },
  {
    title: "Wind Energy Solutions",
    description:
      "Reliable and scalable wind energy systems designed to perform efficiently across diverse wind conditions.",
    icon: Wind,
  },
  {
    title: "Hybrid Systems",
    description:
      "Smart integration of solar, wind, and energy storage to ensure uninterrupted power for on-grid and off-grid needs.",
    icon: Layers,
  },
  {
    title: "Specialized Technologies",
    description:
      "Innovative solutions including green hydrogen, waste-to-energy, and next-generation renewable technologies.",
    icon: Cpu,
  },
];

const SolutionsSection = () => {
  return (
    <section className="relative py-10 md:py-20 bg-[#0A1A2F]" id="solutions">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="max-w-3xl mb-14">
         

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-green-400 tracking-wide">
              Our Solutions
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Intelligent Energy Solutions
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Built for Tomorrow
            </span>
          </h2>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            We deliver end-to-end renewable energy solutions that combine
            innovation, reliability, and sustainability.
          </p>
        </div>

        {/* ================= SOLUTIONS GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-green-400 transition-colors">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Read More */}
                <button className="inline-flex items-center gap-2 text-green-400 font-semibold group-hover:text-green-300 transition-colors">
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
