import React, { useState } from "react";
import { MapPin, Phone, Mail, Globe, PhoneCall } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../utils/app";

const ContactUsSection = ({ contactInfo = [] }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    email: "",
    average_monthly_usage: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!formData.mobile.trim()) {
      toast.error("Mobile number is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.average_monthly_usage) {
      toast.error("Average monthly electricity usage is required");
      return;
    }

    if (!formData.pincode.trim()) {
      toast.error("Pincode is required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/book-solar-survey", formData);

      if (response.data?.success) {
        toast.success(
          response.data.message ||
            "Solar survey request submitted successfully!"
        );

        // Reset form
        setFormData({
          full_name: "",
          mobile: "",
          email: "",
          average_monthly_usage: "",
          pincode: "",
        });
      } else {
        toast.error(response.data?.message || "Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.values(errors).forEach((errorArray) => {
          errorArray.forEach((errorMessage) => {
            toast.error(errorMessage);
          });
        });
      } else {
        toast.error(
          error.response?.data?.message ||
            "Failed to submit request. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Find a specific contact for the header phone number
  const findCorporateOffice = () => {
    return contactInfo.find(
      (contact) => 
        contact.company_name?.toLowerCase().includes("corporate") || 
        contact.office_name?.toLowerCase().includes("kolkata")
    );
  };

  const corporateOffice = findCorporateOffice();

  return (
    <section className="relative py-20 md:py-28 bg-[#0A1A2F]" id="contact">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="max-w-4xl mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 mb-5">
            <span className="text-sm font-semibold text-green-400 uppercase">
              Contact Us
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Let’s Talk About Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Energy Requirements
            </span>
          </h2>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* ================= LEFT : OFFICE DETAILS ================= */}
          <div className="space-y-8 text-gray-300">
            {contactInfo.length > 0 ? (
              contactInfo.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-green-500/30 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {contact.company_name}
                    {contact.office_name && contact.office_name !== contact.company_name && (
                      <span className="text-green-400 ml-2">
                        ({contact.office_name})
                      </span>
                    )}
                  </h3>
                  
                  {/* Address */}
                  {contact.address && (
                    <p className="flex items-start gap-2 mb-3">
                      <MapPin className="w-4 h-4 mt-1 text-green-400 flex-shrink-0" />
                      <span>{contact.address}</span>
                    </p>
                  )}

                  {/* Contact Details */}
                  <div className="space-y-2 mt-3">
                    {/* Phone */}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-green-400" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="hover:text-green-400 transition-colors"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    )}

                    {/* Landline */}
                    {/* {contact.landline && (
                      <div className="flex items-center gap-2">
                        <PhoneCall className="w-4 h-4 text-green-400" />
                        <span>{contact.landline}</span>
                      </div>
                    )} */}

                    {/* Email */}
                    {/* {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-green-400" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="hover:text-green-400 transition-colors"
                        >
                          {contact.email}
                        </a>
                      </div>
                    )} */}

                    {/* Fax (if available) */}
                    {/* {contact.fax && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Globe className="w-4 h-4" />
                        <span>Fax: {contact.fax}</span>
                      </div>
                    )} */}
                  </div>

                  {/* Social Media Links (if available) */}
                  {/* {(contact.fb || contact.insta || contact.linkdin || contact.twiter) && (
                    <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                      {contact.fb && (
                        <a
                          href={contact.fb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          Facebook
                        </a>
                      )}
                      {contact.insta && (
                        <a
                          href={contact.insta}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-pink-500 transition-colors"
                        >
                          Instagram
                        </a>
                      )}
                      {contact.linkdin && (
                        <a
                          href={contact.linkdin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          LinkedIn
                        </a>
                      )}
                      {contact.twiter && (
                        <a
                          href={contact.twiter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-blue-300 transition-colors"
                        >
                          Twitter
                        </a>
                      )}
                    </div>
                  )} */}
                </div>
              ))
            ) : (
              // Fallback if no contact info is provided
              <div className="space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Corporate Office (Kolkata)
                  </h3>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-green-400" />
                    Convergence Contact Center D2/2 EP and GP Block, Sector V,
                    Salt Lake, Kolkata - 700091
                  </p>
                  <p className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    +91 82768 63844
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Regional Office (Kerala)
                  </h3>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-green-400" />
                    18/1691/1, Maveli Arcade, Pattalakunnu, Mannuthy - 680651,
                    Thrissur, Kerala
                  </p>
                  <p className="flex items-center gap-2 mt-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    +91 7736 981183
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Branch Office (Kolkata)
                  </h3>
                  <p className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-green-400" />
                    C/20 Bapujinagar, Regent Estate, Kolkata - 700092
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ================= RIGHT : FORM ================= */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            {/* ===== NEW INTRO CONTENT ===== */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Book your Free Solar Survey
              </h3>
              <p className="text-gray-300 mb-4">Let's Build Solar Community</p>
              <p className="flex items-center gap-2 text-white font-semibold">
                <Phone className="w-5 h-5" />
                Call Today:
                <a
                  href={`tel:${corporateOffice?.phone || "+918276863844"}`}
                  className="hover:underline"
                >
                  {corporateOffice?.phone || "+91 82768 63844"}
                </a>
              </p>
              {corporateOffice?.email && (
                <p className="flex items-center gap-2 text-white font-semibold mt-2">
                  <Mail className="w-5 h-5" />
                  Email:
                  <a
                    href={`mailto:${corporateOffice.email}`}
                    className="hover:underline"
                  >
                    {corporateOffice.email}
                  </a>
                </p>
              )}
            </div>

            <h3 className="text-2xl font-bold text-green-400 mb-6">
              Enquire Now
            </h3>

            {/* ===== FORM ===== */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-4 py-6 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                required
              />

              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="w-full px-4 py-6 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                required
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-4 py-6 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                required
              />

              <input
                type="number"
                name="average_monthly_usage"
                value={formData.average_monthly_usage}
                onChange={handleChange}
                placeholder="Average Monthly Electricity Usage (kWh)"
                min="0"
                className="w-full px-4 py-6 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                required
              />

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode"
                className="w-full px-4 py-6 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-400 text-center">
              We'll contact you within 24 hours to schedule your free solar
              survey
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;