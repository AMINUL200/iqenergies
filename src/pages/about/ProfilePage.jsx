import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  ShieldCheck,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  // Dummy user data (replace later with API/context)
  const user = {
    name: "Aminul Islam",
    email: "aminul@iqenergies.com",
    phone: "+91 98765 43210",
    location: "West Bengal, India",
    role: "Customer",
  };

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* ================= HEADER ================= */}
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 rounded-xl bg-green-500/20 border border-green-500/30">
            <User className="w-7 h-7 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
            <p className="text-gray-400">
              Manage your personal information and account settings
            </p>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid lg:grid-cols-3 gap-10">

          {/* ================= PROFILE CARD ================= */}
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl
                          border border-white/10 h-fit">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600
                              flex items-center justify-center text-3xl font-bold mb-4">
                {user.name.charAt(0)}
              </div>

              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-400 text-sm">{user.role}</p>

              <span className="mt-4 inline-flex items-center gap-2 px-4 py-2
                               rounded-full bg-green-500/20 border border-green-500/30
                               text-green-400 text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Verified Account
              </span>

              {/* Edit Profile */}
              <button
                className="mt-6 w-full px-6 py-3 rounded-xl font-semibold
                           bg-gradient-to-r from-green-500 to-green-600
                           hover:from-green-600 hover:to-green-700 transition-all"
              >
                <Edit className="inline w-4 h-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* ================= DETAILS ================= */}
          <div className="lg:col-span-2 space-y-8">

            {/* Personal Info */}
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl
                            border border-white/10">
              <h3 className="text-2xl font-bold mb-6">
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                <div className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-semibold">{user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="font-semibold">{user.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-6">
              <button
                onClick={() => navigate("/orders")}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl
                           border border-white/10 hover:border-green-500/40
                           transition-all text-left"
              >
                <ShoppingBag className="w-6 h-6 text-green-400 mb-3" />
                <h4 className="font-semibold text-lg mb-1">
                  My Orders
                </h4>
                <p className="text-gray-400 text-sm">
                  View your order history and invoices
                </p>
              </button>

              <button
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl
                           border border-white/10 hover:border-red-500/40
                           transition-all text-left"
              >
                <LogOut className="w-6 h-6 text-red-400 mb-3" />
                <h4 className="font-semibold text-lg mb-1">
                  Logout
                </h4>
                <p className="text-gray-400 text-sm">
                  Securely sign out of your account
                </p>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
