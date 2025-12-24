import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  ShoppingCart,
  User,
  Sun,
  Moon,
  X,
  UserCircle,
  Package,
  History,
  Settings,
  LogOut,
  ChevronDown,
  CreditCard,
  Shield,
  Bell,
} from "lucide-react";

const Navbar = ({ toggleMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Changed to true for testing
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileUserDropdownOpen, setMobileUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);
  const mobileUserDropdownRef = useRef(null);

  /* ================= USER DATA (Mock - Replace with real data) ================= */
  const [userData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null, // You can set a URL here for avatar image
    membership: "Premium",
    notificationCount: 2,
  });

  /* ================= BRAND COLORS ================= */
  const colors = {
    primary: "#4CAF50",
    secondary: "#0F766E",
    accent: "#10B981",
    text: "#1F2933",
    muted: "#6B7280",
    white: "#FFFFFF",
    background: darkMode ? "#1F2933" : "#FFFFFF",
    textColor: darkMode ? "#F9FAFB" : "#1F2933",
    cardBg: darkMode ? "#374151" : "#F9FAFB",
    border: darkMode ? "#4B5563" : "#E5E7EB",
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
    { id: "products", label: "Products", type: "route", path: "/products" },
  ];

  /* ================= HANDLERS ================= */
  const handleNavClick = (item) => {
    if (item.type === "scroll") {
      if (location.pathname === "/") {
        window.dispatchEvent(
          new CustomEvent("scroll-to-section", { detail: item.sectionId })
        );
      } else {
        navigate("/", { state: { scrollTo: item.sectionId } });
      }
      setIsMobileMenuOpen(false);
      return;
    }

    navigate(item.path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserDropdownOpen(false);
    setMobileUserDropdownOpen(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleUserMenuClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    setUserDropdownOpen(false);
    setMobileUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  const toggleMobileUserDropdown = () => {
    setMobileUserDropdownOpen(!mobileUserDropdownOpen);
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /* ================= USER MENU ITEMS ================= */
  const userMenuItems = [
    {
      icon: UserCircle,
      label: "My Profile",
      path: "/profile",
      color: colors.accent,
    },
    { icon: Package, label: "My Orders", path: "/orders", badge: "3" },
    // { icon: History, label: "Order History", path: "/orders/history" },
    // { icon: CreditCard, label: "Payment Methods", path: "/payments" },
    // {
    //   icon: Bell,
    //   label: "Notifications",
    //   path: "/notifications",
    //   badge: userData.notificationCount,
    // },
    // { icon: Settings, label: "Settings", path: "/settings" },
    // { icon: Shield, label: "Privacy & Security", path: "/privacy" },
    {
      icon: LogOut,
      label: "Logout",
      action: handleLogout,
      isDestructive: true,
    },
  ];

  /* ================= CLOSE DROPDOWN ON CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
      if (
        mobileUserDropdownRef.current &&
        !mobileUserDropdownRef.current.contains(event.target)
      ) {
        setMobileUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <header
      className="fixed top-0 left-0 w-full z-50"
      id="main-navbar"
      style={{
        backgroundColor: colors.background,
        color: colors.textColor,
      }}
    >
      {/* ================= TOP INFO BAR ================= */}
      <div
        className={`transition-all duration-300 ${
          scrolled ? "h-0 opacity-0 overflow-hidden" : "h-auto opacity-100"
        }`}
        style={{
          backgroundColor: colors.secondary,
          color: colors.white,
        }}
      >
        <div className="flex justify-between md:justify-baseline items-center px-4 md:px-8 lg:px-16 xl:px-34 py-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 md:gap-4">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Phone size={12} />
              <span className="hidden sm:inline">+91 98765 43210</span>
              <span className="sm:hidden">+91 9876543210</span>
            </span>
            <span className="hidden md:flex items-center gap-1">
              <Mail size={12} /> info@iqenergies.com
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 md:gap-4">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <Icon
                  key={i}
                  size={14}
                  className="cursor-pointer hover:opacity-80 transition hover:scale-110"
                />
              ))}
            </div>
            <button
              onClick={toggleDarkMode}
              className="ml-2 p-1 rounded-full hover:bg-white/10 transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={14} className="text-amber-300" />
              ) : (
                <Moon size={14} className="text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVBAR ================= */}
      <div
        className={`transition-all duration-300 ${
          scrolled ? "shadow-lg py-2" : "py-3"
        }`}
        style={{
          backgroundColor: colors.background,
          borderBottom: scrolled ? `1px solid ${colors.secondary}20` : "none",
        }}
      >
        <div className="flex justify-between items-center px-4 md:px-8 lg:px-16 xl:px-34">
          {/* Logo */}
          <div
            className="flex flex-col items-center  cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="/image/logo.png"
              alt="IQEnergies"
              className="w-16 h-12 md:w-20 md:h-16 transition-transform hover:scale-105"
            />
            <p>
              <span className="text-sm  text-amber-500 ">Sun. </span>
              <span className="text-sm text-gray-400" >Wind. </span>
              <span className="text-sm text-blue-500" >Water. </span>
            </p>
            {/* <span
              className="hidden md:block text-xl font-bold"
              style={{ color: colors.primary }}
            >
              IQEnergies
            </span> */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className="relative font-medium cursor-pointer transition-all hover:scale-105 group"
                    style={{
                      color: isActive ? colors.primary : colors.textColor,
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <div
                        className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}
                    <div
                      className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-300 group-hover:w-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Icons Section */}
            <div className="flex items-center gap-4 ml-4">
              {/* Shopping Cart */}
              <div className="relative group">
                <button
                  onClick={() => navigate("/cart")}
                  className="relative p-2 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800/40 group cursor-pointer"
                  aria-label="Shopping Cart"
                >
                  <ShoppingCart
                    size={22}
                    style={{ color: colors.textColor }}
                    className="group-hover:scale-110 transition-transform"
                  />

                  {cartCount > 0 && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse"
                      style={{
                        backgroundColor: colors.primary,
                        animation: "pulse 2s infinite",
                      }}
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </div>
                  )}

                  <div className="absolute top-full right-0 mt-2 w-32 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    View Cart ({cartCount} items)
                  </div>
                </button>
              </div>

              {/* User Dropdown (Desktop) */}
              {isLoggedIn ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:scale-105 cursor-pointer group"
                    style={{
                      backgroundColor: userDropdownOpen
                        ? `${colors.primary}15`
                        : "transparent",
                    }}
                    aria-label="User menu"
                    aria-expanded={userDropdownOpen}
                  >
                    {/* User Info */}
                    <div className="text-left  hidden lg:flex">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center border-2 mr-2"
                        style={{
                          borderColor: colors.primary,
                          backgroundColor: colors.primary + "20",
                        }}
                      >
                        <UserCircle
                          size={24}
                          style={{ color: colors.primary }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 ">
                          John Doe
                        </h3>
                        <p className="text-xs text-gray-600 ">
                          john@iqenergies.com
                        </p>
                      </div>
                    </div>

                    {/* Dropdown Icon */}
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                      style={{ color: colors.muted }}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 rounded-lg shadow-xl animate-fadeIn"
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                      }}
                    >
                      {/* User Info Header */}
                      <div
                        className="p-4 border-b"
                        style={{ borderColor: colors.border }}
                      >
                        <div className="flex items-center gap-3">
                          {userData.avatar ? (
                            <img
                              src={userData.avatar}
                              alt={userData.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white"
                              style={{ backgroundColor: colors.primary }}
                            >
                              {getInitials(userData.name)}
                            </div>
                          )}
                          <div>
                            <p
                              className="font-medium"
                              style={{ color: colors.textColor }}
                            >
                              {userData.name}
                            </p>
                            <p
                              className="text-sm opacity-75"
                              style={{ color: colors.muted }}
                            >
                              {userData.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2 max-h-96 overflow-y-auto">
                        {userMenuItems.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleUserMenuClick(item)}
                            className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-md transition-all hover:scale-[1.02] cursor-pointer group"
                            style={{
                              backgroundColor: item.isDestructive
                                ? darkMode
                                  ? "#DC262620"
                                  : "#FEE2E2"
                                : "transparent",
                              color: item.isDestructive
                                ? darkMode
                                  ? "#FCA5A5"
                                  : "#DC2626"
                                : colors.textColor,
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon
                                size={18}
                                style={{
                                  color:
                                    item.color ||
                                    (item.isDestructive
                                      ? darkMode
                                        ? "#FCA5A5"
                                        : "#DC2626"
                                      : colors.muted),
                                }}
                              />
                              <span className="text-sm font-medium">
                                {item.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {item.badge && (
                                <span
                                  className="px-1.5 py-0.5 text-xs rounded-full text-white font-bold min-w-5 text-center"
                                  style={{ backgroundColor: colors.primary }}
                                >
                                  {item.badge}
                                </span>
                              )}
                              <div
                                className="w-1 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ backgroundColor: colors.primary }}
                              />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 cursor-pointer"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.white,
                  }}
                >
                  <User size={18} />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Header Icons */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Mobile Shopping Cart */}
            <div className="relative">
              <button
                onClick={() => navigate("/cart")}
                className="relative p-2"
                aria-label="Shopping Cart"
              >
                <ShoppingCart size={22} style={{ color: colors.textColor }} />
                {cartCount > 0 && (
                  <div
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {cartCount}
                  </div>
                )}
              </button>
            </div>

            {/* Mobile User Dropdown */}
            {isLoggedIn && (
              <div className="relative" ref={mobileUserDropdownRef}>
                <button
                  onClick={toggleMobileUserDropdown}
                  className="relative p-2"
                  aria-label="User menu"
                  aria-expanded={mobileUserDropdownOpen}
                >
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-8 h-8 rounded-full object-cover border-2"
                      style={{ borderColor: colors.primary }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white relative"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {getInitials(userData.name)}
                      {userData.notificationCount > 0 && (
                        <div
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs"
                          style={{
                            backgroundColor: "#EF4444",
                            color: colors.white,
                          }}
                        >
                          {userData.notificationCount}
                        </div>
                      )}
                    </div>
                  )}
                </button>

                {/* Mobile User Dropdown Menu */}
                {mobileUserDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 rounded-lg shadow-xl animate-fadeIn"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.border}`,
                      maxHeight: "80vh",
                      overflowY: "auto",
                    }}
                  >
                    {/* User Info Header */}
                    <div
                      className="p-4 border-b"
                      style={{ borderColor: colors.border }}
                    >
                      <div className="flex items-center gap-3">
                        {userData.avatar ? (
                          <img
                            src={userData.avatar}
                            alt={userData.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white"
                            style={{ backgroundColor: colors.primary }}
                          >
                            {getInitials(userData.name)}
                          </div>
                        )}
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: colors.textColor }}
                          >
                            {userData.name}
                          </p>
                          <p
                            className="text-sm opacity-75"
                            style={{ color: colors.muted }}
                          >
                            {userData.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      {userMenuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleUserMenuClick(item)}
                          className="w-full flex items-center justify-between gap-3 px-3 py-3 rounded-md transition-all hover:scale-[1.02] cursor-pointer group"
                          style={{
                            backgroundColor: item.isDestructive
                              ? darkMode
                                ? "#DC262620"
                                : "#FEE2E2"
                              : "transparent",
                            color: item.isDestructive
                              ? darkMode
                                ? "#FCA5A5"
                                : "#DC2626"
                              : colors.textColor,
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              size={18}
                              style={{
                                color:
                                  item.color ||
                                  (item.isDestructive
                                    ? darkMode
                                      ? "#FCA5A5"
                                      : "#DC2626"
                                    : colors.muted),
                              }}
                            />
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                          </div>

                          {item.badge && (
                            <span
                              className="px-1.5 py-0.5 text-xs rounded-full text-white font-bold min-w-5 text-center"
                              style={{ backgroundColor: colors.primary }}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="mobile-menu-trigger p-1"
              style={{ color: colors.textColor }}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        /* Scrollbar Styling */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: ${colors.border};
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: ${colors.muted};
        }
      `}</style>
    </header>
  );
};

export default Navbar;
