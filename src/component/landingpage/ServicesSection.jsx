import React, { useState, useEffect } from "react";
import { Settings, Sun, Wrench, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Map service titles to icons
const getIconForService = (title) => {
  const iconMap = {
    "Turnkey EPC": Settings,
    "Customized Design & Project Management": Sun,
    "O&M Services": Wrench,
  };
  return iconMap[title] || Settings;
};

const ServicesSection = ({ servicesData = {} }) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  
  // Extract data from servicesData prop
  const { service, service_details = [] } = servicesData;
  
  // If no data is provided, use empty values
  const tagline = service?.tagline || "Our Services";
  const title = service?.title || "End-to-End Renewable";
  const highlightedText = service?.highlighted_text || "Energy Services";
  
  // Transform service_details to match the original structure
  const services = service_details.map(service => ({
    id: service.id,
    title: service.heading,
    description: service.description,
    icon: getIconForService(service.heading),
    image: service.web_image_url,
    slug: service.slug
  }));

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="relative py-10 md:py-20 md:pt-30 bg-[#0A1A2F]" id="services">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-green-400 tracking-wide">
              {tagline}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {title}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              {highlightedText}
            </span>
          </h2>
        </div>

        {/* ================= CARDS ================= */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            if (isMobile) {
              // ================= MOBILE LAYOUT =================
              return (
                <div key={index} className="relative rounded-3xl overflow-hidden group h-[380px]">
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url('${service.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  </div>
                  
                  <div className="relative h-full flex flex-col justify-between p-6">
                    {/* Top content */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>
                    
                    {/* Button at bottom */}
                    <button
                      onClick={() => navigate(`/services/${service.slug || service.id}`)}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-semibold transition-all duration-300 hover:bg-green-700"
                    >
                      Click Here
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            }

            // ================= DESKTOP FLIP CARDS =================
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
                    <h3 className="text-2xl font-bold mb-4">{service.title}</h3>

                    <p className="text-white/90 text-sm leading-relaxed mb-8">
                      {service.description}
                    </p>

                    <button
                      onClick={() => navigate(`/services/${service.slug || service.id}`)}
                      className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-900 font-semibold transition-all duration-300 hover:bg-gray-100"
                    >
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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default ServicesSection;