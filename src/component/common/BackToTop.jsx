import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  // Show button after scroll
  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="
        fixed bottom-6 right-6 z-50
        w-12 h-12 rounded-full
        flex items-center justify-center
        shadow-lg
        transition-all duration-300
        hover:scale-105
      "
      style={{
        backgroundColor: "#4CAF50",
        color: "#FFFFFF",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0F766E")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  );
};

export default BackToTop;
