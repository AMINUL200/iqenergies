import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { api } from "../../../utils/app";
import AdminLoader from "../../../component/admin/AdminLoader";

const HandleWhoWeAre = () => {
  const [whoWeAreData, setWhoWeAreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    title_meta: "",
    description: "",
    description_meta: "",
    is_active: "1",
  });

  // Fetch who we are data on component mount
  useEffect(() => {
    fetchWhoWeAreData();
  }, []);

  const fetchWhoWeAreData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/about/who-we-are");
      setWhoWeAreData(response.data.data);
      console.log("Fetched who we are data:", response.data.data);

      // Populate form with existing data
      if (response.data.data) {
        setFormData({
          title: response.data.data.title || "",
          title_meta: response.data.data.title_meta || "",
          description: response.data.data.description || "",
          description_meta: response.data.data.description_meta || "",
          is_active: response.data.data.is_active ? "1" : "0",
        });
      }
    } catch (err) {
      setError('Failed to fetch "Who We Are" section data. Please try again.');
      console.error("Error fetching who we are data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
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
        const value = formData[key];

        // Always send all fields including is_active
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
      const endpoint = `/admin/about/who-we-are/${whoWeAreData?.id}`;

      const response = await api.post(endpoint, formDataToSend);

      if (response.data.status) {
        // Refresh data
        fetchWhoWeAreData();
        setSuccess(
          response.data.message || '"Who We Are" section saved successfully!'
        );
      }else{
        setError(
          response.data.message || 'Failed to save "Who We Are" section. Please try again.'
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save "Who We Are" section. Please try again.';
      setError(errorMessage);
      console.error(
        "Error saving who we are section:",
        err.response?.data || err
      );
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
            Who We Are Section
          </h1>
          <p className="text-gray-600 mt-2">
            Manage the "Who We Are" content for the About Us page
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
              "Who We Are" Section Configuration
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {whoWeAreData?.id
                ? `Editing existing section (ID: ${whoWeAreData.id})`
                : "Create new section"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Main Content */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="e.g., Who We Are"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Main heading for the section
                  </p>
                </div>

                {/* Title Meta */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Title Meta (SEO)
                  </label>
                  <textarea
                    name="title_meta"
                    value={formData.title_meta}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Meta title for SEO"
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

              {/* Right Column - Description */}
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
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Main description text for the section"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Detailed description about your company
                  </p>
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
                      {whoWeAreData?.id ? "Update Section" : "Create Section"}
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

export default HandleWhoWeAre;
