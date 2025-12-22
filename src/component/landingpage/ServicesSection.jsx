import React from "react";
import {
  Settings,
  Sun,
  Wrench,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    title: "Turnkey EPC",
    description:
      "End-to-end Engineering, Procurement, and Construction solutions delivering fully integrated solar and wind power projects with assured quality, timelines, and performance.",
    icon: Settings,
    image: "/image/Empowering-Tomorrow-with-Solar-Solutions.jpg",
  },
  {
    title: "Customized Design & Project Management",
    description:
      "Tailor-made solar and wind solutions with expert project planning, site assessment, system design, and execution management to maximize efficiency and ROI.",
    icon: Sun,
    image: "/image/Ev-Charger.jpg",
  },
  {
    title: "O&M Services",
    description:
      "Comprehensive Operations & Maintenance services ensuring optimal system performance, long-term reliability, and maximum energy output.",
    icon: Wrench,
    image: "/image/Wind-power.jpg",
  },
];

const ServicesSection = () => {
  return (
    <section className="relative py-10 md:py-20 bg-[#0A1A2F]" id="services">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================= HEADER ================= */}
        <div className="max-w-4xl mb-16">
          

           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-green-400 tracking-wide">
                 Our Services
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            End-to-End Renewable
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Energy Services
            </span>
          </h2>
        </div>

        {/* ================= FLIP CARDS ================= */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div key={index} className="group perspective">
                <div className="relative h-[380px] w-full transition-transform duration-700 transform-style-preserve-3d group-hover:rotate-y-180">

                  {/* ================= FRONT ================= */}
                  <div
                    className="absolute inset-0 rounded-3xl overflow-hidden backface-hidden"
                    style={{
                      backgroundImage: `url('${service.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-black/50" />

                    <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
                      <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-sm">
                        <Icon className="w-10 h-10 text-white" />
                      </div>

                      <h3 className="text-2xl font-bold text-white">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* ================= BACK ================= */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-600 to-green-700 text-white px-8 flex flex-col items-center justify-center text-center rotate-y-180 backface-hidden">
                    <h3 className="text-2xl font-bold mb-4">
                      {service.title}
                    </h3>

                    <p className="text-white/90 text-sm leading-relaxed mb-8">
                      {service.description}
                    </p>

                    <button className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold transition-all duration-300 hover:bg-gray-100">
                      Click Here
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= REQUIRED STYLES ================= */}
      <style jsx>{`
        .perspective {
          perspective: 1200px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;
