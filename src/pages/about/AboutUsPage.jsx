import React from "react";
import { Leaf, Zap, Globe, Award } from "lucide-react";

const AboutUsPage = () => {
  return (
    <section className="relative bg-[#0A1A2F] text-white pt-20 md:pt-10">

      {/* ================= HERO ================= */}
      <div className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
              <span className="text-sm font-semibold text-green-400 uppercase">
                About IQ Energies
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Powering a
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Sustainable Tomorrow
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-3xl">
              IQ Energies is a forward-looking renewable energy company dedicated
              to transforming how the world generates, manages, and consumes
              power through innovative, reliable, and sustainable solutions.
            </p>
          </div>
        </div>
      </div>

      {/* ================= WHO WE ARE ================= */}
      <div className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Who We Are
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              IQ Energies is built on a strong foundation of engineering
              excellence, industry expertise, and a deep commitment to clean
              energy. We operate across solar, wind, hybrid, EV charging, and
              advanced energy technologies, delivering turnkey solutions from
              concept to commissioning.
            </p>
            <p className="text-gray-300 leading-relaxed">
              With operations spanning India and international markets, our
              multidisciplinary approach allows us to serve residential,
              commercial, industrial, and utility-scale energy needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Zap className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="font-semibold mb-2">Innovation Driven</h4>
              <p className="text-sm text-gray-300">
                Advanced technologies engineered for performance and longevity.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Leaf className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="font-semibold mb-2">Sustainability First</h4>
              <p className="text-sm text-gray-300">
                Environmentally responsible solutions for a greener planet.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Globe className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="font-semibold mb-2">Global Presence</h4>
              <p className="text-sm text-gray-300">
                Projects and partnerships across multiple regions.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <Award className="w-8 h-8 text-green-400 mb-4" />
              <h4 className="font-semibold mb-2">Trusted Expertise</h4>
              <p className="text-sm text-gray-300">
                Proven delivery with industry-grade standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MISSION & VISION ================= */}
      <div className="py-20 bg-black/20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              To accelerate the transition to clean energy by delivering
              innovative, efficient, and reliable renewable energy solutions
              that empower individuals, businesses, and communities.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
            <p className="text-gray-300 leading-relaxed">
              To become a globally recognized leader in renewable energy,
              shaping a future where clean power is accessible, affordable, and
              integral to everyday life.
            </p>
          </div>
        </div>
      </div>

      {/* ================= VALUES ================= */}
      <div className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              "Integrity & Transparency",
              "Customer-Centric Approach",
              "Technical Excellence",
              "Environmental Responsibility",
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-gray-300"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= CTA ================= */}
      <div className="py-24 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Partner With IQ Energies
          </h2>
          <p className="text-white/90 mb-8">
            Join us in building a cleaner, smarter, and more sustainable energy
            future.
          </p>
          <a
            href="/contact"
            className="inline-block px-10 py-4 rounded-full bg-white text-green-700 font-semibold hover:bg-gray-100 transition"
          >
            Contact Us
          </a>
        </div>
      </div>

    </section>
  );
};

export default AboutUsPage;
