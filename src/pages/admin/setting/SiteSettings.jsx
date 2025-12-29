import React, { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Edit2, Trash2, X, Eye, EyeOff, Building, Phone, Mail, MapPin, Globe, Facebook, Instagram, Linkedin, Twitter, Image as ImageIcon } from 'lucide-react';
import { api } from '../../../utils/app';
import AdminLoader from '../../../component/admin/AdminLoader';

const SiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    logo_alt: '',
    company_name: '',
    office_name: '',
    landline: '',
    phone: '',
    email: '',
    fax: '',
    address: '',
    fb: '',
    insta: '',
    linkdin: '',
    twiter: '',
    web_logo: null,
    mobile_logo: null,
    web_logo_preview: '',
    mobile_logo_preview: '',
    is_active: 1,
  });

  // Fetch site settings on component mount
  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/settings');
      setSiteSettings(response.data.data || []);
      console.log('Fetched site settings:', response.data.data);
    } catch (err) {
      setError('Failed to fetch site settings. Please try again.');
      console.error('Error fetching site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);
      
      if (name === 'web_logo') {
        setFormData(prev => ({
          ...prev,
          web_logo: file,
          web_logo_preview: previewUrl
        }));
      } else if (name === 'mobile_logo') {
        setFormData(prev => ({
          ...prev,
          mobile_logo: file,
          mobile_logo_preview: previewUrl
        }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: e.target.checked ? 1 : 0
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
      logo_alt: '',
      company_name: '',
      office_name: '',
      landline: '',
      phone: '',
      email: '',
      fax: '',
      address: '',
      fb: '',
      insta: '',
      linkdin: '',
      twiter: '',
      web_logo: null,
      mobile_logo: null,
      web_logo_preview: '',
      mobile_logo_preview: '',
      is_active: 1,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (setting) => {
    setFormData({
      logo_alt: setting.logo_alt || '',
      company_name: setting.company_name || '',
      office_name: setting.office_name || '',
      landline: setting.landline || '',
      phone: setting.phone || '',
      email: setting.email || '',
      fax: setting.fax || '',
      address: setting.address || '',
      fb: setting.fb || '',
      insta: setting.insta || '',
      linkdin: setting.linkdin || '',
      twiter: setting.twiter || '',
      web_logo: null,
      mobile_logo: null,
      web_logo_preview: setting.web_logo_url || '',
      mobile_logo_preview: setting.mobile_logo_url || '',
      is_active: setting.is_active ? 1 : 0,
    });
    setEditingId(setting.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const formDataToSend = new FormData();
      
      // Append all form fields except preview URLs
      Object.keys(formData).forEach(key => {
        if (!key.includes('_preview') && formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Log form data for debugging
      console.log('Form data to send:', Object.fromEntries(formDataToSend.entries()));

      // Use POST for both create and update
      const endpoint = editingId 
        ? `/admin/settings/${editingId}`
        : '/admin/settings';
      
      const method = editingId ? 'post' : 'post';
      
      const response = await api[method](endpoint, formDataToSend);

      if (response.data.success) {
        setSuccess(response.data.message || `Site setting ${editingId ? 'updated' : 'created'} successfully!`);
        
        // Refresh site settings list and reset form
        await fetchSiteSettings();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          logo_alt: '',
          company_name: '',
          office_name: '',
          landline: '',
          phone: '',
          email: '',
          fax: '',
          address: '',
          fb: '',
          insta: '',
          linkdin: '',
          twiter: '',
          web_logo: null,
          mobile_logo: null,
          web_logo_preview: '',
          mobile_logo_preview: '',
          is_active: 1,
        });

        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      } else {
        setError(response.data.message || `Failed to ${editingId ? 'update' : 'create'} site setting.`);
      }
    } catch (err) {
      console.error('Error saving site setting:', err.response?.data || err);
      
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
                          `Failed to ${editingId ? 'update' : 'create'} site setting. Please try again.`;
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this site setting?')) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(`/admin/site-settings/${id}`);
      
      if (response.data.success) {
        setSuccess('Site setting deleted successfully!');
        await fetchSiteSettings();

        // Auto-clear success message after 5 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 5000);
      } else {
        setError(response.data.message || 'Failed to delete site setting.');
      }
    } catch (err) {
      setError('Failed to delete site setting. Please try again.');
      console.error('Error deleting site setting:', err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      const response = await api.put(`/admin/site-settings/${id}/status`, {
        is_active: currentStatus ? false : true,
      });
      
      if (response.data.success) {
        setSuccess('Status updated successfully!');
        await fetchSiteSettings();

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

  if (loading) {
    return <AdminLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage company information, contact details, and social media links
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
                  {editingId ? 'Edit Site Setting' : 'Add New Site Setting'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      logo_alt: '',
                      company_name: '',
                      office_name: '',
                      landline: '',
                      phone: '',
                      email: '',
                      fax: '',
                      address: '',
                      fb: '',
                      insta: '',
                      linkdin: '',
                      twiter: '',
                      web_logo: null,
                      mobile_logo: null,
                      web_logo_preview: '',
                      mobile_logo_preview: '',
                      is_active: 1,
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Company Name *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <Building className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="e.g., IQ Energies"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Office Name *
                        </label>
                        <input
                          type="text"
                          name="office_name"
                          value={formData.office_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                          placeholder="e.g., Kolkata Office"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Logo Alt Text
                        </label>
                        <input
                          type="text"
                          name="logo_alt"
                          value={formData.logo_alt}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                          placeholder="Alt text for company logo"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Address *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                            placeholder="Full company address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Landline
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <Phone className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            name="landline"
                            value={formData.landline}
                            onChange={handleInputChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="e.g., +033985369"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Phone *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <Phone className="w-5 h-5" />
                          </div>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="e.g., 9856985874"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Email *
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <Mail className="w-5 h-5" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="e.g., info@company.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Fax
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            {/* <Fax className="w-5 h-5" /> */}
                          </div>
                          <input
                            type="text"
                            name="fax"
                            value={formData.fax}
                            onChange={handleInputChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="Fax number"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Facebook
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <Facebook className="w-5 h-5" />
                          </div>
                          <input
                            type="url"
                            name="fb"
                            value={formData.fb}
                            onChange={handleInputChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="https://facebook.com/yourpage"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Instagram
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <Instagram className="w-5 h-5" />
                          </div>
                          <input
                            type="url"
                            name="insta"
                            value={formData.insta}
                            onChange={handleInputChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="https://instagram.com/yourpage"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          LinkedIn
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <Linkedin className="w-5 h-5" />
                          </div>
                          <input
                            type="url"
                            name="linkdin"
                            value={formData.linkdin}
                            onChange={handleInputChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="https://linkedin.com/company/yourcompany"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Twitter
                        </label>
                        <div className="relative">
                          <div className="absolute left-3 top-3 text-gray-400">
                            <Twitter className="w-5 h-5" />
                          </div>
                          <input
                            type="url"
                            name="twiter"
                            value={formData.twiter}
                            onChange={handleInputChange}
                            className="w-full pl-10 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                            placeholder="https://twitter.com/yourpage"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo Upload</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Web Logo
                        </label>
                        <div className="space-y-3">
                          {formData.web_logo_preview && (
                            <div className="border border-gray-200 rounded-lg p-3">
                              <div className="mb-2 text-sm text-gray-600">Current Logo:</div>
                              <img
                                src={formData.web_logo_preview}
                                alt="Web logo preview"
                                className="w-32 h-auto object-contain"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            name="web_logo"
                            onChange={handleInputChange}
                            accept="image/*"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                          />
                          <p className="text-xs text-gray-500">
                            Recommended: PNG format, transparent background, 200x60px
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Mobile Logo
                        </label>
                        <div className="space-y-3">
                          {formData.mobile_logo_preview && (
                            <div className="border border-gray-200 rounded-lg p-3">
                              <div className="mb-2 text-sm text-gray-600">Current Logo:</div>
                              <img
                                src={formData.mobile_logo_preview}
                                alt="Mobile logo preview"
                                className="w-32 h-auto object-contain"
                              />
                            </div>
                          )}
                          <input
                            type="file"
                            name="mobile_logo"
                            onChange={handleInputChange}
                            accept="image/*"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                          />
                          <p className="text-xs text-gray-500">
                            Recommended: PNG format, 100x40px for mobile devices
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="pb-6">
                  <div className="flex items-center space-x-3">
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
                      {formData.is_active === 1 ? 'Active (This setting will be used on the site)' : 'Inactive (This setting will be hidden)'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        logo_alt: '',
                        company_name: '',
                        office_name: '',
                        landline: '',
                        phone: '',
                        email: '',
                        fax: '',
                        address: '',
                        fb: '',
                        insta: '',
                        linkdin: '',
                        twiter: '',
                        web_logo: null,
                        mobile_logo: null,
                        web_logo_preview: '',
                        mobile_logo_preview: '',
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
                        <span>{editingId ? 'Update Site Setting' : 'Create Site Setting'}</span>
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
              <span>Add New Site Setting</span>
            </button>
          )}
        </div>

        {/* Bottom Section - Site Settings List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Site Settings List</h2>
            <p className="text-gray-600 text-sm mt-1">
              {siteSettings.length} setting(s) found • {siteSettings.filter(s => s.is_active).length} active
            </p>
          </div>

          {siteSettings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">No site settings found</div>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
              >
                Create Your First Site Setting
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
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Logos
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
                  {siteSettings.map((setting) => (
                    <tr key={setting.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{setting.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">{setting.company_name}</div>
                          <div className="text-sm text-gray-600">{setting.office_name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{setting.address}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {setting.phone && (
                            <div className="text-sm text-gray-600">{setting.phone}</div>
                          )}
                          {setting.email && (
                            <div className="text-sm text-gray-600 truncate max-w-xs">{setting.email}</div>
                          )}
                          {setting.fb && (
                            <div className="text-xs text-blue-600 flex items-center">
                              <Facebook className="w-3 h-3 mr-1" />
                              Facebook
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {setting.web_logo_url ? (
                            <div className="relative group">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                              <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs px-2 py-1 rounded -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                Web logo
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400">No web logo</div>
                          )}
                          {setting.mobile_logo_url && (
                            <div className="relative group">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                              <div className="absolute invisible group-hover:visible bg-gray-900 text-white text-xs px-2 py-1 rounded -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                                Mobile logo
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleStatusToggle(setting.id, setting.is_active)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${setting.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {setting.is_active ? (
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
                        {new Date(setting.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(setting)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(setting.id)}
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

export default SiteSettings;