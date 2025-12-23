import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/landing/LandingPage";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import SiteSettings from "./pages/admin/settings/SiteSettings";
import AdminProfile from "./pages/admin/profile/AdminProfile";
import AboutUsPage from "./pages/about/AboutUsPage";
import ProductDetails from "./pages/product/ProductDetails";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderSuccessPage from "./pages/order/OrderSuccessPage";
import BrochurePage from "./pages/brochure/BrochurePage";
import CertificatePage from "./pages/certificate/CertificatePage";
import ProductPage from "./pages/product/ProductPage";
import ServicesDetails from "./pages/services/ServicesDetails";
import SolutionDetails from "./pages/solution/SolutionDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AppLayout />}>
          <Route index path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />

          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route path="/services/:slug" element={<ServicesDetails />} />
          <Route path="/solution/:slug" element={<SolutionDetails />} />



          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />



          <Route path="/brochure" element={<BrochurePage />} />
          <Route path="/certificate" element={<CertificatePage />} />

        </Route>

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          {/* Additional admin routes can be added here */}
          <Route path="site-settings" element={<SiteSettings />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
