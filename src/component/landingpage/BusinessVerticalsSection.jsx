import React from "react";
import { Cpu, Globe, ShoppingCart, BriefcaseBusiness } from "lucide-react";

// Icon mapping based on business vertical title
const getIconForVertical = (title) => {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes("electronics") || lowerTitle.includes("distribution") || lowerTitle.includes("lighting") || lowerTitle.includes("wiring")) return Cpu;
  if (lowerTitle.includes("export") || lowerTitle.includes("logistics") || lowerTitle.includes("supply") || lowerTitle.includes("global")) return Globe;
  if (lowerTitle.includes("e-commerce") || lowerTitle.includes("ecommerce") || lowerTitle.includes("marketplace") || lowerTitle.includes("online")) return ShoppingCart;
  if (lowerTitle.includes("consultancy") || lowerTitle.includes("advisory") || lowerTitle.includes("planning") || lowerTitle.includes("feasibility")) return BriefcaseBusiness;
  
  // Default icon
  return Cpu;
};

const BusinessVerticalsSection = ({ businessData = {} }) => {
  // Extract business hero data and items
  const businessHero = businessData?.business_hero || {};
  const verticalItems = businessData?.items || [];

  return (
    <section className="relative py-10 md:py-20 min-h-screen overflow-hidden">
      {/* ================= FIXED BACKGROUND ================= */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1920&auto=format&fit=crop')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#0A1A2F]/85" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-green-400 tracking-wide">
              {businessHero.tagline || "Business Verticals"}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight" aria-label={businessHero?.title_meta}>
            {businessHero.title || "Diverse Capabilities Across"}
            {businessHero.highlighted_text && (
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                {businessHero.highlighted_text}
              </span>
            )}
          </h2>
        </div>

        {/* Verticals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {verticalItems.length > 0 ? (
            verticalItems
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((item) => {
                const Icon = getIconForVertical(item.title);

                return (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40"
                  >
                    {/* Icon */}
                    <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-500/20 border border-green-500/30">
                      <Icon className="w-7 h-7 text-green-400" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-white mb-4">
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
            // Fallback to original verticals if no items are provided
            <>
              <div className="group relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40">
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-500/20 border border-green-500/30">
                  <Cpu className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Electronics & Distribution
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Super stockist of premium lighting and wiring products, delivering quality electrical solutions across diverse markets.
                </p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              
              <div className="group relative rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl p-8 transition-all duration-300 hover:-translate-y-1 hover:border-green-500/40">
                <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-green-500/20 border border-green-500/30">
                  <Globe className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Export Operations
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  Reliable international logistics and supply chain management ensuring seamless global delivery of energy products.
                </p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default BusinessVerticalsSection;