import React from "react";
import { Sun, Wind, Layers, Recycle, Zap, TreePine } from "lucide-react";

// Icon mapping based on service title
const getIconForService = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("solar") && lowerTitle.includes("tree")) return TreePine;
  if (lowerTitle.includes("solar") || lowerTitle.includes("pv") || lowerTitle.includes("topcon")) return Sun;
  if (lowerTitle.includes("wind")) return Wind;
  if (lowerTitle.includes("hybrid") || lowerTitle.includes("storage")) return Layers;
  if (lowerTitle.includes("hydrogen") || lowerTitle.includes("waste") || lowerTitle.includes("circular")) return Recycle;
  if (lowerTitle.includes("ev") || lowerTitle.includes("charging") || lowerTitle.includes("mobility")) return Zap;
  
  // Default icon for new services
  return Sun;
};

const WhatWeDoSection = ({ whatData = {} }) => {
  // Extract section data and items
  const section = whatData?.section || {};
  const items = whatData?.items || [];

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
                {section.tagline || "What We Do"}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight" aria-label={section?.title_meta}>
              {section.title || "Clean Energy Solutions"}
              {section.highlighted_text && (
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                  {section.highlighted_text}
                </span>
              )}
            </h2>

            <p className="mt-6 text-lg text-gray-300 max-w-2xl" aria-label={section?.description_meta}>
              {section.description || "We deliver integrated, future-ready renewable energy solutions across multiple technologies to power sustainable growth."}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.length > 0 ? (
              items.map((item, index) => {
                const Icon = getIconForService(item.title);
                return (
                  <div
                    key={item.id}
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
                      {item.description}
                    </p>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                );
              })
            ) : (
              // Fallback to original services if no items are provided
              <>
                <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                    <Sun className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors">
                    Solar Power Solutions
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Utility-scale and rooftop solar projects backed by advanced PV technologies including Monofacial, Bifacial, and TOPCon modules.
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                    <Wind className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors">
                    Wind Energy Systems
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    A complete portfolio of horizontal and vertical axis turbines tailored for variable wind conditions.
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-500/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                    <Layers className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-400 transition-colors">
                    Hybrid Energy Systems
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm">
                    Smart integration of solar and wind with energy storage for uninterrupted, off-grid solutions.
                  </p>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;