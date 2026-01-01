import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AboutSection = ({ aboutData = {} }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If no data is provided, use default placeholder
  if (!aboutData || Object.keys(aboutData).length === 0) {
    return (
      <section className="relative w-full overflow-hidden" id="about">
        {/* Fallback background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-green-900" />
        <div className="relative z-10 min-h-screen flex items-center justify-center py-16 md:py-24">
          <p className="text-white text-xl">Loading about section...</p>
        </div>
      </section>
    );
  }

  // Parse description HTML safely
  const createDescription = () => {
    if (!aboutData.description) {
      return (
        <>
          At IQ Energies, we are more than just a renewable energy company — we are a multi-dimensional force driving the transformation toward a cleaner, smarter, and more sustainable future.
          <br /><br />
          From solar PV module manufacturing to turnkey execution of large-scale solar and wind projects, we deliver efficient, reliable, and future-ready energy solutions.
        </>
      );
    }
    
    // Create HTML from the string safely
    return { __html: aboutData.description };
  };

  // Determine which image to use based on screen size
  const backgroundImage = isMobile && aboutData.media_mobile_url 
    ? aboutData.media_mobile_url 
    : aboutData.media_web_url;
  
  const rightImage = isMobile && aboutData.media_mobile_url 
    ? aboutData.media_mobile_url 
    : aboutData.media_web_url;

  return (
    <section className="relative w-full overflow-hidden" id="about">
      {/* ================= BACKGROUND IMAGE ================= */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: backgroundImage 
            ? `url('${backgroundImage}')`
            : "linear-gradient(to bottom right, #0A1A2F, #1a365d)",
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
              {/* Label - Use data from aboutData */}
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm mx-auto lg:mx-0">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-semibold text-green-400 tracking-wide">
                  {aboutData.badge_text || "ABOUT US"}
                </span>
              </div>

              {/* Title - Use data from aboutData */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-white leading-snug" aria-label={aboutData?.heading_meta}>
                {aboutData.heading || "Empowering a Sustainable"}
                {aboutData.highlighted_text && (
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                    {aboutData.highlighted_text}
                  </span>
                )}
              </h2>

              {/* Description - Use data from aboutData */}
              <div className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {aboutData.description ? (
                  <div 
                    className="space-y-4 editor-content"
                    dangerouslySetInnerHTML={createDescription()}
                    aria-label={aboutData?.description_meta}
                  />
                ) : (
                  <p>
                    At IQ Energies, we are more than just a renewable energy company — we are a multi-dimensional force driving the transformation toward a cleaner, smarter, and more sustainable future.
                    <br />
                    <br />
                    From solar PV module manufacturing to turnkey execution of large-scale solar and wind projects, we deliver efficient, reliable, and future-ready energy solutions.
                  </p>
                )}
              </div>

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
                {rightImage ? (
                  <img
                    src={rightImage}
                    alt={aboutData.media_alt || "Renewable Energy"}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-gray-900 to-blue-900 flex items-center justify-center">
                    <p className="text-white/60">Image coming soon</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;