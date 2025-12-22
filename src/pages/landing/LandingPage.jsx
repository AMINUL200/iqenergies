import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Award,
  Globe,
  Code,
  Palette,
  Smartphone,
} from "lucide-react";
import HeroSection from "../../component/landingpage/HeroSection";
import AboutSection from "../../component/landingpage/AboutSection";
import WhatWeDoSection from "../../component/landingpage/WhatWeDoSection";
import SolutionsSection from "../../component/landingpage/SolutionsSection";
import ProductSection from "../../component/landingpage/ProductSection";
import BusinessVerticalsSection from "../../component/landingpage/BusinessVerticalsSection";
import ServicesSection from "../../component/landingpage/ServicesSection";
import ContactUsSection from "../../component/landingpage/ContactUsSection";
import SolarInverterSection from "../../component/landingpage/SolarInverterSection";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);



  return (
    <div className="min-h-screen bg-white pt-10">
      {/* Hero Section */}
      <HeroSection />

      <section>
        <div className="relative bg-white text-white py-8 md:py-10 overflow-hidden"></div>
      </section>

      {/* about us section */}
      <AboutSection />

      <section>
        <div className="relative bg-white text-white py-8 md:py-10 overflow-hidden"></div>
      </section>

      {/* what we do */}
      <WhatWeDoSection />

      <section>
        <div className="relative bg-white text-white py-8 md:py-10 overflow-hidden"></div>
      </section>

      {/* solutions */}
      <SolutionsSection />

      <section>
        <div className="relative bg-white text-white py-8 md:py-10 overflow-hidden"></div>
      </section>

      {/* product section */}
      <ProductSection />

      <section>
        <div className="relative bg-white text-white py-8 md:py-10 overflow-hidden"></div>
      </section>

      {/* business verticals */}
      <BusinessVerticalsSection />

      <section>
        <div className="relative bg-white text-white py-8 md:py-10 overflow-hidden"></div>
      </section>

      {/* solar inverter section */}
      <SolarInverterSection />

      <section>
        <div className="relative bg-white text-white py-8 md:py-10 overflow-hidden"></div>
      </section>

      {/* services section */}
      <ServicesSection />

      <section>
        <div className="relative bg-white text-white py-8 md:py-10 overflow-hidden"></div>
      </section>

      {/* contact us section */}
      <ContactUsSection />

    </div>
  );
};

export default LandingPage;
