import React, { useEffect, useState } from "react";
import { Leaf, Zap, Globe, Award } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../utils/app";
import PageLoader from "../../component/common/PageLoader";

const AboutUsPage = () => {
  const [aboutData, setAboutData] = useState(null);
  const [heroData, setHeroData] = useState(null);
  const [whoWeAreData, setWhoWeAreData] = useState(null);
  const [missionData, setMissionData] = useState(null);
  const [featuresData, setFeaturesData] = useState(null);
  const [ctaData, setCtaData] = useState(null);

  const [loading, setLoading] = useState(true);
  const featureIcons = {
    "Innovation Driven": Zap,
    "Sustainability First": Leaf,
    "Global Presence": Globe,
    "Trusted Expertise": Award,
  };

  // Get data from API
  const fetchAboutData = async () => {
    try {
      const response = await api.get("/about");

      if (response.data.status) {
        console.log("About Us Data:", response.data.data);
        setHeroData(response.data.data.hero);
        setWhoWeAreData(response.data.data.who_we_are);
        setMissionData(response.data.data.mission_vision);
        setFeaturesData(response.data.data.features);
        setCtaData(response.data.data.cta);

        console.log("Hero Data:", response.data.data.hero);
        console.log("Who We Are Data:", response.data.data.who_we_are);
        console.log("Mission/Vision Data:", response.data.data.mission_vision);
        console.log("Features Data:", response.data.data.features);
        console.log("CTA Data:", response.data.data.cta);
      }
    } catch (error) {
      console.error("Error fetching about us data:", error);
      toast.error(error.message || "Failed to load about us data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <section className="relative bg-[#0A1A2F] text-white pt-20 md:pt-10">
      {/* ================= HERO ================= */}
      <div className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-6">
              <span className="text-sm font-semibold text-green-400 uppercase">
                {heroData?.badge_text}
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              aria-label={`${heroData?.heading_meta}`}
            >
              {heroData?.heading}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                {heroData?.highlighted_text}
              </span>
            </h1>

            <p
              className="mt-6 text-lg max-w-3xl line-clamp-5 text-gray-300 prose prose-invert prose-p:text-gray-300 prose-span:text-gray-300 prose-strong:text-gray-300 prose-em:text-gray-300 editor-content"
              aria-label={heroData?.description_meta}
              dangerouslySetInnerHTML={{ __html: heroData?.description }}
            />
          </div>
        </div>
      </div>

      {/* ================= WHO WE ARE ================= */}
      <div className="py-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              aria-label={whoWeAreData?.title_meta}
            >
              {whoWeAreData?.title}
            </h2>
            <p
              className="text-gray-300 leading-relaxed mb-6 editor-content"
              aria-label={whoWeAreData?.description_meta}
              dangerouslySetInnerHTML={{ __html: whoWeAreData?.description }}
            ></p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {featuresData
              ?.filter((item) => item.is_active)
              ?.sort((a, b) => a.sort_order - b.sort_order)
              ?.map((feature) => {
                const Icon = featureIcons[feature.title] || Zap;

                return (
                  <div
                    key={feature.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6"
                  >
                    <Icon className="w-8 h-8 text-green-400 mb-4" />

                    <h4 className="font-semibold mb-2">{feature.title}</h4>

                    <p className="text-sm text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* ================= MISSION & VISION ================= */}
      <div className="py-20 bg-black/20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              {missionData?.[0]?.title}
            </h3>
            <p className="text-gray-300 leading-relaxed" >
              {missionData?.[0]?.description}
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              {missionData?.[1]?.title}
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {missionData?.[1]?.description}
            </p>
          </div>
        </div>
      </div>

     

      {/* ================= CTA ================= */}
      <div className="py-24 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {ctaData?.heading}
          </h2>
          <p className="text-white/90 mb-8">
            {ctaData?.description}
          </p>
          <a
            href={ctaData?.button_link}
            blank="_blank"
            className="inline-block px-10 py-4 rounded-full bg-white text-green-700 font-semibold hover:bg-gray-100 transition"
          >
            {ctaData?.button_text}
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUsPage;
