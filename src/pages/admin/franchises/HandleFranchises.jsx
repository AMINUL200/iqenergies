import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Play,
  FileText,
  Eye,
  EyeOff,
  Save,
  X,
  Upload,
  Video,
  RefreshCw,
  Search,
  Filter,
  Download,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "../../../utils/app";
import CustomTextEditor from "../../../component/form/TextEditor";

const HandleFranchises = () => {
  // States
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    tagline: "",
    title: "",
    highlighted_text: "",
    title_meta: "",
    description: "",
    description_meta: "",
    video: null,
    video_sitemap: "",
    pdf: null,
    pdf_alt: "",
    is_active: true,
  });

  const [previews, setPreviews] = useState({
    video: null,
    pdf: null,
  });

  const [errors, setErrors] = useState({});

  // Fetch franchises
  const fetchFranchises = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/franchises");
      if (response.data?.success) {
        setFranchises(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch franchises:", error);
      toast.error("Failed to load franchises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFranchises();
  }, []);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle file change
  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate video file
    if (fieldName === "video") {
      if (!file.type.includes("video/")) {
        setErrors((prev) => ({
          ...prev,
          video: "Please upload a valid video file",
        }));
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        // 100MB limit
        setErrors((prev) => ({
          ...prev,
          video: "Video size must be less than 100MB",
        }));
        return;
      }

      // Create video preview
      const videoUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, video: videoUrl }));
    }

    // Validate PDF file
    if (fieldName === "pdf") {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          pdf: "Please upload a valid PDF file",
        }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        setErrors((prev) => ({
          ...prev,
          pdf: "PDF size must be less than 10MB",
        }));
        return;
      }

      // For PDF preview, we'll just show the file name
      setPreviews((prev) => ({ ...prev, pdf: file.name }));
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  };

  // Handle edit
  const handleEdit = (franchise) => {
    setEditingId(franchise.id);
    setFormData({
      tagline: franchise.tagline || "",
      title: franchise.title || "",
      highlighted_text: franchise.highlighted_text || "",
      title_meta: franchise.title_meta || "",
      description: franchise.description || "",
      description_meta: franchise.description_meta || "",
      video: null,
      video_sitemap: franchise.video_sitemap || "",
      pdf: null,
      pdf_alt: franchise.pdf_alt || "",
      is_active: franchise.is_active === 1,
    });
    setPreviews({
      video: franchise.video_url || null,
      pdf: franchise.pdf_url || null,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this franchise?"))
      return;

    try {
      const response = await api.delete(`/admin/franchises/${id}`);
      if (response.data?.success) {
        toast.success("Franchise deleted successfully");
        fetchFranchises();
      }
    } catch (error) {
      console.error("Failed to delete franchise:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete franchise"
      );
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.tagline.trim()) newErrors.tagline = "Tagline is required";
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.highlighted_text.trim())
      newErrors.highlighted_text = "Highlighted text is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const formDataToSend = new FormData();

      // Append all form data
      Object.keys(formData).forEach((key) => {
        if (key === "video" && formData[key] instanceof File) {
          formDataToSend.append("video", formData[key]);
        } else if (key === "pdf" && formData[key] instanceof File) {
          formDataToSend.append("pdf", formData[key]);
        } else if (key === "is_active") {
          formDataToSend.append(key, formData[key] ? "1" : "0");
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });

      let response;
      if (editingId) {
        // Update existing franchise
        response = await api.post(
          `/admin/franchises/${editingId}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        // Create new franchise
        response = await api.post("/admin/franchises", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.data?.success) {
        toast.success(
          editingId
            ? "Franchise updated successfully!"
            : "Franchise created successfully!"
        );
        resetForm();
        fetchFranchises();
      }
    } catch (error) {
      console.error("Failed to save franchise:", error);
      toast.error(error.response?.data?.message || "Failed to save franchise");
    } finally {
      setSaving(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      tagline: "",
      title: "",
      highlighted_text: "",
      title_meta: "",
      description: "",
      description_meta: "",
      video: null,
      video_sitemap: "",
      pdf: null,
      pdf_alt: "",
      is_active: true,
    });
    setPreviews({ video: null, pdf: null });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  // Filtered franchises based on search
  const filteredFranchises = franchises.filter(
    (franchise) =>
      franchise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchise.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      franchise.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Franchise Management
              </h1>
              <p className="text-gray-600">
                Manage franchise content and media
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchFranchises}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
                Add New Franchise
              </button>
            </div>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-xl border p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit Franchise" : "Add New Franchise"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Tagline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline *
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                      errors.tagline ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter tagline"
                  />
                  {errors.tagline && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.tagline}
                    </p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Highlighted Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Highlighted Text *
                  </label>
                  <input
                    type="text"
                    name="highlighted_text"
                    value={formData.highlighted_text}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 ${
                      errors.highlighted_text
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter highlighted text"
                  />
                  {errors.highlighted_text && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.highlighted_text}
                    </p>
                  )}
                </div>

                {/* Title Meta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Meta
                  </label>
                  <input
                    type="text"
                    name="title_meta"
                    value={formData.title_meta}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Enter title meta for SEO"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>

                <div
                  className={`border rounded-lg ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <CustomTextEditor
                    value={formData.description}
                    onChange={(content) =>
                      setFormData((prev) => ({ ...prev, description: content }))
                    }
                    placeholder="Enter detailed description..."
                    height={300}
                  />
                </div>

                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Description Meta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description Meta (for SEO)
                </label>
                <textarea
                  name="description_meta"
                  value={formData.description_meta}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  placeholder="Enter meta description for SEO"
                />
              </div>

              {/* Video Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Upload
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, "video")}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload video (max 20MB)
                      </span>
                      {previews.video && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Video className="w-4 h-4" />
                            Video selected
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.video && (
                    <p className="mt-1 text-sm text-red-600">{errors.video}</p>
                  )}

                  {/* Video Preview */}
                  {previews.video && (
                    <div className="mt-4">
                      <div className="text-sm text-gray-600 mb-2">Preview:</div>
                      <video
                        src={previews.video}
                        controls
                        className="w-full rounded-lg max-h-64"
                      />
                    </div>
                  )}
                </div>

                {/* Video Sitemap URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Sitemap URL
                  </label>
                  <input
                    type="url"
                    name="video_sitemap"
                    value={formData.video_sitemap}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="https://example.com/video-sitemap"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional: URL for video sitemap
                  </p>
                </div>
              </div>

              {/* PDF Section */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF Upload
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, "pdf")}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Click to upload PDF (max 5MB)
                      </span>
                      {previews.pdf && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <FileText className="w-4 h-4" />
                            {typeof previews.pdf === "string"
                              ? previews.pdf
                              : "PDF selected"}
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.pdf && (
                    <p className="mt-1 text-sm text-red-600">{errors.pdf}</p>
                  )}
                </div>

                {/* PDF Alt Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF Alt Text
                  </label>
                  <input
                    type="text"
                    name="pdf_alt"
                    value={formData.pdf_alt}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="Alt text for PDF"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  id="is_active"
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 text-sm text-gray-700"
                >
                  Active (Visible on website)
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {editingId ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingId ? "Update Franchise" : "Create Franchise"}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search franchises by title, tagline, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Showing {filteredFranchises.length} of {franchises.length}{" "}
                franchises
              </div>
            </div>
          </div>
        </div>

        {/* Franchises List */}
        <div className="bg-white rounded-xl border overflow-hidden">
          {filteredFranchises.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No franchises found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Try a different search term"
                  : "No franchises have been created yet"}
              </p>
              {!showForm && (
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(true);
                  }}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create First Franchise
                </button>
              )}
            </div>
          ) : (
            <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left">
                      <span className="text-sm font-semibold text-gray-900">
                        Franchise Details
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-sm font-semibold text-gray-900">
                        Media
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-sm font-semibold text-gray-900">
                        Status
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-sm font-semibold text-gray-900">
                        Created
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span className="text-sm font-semibold text-gray-900">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFranchises.map((franchise) => (
                    <tr
                      key={franchise.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {franchise.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {franchise.tagline}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-md" dangerouslySetInnerHTML={{__html: franchise.description.length > 100 ? franchise.description.substring(0, 100) + "..." : franchise.description}}>
                            {/* {franchise.description.substring(0, 100)}... */}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {franchise.video_url && (
                            <a
                              href={franchise.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200"
                            >
                              <Play className="w-3 h-3" />
                              Video
                            </a>
                          )}
                          {franchise.pdf_url && (
                            <a
                              href={franchise.pdf_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200"
                            >
                              <FileText className="w-3 h-3" />
                              PDF
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            franchise.is_active === 1
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {franchise.is_active === 1 ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-600">
                          {new Date(franchise.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(franchise)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(franchise.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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
      </div>
    </div>
  );
};

export default HandleFranchises;
