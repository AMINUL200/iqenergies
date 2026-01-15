import React, { useState } from "react";
import {
  Play,
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Shield,
  Star,
  Award,
  Globe,
  Target,
  X,
  User,
  Mail,
  Building,
  MessageSquare,
  Phone,
  Send
} from "lucide-react";
import { api } from "../../utils/app";
import { toast } from "react-toastify";

const SolarFranchise = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    company_name: "",
    message: "Interested in franchise partnership",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const colors = {
    primary: "#4CAF50",
    secondary: "#0F766E",
    accent: "#F59E0B",
    background: "#F8FAFC",
    textPrimary: "#1F2933",
    textMuted: "#6B7280",
    sunPrimary: "#F97316",
    sunSecondary: "#FACC15",
    sunAccent: "#DC2626",
    sunBackground: "#FFF7ED",
    sunText: "#3B2F2F",
  };

  const franchiseBenefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "High ROI",
      description: "20-30% annual returns on investment",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Full Support",
      description: "End-to-end training and technical support",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Proven Model",
      description: "500+ successful franchises across India",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Brand Value",
      description: "Leading solar brand in the market",
    },
  ];

  const franchiseFeatures = [
    "Zero Franchise Fee (Limited Time)",
    "Technical Training Program",
    "Marketing & Sales Support",
    "Inventory Management System",
    "After-Sales Service Training",
    "Digital Marketing Toolkit",
  ];

  const handleApplyNow = () => {
    setShowPopup(true);
  };

  const handlePlayVideo = () => {
    setVideoPlaying(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.full_name || !formData.email || !formData.phone || !formData.company_name) {
      alert("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Phone validation (Indian phone number)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      alert("Please enter a valid 10-digit Indian phone number");
      return;
    }

    setSubmitting(true);

    try {
      // Prepare the data in the exact format you specified
      const submissionData = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company_name: formData.company_name.trim(),
        message: formData.message.trim() || "Interested in franchise partnership",
        // source: "franchise_landing_page",
        // submission_date: new Date().toISOString(),
      };

      console.log("Submitting data:", submissionData);

      // Replace this with your actual API endpoint
      const response = await api.post('/franchise-application', submissionData);
      

      if (response.data.success) {
        toast.success(response.data.message || "Application submitted successfully!");
        setSubmitted(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            full_name: "",
            email: "",
            phone: "",
            company_name: "",
            message: "Interested in franchise partnership",
          });
          setSubmitted(false);
          setShowPopup(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Failed to submit application: ${error.message}. Please try again or contact us directly.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Limit to 10 digits
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    // Format with spaces for better readability
    if (value.length > 6) {
      value = `${value.substring(0, 5)} ${value.substring(5, 10)}`;
    } else if (value.length > 5) {
      value = `${value.substring(0, 5)} ${value.substring(5)}`;
    } else if (value.length > 2) {
      value = `${value.substring(0, 2)} ${value.substring(2)}`;
    }
    
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  return (
    <>
      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !submitting && setShowPopup(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/20">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      IQEnergies Franchise Application
                    </h2>
                    <p className="text-green-100 mt-1">
                      Join India's leading solar franchise network
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => !submitting && setShowPopup(false)}
                  disabled={submitting}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Success Message */}
            {submitted && (
              <div className="p-6 bg-green-50 border-b border-green-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800">
                      Application Submitted Successfully!
                    </h3>
                    <p className="text-green-600 text-sm mt-1">
                      Our franchise team will contact you within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name *
                      </div>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </div>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number *
                      </div>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="98 7654 3210"
                      maxLength="12"
                    />
                  </div>

                  {/* Company Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Company Name *
                      </div>
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      required
                      disabled={submitting}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Enter your company name"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Additional Message
                    </div>
                    <span className="text-sm text-gray-500 font-normal">
                      Tell us about your experience or specific interests in solar energy
                    </span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Interested in franchise partnership..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting || submitted}
                    className="group flex items-center justify-center gap-3 px-8 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      color: "#FFFFFF",
                    }}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : submitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Submitted!
                      </>
                    ) : (
                      <>
                        Submit Application
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => !submitting && setShowPopup(false)}
                    disabled={submitting}
                    className="px-8 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>

              {/* Privacy Note */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  By submitting this form, you agree to our Privacy Policy. 
                  Your information is secure and will only be used for franchise inquiry purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Component */}
      <div className="relative min-h-screen overflow-hidden" id="franchise">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
            backgroundAttachment: "fixed",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F2933]/90 via-[#1F2933]/80 to-transparent"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-green-400 tracking-wide">
                    Limited Franchise Opportunities
                  </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="block" style={{ color: "#FFF" }}>
                    Own Your Solar
                  </span>
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                    Energy Business
                  </span>
                </h1>

                {/* Description */}
                <p
                  className="text-lg md:text-xl leading-relaxed"
                  style={{ color: "#CBD5E1" }}
                >
                  Join India's fastest growing solar franchise network. Be part
                  of the renewable energy revolution with comprehensive support,
                  proven business model, and sustainable growth opportunities.
                </p>

                {/* Features List */}
                <div className="space-y-3">
                  {franchiseFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle
                        className="w-5 h-5"
                        style={{ color: colors.primary }}
                      />
                      <span className="text-lg" style={{ color: "#E5E7EB" }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    onClick={handleApplyNow}
                    className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                      color: "#FFFFFF",
                      boxShadow: `0 10px 30px ${colors.primary}40`,
                    }}
                  >
                    Apply for Franchise
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => console.log("Download Brochure")}
                    className="group flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:bg-white/10"
                    style={{
                      borderColor: colors.accent,
                      color: '#FFFFFF'
                    }}
                  >
                    Download Brochure
                    <svg className="w-5 h-5 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right Content - Video Section */}
              <div className="relative">
                {/* Video Container */}
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-500"
                  style={{
                    boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5)`,
                  }}
                >
                  {/* Placeholder/Thumbnail */}
                  {!videoPlaying ? (
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Solar Franchise Success Story"
                        className="w-full h-[400px] md:h-[500px] object-cover"
                      />

                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                        <button
                          onClick={handlePlayVideo}
                          className="group relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-[#F97316] to-[#F59E0B] rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-[#F97316] to-[#F59E0B] flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </button>
                      </div>

                      {/* Video Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Play className="w-4 h-4 text-white" />
                          <span className="text-sm font-semibold text-white">
                            Watch Success Story
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          From Zero to ₹50L/Month: A Franchise Journey
                        </h3>
                      </div>
                    </div>
                  ) : (
                    // Video Player
                    <div className="w-full h-[400px] md:h-[500px] bg-black">
                      <iframe
                        width="100%"
                        height="100%"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                        title="Solar Franchise Success Story"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-2xl"
                      ></iframe>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SolarFranchise;