import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import HeroSection from "../../component/landingpage/HeroSection";
import AboutSection from "../../component/landingpage/AboutSection";
import WhatWeDoSection from "../../component/landingpage/WhatWeDoSection";
import SolutionsSection from "../../component/landingpage/SolutionsSection";
import ProductSection from "../../component/landingpage/ProductSection";
import BusinessVerticalsSection from "../../component/landingpage/BusinessVerticalsSection";
import ServicesSection from "../../component/landingpage/ServicesSection";
import ContactUsSection from "../../component/landingpage/ContactUsSection";
import SolarInverterSection from "../../component/landingpage/SolarInverterSection";
import PageLoader from "../../component/common/PageLoader";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const location = useLocation();

  const scrollWithOffset = (id) => {
    const element = document.getElementById(id);
    const navbar = document.getElementById("main-navbar");
    if (!element || !navbar) return;

    const navbarHeight = navbar.offsetHeight; // extra offset

    const y =
      element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    console.log("Scrolling to:", id, "at position:", y);
    window.scrollTo({
      top: Math.max(0, y), // safety
      behavior: "smooth",
    });
  };
  useEffect(() => {
    // Check if there's a scroll target in location state
    if (location.state && location.state.scrollTo) {
      // Clear the state to prevent re-scrolling on refresh
      navigate(location.pathname, { replace: true, state: {} });

      // Small delay to ensure page is fully rendered
      setTimeout(() => {
        scrollWithOffset(location.state.scrollTo);
      }, 100);
    }
  }, [location.state, navigate, location.pathname]);
  useEffect(() => {
    const handleScrollEvent = (e) => {
      scrollWithOffset(e.detail);
    };

    window.addEventListener("scroll-to-section", handleScrollEvent);

    return () => {
      window.removeEventListener("scroll-to-section", handleScrollEvent);
    };
  }, []);

  if (loading) {
    return <PageLoader/>; 
  }

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
