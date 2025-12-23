import React, { useEffect, useState, useRef } from "react";
import { 
  useNavigate, 
  useLocation,
  Link 
} from "react-router-dom";
import { 
  Menu, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Linkedin,
  ShoppingCart,
  User,
  LogOut,
  Settings,
  UserCircle,
  ChevronDown,
  Package,
  HelpCircle,
  Bell,
  Sun,
  Moon,
  Heart,
  History,
  Shield,
  X
} from "lucide-react";

const Navbar = ({ toggleMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const userDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  /* ================= BRAND COLORS ================= */
  const colors = {
    primary: "#4CAF50",
    secondary: "#0F766E",
    text: "#1F2933",
    muted: "#6B7280",
    white: "#FFFFFF",
    background: darkMode ? "#1F2933" : "#FFFFFF",
    textColor: darkMode ? "#F9FAFB" : "#1F2933",
  };

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= CLOSE DROPDOWN ON CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close user dropdown
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      
      // Close mobile menu if clicking outside
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('.mobile-menu-trigger')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= NAV LINKS ================= */
  const navLinks = [
    { id: "home", label: "Home", type: "route", path: "/" },
    { id: "about", label: "About Us", type: "scroll", sectionId: "about" },
    { id: "solutions", label: "Solutions", type: "scroll", sectionId: "solutions" },
    { id: "services", label: "Services", type: "scroll", sectionId: "services" },
    { id: "products", label: "Products", type: "route", path: "/products" },
  ];

  /* ================= USER MENU ITEMS ================= */
  const userMenuItems = [
    { icon: UserCircle, label: "My Profile", path: "/profile", divider: false },
    { icon: Package, label: "My Orders", path: "/orders", divider: false },
    { icon: History, label: "Order History", path: "/history", divider: true },
    { icon: Settings, label: "Settings", path: "/settings", divider: false },
    { icon: LogOut, label: "Logout", action: () => handleLogout(), divider: false },
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

  const handleUserAction = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    setUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!userDropdownOpen);
  };

  return (
    <header 
      className="fixed top-0 left-0 w-full z-50" 
      id="main-navbar"
      style={{ 
        backgroundColor: colors.background,
        color: colors.textColor
      }}
    >
      {/* ================= TOP INFO BAR ================= */}
      <div
        className={`transition-all duration-300 ${
          scrolled ? "h-0 opacity-0 overflow-hidden" : "h-auto opacity-100"
        }`}
        style={{ 
          backgroundColor: colors.secondary, 
          color: colors.white 
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
              <Mail size={12}  /> info@iqenergies.com
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
          borderBottom: scrolled ? `1px solid ${colors.secondary}20` : 'none'
        }}
      >
        <div className="flex justify-between items-center px-4 md:px-8 lg:px-16 xl:px-34">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img 
              src="/image/logo.png" 
              alt="IQEnergies" 
              className="w-16 h-12 md:w-20 md:h-16 transition-transform hover:scale-105" 
            />
            <span className="hidden md:block text-xl font-bold" style={{ color: colors.primary }}>
              IQEnergies
            </span>
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
                        animation: 'pulse 2s infinite'
                      }}
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </div>
                  )}

                  <div className="absolute top-full right-0 mt-2 w-32 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    View Cart ({cartCount} items)
                  </div>
                </button>
              </div>

              {/* User Icon */}
              <div className="relative" ref={userDropdownRef}>
                {isLoggedIn ? (
                  <>
                    <button
                      onClick={toggleUserDropdown}
                      className="flex items-center gap-2 p-2 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800/40 cursor-pointer group"
                      aria-label="User Menu"
                    >
                      <div 
                        className="w-9 h-9 rounded-full flex items-center justify-center border-2 group-hover:scale-110 transition-transform"
                        style={{ 
                          borderColor: colors.primary,
                          backgroundColor: colors.primary + '20'
                        }}
                      >
                        <User 
                          size={20} 
                          style={{ color: colors.primary }}
                        />
                      </div>
                      <ChevronDown 
                        size={16} 
                        style={{ color: colors.textColor }}
                        className={`transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* User Dropdown */}
                    {userDropdownOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn"
                        style={{ zIndex: 9999 }}
                      >
                        <div 
                          className="p-4 border-b"
                          style={{ 
                            borderColor: colors.secondary + '20',
                            background: `linear-gradient(135deg, ${colors.primary}10, ${colors.secondary}10)`
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                              style={{ 
                                borderColor: colors.primary,
                                backgroundColor: colors.primary + '20'
                              }}
                            >
                              <UserCircle size={24} style={{ color: colors.primary }} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                John Doe
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                john@iqenergies.com
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2 max-h-80 overflow-y-auto">
                          {userMenuItems.map((item, index) => (
                            <React.Fragment key={index}>
                              <button
                                onClick={() => handleUserAction(item)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                              >
                                <item.icon 
                                  size={18} 
                                  className="text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform"
                                />
                                <span className="text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                                  {item.label}
                                </span>
                              </button>
                              {item.divider && (
                                <div 
                                  className="h-px mx-4 my-1"
                                  style={{ backgroundColor: colors.secondary + '20' }}
                                />
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        <div 
                          className="p-3 border-t text-center"
                          style={{ 
                            borderColor: colors.secondary + '20',
                            backgroundColor: colors.primary + '05'
                          }}
                        >
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Version 2.1.4
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 cursor-pointer"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.white
                    }}
                  >
                    <User size={18} />
                    <span>Login</span>
                  </button>
                )}
              </div>
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

            {/* Mobile User Icon with Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={toggleUserDropdown}
                    className="p-2"
                    aria-label="User Menu"
                  >
                    <div className="relative">
                      <User size={22} style={{ color: colors.textColor }} />
                      {userDropdownOpen && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                      )}
                    </div>
                  </button>

                  {/* Mobile User Dropdown */}
                  {userDropdownOpen && (
                    <div 
                      className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-9999 flex items-start justify-end pt-16 animate-fadeIn"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div 
                        className="w-11/12 max-w-sm mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden animate-slideIn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Mobile Dropdown Header */}
                        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: colors.secondary + '20' }}>
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center border-2"
                              style={{ 
                                borderColor: colors.primary,
                                backgroundColor: colors.primary + '20'
                              }}
                            >
                              <UserCircle size={20} style={{ color: colors.primary }} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                John Doe
                              </h3>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                john@iqenergies.com
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setUserDropdownOpen(false)}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <X size={20} style={{ color: colors.textColor }} />
                          </button>
                        </div>

                        {/* Mobile Dropdown Items */}
                        <div className="max-h-[60vh] overflow-y-auto">
                          {userMenuItems.map((item, index) => (
                            <React.Fragment key={index}>
                              <button
                                onClick={() => handleUserAction(item)}
                                className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                              >
                                <item.icon 
                                  size={20} 
                                  className="text-gray-600 dark:text-gray-300 group-hover:scale-110 transition-transform"
                                />
                                <span className="text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                                  {item.label}
                                </span>
                              </button>
                              {item.divider && (
                                <div 
                                  className="h-px mx-4"
                                  style={{ backgroundColor: colors.secondary + '20' }}
                                />
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-3 py-1 rounded text-sm font-medium"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.white
                  }}
                >
                  Login
                </button>
              )}
            </div>

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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 pt-16 animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            ref={mobileMenuRef}
            className="w-full bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="p-4 border-b" style={{ borderColor: colors.secondary + '20' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold" style={{ color: colors.primary }}>
                  Menu
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={24} style={{ color: colors.textColor }} />
                </button>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="p-4">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center justify-between px-3 py-4 rounded-lg mb-2 transition-all ${
                      isActive ? 'font-semibold' : ''
                    }`}
                    style={{
                      color: isActive ? colors.primary : colors.textColor,
                      backgroundColor: isActive ? colors.primary + '10' : 'transparent'
                    }}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                    )}
                  </button>
                );
              })}

              {/* Mobile Cart Button */}
              <button
                onClick={() => {
                  navigate("/cart");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-4 rounded-lg mb-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart size={20} style={{ color: colors.textColor }} />
                  <span>Shopping Cart</span>
                </div>
                {cartCount > 0 && (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: colors.primary }}
                  >
                    {cartCount}
                  </div>
                )}
              </button>

              {/* Mobile Auth Button */}
              {!isLoggedIn && (
                <button
                  onClick={handleLogin}
                  className="w-full px-4 py-3 rounded-lg font-medium mt-4 text-center"
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.white
                  }}
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .z-9999 {
          z-index: 9999;
        }
      `}</style>
    </header>
  );
};

export default Navbar;