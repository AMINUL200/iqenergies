import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  X,
  Home,
  Info,
  Layers,
  Briefcase,
  Package,
  Menu,
} from "lucide-react";

const SideBar = ({ toggleMenu, isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarLinks = [
    { id: "home", label: "Home", type: "route", path: "/", icon: <Home size={20} /> },
    { id: "about", label: "About Us", type: "route", path: "/about", icon: <Info size={20} /> },
    { id: "solutions", label: "Solutions", type: "scroll", sectionId: "solutions", icon: <Layers size={20} /> },
    { id: "services", label: "Services", type: "scroll", sectionId: "services", icon: <Briefcase size={20} /> },
    { id: "products", label: "Products", type: "scroll", sectionId: "products", icon: <Package size={20} /> },
  ];

  useEffect(() => {
    if (isOpen) toggleMenu();
    // eslint-disable-next-line
  }, [location.pathname]);

  const handleNavClick = (item) => {
    if (item.type === "route") {
      navigate(item.path);
      toggleMenu();
      return;
    }

    if (location.pathname === "/") {
      setTimeout(() => {
        document.getElementById(item.sectionId)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      toggleMenu();
    } else {
      navigate("/", { state: { scrollTo: item.sectionId } });
      toggleMenu();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2 text-green-600">
           <img src="/image/logo.png" className="w-20 h-16" alt="" />
          </div>
          <button onClick={toggleMenu} className="text-gray-600 hover:text-green-600">
            <X size={24} />
          </button>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-2">
          {sidebarLinks.map((item) => {
            const isActive =
              item.type === "route" && location.pathname === item.path;

            return (
              <div
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                  }
                `}
              >
                {item.icon}
                {item.label}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
