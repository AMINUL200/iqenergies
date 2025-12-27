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
import AddToCartPage from "./pages/product/AddToCartPage";
import ProfilePage from "./pages/about/ProfilePage";
import MyOrderPage from "./pages/order/MyOrderPage";
import OrderTrackingPage from "./pages/order/OrderTrackingPage";
import {
  GuestRoute,
  PublicUserRoute,
  PrivateUserRoute,
  AdminRoute,
} from "./routes/ProtectedRoutes";
import HandleBanner from "./pages/admin/landing_page/HandleBanner";
import HandleAboutHero from "./pages/admin/about/HandleAboutHero";
import HandleWhoWeAre from "./pages/admin/about/HandleWhoWeAre";
import HandleAboutFeatures from "./pages/admin/about/HandleAboutFeatures";
import HandleAboutMission from "./pages/admin/about/HandleAboutMission";
import HandleAboutCta from "./pages/admin/about/HandleAboutCta";
import HandleWhatWeDoList from "./pages/admin/waht_we_do/HandleWhatWeDoList";
import HandleWhatWeDoHero from "./pages/admin/waht_we_do/HandleWhatWeDoHero";
import HandleOurSolutionItems from "./pages/admin/our_solution/HandleOurSolutionItems";

const App = () => {

  return (
    <Router>
      <Routes>
        {/* ---------- LOGIN / REGISTER ---------- */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

       

        {/* ---------- PUBLIC USER ROUTES ---------- */}
        <Route element={<PublicUserRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/services/:slug" element={<ServicesDetails />} />
            <Route path="/solution/:slug" element={<SolutionDetails />} />
            <Route path="/cart" element={<AddToCartPage />} />

            <Route path="/brochure" element={<BrochurePage />} />
            <Route path="/certificate" element={<CertificatePage />} />
          </Route>
        </Route>

        {/* ---------- PRIVATE USER ROUTES ---------- */}
        <Route element={<PrivateUserRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<MyOrderPage />} />
            <Route path="/orders/:slug" element={<OrderTrackingPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
          </Route>
        </Route>

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="site-settings" element={<SiteSettings />} />
            <Route path="profile" element={<AdminProfile />} />

            <Route path="handle-banner" element={<HandleBanner />} />
            <Route path="handle-about/hero-section" element={<HandleAboutHero />} />
            <Route path="handle-about/who-we-are" element={<HandleWhoWeAre />} />
            <Route path="handle-about/features" element={<HandleAboutFeatures />} />
            <Route path="handle-about/mission-vision" element={<HandleAboutMission />} />
            <Route path="handle-about/cta" element={<HandleAboutCta />} />

            <Route path="handle-what-we-do/list-services" element={<HandleWhatWeDoList />} />
            <Route path="handle-what-we-do/hero-section" element={<HandleWhatWeDoHero />} />

            <Route path="handle-our-solutions/list-solutions" element={<HandleOurSolutionItems />} />
            {/* <Route path="handle-our-solutions/list-solutions" element={<HandleOurSolutionItems />} /> */}



          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
