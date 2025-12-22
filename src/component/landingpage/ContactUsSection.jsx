import React from "react";
import { MapPin, Phone } from "lucide-react";

const ContactUsSection = () => {
  return (
    <section className="relative py-20 md:py-28 bg-[#0A1A2F]">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================= HEADER ================= */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-5">
            <span className="text-sm font-semibold text-green-400 uppercase">
              Contact Us
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Let’s Talk About Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Energy Requirements
            </span>
          </h2>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* ================= LEFT : OFFICE DETAILS ================= */}
          <div className="space-y-8 text-gray-300">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Corporate Office (Kolkata)
              </h3>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-green-400" />
                Convergence Contact Center D2/2 EP and GP Block, Sector V,
                Salt Lake, Kolkata - 700091
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4 text-green-400" />
                +91 82768 63844
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Regional Office (Kerala)
              </h3>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-green-400" />
                18/1691/1, Maveli Arcade, Pattalakunnu, Mannuthy - 680651,
                Thrissur, Kerala
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4 text-green-400" />
                +91 7736 981183
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Branch Office (Kolkata)
              </h3>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-green-400" />
                C/20 Bapujinagar, Regent Estate, Kolkata - 700092
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Dubai
              </h3>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-green-400" />
                Ryzon International General Trading L.L.C,
                Shop No S08 Greece Cluster K05, International City Phase 1,
                Dubai
              </p>
              <p className="flex items-center gap-2 mt-2">
                <Phone className="w-4 h-4 text-green-400" />
                +971 50 247 0411
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Senegal
              </h3>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-green-400" />
                HLM HANN MARISTE, DAKAR <br />
                RC: SN DKR 2066 B 4472 <br />
                NINEA: 002582197
              </p>
            </div>
          </div>

          {/* ================= RIGHT : FORM ================= */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            {/* ===== NEW INTRO CONTENT ===== */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Book your Free Solar Survey
              </h3>
              <p className="text-gray-300 mb-4">
                Let’s Build Solar Community
              </p>
              <p className="flex items-center gap-2 text-white  font-semibold">
                <Phone className="w-5 h-5" />
                Call Today:
                <a href="tel:+918276863844" className="hover:underline">
                  +91 82768 63844
                </a>
              </p>
            </div>
             <h3 className="text-2xl font-bold text-green-400 mb-6">
              Enquire Now
            </h3>
            {/* ===== FORM ===== */}
            <form className="space-y-6">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-6 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full px-4 py-6 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-6 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <input
                type="number"
                placeholder="Average Monthly Electricity Usage (kWh)"
                className="w-full px-4 py-6 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <input
                type="text"
                placeholder="Pincode"
                className="w-full px-4 py-6 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300"
              >
                Submit Request
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
