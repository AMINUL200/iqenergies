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
} from "lucide-react";
import { api } from "../../../utils/app";
import AdminLoader from "../../../component/admin/AdminLoader";
import DataTable from "react-data-table-component";

const HandleWhatWeDoList = () => {
  const [whatWeDoList, setWhatWeDoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sort_order: 1,
    is_active: "1",
  });

  // Fetch what we do list on component mount
  useEffect(() => {
    fetchWhatWeDoList();
  }, []);

  const fetchWhatWeDoList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/admin/what-we-do-items");
      setWhatWeDoList(response.data.data || []);
      console.log("Fetched what we do list:", response.data.data);
    } catch (err) {
      setError('Failed to fetch "What We Do" list. Please try again.');
      console.error("Error fetching what we do list:", err);
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

  const handleAddNew = () => {
    const maxSortOrder =
      whatWeDoList.length > 0
        ? Math.max(...whatWeDoList.map((item) => item.sort_order))
        : 0;

    setFormData({
      title: "",
      description: "",
      sort_order: maxSortOrder + 1,
      is_active: "1",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      description: item.description || "",
      sort_order: item.sort_order || 1,
      is_active: item.is_active ? "1" : "0",
    });
    setEditingId(item.id);
    setShowForm(true);
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
      const endpoint = editingId
        ? `/admin/what-we-do-items/${editingId}`
        : "/admin/what-we-do-items";

      const method = editingId ? "post" : "post";

      const response = await api[method](endpoint, formDataToSend);

      if (response.data.success) {
        setSuccess(`Item ${editingId ? "updated" : "created"} successfully!`);
        // Refresh list and reset form
        fetchWhatWeDoList();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          title: "",
          description: "",
          sort_order: 1,
          is_active: "1",
        });
      } else {
        setError(
          response.data.message ||
            `Failed to ${
              editingId ? "update" : "create"
            } item. Please try again.`
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        `Failed to ${editingId ? "update" : "create"} item. Please try again.`;
      setError(errorMessage);
      console.error("Error saving item:", err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      setError(null);
      await api.delete(`/admin/what-we-do-items/${id}`);
      setSuccess("Item deleted successfully!");
      fetchWhatWeDoList();

      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError("Failed to delete item. Please try again.");
      console.error("Error deleting item:", err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      await api.put(`/admin/about/what-we-do/${id}/status`, {
        is_active: currentStatus === 1 ? 0 : 1,
      });
      setSuccess("Status updated successfully!");
      fetchWhatWeDoList();

      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError("Failed to update status. Please try again.");
      console.error("Error updating status:", err);
    }
  };

  const handleSortOrder = async (id, direction) => {
    try {
      setError(null);
      await api.put(`/admin/about/what-we-do/${id}/sort`, { direction });
      setSuccess("Sort order updated!");
      fetchWhatWeDoList();

      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError("Failed to update sort order. Please try again.");
      console.error("Error updating sort order:", err);
    }
  };

  if (loading) {
    return <AdminLoader />;
  }

  const columns = [
    {
      name: "Sort",
      cell: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSortOrder(row.id, "up")}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronUp size={14} />
          </button>
          <span className="text-sm font-medium w-8 text-center">
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
      width: "140px",
    },
    {
      name: "ID",
      selector: (row) => `#${row.id}`,
      sortable: true,
      width: "90px",
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
        <span className="text-sm text-gray-600">
          {row.description.length > 120
            ? row.description.slice(0, 120) + "..."
            : row.description}
        </span>
      ),
      grow: 3,
    },
    {
      name: "Status",
      cell: (row) => (
        <button
          onClick={() => handleStatusToggle(row.id, row.is_active)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            row.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.is_active ? (
            <>
              <Eye size={12} className="mr-1" /> Active
            </>
          ) : (
            <>
              <EyeOff size={12} className="mr-1" /> Inactive
            </>
          )}
        </button>
      ),
      width: "140px",
    },
    {
      name: "Created",
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      sortable: true,
      width: "140px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 hover:bg-gray-100 rounded-lg"
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">What We Do List</h1>
          <p className="text-gray-600 mt-2">
            Manage services and solutions for the "What We Do" section
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

        {/* Top Section - Form or Add Button */}
        <div className="mb-8">
          {showForm ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? "Edit Item" : "Add New Item"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      title: "",
                      description: "",
                      sort_order: 1,
                      is_active: "1",
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
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
                        placeholder="e.g., Solar Power Solutions"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Service or solution title
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Sort Order *
                      </label>
                      <input
                        type="number"
                        name="sort_order"
                        value={formData.sort_order}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Lower numbers appear first
                      </p>
                    </div>

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

                  {/* Right Column */}
                  <div className="space-y-6">
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
                        placeholder="Detailed description of the service or solution"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Preview
                  </h3>
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900 mb-2">
                            {formData.title || "Item Title"}
                          </h4>
                          <p className="text-gray-600">
                            {formData.description ||
                              "Item description will appear here..."}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <div
                            className={`text-xs font-medium px-3 py-1 rounded-full ${
                              formData.is_active === "1"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {formData.is_active === "1" ? "Active" : "Inactive"}
                          </div>
                          <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Order: {formData.sort_order}
                          </div>
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
                        title: "",
                        description: "",
                        sort_order: 1,
                        is_active: "1",
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
                        <span>{editingId ? "Update Item" : "Create Item"}</span>
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
              <span>Add New Item</span>
            </button>
          )}
        </div>

        {/* Bottom Section - List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              What We Do List
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {whatWeDoList.length} item(s) found •{" "}
              {whatWeDoList.filter((item) => item.is_active).length} active
            </p>
          </div>

          {whatWeDoList.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">No items found</div>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
              >
                Create Your First Item
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto ">
              <DataTable
                columns={columns}
                data={whatWeDoList}
                pagination
                highlightOnHover
                responsive
                persistTableHead
                defaultSortFieldId={2}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HandleWhatWeDoList;
