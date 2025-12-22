import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  User,
  LogOut,
  Settings,
  UserCircle,
  Mail,
  ChevronDown,
} from "lucide-react";

const AdminNavbar = ({ setSidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  // Dummy user data - replace with your actual user data
  const userData = {
    name: "Admin User",
    email: "admin@example.com",
    role: "Administrator",
    avatar: null, // Set to image URL if available
  };

  // Dummy notifications - replace with your actual notifications
  const notifications = [
    {
      id: 1,
      title: "New user registered",
      message: "John Doe just signed up",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment received",
      message: "Payment of $299 received",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "System update",
      message: "System updated successfully",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    // Add your logout logic here
    navigate("/signin");
  };

  const handleProfileClick = () => {
    setShowProfileMenu(false);
    navigate("/admin/profile");
  };

  const handleSettingsClick = () => {
    setShowProfileMenu(false);
    navigate("/admin/settings");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffba00] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    <p className="text-white/80 text-xs">{unreadCount} unread messages</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          notification.unread ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-center">
                    <button className="text-sm text-indigo-600 hover:text-[#ffba00] font-semibold transition-colors">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-[#ffba00] to-[#ff9500] rounded-full flex items-center justify-center shadow-md">
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500">{userData.role}</p>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform hidden sm:block ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden animate-fadeIn">
                  {/* User Info Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        {userData.avatar ? (
                          <img
                            src={userData.avatar}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">
                          {userData.name}
                        </p>
                        <p className="text-white/80 text-xs">{userData.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UserCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          My Profile
                        </p>
                        <p className="text-xs text-gray-500">
                          View and edit profile
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={handleSettingsClick}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Settings className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Settings
                        </p>
                        <p className="text-xs text-gray-500">
                          Manage preferences
                        </p>
                      </div>
                    </button>

                    <button
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Messages
                        </p>
                        <p className="text-xs text-gray-500">
                          View your messages
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="border-t border-gray-200 p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-red-50 transition-colors rounded-lg text-left group"
                    >
                      <div className="w-8 h-8 bg-red-100 group-hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-600">
                          Logout
                        </p>
                        <p className="text-xs text-red-400">
                          Sign out of your account
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default AdminNavbar;