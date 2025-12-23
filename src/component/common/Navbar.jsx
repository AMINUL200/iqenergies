import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Phone, Mail, Facebook, Twitter, Linkedin } from "lucide-react";

const Navbar = ({ toggleMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  /* ================= BRAND COLORS ================= */
  const colors = {
    primary: "#4CAF50", // Green
    secondary: "#0F766E", // Teal
    text: "#1F2933",
    muted: "#6B7280",
    white: "#FFFFFF",
  };

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= NAV LINKS ================= */
  const navLinks = [
    { id: "home", label: "Home", type: "route", path: "/" },
    { id: "about", label: "About Us", type: "scroll", sectionId: "about" },
    {
      id: "solutions",
      label: "Solutions",
      type: "scroll",
      sectionId: "solutions",
    },
    {
      id: "services",
      label: "Services",
      type: "scroll",
      sectionId: "services",
    },
    {
      id: "products",
      label: "Products",
      type: "scroll",
      sectionId: "products",
    },
  ];

  /* ================= NAV ACTION ================= */
  const handleNavClick = (item) => {
    if (item.type === "scroll") {
      if (location.pathname === "/") {
        // SAME PAGE → direct scroll
        window.dispatchEvent(
          new CustomEvent("scroll-to-section", {
            detail: item.sectionId,
          })
        );
      } else {
        // DIFFERENT PAGE → navigate then scroll
        navigate("/", { state: { scrollTo: item.sectionId } });
      }
      return;
    }

    navigate(item.path);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50" id="main-navbar">
      {/* ================= TOP INFO BAR ================= */}
      <div
        className={`transition-all duration-300 ${
          scrolled ? "h-0 opacity-0 overflow-hidden" : "h-auto opacity-100"
        }`}
        style={{ backgroundColor: colors.secondary, color: colors.white }}
      >
        <div className="flex justify-between md:justify-around items-center px-8 py-2 text-sm">
          {/* Left */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Phone size={14} /> +91 98765 43210
            </span>
            <span className="flex items-center gap-1">
              <Mail size={14} /> info@iqenergies.com
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Linkedin].map((Icon, i) => (
              <Icon
                key={i}
                size={16}
                className="cursor-pointer hover:opacity-80 transition"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <div
        className={`transition-all duration-300 ${
          scrolled ? "shadow-md py-3" : "py-4"
        }`}
        style={{ backgroundColor: colors.white }}
      >
        <div className="flex justify-between md:justify-around items-center px-8">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src="/image/logo.png" alt="IQEnergies" className="w-20 h-16" />
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => {
              const isActive =
                item.type === "route" && location.pathname === item.path;

              return (
                <span
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className="font-semibold cursor-pointer transition-colors"
                  style={{
                    color: isActive ? colors.primary : colors.text,
                  }}
                  onMouseEnter={(e) => (e.target.style.color = colors.primary)}
                  onMouseLeave={(e) =>
                    (e.target.style.color = isActive
                      ? colors.primary
                      : colors.text)
                  }
                >
                  {item.label}
                </span>
              );
            })}
          </nav>

          {/* Mobile Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden"
            style={{ color: colors.text }}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
