import React, { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  EyeOff,
  FileText,
  Award,
  Upload,
  Download,
  File,
} from "lucide-react";
import AdminLoader from "../../../component/admin/AdminLoader";
import { api } from "../../../utils/app";

const HandleBrochureCertification = () => {
  const [items, setItems] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfSaving, setPdfSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showPdfForm, setShowPdfForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pdfEditingId, setPdfEditingId] = useState(null);
  const [selectedType, setSelectedType] = useState("brochure");
  const [formData, setFormData] = useState({
    type: "brochure",
    title: "",
    title_meta: "",
    description: "",
    description_meta: "",
    is_active: true,
  });
  const [pdfFormData, setPdfFormData] = useState({
    type: "brochure",
    title: "",
    pdf: null,
    is_active: true,
  });

  // Fetch items on component mount
  useEffect(() => {
    fetchItems();
    fetchPdfs();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/brochure-certification-heroes");
      setItems(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch items. Please try again.");
      console.error("Error fetching items:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPdfs = async (type = null) => {
    try {
      setPdfLoading(true);
      let endpoint = "/admin/brochure-certification-files";
      if (type) {
        endpoint += `?type=${type}`;
      }
      const response = await api.get(endpoint);
      setPdfs(response.data.data || []);
    } catch (err) {
      console.error("Error fetching PDFs:", err);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePdfInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "pdf" && files && files[0]) {
      setPdfFormData((prev) => ({
        ...prev,
        pdf: files[0],
      }));
    } else if (type === "checkbox") {
      setPdfFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setPdfFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddNew = () => {
    setFormData({
      type: "brochure",
      title: "",
      title_meta: "",
      description: "",
      description_meta: "",
      is_active: true,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleAddNewPdf = () => {
    setPdfFormData({
      type: selectedType,
      title: "",
      pdf: null,
      is_active: true,
    });
    setPdfEditingId(null);
    setShowPdfForm(true);
  };

  const handleEdit = (item) => {
    setFormData({
      type: item.type || "brochure",
      title: item.title || "",
      title_meta: item.title_meta || "",
      description: item.description || "",
      description_meta: item.description_meta || "",
      is_active: item.is_active,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleEditPdf = (pdf) => {
    setPdfFormData({
      type: pdf.type,
      title: pdf.title,
      pdf: null, // Don't pre-fill the file input
      is_active: pdf.is_active,
    });
    setPdfEditingId(pdf.id);
    setShowPdfForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const data = {
        type: formData.type,
        title: formData.title.trim(),
        title_meta: formData.title_meta.trim(),
        description: formData.description.trim(),
        description_meta: formData.description_meta.trim(),
        is_active: formData.is_active,
      };

      const method = editingId ? "put" : "post";

      const endpoint = editingId
        ? `/admin/brochure-certification-heroes/${editingId}`
        : `/admin/brochure-certification-heroes`;

      const response = await api[method](endpoint, data);

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            `Item ${editingId ? "updated" : "created"} successfully!`
        );

        await fetchItems();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          type: "brochure",
          title: "",
          title_meta: "",
          description: "",
          description_meta: "",
          is_active: true,
        });

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(
          response.data.message ||
            `Failed to ${editingId ? "update" : "create"} item.`
        );
      }
    } catch (err) {
      console.error("Error saving item:", err.response?.data || err);

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
          } item. Please try again.`;
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();

    try {
      setPdfSaving(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("type", pdfFormData.type);
      formData.append("title", pdfFormData.title.trim());
      formData.append("is_active", pdfFormData.is_active ? "1" : "0");
      
      if (pdfFormData.pdf) {
        formData.append("pdf", pdfFormData.pdf);
      }

      const method = pdfEditingId ? "post" : "post";
      const endpoint = pdfEditingId
        ? `/admin/brochure-certification-files/${pdfEditingId}`
        : `/admin/brochure-certification-files`;

      const response = await api[method](endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            `PDF ${pdfEditingId ? "updated" : "uploaded"} successfully!`
        );

        await fetchPdfs();
        setShowPdfForm(false);
        setPdfEditingId(null);
        setPdfFormData({
          type: selectedType,
          title: "",
          pdf: null,
          is_active: true,
        });

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(
          response.data.message ||
            `Failed to ${pdfEditingId ? "update" : "upload"} PDF.`
        );
      }
    } catch (err) {
      console.error("Error saving PDF:", err.response?.data || err);

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
            pdfEditingId ? "update" : "upload"
          } PDF. Please try again.`;
        setError(errorMessage);
      }
    } finally {
      setPdfSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(
        `/admin/brochure-certification-delete/${id}`
      );

      if (response.data.success) {
        setSuccess("Item deleted successfully!");
        await fetchItems();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to delete item.");
      }
    } catch (err) {
      setError("Failed to delete item. Please try again.");
      console.error("Error deleting item:", err);
    }
  };

  const handleDeletePdf = async (id) => {
    if (!window.confirm("Are you sure you want to delete this PDF?")) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(
        `/admin/brochure-certification-files/${id}`
      );

      if (response.data.success) {
        setSuccess("PDF deleted successfully!");
        await fetchPdfs();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to delete PDF.");
      }
    } catch (err) {
      setError("Failed to delete PDF. Please try again.");
      console.error("Error deleting PDF:", err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      const response = await api.put(
        `/admin/brochure-certification-status/${id}`,
        {
          is_active: !currentStatus,
        }
      );

      if (response.data.success) {
        setSuccess("Status updated successfully!");
        await fetchItems();

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

  const handlePdfStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      const response = await api.put(
        `/admin/brochure-certification-files/${id}/status`,
        {
          is_active: !currentStatus,
        }
      );

      if (response.data.success) {
        setSuccess("PDF status updated successfully!");
        await fetchPdfs();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to update PDF status.");
      }
    } catch (err) {
      setError("Failed to update PDF status. Please try again.");
      console.error("Error updating PDF status:", err);
    }
  };

  // Get icon based on type
  const getTypeIcon = (type) => {
    return type === "certification" ? Award : FileText;
  };

  // Get type display name
  const getTypeDisplayName = (type) => {
    return type === "certification" ? "Certification" : "Brochure";
  };

  // Get type color
  const getTypeColor = (type) => {
    return type === "certification"
      ? "text-blue-600 bg-blue-100 border-blue-200"
      : "text-green-600 bg-green-100 border-green-200";
  };

  // Filter PDFs by type
  const filteredPdfs = pdfs.filter(pdf => pdf.type === selectedType);

  if (loading) {
    return <AdminLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Brochure & Certification Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage brochure and certification content and PDF files for download pages
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

        {/* Type Selection Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setSelectedType("brochure")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedType === "brochure"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Brochures
            </button>
            <button
              onClick={() => setSelectedType("certification")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedType === "certification"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Award className="w-5 h-5 inline mr-2" />
              Certifications
            </button>
          </div>
        </div>

        {/* Top Section - Hero Content Management */}
        <div className="mb-8">
          {showForm ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? "Edit Content" : "Add New Content"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      type: "brochure",
                      title: "",
                      title_meta: "",
                      description: "",
                      description_meta: "",
                      is_active: true,
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Type *
                  </label>
                  <div className="flex space-x-4">
                    <label
                      className={`flex items-center space-x-3 cursor-pointer border rounded-lg p-4 flex-1 ${
                        formData.type === "brochure"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value="brochure"
                        checked={formData.type === "brochure"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <FileText className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Brochure
                        </div>
                        <div className="text-sm text-gray-500">
                          Product brochure download
                        </div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center space-x-3 cursor-pointer border rounded-lg p-4 flex-1 ${
                        formData.type === "certification"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value="certification"
                        checked={formData.type === "certification"}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <Award className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Certification
                        </div>
                        <div className="text-sm text-gray-500">
                          Official certifications
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Title & Meta Title */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      placeholder="e.g., Download Our Brochure"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Main title displayed on the page
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Meta Title *
                    </label>
                    <input
                      type="text"
                      name="title_meta"
                      value={formData.title_meta}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      placeholder="e.g., Brochure Download Page"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Title for SEO and browser tab
                    </p>
                  </div>
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
                    placeholder="Detailed description of the brochure or certification"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Detailed content shown on the download page
                  </p>
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Meta Description *
                  </label>
                  <textarea
                    name="description_meta"
                    value={formData.description_meta}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="e.g., Download our comprehensive brochure"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Description for SEO and search results
                  </p>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`block w-14 h-8 rounded-full ${
                          formData.is_active ? "bg-gray-900" : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                          formData.is_active ? "transform translate-x-6" : ""
                        }`}
                      ></div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Active Status
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.is_active
                          ? "Item will be visible on site"
                          : "Item will be hidden on site"}
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        type: "brochure",
                        title: "",
                        title_meta: "",
                        description: "",
                        description_meta: "",
                        is_active: true,
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
                        <span>{editingId ? "Update Content" : "Create Content"}</span>
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
              <span>Add New Content</span>
            </button>
          )}
        </div>

        {/* PDF Management Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {getTypeDisplayName(selectedType)} PDF Files
            </h2>
            <button
              onClick={handleAddNewPdf}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
            >
              <Upload className="w-5 h-5" />
              <span>Upload PDF</span>
            </button>
          </div>

          {showPdfForm && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {pdfEditingId ? "Edit PDF" : "Upload New PDF"}
                </h3>
                <button
                  onClick={() => {
                    setShowPdfForm(false);
                    setPdfEditingId(null);
                    setPdfFormData({
                      type: selectedType,
                      title: "",
                      pdf: null,
                      is_active: true,
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handlePdfSubmit} className="space-y-6">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Type *
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setPdfFormData(prev => ({ ...prev, type: "brochure" }))}
                      className={`flex items-center space-x-3 border rounded-lg p-4 flex-1 ${
                        pdfFormData.type === "brochure"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200"
                      }`}
                    >
                      <FileText className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Brochure
                        </div>
                        <div className="text-sm text-gray-500">
                          Product brochure file
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPdfFormData(prev => ({ ...prev, type: "certification" }))}
                      className={`flex items-center space-x-3 border rounded-lg p-4 flex-1 ${
                        pdfFormData.type === "certification"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <Award className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">
                          Certification
                        </div>
                        <div className="text-sm text-gray-500">
                          Certification file
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    PDF Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={pdfFormData.title}
                    onChange={handlePdfInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="e.g., Product Brochure 2024"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Display name for the PDF file
                  </p>
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    PDF File {!pdfEditingId ? "*" : ""}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-gray-900 hover:text-gray-700">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            name="pdf"
                            accept=".pdf"
                            onChange={handlePdfInputChange}
                            required={!pdfEditingId}
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF files only
                      </p>
                      {pdfFormData.pdf && (
                        <p className="text-sm text-gray-700">
                          Selected: {pdfFormData.pdf.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={pdfFormData.is_active}
                        onChange={handlePdfInputChange}
                        className="sr-only"
                      />
                      <div
                        className={`block w-14 h-8 rounded-full ${
                          pdfFormData.is_active ? "bg-gray-900" : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                          pdfFormData.is_active ? "transform translate-x-6" : ""
                        }`}
                      ></div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        Active Status
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {pdfFormData.is_active
                          ? "PDF will be available for download"
                          : "PDF will be hidden"}
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPdfForm(false);
                      setPdfEditingId(null);
                      setPdfFormData({
                        type: selectedType,
                        title: "",
                        pdf: null,
                        is_active: true,
                      });
                    }}
                    className="px-6 py-3 border border-gray-200 rounded-lg text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={pdfSaving}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pdfSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>{pdfEditingId ? "Update PDF" : "Upload PDF"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* PDF List */}
          {pdfLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Loading PDFs...</p>
            </div>
          ) : filteredPdfs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
              <File className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <div className="text-gray-400 text-lg mb-4">No PDFs found</div>
              <p className="text-gray-500 mb-6">
                Upload your first {getTypeDisplayName(selectedType).toLowerCase()} PDF file
              </p>
              <button
                onClick={handleAddNewPdf}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
              >
                Upload First PDF
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Downloads
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPdfs.map((pdf) => {
                      const typeColor = getTypeColor(pdf.type);
                      const typeDisplayName = getTypeDisplayName(pdf.type);

                      return (
                        <tr key={pdf.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{pdf.id}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {pdf.title}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <a
                                href={pdf.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900 flex items-center"
                              >
                                <File className="w-3 h-3 mr-1" />
                                View PDF
                              </a>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeColor}`}
                            >
                              {typeDisplayName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              {pdf.download_count}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handlePdfStatusToggle(pdf.id, pdf.is_active)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                pdf.is_active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {pdf.is_active ? (
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
                            {new Date(pdf.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {new Date(pdf.updated_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <a
                                href={pdf.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => handleEditPdf(pdf)}
                                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePdf(pdf.id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section - Hero Items List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Content Items List</h2>
            <p className="text-gray-600 text-sm mt-1">
              {items.length} item(s) found •{" "}
              {items.filter((item) => item.is_active).length} active
            </p>
          </div>

          {items.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">No content items found</div>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
              >
                Create Your First Content Item
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
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Meta Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => {
                    const TypeIcon = getTypeIcon(item.type);
                    const typeColor = getTypeColor(item.type);
                    const typeDisplayName = getTypeDisplayName(item.type);

                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{item.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeColor}`}
                          >
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {typeDisplayName}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.title}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500">
                            {item.title_meta}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs">
                            {item.description.length > 100
                              ? `${item.description.substring(0, 100)}...`
                              : item.description}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Meta: {item.description_meta}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() =>
                              handleStatusToggle(item.id, item.is_active)
                            }
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              item.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.is_active ? (
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
                          {new Date(item.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(item.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandleBrochureCertification;