import React from "react";
import { Sun, Wind, Layers, Recycle, Zap, TreePine } from "lucide-react";

const services = [
  {
    icon: Sun,
    title: "Solar Power Solutions",
    desc: "Utility-scale and rooftop solar projects backed by advanced PV technologies including Monofacial, Bifacial, and TOPCon modules.",
  },
  {
    icon: Wind,
    title: "Wind Energy Systems",
    desc: "A complete portfolio of horizontal and vertical axis turbines tailored for variable wind conditions.",
  },
  {
    icon: Layers,
    title: "Hybrid Energy Systems",
    desc: "Smart integration of solar and wind with energy storage for uninterrupted, off-grid solutions.",
  },
  {
    icon: Recycle,
    title: "Green Hydrogen & Waste-to-Energy",
    desc: "Cutting-edge innovations in sustainable energy generation for a circular economy.",
  },
  {
    icon: Zap,
    title: "EV Charging Infrastructure",
    desc: "Intelligent and scalable charging solutions for the electric mobility revolution.",
  },
  {
    icon: TreePine,
    title: "Solar Tree Installations",
    desc: "Aesthetic, space-saving solar structures for urban and institutional landscapes.",
  },
];

const WhatWeDoSection = () => {
  return (
    <section className="relative min-h-screen w-full">
      {/* ================= FIXED BACKGROUND ================= */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/image/Empowering-Tomorrow-with-Solar-Solutions.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-[#0A1A2F]/85" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative min-h-screen py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="max-w-3xl mb-16">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold text-green-400 tracking-wide">
                What We Do
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Clean Energy Solutions
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Designed for the Future
              </span>
            </h2>

            <p className="mt-6 text-lg text-gray-300 max-w-2xl">
              We deliver integrated, future-ready renewable energy solutions
              across multiple technologies to power sustainable growth.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed text-sm">
                    {item.desc}
                  </p>

                  {/* Hover Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
