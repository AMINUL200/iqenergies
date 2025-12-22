import React from "react";

const Footer = () => {
  return (
    <footer
      className="py-16"
      style={{
        backgroundColor: "#F3FAF2",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          
          {/* ================= LEFT: LOGO & TEXT ================= */}
          <div className="space-y-6">
            <img
              src="/public/image/logo.png"
              alt="IQ Energies"
              className="w-28"
            />
            <p
              className="text-base leading-relaxed max-w-sm"
              style={{ color: "#1F2933" }}
            >
              IQ Energies Providing Sustainable Solar, Hybrid, and EV
              Solutions for a Greener Future.
            </p>
          </div>

          {/* ================= CENTER: BROCHURE QR ================= */}
          <div className="text-center space-y-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: "#0F766E" }}
            >
              Download Our Brochure
            </h3>

            <div className="bg-white p-4 inline-block shadow-md">
              <img
                src="/image/brochure-qr.png"
                alt="Download Brochure QR"
                className="w-44 h-44 object-contain"
              />
            </div>

            <p
              className="cursor-pointer font-medium"
              style={{ color: "#0F766E" }}
            >
              Click To Download
            </p>
          </div>

          {/* ================= RIGHT: CERTIFICATE QR ================= */}
          <div className="text-center space-y-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: "#0F766E" }}
            >
              Check Our Certificate
            </h3>

            <div className="bg-white p-4 inline-block shadow-md">
              <img
                src="/image/certificate-qr.png"
                alt="Certificate QR"
                className="w-44 h-44 object-contain"
              />
            </div>

            <p
              className="cursor-pointer font-medium"
              style={{ color: "#0F766E" }}
            >
              Click to See
            </p>
          </div>
        </div>

        {/* ================= BOTTOM COPYRIGHT ================= */}
        <div className="mt-16 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} IQ Energies. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
