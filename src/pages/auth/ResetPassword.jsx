import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Key, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";
import CustomInput from "../../component/form/CustomInput";
import { toast } from "react-toastify";
import { api } from "../../utils/app";

const ResetPassword = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    password_confirmation: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: Reset
  const [otpSent, setOtpSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateEmailStep = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateResetStep = () => {
    const newErrors = {};
    
    if (!formData.otp) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "OTP must be 6 digits";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateEmailStep()) return;
    
    setIsLoading(true);
    
    try {
      // API 1: Send OTP
      const response = await api.post("/forgot-password", { email: formData.email });
      
      if (response.data?.success) {
        toast.success("OTP sent to your email!");
        setOtpSent(true);
        setStep(2);
      } else {
        toast.error(response.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validateResetStep()) return;
    
    setIsLoading(true);
    
    try {
      // API 2: Reset password with all data
      const response = await api.post("/reset-password", formData);
      
      if (response.data?.success) {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(response.data?.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!formData.email) {
      toast.error("Please enter your email first");
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await api.post("/forgot-password", { email: formData.email });
      
      if (response.data?.success) {
        toast.success("OTP resent to your email!");
      } else {
        toast.error(response.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <>
            <h2 className="text-3xl font-bold text-[#1F2933] mb-2">
              Reset Your Password
            </h2>
            <p className="text-[#6B7280] mb-6">
              Enter your email address to receive a verification code
            </p>
            
            <div>
              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                placeholder="Enter your email"
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
                  Sending OTP...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  Send Verification Code
                </>
              )}
            </button>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-3xl font-bold text-[#1F2933] mb-2">
              Reset Password
            </h2>
            <p className="text-[#6B7280] mb-6">
              Enter the OTP sent to <span className="font-semibold text-[#0F766E]">{formData.email}</span> and your new password
            </p>
            
            <div className="space-y-6">
              {/* OTP */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">6-Digit OTP</label>
                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={isLoading}
                    className="text-sm font-semibold text-[#0F766E] hover:text-[#4CAF50] disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
                <CustomInput
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleChange}
                  icon={<Key className="w-5 h-5 text-gray-400" />}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  className={
                    errors.otp
                      ? "border-red-500 focus:ring-red-200/50"
                      : "focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"
                  }
                />
                {errors.otp && (
                  <p className="mt-2 text-sm text-red-600">{errors.otp}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <div className="relative">
                  <CustomInput
                    label="New Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    placeholder="Enter new password"
                    className={
                      errors.password
                        ? "border-red-500 focus:ring-red-200/50 pr-10"
                        : "focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] pr-10"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <div className="relative">
                  <CustomInput
                    label="Confirm Password"
                    name="password_confirmation"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    icon={<Lock className="w-5 h-5 text-gray-400" />}
                    placeholder="Confirm new password"
                    className={
                      errors.password_confirmation
                        ? "border-red-500 focus:ring-red-200/50 pr-10"
                        : "focus:ring-[#4CAF50]/40 focus:border-[#4CAF50] pr-10"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <p className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Password must be at least 6 characters
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Both passwords must match
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700
                  hover:bg-gray-50 transition-all duration-300"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center items-center gap-2 py-3 rounded-lg text-white font-semibold text-lg
                  bg-gradient-to-r from-[#4CAF50] to-[#0F766E]
                  hover:from-[#0F766E] hover:to-[#065F46]
                  focus:ring-2 focus:ring-[#4CAF50]
                  transition-all duration-300
                  disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Reset Password
                  </>
                )}
              </button>
            </div>
          </>
        );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    switch(step) {
      case 1:
        handleSendOTP(e);
        break;
      case 2:
        handleResetPassword(e);
        break;
    }
  };

  // Progress steps (simplified to 2 steps)
  const steps = [
    { number: 1, label: "Email" },
    { number: 2, label: "Reset" }
  ];

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
          onClick={() => navigate("/login")}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-[#4CAF50] transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Login</span>
        </button>

        {/* Reset Password Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/30">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#0F766E] rounded-2xl shadow-lg">
              <Key className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-8">
            {steps.map((stepItem, index) => (
              <React.Fragment key={stepItem.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-semibold
                    ${step >= stepItem.number 
                      ? 'bg-[#4CAF50] border-[#4CAF50] text-white' 
                      : 'border-gray-300 text-gray-400'
                    }`}
                  >
                    {step > stepItem.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      stepItem.number
                    )}
                  </div>
                  <span className={`text-xs mt-2 font-medium
                    ${step >= stepItem.number ? 'text-[#4CAF50]' : 'text-gray-400'}`}
                  >
                    {stepItem.label}
                  </span>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded-full
                    ${step > stepItem.number ? 'bg-[#4CAF50]' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
          </form>

         
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;