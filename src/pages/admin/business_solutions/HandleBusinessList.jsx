import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Edit2, Trash2, ChevronUp, ChevronDown, X, Eye, EyeOff } from 'lucide-react';
import { api } from '../../../utils/app';
import AdminLoader from '../../../component/admin/AdminLoader';

const HandleBusinessList = () => {
  const [businessItems, setBusinessItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sort_order: 1,
    is_active: 1,
  });

  // Fetch business items on component mount
  useEffect(() => {
    fetchBusinessItems();
  }, []);

  const fetchBusinessItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/business-items');
      setBusinessItems(response.data.data || []);
      console.log('Fetched business items:', response.data.data);
    } catch (err) {
      setError('Failed to fetch business items. Please try again.');
      console.error('Error fetching business items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.checked ? '1' : '0'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddNew = () => {
    const maxSortOrder = businessItems.length > 0 
      ? Math.max(...businessItems.map(item => item.sort_order)) 
      : 0;
    
    setFormData({
      title: '',
      description: '',
      sort_order: maxSortOrder + 1,
      is_active: 1,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || '',
      description: item.description || '',
      sort_order: item.sort_order || 1,
      is_active: item.is_active ,
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

      // Create JSON data
      const data = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sort_order: parseInt(formData.sort_order),
        is_active: formData.is_active,
      };

      // Log data for debugging
      console.log('Data to send:', data);

      // Use POST for both create and update
      const endpoint = editingId 
        ? `/admin/business-items/${editingId}`
        : '/admin/business-items';
      
      const method = editingId ? 'put' : 'post';
      
      const response = await api[method](endpoint, data);

      if (response.data.success) {
        setSuccess(response.data.message || `Business item ${editingId ? 'updated' : 'created'} successfully!`);
        
        // Refresh business items list and reset form
         fetchBusinessItems();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          title: '',
          description: '',
          sort_order: 1,
          is_active: '1',
        });

       
      } else {
        setError(response.data.message || `Failed to ${editingId ? 'update' : 'create'} business item.`);
      }
    } catch (err) {
      console.error('Error saving business item:', err.response?.data || err);
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        let errorMessage = "Validation failed:\n";
        
        Object.keys(errors).forEach((key) => {
          errorMessage += `${key}: ${errors[key].join(", ")}\n`;
        });
        
        setError(errorMessage);
      } else {
        const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          `Failed to ${editingId ? 'update' : 'create'} business item. Please try again.`;
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this business item?')) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(`/admin/business-items/${id}`);
      
      if (response.data.success) {
        setSuccess('Business item deleted successfully!');
        await fetchBusinessItems();

        
      } else {
        setError(response.data.message || 'Failed to delete business item.');
      }
    } catch (err) {
      setError('Failed to delete business item. Please try again.');
      console.error('Error deleting business item:', err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      const response = await api.put(`/admin/business/list/${id}/status`, {
        is_active: currentStatus ? 0 : 1,
      });
      
      if (response.data.success) {
        setSuccess('Status updated successfully!');
        await fetchBusinessItems();

        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to update status.');
      }
    } catch (err) {
      setError('Failed to update status. Please try again.');
      console.error('Error updating status:', err);
    }
  };

  const handleSortOrder = async (id, direction) => {
    try {
      setError(null);
      const response = await api.put(`/admin/business/list/${id}/sort`, { direction });
      
      if (response.data.success) {
        setSuccess('Sort order updated!');
        await fetchBusinessItems();

        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to update sort order.');
      }
    } catch (err) {
      setError('Failed to update sort order. Please try again.');
      console.error('Error updating sort order:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Business List Items</h1>
          <p className="text-gray-600 mt-2">
            Manage business items for the Business page list section
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
                  {editingId ? 'Edit Business Item' : 'Add New Business Item'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      title: '',
                      description: '',
                      sort_order: 1,
                      is_active: '1',
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
                        placeholder="e.g., Specialized Technologies"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Business service or solution title
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
                            checked={formData.is_active === 1}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`block w-14 h-8 rounded-full ${formData.is_active === 1 ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.is_active === 1 ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formData.is_active === 1 ? 'Active (Visible on site)' : 'Inactive (Hidden on site)'}
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
                        placeholder="Detailed description of the business service or solution"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Focus on business benefits and value proposition
                      </p>
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
                        title: '',
                        description: '',
                        sort_order: 1,
                        is_active: '1',
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
                        <span>{editingId ? 'Update Business Item' : 'Create Business Item'}</span>
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
              <span>Add New Business Item</span>
            </button>
          )}
        </div>

        {/* Bottom Section - Business Items List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Business Items List</h2>
            <p className="text-gray-600 text-sm mt-1">
              {businessItems.length} item(s) found • {businessItems.filter(item => item.is_active).length} active
            </p>
          </div>

          {businessItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">No business items found</div>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
              >
                Create Your First Business Item
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Sort
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Slug
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {businessItems
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSortOrder(item.id, 'up')}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Move up"
                          >
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="text-sm text-gray-900 font-medium w-8 text-center">
                            {item.sort_order}
                          </span>
                          <button
                            onClick={() => handleSortOrder(item.id, 'down')}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Move down"
                          >
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{item.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 font-mono">
                          {item.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-md">
                          {item.description.length > 100 
                            ? `${item.description.substring(0, 100)}...` 
                            : item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(item.id, item.is_active)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
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

export default HandleBusinessList;