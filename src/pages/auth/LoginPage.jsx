import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";
import CustomInput from "../../component/form/CustomInput";
import { toast } from "react-toastify";
import { api } from "../../utils/app";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "admin@iqenergies.com",
    password: "admin123",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await api.post("/login", formData);
        const { token, user } = response.data;
        login(user, token);
        toast.success("Login successful!");
        console.log("Logged in user:", user);
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error.message || "Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#4CAF50]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0F766E]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-[#4CAF50] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Home</span>
        </button>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="/public/image/logo.png" alt="" />
              {/* <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#0F766E] rounded-2xl shadow-lg">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="24" cy="24" r="20" stroke="white" strokeWidth="3" />
                  <path d="M16 24L24 14L32 24L24 34L16 24Z" fill="white" />
                </svg>
              </div> */}
            </div>

            <h2 className="text-3xl font-bold text-[#1F2933] mb-2">
              Welcome Back
            </h2>
            <p className="text-[#6B7280]">Sign in to continue to IQEnergies</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={
                  errors.email
                    ? "border-red-500 focus:ring-red-200/50"
                    : "focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"
                }
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <CustomInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={
                  errors.password
                    ? "border-red-500 focus:ring-red-200/50"
                    : "focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"
                }
              />
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#4CAF50] focus:ring-[#4CAF50] border-gray-300 rounded"
                />
                <span className="ml-2">Remember me</span>
              </label>

              <a
                href="/forgot-password"
                className="text-sm font-semibold text-[#0F766E] hover:text-[#4CAF50]"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 rounded-lg text-white font-semibold text-lg
                bg-gradient-to-r from-[#4CAF50] to-[#0F766E]
                hover:from-[#0F766E] hover:to-[#065F46]
                focus:ring-2 focus:ring-[#4CAF50]
                transition-all duration-300
                disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 border-t pt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="font-semibold text-[#0F766E] hover:text-[#4CAF50]"
            >
              Sign up now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
