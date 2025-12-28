import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import CustomInput from "../../component/form/CustomInput";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../../utils/app";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const API_URL = import.meta.env.VITE_API_BASE_URL; 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!formData.address) newErrors.address = "Address is required";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Minimum 6 characters";

    if (!formData.password_confirmation)
      newErrors.password_confirmation = "Confirm your password";
    else if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await api.post(`${API_URL}/register`, formData);

      if (res.data?.success) {
        toast.success(res.data.message || "Registration successful!");

        // Auto login after register
        login(res.data.user, res.data.token);

        navigate("/"); 
      } else {
        toast.error(res.data?.message || "Registration failed");
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        // Laravel validation errors
        setErrors(err.response.data.errors);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 px-4">
      <div className="max-w-md w-full relative z-10">
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#4CAF50]"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <img
              src="/public/image/logo.png"
              alt="IQEnergies"
              className="mx-auto h-14 mb-4"
            />
            <h2 className="text-3xl font-bold">Create Account</h2>
            <p className="text-gray-600">Join IQEnergies today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <CustomInput label="Full Name" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

            <CustomInput label="Email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

            <CustomInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}

            <CustomInput label="Address" name="address" value={formData.address} onChange={handleChange} />
            {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}

            <CustomInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

            <CustomInput label="Confirm Password" name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} />
            {errors.password_confirmation && (
              <p className="text-sm text-red-600">{errors.password_confirmation}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-white font-semibold
              bg-gradient-to-r from-[#4CAF50] to-[#0F766E]
              hover:from-[#0F766E] hover:to-[#065F46]
              transition-all disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-[#0F766E]"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
