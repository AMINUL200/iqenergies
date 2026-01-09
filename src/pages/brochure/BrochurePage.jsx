import React, { useState, useEffect } from "react";
import { FileText, Download, Loader2 } from "lucide-react";
import { api } from "../../utils/app";
import PageLoader from "../../component/common/PageLoader";

const BrochurePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBrochureData();
  }, []);

  const fetchBrochureData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Adjust the endpoint based on your API structure
      const response = await api.get(
        "/brochure-certification-heroes/type/brochure"
      );

      if (response.data.success) {
        setData(response.data.data);
      } else {
        setError("Failed to fetch brochure data");
      }
    } catch (err) {
      console.error("Error fetching brochure data:", err);
      setError("Failed to load brochures. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId, pdfUrl) => {
   

    // ✅ Open PDF in new tab
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <PageLoader />;
  }

  if (error || !data) {
    return (
      <div
        className="min-h-screen bg-fixed bg-center bg-cover relative pt-20 md:pt-30"
        style={{
          backgroundImage:
            "url('/image/Empowering-Tomorrow-with-Solar-Solutions.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-white text-lg mb-4">Failed to load brochures</p>
            <button
              onClick={fetchBrochureData}
              className="px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#0F766E] text-white rounded-lg hover:from-[#0F766E] hover:to-[#065F46] transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { hero, files } = data;

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover relative pt-20 md:pt-30"
      style={{
        backgroundImage:
          "url('/image/Empowering-Tomorrow-with-Solar-Solutions.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {hero.title || "Download Our Brochure"}
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {hero.description ||
              "Discover all you need to know about our clean energy solutions. Download our brochures to explore detailed specifications, designs, and technology — from high-efficiency solar modules and solar trees to hybrid systems and wind power — perfect for residential, commercial, and utility scale projects."}
          </p>
        </div>

        {/* Brochure List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {files && files.length > 0 ? (
            files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between gap-4 p-6 rounded-xl
                           bg-white/90 backdrop-blur-md shadow-lg
                           hover:shadow-2xl transition-all duration-300"
              >
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#0F766E] text-white">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1F2933]">
                      {file.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Downloads: {file.download_count}
                    </p>
                  </div>
                </div>

                {/* Download */}
                <button
                  onClick={() => handleDownload(file.id, file.pdf_url)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg
                             text-white font-medium
                             bg-gradient-to-r from-[#4CAF50] to-[#0F766E]
                             hover:from-[#0F766E] hover:to-[#065F46]
                             transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-white text-lg">
                No brochures available at the moment
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrochurePage;
