import React, { useEffect, useState } from "react";
import { Zap, Wind, Droplets, Sun, CloudSnow, Waves } from "lucide-react";

const PageLoader = ({ energyType = "brand" }) => {
  const [progress, setProgress] = useState(0);
  const [currentEnergy, setCurrentEnergy] = useState("solar");

  // Define color schemes based on energy type
  const colorSchemes = {
    brand: {
      primary: "#4CAF50", // Energy Green
      secondary: "#0F766E", // Deep Teal
      accent: "#F59E0B", // Solar Orange
      background: "#F8FAFC", // Soft Light
      textPrimary: "#1F2933", // Charcoal
      textMuted: "#6B7280", // Gray
      name: "Brand Theme",
    },
    solar: {
      primary: "#F97316", // Solar Orange
      secondary: "#FACC15", // Sun Yellow
      accent: "#DC2626", // Burnt Red
      background: "#FFF7ED", // Warm Cream
      textPrimary: "#3B2F2F", // Dark Brown
      textMuted: "#92400E", // Darker Brown
      name: "Sun Energy",
    },
    hydro: {
      primary: "#2563EB", // Ocean Blue
      secondary: "#38BDF8", // Aqua
      accent: "#0EA5A4", // Teal
      background: "#F0F9FF", // Ice White
      textPrimary: "#0F172A", // Navy
      textMuted: "#1E40AF", // Darker Blue
      name: "Water Energy",
    },
    wind: {
      primary: "#64748B", // Cool Gray
      secondary: "#CBD5E1", // Sky Gray
      accent: "#2DD4BF", // Mint Green
      background: "#FFFFFF", // Pure White
      textPrimary: "#1E293B", // Slate
      textMuted: "#475569", // Slate Gray
      name: "Wind Energy",
    },
  };

  // Use the appropriate color scheme based on prop
  const colors = colorSchemes[energyType] || colorSchemes.brand;

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5; // Variable speed
      });
    }, 150);

    // Rotate between energy icons
    const energyInterval = setInterval(() => {
      setCurrentEnergy((prev) => {
        if (prev === "solar") return "wind";
        if (prev === "wind") return "hydro";
        return "solar";
      });
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(energyInterval);
    };
  }, []);

  const getEnergyIcon = () => {
    switch (currentEnergy) {
      case "solar":
        return energyType === "solar" ? (
          <Sun className="w-12 h-12 md:w-16 md:h-16 text-[#FACC15]" />
        ) : (
          <Zap className="w-12 h-12 md:w-16 md:h-16 text-[#F59E0B]" />
        );
      case "wind":
        return energyType === "wind" ? (
          <CloudSnow className="w-12 h-12 md:w-16 md:h-16 text-[#2DD4BF]" />
        ) : (
          <Wind className="w-12 h-12 md:w-16 md:h-16 text-[#4CAF50]" />
        );
      case "hydro":
        return energyType === "hydro" ? (
          <Waves className="w-12 h-12 md:w-16 md:h-16 text-[#38BDF8]" />
        ) : (
          <Droplets className="w-12 h-12 md:w-16 md:h-16 text-[#0F766E]" />
        );
      default:
        return <Zap className="w-12 h-12 md:w-16 md:h-16 text-[#F59E0B]" />;
    }
  };

  const getEnergyLabel = () => {
    switch (currentEnergy) {
      case "solar":
        return energyType === "solar"
          ? "Harnessing Solar Power"
          : "Harnessing Solar Energy";
      case "wind":
        return energyType === "wind"
          ? "Capturing Wind Flow"
          : "Capturing Wind Power";
      case "hydro":
        return energyType === "hydro"
          ? "Channeling Water Energy"
          : "Channeling Hydro Energy";
      default:
        return "Powering Sustainable Future";
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: colors.background,
        backgroundImage: `radial-gradient(circle at 20% 80%, ${colors.primary}15 0%, transparent 50%),
                         radial-gradient(circle at 80% 20%, ${colors.secondary}10 0%, transparent 50%)`,
      }}
    >
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8 p-8">
        {/* Logo Section */}
        <div className="mb-8">
          <div className="flex flex-row items-center gap-6">
            <div className="relative">
              {/* Logo Container */}
              <div
                className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                  boxShadow: `0 10px 25px ${colors.primary}40`,
                }}
              >
                {/* Logo Image */}
                <img
                  src="/image/logo.png"
                  alt="IQEnergies"
                  className="w-16 h-16 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='white' opacity='0.2'/%3E%3Ctext x='32' y='40' font-family='Arial' font-size='24' fill='white' text-anchor='middle' font-weight='bold'%3EIQ%3C/text%3E%3C/svg%3E";
                  }}
                />

                {/* Animated Ring */}
                <div
                  className="absolute -ins-4 rounded-3xl animate-ping opacity-70"
                  style={{ border: `4px solid ${colors.primary}` }}
                ></div>
              </div>

              {/* Theme Badge */}
              <div
                className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold shadow-md"
                style={{
                  backgroundColor: colors.accent,
                  color: "white",
                }}
              >
                {colors.name}
              </div>
            </div>

            <div className="text-center">
              <h1
                className="text-4xl md:text-5xl font-bold mb-2"
                style={{ color: colors.textPrimary }}
              >
                IQEnergies
              </h1>
              <p
                className="text-lg font-medium"
                style={{ color: colors.textMuted }}
              >
                {energyType === "solar"
                  ? "Solar Energy Solutions"
                  : energyType === "hydro"
                  ? "Water Energy Solutions"
                  : energyType === "wind"
                  ? "Wind Energy Solutions"
                  : "Sustainable Energy Solutions"}
              </p>
            </div>
          </div>
        </div>

        {/* Animated Energy Icons */}
        <div className="relative">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Rotating Background Circle */}
            <div
              className="absolute inset-0 rounded-full"
              style={{ border: `4px solid ${colors.primary}20` }}
            ></div>

            {/* Rotating Ring */}
            <div
              className="absolute inset-2 rounded-full animate-spin"
              style={{
                border: `4px solid transparent`,
                borderTop: `4px solid ${colors.primary}`,
                animationDuration: "3s",
              }}
            ></div>

            {/* Secondary Rotating Ring */}
            <div
              className="absolute inset-4 rounded-full animate-spin"
              style={{
                border: `2px solid transparent`,
                borderRight: `2px solid ${colors.secondary}`,
                animationDuration: "4s",
                animationDirection: "reverse",
              }}
            ></div>

            {/* Energy Icons Container */}
            <div className="relative flex items-center justify-center">
              <div className="relative">
                {getEnergyIcon()}

                {/* Glow Effect */}
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
                  style={{ backgroundColor: colors.accent }}
                ></div>
              </div>

              {/* Orbiting particles */}
              <div
                className="absolute w-full h-full animate-spin"
                style={{ animationDuration: "4s" }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.secondary }}
                  ></div>
                </div>
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: colors.accent }}
                  ></div>
                </div>
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-3 max-w-md">
          <h2
            className="text-2xl font-semibold"
            style={{ color: colors.textPrimary }}
          >
            {getEnergyLabel()}
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: colors.textMuted }}
          >
            {energyType === "solar"
              ? "Optimizing solar arrays for maximum efficiency and sustainable power generation"
              : energyType === "hydro"
              ? "Managing water resources for clean, renewable energy production"
              : energyType === "wind"
              ? "Harnessing wind power for eco-friendly electricity generation"
              : "Powering a sustainable future with solar, wind, and hydro energy solutions"}
          </p>
        </div>

        {/* Progress Bar */}
        {/* <div className="w-full max-w-md space-y-3">
          <div
            className="h-4 rounded-full overflow-hidden"
            style={{
              backgroundColor: colors.textMuted + "20",
              boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
              }}
            >
              <div
                className="absolute top-0 bottom-0 w-20 bg-white opacity-30 animate-shimmer"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, white, transparent)",
                  animation: "shimmer 2s infinite",
                }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span style={{ color: colors.textMuted }}>Loading...</span>
            <div className="flex items-center gap-2">
              <span
                className="font-bold text-lg"
                style={{ color: colors.textPrimary }}
              >
                {Math.min(100, Math.round(progress))}%
              </span>
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.primary }}
              ></div>
            </div>
          </div>
        </div> */}

        {/* Loading Dots Animation */}
        <div className="flex items-center justify-center space-x-2 pt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full animate-energy-bounce"
              style={{
                backgroundColor: colors.primary,
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.9);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes energyBounce {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-10px); /* 🔥 higher bounce */
            opacity: 1;
          }
        }

        .animate-energy-bounce {
          animation: energyBounce 0.9s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
