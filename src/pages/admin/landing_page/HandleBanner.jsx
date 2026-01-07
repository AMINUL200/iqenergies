import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";
import { api } from "../../../utils/app";
import AdminLoader from "../../../component/admin/AdminLoader";
import DataTable from "react-data-table-component";

const HandleBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    title_meta: "",
    description: "",
    desc_meta: "",
    button_name: "",
    button_url: "",
    web_image_alt: "",
    mobile_image_alt: "",
    status: 1,
    sort_order: 1,
    web_image: null,
    mobile_image: null,
    web_image_preview: "",
    mobile_image_preview: "",
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/banners");
      console.log("banner data: ", response.data);
      setBanners(response.data.data);
    } catch (err) {
      setError("Failed to fetch banners. Please try again.");
      console.error("Error fetching banners:", err);
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

  const handleEdit = (banner) => {
    setFormData({
      title: banner.title || "",
      title_meta: banner.title_meta || "",
      description: banner.description || "",
      desc_meta: banner.desc_meta || "",
      button_name: banner.button_name || "",
      button_url: banner.button_url || "",
      web_image_alt: banner.web_image_alt || "",
      mobile_image_alt: banner.mobile_image_alt || "",
      status: banner.status || 0,
      sort_order: banner.sort_order || 1,
      web_image: null,
      mobile_image: null,
      web_image_preview: banner.web_image_url || "",
      mobile_image_preview: banner.mobile_image_url || "",
    });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setFormData({
      title: "",
      title_meta: "",
      description: "",
      desc_meta: "",
      button_name: "",
      button_url: "",
      web_image_alt: "",
      mobile_image_alt: "",
      status: 1,
      sort_order:
        banners.length > 0
          ? Math.max(...banners.map((b) => b.sort_order)) + 1
          : 1,
      web_image: null,
      mobile_image: null,
      web_image_preview: "",
      mobile_image_preview: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "web_image_preview" && key !== "mobile_image_preview") {
          if (formData[key] !== null) {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      if (editingId) {
        await api.post(`/admin/banners/${editingId}`, formDataToSend);
      } else {
        await api.post("admin/banners", formDataToSend);
      }

      fetchBanners();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: "",
        title_meta: "",
        description: "",
        desc_meta: "",
        button_name: "",
        button_url: "",
        web_image_alt: "",
        mobile_image_alt: "",
        status: 1,
        sort_order: 1,
        web_image: null,
        mobile_image: null,
        web_image_preview: "",
        mobile_image_preview: "",
      });
    } catch (err) {
      setError(
        `Failed to ${editingId ? "update" : "create"} banner. Please try again.`
      );
      console.error("Error submitting form:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await api.delete(`/admin/banners/${id}`);
        fetchBanners();
      } catch (err) {
        setError("Failed to delete banner. Please try again.");
        console.error("Error deleting banner:", err);
      }
    }
  };

  const handleSortOrder = async (id, direction) => {
    try {
      await api.put(`/banners/${id}/sort`, { direction });
      fetchBanners();
    } catch (err) {
      setError("Failed to update sort order. Please try again.");
      console.error("Error updating sort order:", err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await api.put(`/banners/${id}/status`, {
        status: currentStatus === 1 ? 0 : 1,
      });
      fetchBanners();
    } catch (err) {
      setError("Failed to update status. Please try again.");
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return <AdminLoader />;
  }

  const columns = [
    {
      name: "Image",
      cell: (row) => (
        <div className="w-20 h-12 rounded overflow-hidden border border-gray-200">
          {row.web_image_url ? (
            <img
              src={row.web_image_url}
              alt={row.web_image_alt || "Banner"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}
        </div>
      ),
      width: "120px",
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      grow: 2,
    },
    {
      name: "Description",
      cell: (row) => (
        <span className="text-sm text-gray-600 line-clamp-2">
          {row.description}
        </span>
      ),
      grow: 3,
    },
    {
      name: "Status",
      cell: (row) => (
        <button
          onClick={() => handleStatusToggle(row.id, row.status)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            row.status === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status === 1 ? (
            <>
              <Eye className="w-3 h-3 mr-1" /> Active
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3 mr-1" /> Inactive
            </>
          )}
        </button>
      ),
      width: "140px",
    },
    {
      name: "Sort",
      cell: (row) => (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleSortOrder(row.id, "up")}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronUp size={14} />
          </button>
          <span className="text-sm font-medium w-6 text-center">
            {row.sort_order}
          </span>
          <button
            onClick={() => handleSortOrder(row.id, "down")}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      ),
      width: "120px",
    },
    {
      name: "Created",
      selector: (row) =>
        new Date(row.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      sortable: true,
      width: "140px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
      width: "140px",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                Banner Management
              </h1>
              <p className="text-gray-600 mt-1 text-xs sm:text-sm md:text-base">
                Manage your website banners and promotions
              </p>
            </div>
            {!showForm && (
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium w-full sm:w-auto text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Add New Banner</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <div className="mb-6 sm:mb-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg md:text-xl">
                  {editingId ? "Edit Banner" : "Add New Banner"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-200 rounded-full transition-colors"
                  aria-label="Close form"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-5 lg:p-6">
              <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-1 xl:grid-cols-2 lg:gap-8">
                {/* Left Column */}
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-xs sm:text-sm md:text-base"
                      placeholder="Enter banner title"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                      Title Meta
                    </label>
                    <input
                      type="text"
                      name="title_meta"
                      value={formData.title_meta}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-xs sm:text-sm md:text-base"
                      placeholder="Enter meta title for SEO"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 resize-none text-xs sm:text-sm md:text-base"
                      placeholder="Enter banner description"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                      Description Meta
                    </label>
                    <textarea
                      name="desc_meta"
                      value={formData.desc_meta}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 resize-none text-xs sm:text-sm md:text-base"
                      placeholder="Enter meta description for SEO"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                        Button Name
                      </label>
                      <input
                        type="text"
                        name="button_name"
                        value={formData.button_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-xs sm:text-sm md:text-base"
                        placeholder="Button text"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                        Sort Order *
                      </label>
                      <input
                        type="number"
                        name="sort_order"
                        value={formData.sort_order}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 text-xs sm:text-sm md:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                      Button URL
                    </label>
                    <input
                      type="url"
                      name="button_url"
                      value={formData.button_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-xs sm:text-sm md:text-base"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                      Web Image *
                    </label>
                    <div className="space-y-2.5 sm:space-y-3">
                      {formData.web_image_preview && (
                        <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                          <img
                            src={formData.web_image_preview}
                            alt="Web preview"
                            className="w-full h-32 sm:h-40 md:h-48 object-contain rounded"
                          />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          name="web_image"
                          onChange={handleInputChange}
                          accept="image/*"
                          className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 text-xs sm:text-sm md:text-base file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 1920×600px, JPG/PNG
                        </p>
                      </div>
                      <input
                        type="text"
                        name="web_image_alt"
                        value={formData.web_image_alt}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-xs sm:text-sm md:text-base"
                        placeholder="Alt text for web image"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5 sm:mb-2">
                      Mobile Image
                    </label>
                    <div className="space-y-2.5 sm:space-y-3">
                      {formData.mobile_image_preview && (
                        <div className="border border-gray-300 rounded-lg p-2 bg-gray-50">
                          <img
                            src={formData.mobile_image_preview}
                            alt="Mobile preview"
                            className="w-full h-32 sm:h-40 md:h-48 object-contain rounded"
                          />
                        </div>
                      )}
                      <div>
                        <input
                          type="file"
                          name="mobile_image"
                          onChange={handleInputChange}
                          accept="image/*"
                          className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 text-xs sm:text-sm md:text-base file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: 768×1024px, JPG/PNG
                        </p>
                      </div>
                      <input
                        type="text"
                        name="mobile_image_alt"
                        value={formData.mobile_image_alt}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 text-xs sm:text-sm md:text-base"
                        placeholder="Alt text for mobile image"
                      />
                    </div>
                  </div>

                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <label className="flex items-center justify-between cursor-pointer p-2.5 sm:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-2.5 sm:space-x-3">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="status"
                            checked={formData.status === 1}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div
                            className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors ${
                              formData.status === 1
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          ></div>
                          <div
                            className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform ${
                              formData.status === 1
                                ? "transform translate-x-5 sm:translate-x-6"
                                : ""
                            }`}
                          ></div>
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm font-medium text-gray-900">
                            Status
                          </span>
                          <p className="text-xs text-gray-500">
                            {formData.status === 1
                              ? "Banner will be visible on website"
                              : "Banner will be hidden"}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          formData.status === 1
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {formData.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 border border-gray-300 rounded-lg text-gray-900 bg-white hover:bg-gray-50 transition-colors font-medium text-xs sm:text-sm md:text-base order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-xs sm:text-sm md:text-base order-1 sm:order-2"
                >
                  {editingId ? "Update Banner" : "Create Banner"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Banners List Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900 sm:text-lg md:text-xl">
                  Banners List
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm mt-1">
                  {banners.length} banner(s) found
                </p>
              </div>
              {!showForm && banners.length > 0 && (
                <button
                  onClick={handleAddNew}
                  className="flex items-center justify-center space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-xs sm:text-sm mt-3 sm:mt-0"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Add New</span>
                </button>
              )}
            </div>
          </div>

          {banners.length === 0 ? (
            <div className="p-6 sm:p-8 md:p-12 text-center">
              <div className="text-gray-400 text-sm sm:text-base mb-4">
                No banners found
              </div>
              <button
                onClick={handleAddNew}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm sm:text-base"
              >
                Create Your First Banner
              </button>
            </div>
          ) : (
            <div className="p-4">
              <DataTable
                columns={columns}
                data={banners}
                pagination
                highlightOnHover
                responsive
                persistTableHead
                noHeader
                defaultSortFieldId={6}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandleBanner;
