import React, { useEffect, useState } from "react";
import SideBar from "../component/common/SideBar";
import { Outlet } from "react-router-dom";
import Footer from "../component/common/Footer";
import Navbar from "../component/common/Navbar";
import BackToTop from "../component/common/BackToTop";
import PageLoader from "../component/common/PageLoader";
import { api } from "../utils/app";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [loading, setLoading] = useState(true);
  const [appData, setAppData] = useState({
    contactInfo: null,
    // Add other data you need
  });
  const [error, setError] = useState(null);

  // Fetch all required data for the app
  const fetchAppData = async () => {
    try {
      setLoading(true);
      setError(null);

      

      // Fetch contact information
      const contactResponse = await api.get("/seo-optimization");

      

      setAppData({
        contactInfo: contactResponse.data?.success
          ? contactResponse.data.data
          : {},
        
      });
    } catch (error) {
      console.error("Failed to fetch app data:", error);
      setError("Failed to load application data");

      // Set fallback data if API fails
      setAppData({
        contactInfo: null,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  // console.log(appData.contactInfo);
  

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAppData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleMenu={toggleSidebar} />
      <SideBar toggleMenu={toggleSidebar} isOpen={sidebarOpen} />
      <Outlet />
      <BackToTop />
      <Footer footerInfo={appData.contactInfo} />
    </div>
  );
};

export default AppLayout;
