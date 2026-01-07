import React, { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  X,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import { api } from "../../../utils/app";
import AdminLoader from "../../../component/admin/AdminLoader";

const HandleServicesFeature = () => {
  const [serviceReviews, setServiceReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    heading: "",
    highlighted_text: "",
    heading_meta: "",
    description: "",
    heading2: "",
    description2: "",
    web_image_alt: "",
    mobile_image_alt: "",
    web_image: null,
    mobile_image: null,
    web_image_preview: "",
    mobile_image_preview: "",
    is_active: 1,
  });

  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [showFeatureList, setShowFeatureList] = useState(false);

  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const [features, setFeatures] = useState([]);
  const [featureLoading, setFeatureLoading] = useState(false);

  const [featureForm, setFeatureForm] = useState({
    service_overview_id: "",
    title: "",
    description: "",
  });

  // Fetch service reviews on component mount
  useEffect(() => {
    fetchServiceReviews();
  }, []);

  const fetchServiceReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/service-overview-list");
      setServiceReviews(response.data.data || []);
      console.log("Fetched service reviews:", response.data.data);
    } catch (err) {
      setError("Failed to fetch service reviews. Please try again.");
      console.error("Error fetching service reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      if (name === "web_image") {
        setFormData((prev) => ({
          ...prev,
          web_image: file,
          web_image_preview: previewUrl,
        }));
      } else if (name === "mobile_image") {
        setFormData((prev) => ({
          ...prev,
          mobile_image: file,
          mobile_image_preview: previewUrl,
        }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked ? 1 : 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddNew = () => {
    setFormData({
      heading: "",
      highlighted_text: "",
      heading_meta: "",
      description: "",
      heading2: "",
      description2: "",
      web_image_alt: "",
      mobile_image_alt: "",
      web_image: null,
      mobile_image: null,
      web_image_preview: "",
      mobile_image_preview: "",
      is_active: 1,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (review) => {
    setFormData({
      heading: review.heading || "",
      highlighted_text: review.highlighted_text || "",
      heading_meta: review.heading_meta || "",
      description: review.description || "",
      heading2: review.heading2 || "",
      description2: review.description2 || "",
      web_image_alt: review.web_image_alt || "",
      mobile_image_alt: review.mobile_image_alt || "",
      web_image: null,
      mobile_image: null,
      web_image_preview: review.web_image_url || "",
      mobile_image_preview: review.mobile_image_url || "",
      is_active: review.is_active ? 1 : 0,
    });
    setEditingId(review.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const formDataToSend = new FormData();

      // Append all form fields except preview URLs and null values
      Object.keys(formData).forEach((key) => {
        if (
          !key.includes("_preview") &&
          formData[key] !== null &&
          formData[key] !== ""
        ) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Log form data for debugging
      console.log(
        "Form data to send:",
        Object.fromEntries(formDataToSend.entries())
      );

      // Use POST for both create and update
      const endpoint = editingId
        ? `/admin/service-overview/${editingId}`
        : "/admin/service-overview";

      const method = editingId ? "post" : "post";

      const response = await api[method](endpoint, formDataToSend);

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            `Service review ${editingId ? "updated" : "created"} successfully!`
        );

        // Refresh service reviews list and reset form
        await fetchServiceReviews();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          heading: "",
          highlighted_text: "",
          heading_meta: "",
          description: "",
          heading2: "",
          description2: "",
          web_image_alt: "",
          mobile_image_alt: "",
          web_image: null,
          mobile_image: null,
          web_image_preview: "",
          mobile_image_preview: "",
          is_active: 1,
        });

        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      } else {
        setError(
          response.data.message ||
            `Failed to ${editingId ? "update" : "create"} service review.`
        );
      }
    } catch (err) {
      console.error("Error saving service review:", err.response?.data || err);

      // Handle validation errors
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        let errorMessage = "Validation failed:\n";

        Object.keys(errors).forEach((key) => {
          errorMessage += `${key}: ${errors[key].join(", ")}\n`;
        });

        setError(errorMessage);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          `Failed to ${
            editingId ? "update" : "create"
          } service review. Please try again.`;
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this service review?")
    ) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(`/admin/service-overview/${id}`);

      if (response.data.success) {
        setSuccess("Service review deleted successfully!");
        await fetchServiceReviews();

        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      } else {
        setError(response.data.message || "Failed to delete service review.");
      }
    } catch (err) {
      setError("Failed to delete service review. Please try again.");
      console.error("Error deleting service review:", err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      const response = await api.put(`/admin/service-reviews/${id}/status`, {
        is_active: currentStatus ? false : true,
      });

      if (response.data.success) {
        setSuccess("Status updated successfully!");
        await fetchServiceReviews();

        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to update status.");
      }
    } catch (err) {
      setError("Failed to update status. Please try again.");
      console.error("Error updating status:", err);
    }
  };

  const handleAddFeature = (review) => {
    setFeatureForm({
      service_overview_id: review.id,
      title: "",
      description: "",
    });

    setSelectedServiceId(review.id);
    setShowFeatureForm(true);
    setShowFeatureList(false);
  };

  const handleViewFeatures = async (review) => {
    try {
      setFeatureLoading(true);
      setSelectedServiceId(review.id);

      const res = await api.get(`/admin/service-features/${review.id}`);

      setFeatures(res.data.data || []);
      setShowFeatureList(true);
      setShowFeatureForm(false);
    } catch (err) {
      setError("Failed to load features");
    } finally {
      setFeatureLoading(false);
    }
  };

  const handleFeatureSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/admin/service-features/${editingId}`, featureForm);
        setSuccess("Feature updated successfully");
      } else {
        await api.post("/admin/service-features", featureForm);
        setSuccess("Feature added successfully");
      }

      setEditingId(null);
      setShowFeatureForm(false);

      handleViewFeatures({ id: featureForm.service_overview_id });
    } catch (err) {
      setError("Failed to save feature");
    }
  };

  const handleEditFeature = (feature) => {
    setFeatureForm({
      service_overview_id: feature.service_overview_id,
      title: feature.title,
      description: feature.description,
    });

    setEditingId(feature.id);
    setShowFeatureForm(true);
    setShowFeatureList(false);
  };

  const handleDeleteFeature = async (id) => {
    if (!window.confirm("Delete this feature?")) return;

    try {
      await api.delete(`/admin/service-features/${id}`);
      setSuccess("Feature deleted successfully");

      // Reload list
      handleViewFeatures({ id: selectedServiceId });
    } catch (err) {
      setError("Failed to delete feature");
    }
  };

  if (loading) {
    return <AdminLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Service Reviews</h1>
          <p className="text-gray-600 mt-2">
            Manage service review sections for service detail pages
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 whitespace-pre-line">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 whitespace-pre-line">{error}</p>
          </div>
        )}

        {/* Top Section - Form or Add Button */}
        <div className="mb-8">
          {showForm ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? "Edit Service Review" : "Add New Service Review"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      heading: "",
                      highlighted_text: "",
                      heading_meta: "",
                      description: "",
                      heading2: "",
                      description2: "",
                      web_image_alt: "",
                      mobile_image_alt: "",
                      web_image: null,
                      mobile_image: null,
                      web_image_preview: "",
                      mobile_image_preview: "",
                      is_active: 1,
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
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
                        placeholder="e.g., Project Management"
                      />
                    </div>

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
                        placeholder="e.g., Designed for a Greener Tomorrow"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        This text will be highlighted in the design
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Heading Meta (SEO)
                      </label>
                      <input
                        type="text"
                        name="heading_meta"
                        value={formData.heading_meta}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                        placeholder="SEO meta for heading"
                      />
                    </div>

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
                        placeholder="Main description of the service"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Second Heading
                      </label>
                      <input
                        type="text"
                        name="heading2"
                        value={formData.heading2}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                        placeholder="e.g., Why Choose Us?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Second Description
                      </label>
                      <textarea
                        name="description2"
                        value={formData.description2}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                        placeholder="Additional description or benefits"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="is_active"
                            checked={formData.is_active === 1}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div
                            className={`block w-14 h-8 rounded-full ${
                              formData.is_active === 1
                                ? "bg-gray-900"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <div
                            className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                              formData.is_active === 1
                                ? "transform translate-x-6"
                                : ""
                            }`}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formData.is_active === 1
                            ? "Active (Visible on site)"
                            : "Inactive (Hidden on site)"}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Images
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Web Image */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Web Image
                        </label>
                        <div className="space-y-3">
                          {formData.web_image_preview && (
                            <div className="border border-gray-200 rounded-lg p-3">
                              <div className="mb-2 text-sm text-gray-600">
                                Current Image:
                              </div>
                              <img
                                src={formData.web_image_preview}
                                alt="Web preview"
                                className="w-full h-40 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            name="web_image"
                            onChange={handleInputChange}
                            accept="image/*"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                          />
                          <input
                            type="text"
                            name="web_image_alt"
                            value={formData.web_image_alt}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="Alt text for web image"
                          />
                          <p className="text-xs text-gray-500">
                            Recommended size: 1200x800px
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Image */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Mobile Image
                        </label>
                        <div className="space-y-3">
                          {formData.mobile_image_preview && (
                            <div className="border border-gray-200 rounded-lg p-3">
                              <div className="mb-2 text-sm text-gray-600">
                                Current Image:
                              </div>
                              <img
                                src={formData.mobile_image_preview}
                                alt="Mobile preview"
                                className="w-full h-40 object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            name="mobile_image"
                            onChange={handleInputChange}
                            accept="image/*"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                          />
                          <input
                            type="text"
                            name="mobile_image_alt"
                            value={formData.mobile_image_alt}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="Alt text for mobile image"
                          />
                          <p className="text-xs text-gray-500">
                            Recommended size: 600x800px (portrait)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        heading: "",
                        highlighted_text: "",
                        heading_meta: "",
                        description: "",
                        heading2: "",
                        description2: "",
                        web_image_alt: "",
                        mobile_image_alt: "",
                        web_image: null,
                        mobile_image: null,
                        web_image_preview: "",
                        mobile_image_preview: "",
                        is_active: 1,
                      });
                    }}
                    className="px-6 py-3 border border-gray-200 rounded-lg text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                          {editingId
                            ? "Update Service Review"
                            : "Create Service Review"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={handleAddNew}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Service Review</span>
            </button>
          )}

          {showFeatureForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 mt-4 border">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingId ? "Edit Service Feature" : "Add Service Feature"}
                </h2>

                <button
                  onClick={() => {
                    setShowFeatureForm(false);
                    setFeatureForm({
                      service_overview_id: "",
                      title: "",
                      description: "",
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleFeatureSubmit} className="space-y-4">
                {/* Service Overview Select */}
                <select
                  value={featureForm.service_overview_id}
                  disabled
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100"
                >
                  {serviceReviews.map((sr) => (
                    <option key={sr.id} value={sr.id}>
                      {sr.heading}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Feature Title"
                  value={featureForm.title}
                  onChange={(e) =>
                    setFeatureForm({ ...featureForm, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border rounded-lg"
                />

                <textarea
                  placeholder="Feature Description"
                  value={featureForm.description}
                  onChange={(e) =>
                    setFeatureForm({
                      ...featureForm,
                      description: e.target.value,
                    })
                  }
                  required
                  className="w-full px-4 py-3 border rounded-lg"
                />

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFeatureForm(false);
                      setFeatureForm({
                        service_overview_id: "",
                        title: "",
                        description: "",
                      });
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg"
                  >
                    Save Feature
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Section - Service Reviews List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Service Reviews List
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {serviceReviews.length} review(s) found •{" "}
              {serviceReviews.filter((r) => r.is_active).length} active
            </p>
          </div>

          {serviceReviews.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">No service reviews found</div>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
              >
                Create Your First Service Review
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Heading
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Highlighted Text
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {serviceReviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{review.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {review.heading}
                        </div>
                        {review.slug && (
                          <div className="text-xs text-gray-500 font-mono">
                            /{review.slug}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs">
                          {review.highlighted_text || "No highlighted text"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md">
                          {review.description.length > 100
                            ? `${review.description.substring(0, 100)}...`
                            : review.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {review.web_image_url ? (
                            <div className="relative group">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                              <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs px-2 py-1 rounded -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                Web image available
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">
                              No web image
                            </div>
                          )}
                          {review.mobile_image_url && (
                            <div className="relative group">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                              <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs px-2 py-1 rounded -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                Mobile image available
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleStatusToggle(review.id, review.is_active)
                          }
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            review.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {review.is_active ? (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(review.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAddFeature(review)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Add Feature"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleViewFeatures(review)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                            title="View Features"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleEdit(review)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showFeatureList && (
          <div className="bg-white rounded-xl shadow-lg mt-10 border">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Service Features</h2>

                <button
                  onClick={() => {
                    setShowFeatureList(false);
                    setFeatures([]);
                    setSelectedServiceId(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {featureLoading ? (
              <div className="p-6 text-center">Loading...</div>
            ) : features.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No features found
              </div>
            ) : (
              <ul className="divide-y">
                {features.map((feature) => (
                  <li
                    key={feature.id}
                    className="p-6 flex justify-between items-start gap-4"
                  >
                    <div>
                      <h4 className="font-semibold">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditFeature(feature)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit Feature"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete Feature"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleServicesFeature;
