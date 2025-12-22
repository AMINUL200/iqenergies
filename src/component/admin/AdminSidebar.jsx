import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  Users,
  Settings,
  Package,
  BarChart,
  ShoppingCart,
  FileText,
  ChevronDown,
  ChevronRight,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Mail,
  UserCog,
  Tag,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  User2,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: "/admin",
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User2 className="w-5 h-5" />,
      path: "/admin/profile",
    },
    {
      id: "users",
      label: "Users Management",
      icon: <Users className="w-5 h-5" />,
      children: [
        {
          id: "all-users",
          label: "All Users",
          icon: <Users className="w-4 h-4" />,
          path: "/admin/users/all",
        },
        {
          id: "user-roles",
          label: "User Roles",
          icon: <UserCog className="w-4 h-4" />,
          path: "/admin/users/roles",
        },
        {
          id: "permissions",
          label: "Permissions",
          icon: <Shield className="w-4 h-4" />,
          path: "/admin/users/permissions",
        },
      ],
    },
    {
      id: "products",
      label: "Products",
      icon: <Package className="w-5 h-5" />,
      children: [
        {
          id: "all-products",
          label: "All Products",
          icon: <Package className="w-4 h-4" />,
          path: "/admin/products/all",
        },
        {
          id: "categories",
          label: "Categories",
          icon: <Tag className="w-4 h-4" />,
          path: "/admin/products/categories",
        },
        {
          id: "inventory",
          label: "Inventory",
          icon: <Database className="w-4 h-4" />,
          path: "/admin/products/inventory",
        },
      ],
    },
    {
      id: "orders",
      label: "Orders",
      icon: <ShoppingCart className="w-5 h-5" />,
      path: "/admin/orders",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart className="w-5 h-5" />,
      children: [
        {
          id: "overview",
          label: "Overview",
          icon: <TrendingUp className="w-4 h-4" />,
          path: "/admin/analytics/overview",
        },
        {
          id: "sales",
          label: "Sales Analytics",
          icon: <DollarSign className="w-4 h-4" />,
          path: "/admin/analytics/sales",
        },
        {
          id: "user-behavior",
          label: "User Behavior",
          icon: <Users className="w-4 h-4" />,
          path: "/admin/analytics/behavior",
        },
      ],
    },
    {
      id: "reports",
      label: "Reports",
      icon: <FileText className="w-5 h-5" />,
      path: "/admin/reports",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      children: [
        {
          id: "SiteSettings",
          label: "Site Setting",
          icon: <Settings className="w-4 h-4" />,
          path: "/admin/site-settings",
        },
        {
          id: "appearance",
          label: "Appearance",
          icon: <Palette className="w-4 h-4" />,
          path: "/admin/settings/appearance",
        },
        {
          id: "notifications",
          label: "Notifications",
          icon: <Bell className="w-4 h-4" />,
          path: "/admin/settings/notifications",
        },
        {
          id: "integrations",
          label: "Integrations",
          icon: <Globe className="w-4 h-4" />,
          path: "/admin/settings/integrations",
        },
      ],
    },
  ];

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isActive = (path) => location.pathname === path;

  const isParentActive = (children) => {
    return children?.some((child) => location.pathname === child.path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 
  bg-gradient-to-b from-slate-900 to-slate-800 
  shadow-2xl transform transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className=" sticky flex top-0 z-50 bg-slate-900 items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Admin Panel</h2>
              <p className="text-xs text-slate-400">Management Console</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors lg:hidden text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-100px)] custom-scrollbar">
          {menuItems.map((item) => (
            <div key={item.id}>
              {/* Parent Item */}
              {item.children ? (
                <button
                  onClick={() => toggleDropdown(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isParentActive(item.children)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`${
                        isParentActive(item.children)
                          ? "text-white"
                          : "text-slate-400 group-hover:text-white"
                      } transition-colors`}
                    >
                      {item.icon}
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <div
                    className={`transition-transform duration-200 ${
                      openDropdowns[item.id] ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <div
                    className={`${
                      isActive(item.path)
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    } transition-colors`}
                  >
                    {item.icon}
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              )}

              {/* Dropdown Children */}
              {item.children && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openDropdowns[item.id]
                      ? "max-h-96 opacity-100 mt-1"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-4 pl-4 border-l-2 border-slate-700/50 space-y-1 py-1">
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleNavigation(child.path)}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                          isActive(child.path)
                            ? "bg-blue-500/20 text-blue-400 border-l-2 border-blue-400"
                            : "text-slate-400 hover:bg-slate-700/30 hover:text-slate-200"
                        }`}
                      >
                        <div
                          className={`${
                            isActive(child.path)
                              ? "text-blue-400"
                              : "text-slate-500 group-hover:text-slate-300"
                          } transition-colors`}
                        >
                          {child.icon}
                        </div>
                        <span className="font-medium text-sm">
                          {child.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
