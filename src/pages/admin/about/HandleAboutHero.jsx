import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "../../../utils/app";
import AdminLoader from "../../../component/admin/AdminLoader";

const HandleAboutHero = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    badge_text: "",
    heading: "",
    highlighted_text: "",
    heading_meta: "",
    description: "",
    description_meta: "",
    media_alt: "",
    is_active: "1", // Default to string '1' for active
    media_web: null,
    media_mobile: null,
    media_web_preview: "",
    media_mobile_preview: "",
  });

  // Fetch hero data on component mount
  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/about/hero");
      setHeroData(response.data.data);
      //   console.log('Fetched hero data:', response.data.data);

      // Populate form with existing data
      if (response.data.data) {
        setFormData({
          badge_text: response.data.data.badge_text || "",
          heading: response.data.data.heading || "",
          highlighted_text: response.data.data.highlighted_text || "",
          heading_meta: response.data.data.heading_meta || "",
          description: response.data.data.description || "",
          description_meta: response.data.data.description_meta || "",
          media_alt: response.data.data.media_alt || "",
          // Convert number to string for checkbox
          is_active: response.data.data.is_active ? "1" : "0",
          media_web: null,
          media_mobile: null,
          media_web_preview: response.data.data.media_web_url || "",
          media_mobile_preview: response.data.data.media_mobile_url || "",
        });
      }
    } catch (err) {
      setError("Failed to fetch hero section data. Please try again.");
      console.error("Error fetching hero data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      if (name === "media_web") {
        setFormData((prev) => ({
          ...prev,
          media_web: file,
          media_web_preview: previewUrl,
        }));
      } else if (name === "media_mobile") {
        setFormData((prev) => ({
          ...prev,
          media_mobile: file,
          media_mobile_preview: previewUrl,
        }));
      }
    } else if (type === "checkbox") {
      // For checkbox, toggle between '1' and '0'
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
        if (key !== "media_web_preview" && key !== "media_mobile_preview") {
          const value = formData[key];

          // Skip null or empty strings except for is_active
          if (key === "is_active") {
            // Always send is_active (0 or 1)
            formDataToSend.append(key, value);
          } else if (value !== null && value !== "") {
            formDataToSend.append(key, value);
          }
        }
      });

      // Log form data for debugging
      //   console.log('Form data to send:', Object.fromEntries(formDataToSend.entries()));

      // Use POST for both create and update
      const endpoint = `/admin/about/hero/${heroData?.id}`;

      const response = await api.post(endpoint, formDataToSend);



      if (response.data.status) {
        // Refresh data to reflect any changes
        fetchHeroData();
        setSuccess(response.data.message || "Hero section saved successfully!");
      }else{
        setError(response.data.message || "Failed to save hero section. Please try again.");

      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save hero section. Please try again.";
      setError(errorMessage);
      console.error("Error saving hero section:", err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return<AdminLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            About Page Hero Section
          </h1>
          <p className="text-gray-600 mt-2">
            Manage the hero section content for the About Us page
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
              Hero Section Configuration
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {heroData?.id
                ? `Editing existing hero section (ID: ${heroData.id})`
                : "Create new hero section"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Text Content */}
              <div className="space-y-6">
                {/* Badge Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Badge Text *
                  </label>
                  <input
                    type="text"
                    name="badge_text"
                    value={formData.badge_text}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="e.g., About Us, Our Story"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This appears as a small badge above the main heading
                  </p>
                </div>

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
                    placeholder="e.g., Powering a"
                  />
                </div>

                {/* Highlighted Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Highlighted Text *
                  </label>
                  <input
                    type="text"
                    name="highlighted_text"
                    value={formData.highlighted_text}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="e.g., Sustainable Tomorrow"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This text will be highlighted in the hero section
                  </p>
                </div>

                {/* Heading Meta */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Heading Meta (SEO)
                  </label>
                  <textarea
                    name="heading_meta"
                    value={formData.heading_meta}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Meta description for SEO"
                  />
                </div>
              </div>

              {/* Right Column - Description & Media */}
              <div className="space-y-6">
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
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Main description text for the hero section"
                  />
                </div>

                {/* Description Meta */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description Meta (SEO)
                  </label>
                  <textarea
                    name="description_meta"
                    value={formData.description_meta}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Meta description for SEO"
                  />
                </div>

                {/* Media Alt Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Media Alt Text
                  </label>
                  <input
                    type="text"
                    name="media_alt"
                    value={formData.media_alt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Alt text for hero images"
                  />
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

            {/* Media Upload Section */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Media Upload
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Web Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Web Image (Desktop)
                  </label>
                  <div className="space-y-4">
                    {formData.media_web_preview && (
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="mb-2 text-sm text-gray-600">
                          Current Image:
                        </div>
                        <img
                          src={formData.media_web_preview}
                          alt="Web preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      name="media_web"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500">
                      Recommended size: 1920x800px (16:7 ratio)
                    </p>
                  </div>
                </div>

                {/* Mobile Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Mobile Image
                  </label>
                  <div className="space-y-4">
                    {formData.media_mobile_preview && (
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="mb-2 text-sm text-gray-600">
                          Current Image:
                        </div>
                        <img
                          src={formData.media_mobile_preview}
                          alt="Mobile preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <input
                      type="file"
                      name="media_mobile"
                      onChange={handleInputChange}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                    />
                    <p className="text-xs text-gray-500">
                      Recommended size: 768x1000px (portrait)
                    </p>
                  </div>
                </div>
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
                      {heroData?.id
                        ? "Update Hero Section"
                        : "Create Hero Section"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Last Updated Info */}
        {heroData?.updated_at && (
          <div className="mt-6 text-sm text-gray-500">
            Last updated: {new Date(heroData.updated_at).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleAboutHero;
