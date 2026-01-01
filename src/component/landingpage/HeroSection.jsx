import React, { useState, useEffect } from "react";
import { ChevronRight, Sparkles, Zap, Wind, Battery } from "lucide-react";

// Define default icons for different slide types
const getIconForSlide = (title) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("solar")) return Sparkles;
  if (lowerTitle.includes("wind")) return Wind;
  if (lowerTitle.includes("ev") || lowerTitle.includes("power")) return Battery;
  return Sparkles; // default icon
};

// Define gradients based on slide content
const getGradientForSlide = (title, index) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("solar")) return "from-amber-500/20 via-orange-500/20 to-red-500/20";
  if (lowerTitle.includes("wind")) return "from-cyan-500/20 via-blue-500/20 to-indigo-500/20";
  if (lowerTitle.includes("ev") || lowerTitle.includes("power")) return "from-emerald-500/20 via-green-500/20 to-teal-500/20";
  
  // Fallback gradients based on index
  const gradients = [
    "from-amber-500/20 via-orange-500/20 to-red-500/20",
    "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
    "from-emerald-500/20 via-green-500/20 to-teal-500/20",
    "from-purple-500/20 via-pink-500/20 to-rose-500/20"
  ];
  return gradients[index % gradients.length];
};

// Define accent colors based on slide content
const getAccentColor = (title, index) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("solar")) return "#FF6B35";
  if (lowerTitle.includes("wind")) return "#00B4D8";
  if (lowerTitle.includes("ev") || lowerTitle.includes("power")) return "#00D9A5";
  
  // Fallback colors based on index
  const colors = ["#FF6B35", "#00B4D8", "#00D9A5", "#8B5CF6"];
  return colors[index % colors.length];
};

const HeroSection = ({ heroData = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
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

  // Transform heroData into slides format
  const slides = heroData.map((item, index) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image: isMobile && item.mobile_image_url ? item.mobile_image_url : item.web_image_url,
    icon: getIconForSlide(item.title),
    gradient: getGradientForSlide(item.title, index),
    accentColor: getAccentColor(item.title, index),
    buttonName: item.button_name || "Get a Quote",
    buttonUrl: item.button_url || "#",
  }));

  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 600);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Return empty if no slides
  if (slides.length === 0) {
    return (
      <section className="relative min-h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        <p className="text-white text-xl">No hero content available</p>
      </section>
    );
  }

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black ">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {s.image && (
              <>
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-full w-full object-cover scale-110 animate-[ken-burns_20s_ease-in-out_infinite]"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-10">
              {/* Title */}
              <h1
                className={`text-4xl sm:text-3xl md:text-4xl font-bold leading-tight text-white transition-all duration-700 delay-100 ${
                  isAnimating
                    ? "translate-y-4 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                {slide.title}
              </h1>

              {/* Description */}
              <p
                className={`text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
                  isAnimating
                    ? "translate-y-4 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                {slide.description}
              </p>

              {/* CTA Buttons */}
              <div
                className={`flex flex-wrap gap-4 pt-4 transition-all duration-700 delay-300 ${
                  isAnimating
                    ? "translate-y-4 opacity-0"
                    : "translate-y-0 opacity-100"
                }`}
              >
                <a
                  href={slide.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2 relative overflow-hidden"
                  style={{ backgroundColor: slide.accentColor }}
                >
                  <span className="relative z-10">{slide.buttonName}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentSlide(idx);
                setIsAnimating(false);
              }, 600);
            }}
            className="group relative"
          >
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                idx === currentSlide ? "w-12" : "w-8"
              } ${idx === currentSlide ? "bg-white" : "bg-white/40"}`}
              style={
                idx === currentSlide
                  ? { backgroundColor: slide.accentColor }
                  : {}
              }
            />
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 right-6 sm:right-12 z-20 hidden md:block">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs tracking-widest rotate-90 mb-8">SCROLL</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0.5;
          }
          90% {
            opacity: 0.3;
          }
        }

        @keyframes ken-burns {
          0%,
          100% {
            transform: scale(1.1) translateX(0);
          }
          50% {
            transform: scale(1.15) translateX(-20px);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;