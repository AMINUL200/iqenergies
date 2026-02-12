import React from "react";
import { MessageCircle } from "lucide-react";

const WhatsAppFloat = () => {
  const phoneNumber = "918276863844"; // Add country code

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-6 right-20 z-50 cursor-pointer group"
    >
      <div className="relative">
        {/* Pulse Animation */}
        <span className="absolute inline-flex h-14 w-14 rounded-full bg-green-500 opacity-60 animate-ping"></span>

        {/* Main Button */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-xl hover:scale-110 transition-all duration-300">
          <MessageCircle size={28} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppFloat;
