import React, { useState, useEffect } from "react";
import { Save, Loader2, ExternalLink } from "lucide-react";
import { api } from "../../../utils/app";
import AdminLoader from "../../../component/admin/AdminLoader";

const HandleAboutCta = () => {
  const [ctaData, setCtaData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    button_text: "",
    button_link: "",
    is_active: "1",
  });

  // Fetch CTA data on component mount
  useEffect(() => {
    fetchCtaData();
  }, []);

  const fetchCtaData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/about/cta");
      setCtaData(response.data.data);
      console.log("Fetched CTA data:", response.data.data);

      // Populate form with existing data
      if (response.data.data) {
        setFormData({
          heading: response.data.data.heading || "",
          description: response.data.data.description || "",
          button_text: response.data.data.button_text || "",
          button_link: response.data.data.button_link || "",
          is_active: response.data.data.is_active ? "1" : "0",
        });
      }
    } catch (err) {
      setError("Failed to fetch CTA section data. Please try again.");
      console.error("Error fetching CTA data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked ? "1" : "0",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Log form data for debugging
      console.log(
        "Form data to send:",
        Object.fromEntries(formDataToSend.entries())
      );

      // Use POST for both create and update
      const endpoint = ctaData?.id
        ? `/admin/about/cta/${ctaData.id}`
        : "/admin/about/cta";

      const method = ctaData?.id ? "post" : "post";

      const response = await api[method](endpoint, formDataToSend);

      if (response.data.status) {
        // refetch data after successful save
        fetchCtaData();
        setSuccess(response.data.message || "CTA section saved successfully!");
      }else{
        setError(response.data.message || "Failed to save CTA section. Please try again.");
      }

      
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save CTA section. Please try again.";
      setError(errorMessage);
      console.error("Error saving CTA section:", err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            About Page Call to Action
          </h1>
          <p className="text-gray-600 mt-2">
            Manage the Call to Action section for the About Us page
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Call to Action Configuration
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {ctaData?.id
                ? `Editing existing CTA section (ID: ${ctaData.id})`
                : "Create new CTA section"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Content */}
              <div className="space-y-6">
                {/* Heading */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Heading *
                  </label>
                  <input
                    type="text"
                    name="heading"
                    value={formData.heading}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="e.g., Ready to Start Your Journey?"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Main heading for the CTA section
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Description text for the CTA section"
                  />
                </div>
              </div>

              {/* Right Column - Button & Status */}
              <div className="space-y-6">
                {/* Button Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Button Text *
                  </label>
                  <input
                    type="text"
                    name="button_text"
                    value={formData.button_text}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="e.g., Get Started, Learn More, Contact Us"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Text displayed on the button
                  </p>
                </div>

                {/* Button Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Button Link *
                  </label>
                  <input
                    type="url"
                    name="button_link"
                    value={formData.button_link}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="https://example.com/path"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    URL where the button will link to
                  </p>
                </div>

                {/* Active Toggle */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active === "1"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`block w-14 h-8 rounded-full ${
                          formData.is_active === "1"
                            ? "bg-gray-900"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                          formData.is_active === "1"
                            ? "transform translate-x-6"
                            : ""
                        }`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formData.is_active === "1"
                        ? "Active (Visible on site)"
                        : "Inactive (Hidden on site)"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

           

            {/* Current Data */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Current Data
              </h3>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                {ctaData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Section ID
                      </div>
                      <div className="text-gray-900 font-semibold">
                        #{ctaData.id}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Status
                      </div>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          ctaData.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ctaData.is_active ? "Active" : "Inactive"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Created
                      </div>
                      <div className="text-gray-900">
                        {new Date(ctaData.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Last Updated
                      </div>
                      <div className="text-gray-900">
                        {new Date(ctaData.updated_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No CTA section data available. Create your first CTA
                    section.
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>
                      {ctaData?.id
                        ? "Update CTA Section"
                        : "Create CTA Section"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HandleAboutCta;
