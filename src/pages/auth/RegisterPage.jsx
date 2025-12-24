import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, ArrowLeft } from "lucide-react";
import CustomInput from "../../component/form/CustomInput";

const RegisterPage = () => {
  const navigate = useNavigate();

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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required";

    if (!formData.email)
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email";

    if (!formData.phone)
      newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!formData.address)
      newErrors.address = "Address is required";

    if (!formData.password)
      newErrors.password = "Password is required";
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
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      console.log("REGISTER PAYLOAD:", formData);
      setIsLoading(false);
      // navigate("/login");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 px-4">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#4CAF50]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#0F766E]/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-[#4CAF50]"
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30">
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="/public/image/logo.png"
              alt="IQEnergies"
              className="mx-auto h-14 mb-4"
            />
            <h2 className="text-3xl font-bold text-[#1F2933]">
              Create Account
            </h2>
            <p className="text-gray-600 mt-1">
              Join IQEnergies today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <CustomInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name && "border-red-500"}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}

            <CustomInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email && "border-red-500"}
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}

            <CustomInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone && "border-red-500"}
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}

            <CustomInput
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address && "border-red-500"}
            />
            {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}

            <CustomInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password && "border-red-500"}
            />
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

            <CustomInput
              label="Confirm Password"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={errors.password_confirmation && "border-red-500"}
            />
            {errors.password_confirmation && (
              <p className="text-sm text-red-600">
                {errors.password_confirmation}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-white font-semibold text-lg
                bg-gradient-to-r from-[#4CAF50] to-[#0F766E]
                hover:from-[#0F766E] hover:to-[#065F46]
                transition-all disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-[#0F766E] hover:text-[#4CAF50]"
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
