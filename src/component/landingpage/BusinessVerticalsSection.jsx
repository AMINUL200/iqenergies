import React from "react";
import {
  Cpu,
  Globe,
  ShoppingCart,
  BriefcaseBusiness,
} from "lucide-react";

const verticals = [
  {
    title: "Electronics & Distribution",
    description:
      "Super stockist of premium lighting and wiring products, delivering quality electrical solutions across diverse markets.",
    icon: Cpu,
  },
  {
    title: "Export Operations",
    description:
      "Reliable international logistics and supply chain management ensuring seamless global delivery of energy products.",
    icon: Globe,
  },
  {
    title: "E-commerce Platform",
    description:
      "Online marketplace dedicated to clean tech and sustainable products for residential and industrial needs.",
    icon: ShoppingCart,
  },
  {
    title: "Consultancy Services",
    description:
      "Expert advisory for renewable project planning, feasibility analysis, and performance optimization.",
    icon: BriefcaseBusiness,
  },
];

const BusinessVerticalsSection = () => {
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
                 Business Verticals
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Diverse Capabilities Across
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Clean Energy Ecosystem
            </span>
          </h2>
        </div>

        {/* Verticals Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {verticals.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
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
          })}
        </div>
      </div>
    </section>
  );
};

export default BusinessVerticalsSection;
