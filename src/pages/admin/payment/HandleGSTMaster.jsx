import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Search,
  Package,
  Percent,
  Hash,
} from "lucide-react";
import AdminLoader from "../../../component/admin/AdminLoader";
import { api } from "../../../utils/app";

const HandleGSTMaster = () => {
  const [gstRates, setGstRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    hsn_code: "",
    description: "",
    gst_rate: "",
    is_active: true,
  });

  // Fetch GST rates on component mount
  useEffect(() => {
    fetchGstRates();
  }, []);

  const fetchGstRates = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/gst-rates");
      setGstRates(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch GST rates. Please try again.");
      console.error("Error fetching GST rates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "gst_rate") {
      // Validate GST rate (0-100 with optional decimal)
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        const numValue = parseFloat(value);
        if (value === "" || (numValue >= 0 && numValue <= 100)) {
          setFormData((prev) => ({
            ...prev,
            [name]: value,
          }));
        }
      }
    } else if (name === "hsn_code") {
      // HSN code validation (numbers only, 4-8 digits)
      if (value === "" || /^[0-9]{0,8}$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddNew = () => {
    setFormData({
      hsn_code: "",
      description: "",
      gst_rate: "",
      is_active: true,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (gstRate) => {
    setFormData({
      hsn_code: gstRate.hsn_code,
      description: gstRate.description,
      gst_rate: gstRate.gst_rate,
      is_active: gstRate.is_active === 1 || gstRate.is_active === true,
    });
    setEditingId(gstRate.id);
    setShowForm(true);
  };

  const validateForm = () => {
    if (!formData.hsn_code.trim()) {
      setError("HSN Code is required");
      return false;
    }
    
    if (formData.hsn_code.length < 4) {
      setError("HSN Code must be at least 4 digits");
      return false;
    }
    
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    
    if (!formData.gst_rate) {
      setError("GST Rate is required");
      return false;
    }
    
    const gstRate = parseFloat(formData.gst_rate);
    if (gstRate < 0 || gstRate > 100) {
      setError("GST Rate must be between 0 and 100");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const data = {
        hsn_code: formData.hsn_code.trim(),
        description: formData.description.trim(),
        gst_rate: formData.gst_rate,
        is_active: formData.is_active ? 1 : 0,
      };

      const method = editingId ? "put" : "post";
      const endpoint = editingId
        ? `/admin/gst-rates/${editingId}`
        : `/admin/gst-rates`;

      const response = await api[method](endpoint, data);

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            `GST Rate ${editingId ? "updated" : "created"} successfully!`
        );

        await fetchGstRates();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          hsn_code: "",
          description: "",
          gst_rate: "",
          is_active: true,
        });

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(
          response.data.message ||
            `Failed to ${editingId ? "update" : "create"} GST Rate.`
        );
      }
    } catch (err) {
      console.error("Error saving GST rate:", err.response?.data || err);

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
          } GST Rate. Please try again.`;
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this GST Rate?")) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(`/admin/gst-rates/${id}`);

      if (response.data.success) {
        setSuccess("GST Rate deleted successfully!");
        await fetchGstRates();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to delete GST Rate.");
      }
    } catch (err) {
      setError("Failed to delete GST Rate. Please try again.");
      console.error("Error deleting GST rate:", err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      const response = await api.put(`/admin/gst-rates/${id}/status`, {
        is_active: !currentStatus,
      });

      if (response.data.success) {
        setSuccess("Status updated successfully!");
        await fetchGstRates();

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

  // Filter GST rates based on search term
  const filteredGstRates = gstRates.filter((rate) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      rate.hsn_code.toLowerCase().includes(searchLower) ||
      rate.description.toLowerCase().includes(searchLower) ||
      rate.gst_rate.toLowerCase().includes(searchLower)
    );
  });

  // Calculate statistics
  const activeCount = gstRates.filter(rate => rate.is_active === 1 || rate.is_active === true).length;
  const uniqueGstRates = [...new Set(gstRates.map(rate => rate.gst_rate))];

  if (loading) {
    return <AdminLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            GST Rate Master
          </h1>
          <p className="text-gray-600 mt-2">
            Manage HSN codes, descriptions, and GST rates for products
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

        {/* Top Section - Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingId ? "Edit GST Rate" : "Add New GST Rate"}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    hsn_code: "",
                    description: "",
                    gst_rate: "",
                    is_active: true,
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* HSN Code */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  HSN Code *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="hsn_code"
                    value={formData.hsn_code}
                    onChange={handleInputChange}
                    required
                    maxLength={8}
                    className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Enter 4-8 digit HSN code"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  4-8 digit numerical code (e.g., 999084 for Solar Street Light)
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Package className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Enter product/service description"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Detailed description of the product or service
                </p>
              </div>

              {/* GST Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  GST Rate (%) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Percent className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="gst_rate"
                    value={formData.gst_rate}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Enter GST rate (0-100)"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Enter GST rate percentage (0-100)
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
                        ? "This GST rate will be available for use"
                        : "This GST rate will be hidden"}
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
                      hsn_code: "",
                      description: "",
                      gst_rate: "",
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
                      <span>{editingId ? "Update GST Rate" : "Create GST Rate"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bottom Section - GST Rates List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">GST Rates</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {gstRates.length} rate(s) found • {activeCount} active • {uniqueGstRates.length} unique rates
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by HSN or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent w-full md:w-64"
                  />
                </div>

                {/* Add New Button - Only show when form is not visible */}
                {!showForm && (
                  <button
                    onClick={handleAddNew}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredGstRates.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                {searchTerm ? "No matching GST rates found" : "No GST rates found"}
              </div>
              {!showForm && (
                <button
                  onClick={handleAddNew}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
                >
                  Create Your First GST Rate
                </button>
              )}
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
                      HSN Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      GST Rate
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
                  {filteredGstRates.map((rate) => {
                    const isActive = rate.is_active === 1 || rate.is_active === true;
                    
                    return (
                      <tr key={rate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{rate.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 font-mono">
                            {rate.hsn_code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {rate.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {rate.gst_rate}%
                            </div>
                            <div className={`ml-2 w-2 h-2 rounded-full ${
                              parseFloat(rate.gst_rate) <= 5 ? 'bg-green-500' :
                              parseFloat(rate.gst_rate) <= 12 ? 'bg-blue-500' :
                              parseFloat(rate.gst_rate) <= 18 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleStatusToggle(rate.id, isActive)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              isActive
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            {isActive ? (
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
                          {new Date(rate.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(rate.updated_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(rate)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(rate.id)}
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

export default HandleGSTMaster;