import React from "react";
import { FileText, Download } from "lucide-react";

const brochures = [
  {
    title: "500 MW PV Module Manufacturing Line",
    file: "/brochures/500-mw-pv-module-manufacturing-line.pdf",
  },
  {
    title:
      "Mono Crystalline Solar PV Modules Mono Facial MBB, M10 Half-Cell (Single Pager)",
    file: "/brochures/mono-facial-mbb-m10-single-pager.pdf",
  },
  {
    title:
      "Mono Crystalline Solar PV Modules Mono Facial MBB, M10 Half-Cell",
    file: "/brochures/mono-facial-mbb-m10.pdf",
  },
  {
    title: "Solar Tree Design – IQEnergies",
    file: "/brochures/solar-tree-design-iq.pdf",
  },
  {
    title: "TopCon Bi-Facial 565Wp–650Wp",
    file: "/brochures/topcon-bifacial-565-650.pdf",
  },
  {
    title: "TopCon Bi-Facial 565Wp–650Wp (Single Pager)",
    file: "/brochures/topcon-bifacial-565-650-single-pager.pdf",
  },
  {
    title: "Wind Power",
    file: "/brochures/wind-power.pdf",
  },
];

const BrochurePage = () => {
  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover relative pt-20 md:pt-30"
      style={{
        backgroundImage: "url('/image/Empowering-Tomorrow-with-Solar-Solutions.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Download Our Brochure
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Discover all you need to know about our clean energy solutions.
            Download our brochures to explore detailed specifications, designs,
            and technology — from high-efficiency solar modules and solar trees
            to hybrid systems and wind power — perfect for residential,
            commercial, and utility scale projects.
          </p>
        </div>

        {/* Brochure List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brochures.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 p-6 rounded-xl
                         bg-white/90 backdrop-blur-md shadow-lg
                         hover:shadow-2xl transition-all duration-300"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#0F766E] text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-[#1F2933]">
                  {item.title}
                </h3>
              </div>

              {/* Download */}
              <a
                href={item.file}
                download
                className="flex items-center gap-2 px-4 py-2 rounded-lg
                           text-white font-medium
                           bg-gradient-to-r from-[#4CAF50] to-[#0F766E]
                           hover:from-[#0F766E] hover:to-[#065F46]
                           transition-all"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrochurePage;
