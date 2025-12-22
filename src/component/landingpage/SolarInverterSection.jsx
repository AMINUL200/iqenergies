import React from "react";
import { ArrowRight } from "lucide-react";

const inverters = [
  {
    title: "Single Phase (3–6 kW)",
    image: "/image/single-phase.jpg",
  },
  {
    title: "Three Phase (5–15 kW)",
    image: "/image/single-phase.jpg",
  },
  {
    title: "Hybrid Inverter (Battery Ready)",
    image: "/image/single-phase.jpg",
  },
];

const SolarInverterSection = () => {
  return (
    <section className="relative py-20 md:py-28 bg-[#0A1A2F]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================= HEADER ================= */}
        <div className="max-w-4xl mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 mb-5">
            <span className="text-sm font-semibold text-orange-400 uppercase">
              Solar Inverters
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Reliable & Efficient
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
              Solar Inverter Solutions
            </span>
          </h2>
        </div>

        {/* ================= INVERTER GRID ================= */}
        <div className="grid md:grid-cols-3 gap-8">
          {inverters.map((item, index) => (
            <div
              key={index}
              className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/40"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">
                  {item.title}
                </h3>

                <button className="inline-flex items-center gap-2 font-semibold text-orange-400 hover:text-orange-300 transition-colors">
                  More Details
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SolarInverterSection;
