import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden">
      {/* ================= BACKGROUND IMAGE ================= */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('/image/Empowering-Tomorrow-with-Solar-Solutions.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-[#0A1A2F]/80" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 min-h-screen flex items-center py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ================= LEFT CONTENT ================= */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">

              {/* Label */}
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-green-400 tracking-wide">
                  ABOUT US
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white leading-snug">
                Empowering a Sustainable
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                  Future, Today
                </span>
              </h2>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                At IQ Energies, we are more than just a renewable energy company
                — we are a multi-dimensional force driving the transformation
                toward a cleaner, smarter, and more sustainable future.
                <br /><br />
                From solar PV module manufacturing to turnkey execution of
                large-scale solar and wind projects, we deliver efficient,
                reliable, and future-ready energy solutions.
              </p>

              {/* CTA */}
              <div className="pt-2 flex justify-center lg:justify-start">
                <button
                  onClick={() => navigate("/about")}
                  className="group inline-flex items-center gap-2 px-7 py-3 sm:px-8 sm:py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105"
                >
                  Read More
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* ================= RIGHT IMAGE ================= */}
            <div className="relative w-full max-w-xl mx-auto lg:max-w-none">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=800&fit=crop"
                  alt="Renewable Energy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
