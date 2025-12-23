import React from "react";
import { Award, Download } from "lucide-react";

const certificates = [
  {
    title: "BIS Certificate",
    file: "/certificates/bis-certificate.pdf",
  },
  {
    title: "IEC BVG with Branch – Greater Noida",
    file: "/certificates/18_IEC_BVG_Greater_Noida.pdf",
  },
  {
    title: "MNRE – ALMM List (23.01.2025)",
    file: "/certificates/mnre-almm-list-23-01-2025.pdf",
  },
];

const CertificatePage = () => {
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
            Check Our Certificates
          </h1>
          <p className="text-lg text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Our certifications reflect compliance, quality, and trust.
            Download official certificates verifying our standards, approvals,
            and eligibility across national and international clean energy
            programs.
          </p>
        </div>

        {/* Certificate List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 p-6 rounded-xl
                         bg-white/90 backdrop-blur-md shadow-lg
                         hover:shadow-2xl transition-all duration-300"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[#4CAF50] to-[#0F766E] text-white">
                  <Award className="w-6 h-6" />
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

export default CertificatePage;
