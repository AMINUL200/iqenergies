import React from "react";
import { Sun, Wind, Layers, Cpu, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Icon mapping based on solution title
const getIconForSolution = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("solar") || lowerTitle.includes("pv")) return Sun;
  if (lowerTitle.includes("wind")) return Wind;
  if (lowerTitle.includes("hybrid")) return Layers;
  if (lowerTitle.includes("specialized") || lowerTitle.includes("technology") || lowerTitle.includes("hydrogen") || lowerTitle.includes("waste")) return Cpu;
  
  // Default icon
  return Sun;
};

const SolutionsSection = ({ solutionData = {} }) => {
  const navigate = useNavigate();
  
  // Extract solution section data and items
  const solutionSection = solutionData?.solution || {};
  const solutionItems = solutionData?.items || [];

  return (
    <section className="relative py-10 md:py-20 bg-[#0A1A2F]" id="solutions">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-green-400 tracking-wide">
              {solutionSection.tagline || "Our Solutions"}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {solutionSection.title || "Intelligent Energy Solutions"}
            {solutionSection.highlighted_text && (
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                {solutionSection.highlighted_text}
              </span>
            )}
          </h2>

          <p className="mt-6 text-lg text-gray-300 max-w-2xl">
            {solutionSection.description || "We deliver end-to-end renewable energy solutions that combine innovation, reliability, and sustainability."}
          </p>
        </div>

        {/* ================= SOLUTIONS GRID ================= */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutionItems.length > 0 ? (
            solutionItems
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((item) => {
                const Icon = getIconForSolution(item.title);
                return (
                  <div
                    key={item.id}
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
                    <button
                      onClick={() => navigate(`/solution/${item.slug || item.id}`)}
                      className="inline-flex items-center gap-2 text-green-400 font-semibold group-hover:text-green-300 transition-colors"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                );
              })
          ) : (
            // Fallback to original solutions if no items are provided
            <>
              <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                  <Sun className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-green-400 transition-colors">
                  Solar PV Solutions
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Advanced solar power solutions for utility-scale and rooftop installations using high-efficiency PV technologies.
                </p>
                <button
                  onClick={() => navigate("/solution/1")}
                  className="inline-flex items-center gap-2 text-green-400 font-semibold group-hover:text-green-300 transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              
              <div className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                  <Wind className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-green-400 transition-colors">
                  Wind Energy Solutions
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Reliable and scalable wind energy systems designed to perform efficiently across diverse wind conditions.
                </p>
                <button
                  onClick={() => navigate("/solution/2")}
                  className="inline-flex items-center gap-2 text-green-400 font-semibold group-hover:text-green-300 transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;