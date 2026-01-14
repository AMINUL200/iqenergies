import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  ShieldCheck,
  ShoppingBag,
  LogOut,
  Camera,
  Save,
  X,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../utils/app";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  console.log(user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    image: null,
    image_alt: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        image: null,
        image_alt: user.image_alt || ""
      });
      setImagePreview(user.image_url || "");
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        setError("Please select a valid image file");
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError("");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formDataToSend = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'image' && formData[key] instanceof File) {
            formDataToSend.append(key, formData[key]);
          } else if (key !== 'image') {
            formDataToSend.append(key, formData[key]);
          }
        }
      });


      // Add _method for Laravel to handle PUT via POST
      formDataToSend.append('_method', 'POST');

      const response = await api.post(`/user/profile-update`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log("Profile update response:", response);
      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        
        // Refresh user data in context if needed
        // You might want to update your auth context here
        
        // Auto-clear success message
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError(response.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        let errorMessage = "Validation failed:\n";
        
        Object.keys(errors).forEach((key) => {
          errorMessage += `${key}: ${errors[key].join(", ")}\n`;
        });
        
        setError(errorMessage);
      } else {
        setError(err.response?.data?.message || "Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A1A2F] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-green-400 mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white py-16 pt-30 md:pt-40">
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

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
            <p className="text-green-400 text-center">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-400 whitespace-pre-line">{error}</p>
          </div>
        )}

        {/* ================= CONTENT ================= */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ================= PROFILE CARD ================= */}
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 h-fit">
            <div className="flex flex-col items-center text-center">
              {/* Profile Image */}
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt={formData.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold">
                      {formData.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-green-600 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <h2 className="text-xl font-semibold">{formData.name}</h2>
              <p className="text-gray-400 text-sm">{user.role}</p>

              <span className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold">
                <ShieldCheck className="w-4 h-4" />
                {user.email_verified_at ? "Verified Account" : "Unverified Account"}
              </span>

              {/* Edit/Save Profile Button */}
              {isEditing ? (
                <div className="flex gap-3 w-full mt-6">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || "",
                        email: user.email || "",
                        phone: user.phone || "",
                        address: user.address || "",
                        image: null,
                        image_alt: user.image_alt || ""
                      });
                      setImagePreview(user.image_url || "");
                      setError("");
                    }}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gray-700 hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {loading ? "Saving..." : "Save"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 w-full px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* ================= DETAILS ================= */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Info */}
            <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <h3 className="text-2xl font-bold mb-6">
                Personal Information
              </h3>

              <div className="space-y-6">
                {/* Name */}
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-green-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-green-500 focus:outline-none"
                        placeholder="Enter your name"
                      />
                    ) : (
                      <p className="font-semibold">{formData.name || "Not provided"}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-green-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-green-500 focus:outline-none"
                        placeholder="Enter your email"
                      />
                    ) : (
                      <p className="font-semibold">{formData.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-green-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Phone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-green-500 focus:outline-none"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="font-semibold">{formData.phone || "Not provided"}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-green-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">Address</p>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-green-500 focus:outline-none resize-none"
                        placeholder="Enter your address"
                      />
                    ) : (
                      <p className="font-semibold">{formData.address || "Not provided"}</p>
                    )}
                  </div>
                </div>

                {/* Image Alt Text (only in edit mode) */}
                {isEditing && (
                  <div className="flex items-start gap-4">
                    <Camera className="w-5 h-5 text-green-400 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">Image Alt Text</p>
                      <input
                        type="text"
                        name="image_alt"
                        value={formData.image_alt}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-green-500 focus:outline-none"
                        placeholder="Alt text for profile image"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        This text helps screen readers describe your image
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid sm:grid-cols-2 gap-6">
              <button
                onClick={() => navigate("/orders")}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-500/40 transition-all text-left"
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
                onClick={handleLogout}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-red-500/40 transition-all text-left"
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