import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  TrendingUp,
  Leaf,
  Settings,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { api } from "../../utils/app";
import { toast } from "react-toastify";
import PageLoader from "../../component/common/PageLoader";

// Map feature titles to icons
const getIconForFeature = (title) => {
  const iconMap = {
    "Clean Energy Focus": Leaf,
    "Quality & Safety": Shield,
    "High Performance": TrendingUp,
    "Smart Technology": Settings,
    default: Zap,
  };
  return iconMap[title] || iconMap.default;
};

const ServicesDetails = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);

  const fetchData = async () => {
    try {
      const res = await api.get(`/services/${slug}`);

      if (res.data.success) {
        setService(res.data.data);
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return <PageLoader />;
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Service not found
          </h2>
          <p className="text-gray-500 mt-2">
            The requested service does not exist.
          </p>
        </div>
      </div>
    );
  }

  // Function to safely render HTML from description2
  const renderDescription2 = () => {
    if (!service.description2) return null;

    return (
      <div
        className="description2-content"
        dangerouslySetInnerHTML={{ __html: service.description2 }}
      />
    );
  };

  return (
    <div className="bg-white text-[#1F2933] md:pt-30">
      {/* ================= HERO ================= */}
      <section className="relative bg-[#0A1A2F] overflow-hidden">
        {/* Background Image - Responsive */}
        {(service.web_image_url || service.mobile_image_url) && (
          <div className="absolute inset-0">
            {/* Desktop/Tab Image */}
            <div
              className="hidden md:block absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: service.web_image_url
                  ? `url('${service.web_image_url}')`
                  : "none",
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Mobile Image */}
            <div
              className="md:hidden absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: service.mobile_image_url
                  ? `url('${service.mobile_image_url}')`
                  : service.web_image_url
                  ? `url('${service.web_image_url}')`
                  : "none",
              }}
            >
              <div className="absolute inset-0 bg-black/60"></div>
            </div>
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white max-w-3xl leading-tight">
            {service.heading}
            {service.highlighted_text && (
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4CAF50] to-[#0F766E]">
                {service.highlighted_text}
              </span>
            )}
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-3xl">
            {service.description}
          </p>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          {/* Left - Heading2 and Description2 */}
          <div>
            {service.heading2 && (
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {service.heading2}
              </h2>
            )}

            {service.description2 ? (
              <div
                className="description2-content"
                dangerouslySetInnerHTML={{ __html: service.description2 }}
              ></div>
            ) : (
              <p className="text-gray-600 text-lg mb-8">
                We combine innovation, engineering excellence, and
                sustainability to deliver energy solutions that power growth
                while reducing environmental impact.
              </p>
            )}
          </div>

          {/* Right – Feature Cards */}
          {service.features && service.features.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-6">
              {service.features.map((feature, index) => {
                const Icon = getIconForFeature(feature.title);
                return (
                  <div
                    key={index}
                    className="p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#4CAF50]/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#4CAF50]" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            // Fallback if no features data
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: Leaf, title: "Clean Energy Focus" },
                { icon: Shield, title: "Quality & Safety" },
                { icon: TrendingUp, title: "High Performance" },
                { icon: Settings, title: "Smart Technology" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-gray-200 hover:shadow-xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#4CAF50]/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[#4CAF50]" />
                    </div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Engineered solutions built to meet modern energy demands
                      with maximum efficiency.
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Add some styling for the rendered HTML content */}
      <style jsx>{`
        .description2-content :global(p) {
          color: #4b5563;
          font-size: 1.125rem;
          line-height: 1.75;
          margin-bottom: 2rem;
        }

        .description2-content :global(ul) {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .description2-content :global(li) {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .description2-content :global(svg) {
          width: 1.25rem;
          height: 1.25rem;
          color: #4caf50;
          flex-shrink: 0;
        }

        .description2-content :global(span) {
          color: #374151;
        }
      `}</style>
    </div>
  );
};

export default ServicesDetails;
