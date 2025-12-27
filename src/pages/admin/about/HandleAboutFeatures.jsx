import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Edit2, Trash2, ChevronUp, ChevronDown, X, Eye, EyeOff } from 'lucide-react';
import { api } from '../../../utils/app';
import AdminLoader from '../../../component/admin/AdminLoader';

const HandleAboutFeatures = () => {
  const [features, setFeatures] = useState([]);
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
    is_active: '1',
  });

  // Fetch features on component mount
  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/about/features'); // Adjust API endpoint as needed
      setFeatures(response.data.data || []);
      console.log('Fetched features:', response.data.data);
    } catch (err) {
      setError('Failed to fetch features. Please try again.');
      console.error('Error fetching features:', err);
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
    setFormData({
      title: '',
      description: '',
      sort_order: features.length > 0 ? Math.max(...features.map(f => f.sort_order)) + 1 : 1,
      is_active: '1',
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (feature) => {
    setFormData({
      title: feature.title || '',
      description: feature.description || '',
      sort_order: feature.sort_order || 1,
      is_active: feature.is_active ? '1' : '0',
    });
    setEditingId(feature.id);
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
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      // Log form data for debugging
      console.log('Form data to send:', Object.fromEntries(formDataToSend.entries()));

      // Use POST for both create and update
      const endpoint = editingId 
        ? `/admin/about/features/${editingId}`
        : '/admin/about/features';
      
      const method = editingId ? 'post' : 'post';
      
      const response = await api[method](endpoint, formDataToSend);
      
      setSuccess(response.data.message || `Feature ${editingId ? 'updated' : 'created'} successfully!`);
      
      // Refresh features list and reset form
      fetchFeatures();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        sort_order: 1,
        is_active: '1',
      });

      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          `Failed to ${editingId ? 'update' : 'create'} feature. Please try again.`;
      setError(errorMessage);
      console.error('Error saving feature:', err.response?.data || err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) {
      return;
    }

    try {
      setError(null);
      await api.delete(`/admin/about/features/${id}`);
      setSuccess('Feature deleted successfully!');
      fetchFeatures();
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError('Failed to delete feature. Please try again.');
      console.error('Error deleting feature:', err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      await api.put(`/admin/about/features/${id}/status`, { 
        is_active: currentStatus === 1 ? 0 : 1 
      });
      setSuccess('Status updated successfully!');
      fetchFeatures();
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update status. Please try again.');
      console.error('Error updating status:', err);
    }
  };

  const handleSortOrder = async (id, direction) => {
    try {
      setError(null);
      await api.put(`/admin/about/features/${id}/sort`, { direction });
      setSuccess('Sort order updated!');
      fetchFeatures();
      
      // Auto-clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">About Page Features</h1>
          <p className="text-gray-600 mt-2">
            Manage features for the About Us page
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
                  {editingId ? 'Edit Feature' : 'Add New Feature'}
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
                        placeholder="e.g., Innovation Driven"
                      />
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
                            checked={formData.is_active === '1'}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className={`block w-14 h-8 rounded-full ${formData.is_active === '1' ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
                          <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.is_active === '1' ? 'transform translate-x-6' : ''}`}></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formData.is_active === '1' ? 'Active' : 'Inactive'}
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
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                        placeholder="Enter feature description"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">{formData.title || 'Feature Title'}</h4>
                      <p className="text-gray-600 text-sm">{formData.description || 'Feature description will appear here...'}</p>
                      <div className="flex items-center space-x-4 pt-2">
                        <div className="text-xs font-medium text-gray-500">
                          Sort Order: <span className="text-gray-900">{formData.sort_order}</span>
                        </div>
                        <div className={`text-xs font-medium px-2 py-1 rounded-full ${formData.is_active === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {formData.is_active === '1' ? 'Active' : 'Inactive'}
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
                        <span>{editingId ? 'Update Feature' : 'Create Feature'}</span>
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
              <span>Add New Feature</span>
            </button>
          )}
        </div>

        {/* Bottom Section - Features List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Features List</h2>
            <p className="text-gray-600 text-sm mt-1">
              {features.length} feature(s) found • {features.filter(f => f.is_active).length} active
            </p>
          </div>

          {features.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">No features found</div>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
              >
                Create Your First Feature
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Sort Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Title
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
                  {features
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((feature) => (
                    <tr key={feature.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleSortOrder(feature.id, 'up')}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Move up"
                          >
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          </button>
                          <span className="text-sm text-gray-900 font-medium w-8 text-center">
                            {feature.sort_order}
                          </span>
                          <button
                            onClick={() => handleSortOrder(feature.id, 'down')}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Move down"
                          >
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{feature.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs">
                          {feature.description.length > 100 
                            ? `${feature.description.substring(0, 100)}...` 
                            : feature.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(feature.id, feature.is_active)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${feature.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {feature.is_active ? (
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
                        {new Date(feature.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(feature)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(feature.id)}
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

export default HandleAboutFeatures;