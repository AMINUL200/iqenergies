import React, { useState } from "react";
import SideBar from "../component/common/SideBar";
import { Outlet } from "react-router-dom";
import Footer from "../component/common/Footer";
import Navbar from "../component/common/Navbar";
import BackToTop from "../component/common/BackToTop";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleMenu={toggleSidebar} />
      <SideBar toggleMenu={toggleSidebar} isOpen={sidebarOpen} />
      <Outlet />
      <BackToTop/>
      <Footer />
    </div>
  );
};

export default AppLayout;