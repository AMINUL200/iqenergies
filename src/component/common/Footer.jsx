import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = ({ footerInfo = {} }) => {
  const navigate = useNavigate();
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
            <div className="text-center md:text-start">
              <img
                src={footerInfo.com_web_logo_url || "/image/logo.png"}
                alt={footerInfo.logo_alt || "IQ Energies Logo"}
                className="w-28  mx-auto md:mx-0 object-contain"
              />
              <p>
                <span className="text-sm  text-amber-500 ">Sun. </span>
                <span className="text-sm text-gray-400">Wind. </span>
                <span className="text-sm text-blue-500">Water. </span>
              </p>
            </div>
            <p
              className="text-base leading-relaxed max-w-sm"
              style={{ color: "#1F2933" }}
            >
              {footerInfo.footer_title ||
                "Leading the way in renewable energy solutions for a sustainable future."}
            </p>

            {/* Customer Support Link - Simple addition */}
            {/* <p
              onClick={() => navigate("/customer-support")}
              className="cursor-pointer font-medium hover:underline mt-4"
              style={{ color: "#0F766E" }}
            >
              Customer Support →
            </p> */}
          </div>

          {/* ================= CENTER: BROCHURE QR ================= */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "#0F766E" }} alt={footerInfo.brochure_alt || "Download Brochure QR"}>
              Download Our Brochure
            </h3>

            <div className="bg-white p-4 inline-block shadow-md">
              <img
                src={footerInfo.brochure_image_url || "/image/brochure-qr.png"}
                alt="Download Brochure QR"
                className="w-44 h-44 object-contain"
              />
            </div>

            <p
              onClick={() => navigate("/brochure")}
              className="cursor-pointer font-medium"
              style={{ color: "#0F766E" }}
            >
              Click To Download
            </p>
          </div>

          {/* ================= RIGHT: CERTIFICATE QR ================= */}
          <div className="text-center space-y-4">
            <h3
              className="text-lg font-semibold  "
              style={{ color: "#0F766E" }}
            >
              Check Our Certificate
            </h3>

            <div className="bg-white p-4 inline-block shadow-md">
              <img
                src={footerInfo.cirtificate_image_url || "/image/certificate-qr.png"}
                alt="Certificate QR"
                className="w-44 h-44 object-contain"
              />
            </div>

            <p
              onClick={() => navigate("/certificate")}
              className="cursor-pointer font-medium cursor-pointer"
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
