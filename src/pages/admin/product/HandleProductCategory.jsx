import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Edit2, Trash2, ChevronUp, ChevronDown, X, Eye, EyeOff, ListTree } from 'lucide-react';
import { api } from '../../../utils/app';
import AdminLoader from '../../../component/admin/AdminLoader';

const HandleProductCategory = () => {
  // States for Categories
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    is_active: 1,
  });

  // States for Subcategories
  const [subcategories, setSubcategories] = useState([]);
  const [showSubcategoryForm, setShowSubcategoryForm] = useState(false);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const [subcategoryFormData, setSubcategoryFormData] = useState({
    category_id: '',
    name: '',
    is_active: 1,
  });

  // Fetch categories and subcategories on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch categories
      const categoriesResponse = await api.get('/admin/category-list');
      setCategories(categoriesResponse.data.data || []);
      
      // Fetch subcategories
      const subcategoriesResponse = await api.get('/admin/sub-category-list');
      setSubcategories(subcategoriesResponse.data.data || []);
      
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setCategoryFormData(prev => ({
        ...prev,
        [name]: e.target.checked ? 1 : 0
      }));
    } else {
      setCategoryFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubcategoryInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setSubcategoryFormData(prev => ({
        ...prev,
        [name]: e.target.checked ? 1 : 0
      }));
    } else {
      setSubcategoryFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddNewCategory = () => {
    setCategoryFormData({
      name: '',
      is_active: 1,
    });
    setEditingCategoryId(null);
    setShowCategoryForm(true);
  };

  const handleAddNewSubcategory = () => {
    if (categories.length === 0) {
      setError('Please create a category first before adding subcategories.');
      return;
    }
    
    setSubcategoryFormData({
      category_id: categories[0]?.id || '',
      name: '',
      is_active: 1,
    });
    setEditingSubcategoryId(null);
    setShowSubcategoryForm(true);
  };

  const handleEditCategory = (category) => {
    setCategoryFormData({
      name: category.name || '',
      is_active: category.is_active,
    });
    setEditingCategoryId(category.id);
    setShowCategoryForm(true);
  };

  const handleEditSubcategory = (subcategory) => {
    setSubcategoryFormData({
      category_id: subcategory.category_id,
      name: subcategory.name || '',
      is_active: subcategory.is_active,
    });
    setEditingSubcategoryId(subcategory.id);
    setShowSubcategoryForm(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const data = {
        name: categoryFormData.name.trim(),
        is_active: categoryFormData.is_active,
      };

      const endpoint = editingCategoryId 
        ? `/admin/category-update/${editingCategoryId}`
        : 'admin/category-store';
      
      const response = await api.post(endpoint, data);

      if (response.data.success) {
        setSuccess(response.data.message || `Category ${editingCategoryId ? 'updated' : 'created'} successfully!`);
        
        await fetchData();
        setShowCategoryForm(false);
        setEditingCategoryId(null);
        setCategoryFormData({
          name: '',
          is_active: 1,
        });

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || `Failed to ${editingCategoryId ? 'update' : 'create'} category.`);
      }
    } catch (err) {
      console.error('Error saving category:', err.response?.data || err);
      
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
                          `Failed to ${editingCategoryId ? 'update' : 'create'} category. Please try again.`;
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubcategorySubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const data = {
        category_id: subcategoryFormData.category_id,
        name: subcategoryFormData.name.trim(),
        is_active: subcategoryFormData.is_active,
      };

      const endpoint = editingSubcategoryId 
        ? `/admin/sub-category-update/${editingSubcategoryId}`
        : '/admin/sub-category-store';
      
      const response = await api.post(endpoint, data);

      if (response.data.success) {
        setSuccess(response.data.message || `Subcategory ${editingSubcategoryId ? 'updated' : 'created'} successfully!`);
        
        await fetchData();
        setShowSubcategoryForm(false);
        setEditingSubcategoryId(null);
        setSubcategoryFormData({
          category_id: categories[0]?.id || '',
          name: '',
          is_active: 1,
        });

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || `Failed to ${editingSubcategoryId ? 'update' : 'create'} subcategory.`);
      }
    } catch (err) {
      console.error('Error saving subcategory:', err.response?.data || err);
      
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
                          `Failed to ${editingSubcategoryId ? 'update' : 'create'} subcategory. Please try again.`;
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? This will also delete all associated subcategories.')) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(`/admin/category-delete/${id}`);
      
      if (response.data.success) {
        setSuccess('Category deleted successfully!');
        await fetchData();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to delete category.');
      }
    } catch (err) {
      setError('Failed to delete category. Please try again.');
      console.error('Error deleting category:', err);
    }
  };

  const handleSubcategoryDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(`/admin/sub-category-delete/${id}`);
      
      if (response.data.success) {
        setSuccess('Subcategory deleted successfully!');
        await fetchData();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to delete subcategory.');
      }
    } catch (err) {
      setError('Failed to delete subcategory. Please try again.');
      console.error('Error deleting subcategory:', err);
    }
  };

  const handleCategoryStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      const response = await api.put(`/admin/category-status/${id}`, {
        is_active: currentStatus ? 0 : 1,
      });
      
      if (response.data.success) {
        setSuccess('Category status updated successfully!');
        await fetchData();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to update category status.');
      }
    } catch (err) {
      setError('Failed to update category status. Please try again.');
      console.error('Error updating category status:', err);
    }
  };

  const handleSubcategoryStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      const response = await api.put(`/admin/subcategory-status/${id}`, {
        is_active: currentStatus ? 0 : 1,
      });
      
      if (response.data.success) {
        setSuccess('Subcategory status updated successfully!');
        await fetchData();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to update subcategory status.');
      }
    } catch (err) {
      setError('Failed to update subcategory status. Please try again.');
      console.error('Error updating subcategory status:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Product Categories & Subcategories</h1>
          <p className="text-gray-600 mt-2">
            Manage product categories and their subcategories for your e-commerce store
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

        {/* ========== CATEGORY SECTION ========== */}
        <div className="mb-12">
          {/* Top Section - Category Form or Add Button */}
          <div className="mb-8">
            {showCategoryForm ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCategoryForm(false);
                      setEditingCategoryId(null);
                      setCategoryFormData({
                        name: '',
                        is_active: 1,
                      });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <form onSubmit={handleCategorySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Category Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={categoryFormData.name}
                        onChange={handleCategoryInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                        placeholder="e.g., Solar Energy"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Enter the category name (slug will be auto-generated)
                      </p>
                    </div>

                    {/* Status Toggle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Status
                      </label>
                      <div className="mt-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="is_active"
                              checked={categoryFormData.is_active === 1}
                              onChange={handleCategoryInputChange}
                              className="sr-only"
                            />
                            <div className={`block w-14 h-8 rounded-full ${categoryFormData.is_active === 1 ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${categoryFormData.is_active === 1 ? 'transform translate-x-6' : ''}`}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {categoryFormData.is_active === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          {categoryFormData.is_active === 1 ? 'Category will be visible on site' : 'Category will be hidden on site'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryForm(false);
                        setEditingCategoryId(null);
                        setCategoryFormData({
                          name: '',
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
                          <span>{editingCategoryId ? 'Update Category' : 'Create Category'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={handleAddNewCategory}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Category</span>
              </button>
            )}
          </div>

          {/* Bottom Section - Categories List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Categories List</h2>
              <p className="text-gray-600 text-sm mt-1">
                {categories.length} category(s) found • {categories.filter(cat => cat.is_active).length} active
              </p>
            </div>

            {categories.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">No categories found</div>
                <button
                  onClick={handleAddNewCategory}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
                >
                  Create Your First Category
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
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Slug
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
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{category.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 font-mono">
                            {category.slug}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleCategoryStatusToggle(category.id, category.is_active)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {category.is_active ? (
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
                          {new Date(category.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(category.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditCategory(category)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleCategoryDelete(category.id)}
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

        {/* ========== SUBCATEGORY SECTION ========== */}
        <div>
          {/* Top Section - Subcategory Form or Add Button */}
          <div className="mb-8">
            {showSubcategoryForm ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingSubcategoryId ? 'Edit Subcategory' : 'Add New Subcategory'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowSubcategoryForm(false);
                      setEditingSubcategoryId(null);
                      setSubcategoryFormData({
                        category_id: categories[0]?.id || '',
                        name: '',
                        is_active: 1,
                      });
                    }}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <form onSubmit={handleSubcategorySubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Parent Category *
                      </label>
                      <select
                        name="category_id"
                        value={subcategoryFormData.category_id}
                        onChange={handleSubcategoryInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        Select the parent category for this subcategory
                      </p>
                    </div>

                    {/* Subcategory Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Subcategory Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={subcategoryFormData.name}
                        onChange={handleSubcategoryInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                        placeholder="e.g., Solar Panels"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Enter the subcategory name (slug will be auto-generated)
                      </p>
                    </div>

                    {/* Status Toggle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Status
                      </label>
                      <div className="mt-2">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              name="is_active"
                              checked={subcategoryFormData.is_active === 1}
                              onChange={handleSubcategoryInputChange}
                              className="sr-only"
                            />
                            <div className={`block w-14 h-8 rounded-full ${subcategoryFormData.is_active === 1 ? 'bg-gray-900' : 'bg-gray-300'}`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${subcategoryFormData.is_active === 1 ? 'transform translate-x-6' : ''}`}></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {subcategoryFormData.is_active === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          {subcategoryFormData.is_active === 1 ? 'Subcategory will be visible on site' : 'Subcategory will be hidden on site'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowSubcategoryForm(false);
                        setEditingSubcategoryId(null);
                        setSubcategoryFormData({
                          category_id: categories[0]?.id || '',
                          name: '',
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
                          <span>{editingSubcategoryId ? 'Update Subcategory' : 'Create Subcategory'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                onClick={handleAddNewSubcategory}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
              >
                <ListTree className="w-5 h-5" />
                <span>Add New Subcategory</span>
              </button>
            )}
          </div>

          {/* Bottom Section - Subcategories List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Subcategories List</h2>
              <p className="text-gray-600 text-sm mt-1">
                {subcategories.length} subcategory(s) found • {subcategories.filter(sub => sub.is_active).length} active
              </p>
            </div>

            {subcategories.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">No subcategories found</div>
                <button
                  onClick={handleAddNewSubcategory}
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
                >
                  Create Your First Subcategory
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
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Subcategory
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Slug
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
                    {subcategories.map((subcategory) => (
                      <tr key={subcategory.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{subcategory.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {subcategory.category?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{subcategory.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 font-mono">
                            {subcategory.slug}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleSubcategoryStatusToggle(subcategory.id, subcategory.is_active)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${subcategory.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          >
                            {subcategory.is_active ? (
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
                          {new Date(subcategory.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(subcategory.updated_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditSubcategory(subcategory)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSubcategoryDelete(subcategory.id)}
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
    </div>
  );
};

export default HandleProductCategory;