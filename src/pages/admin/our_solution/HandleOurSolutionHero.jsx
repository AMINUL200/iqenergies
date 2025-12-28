import React, { useState, useEffect } from 'react';
import { Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { api } from '../../../utils/app';
import AdminLoader from '../../../component/admin/AdminLoader';

const HandleOurSolutionHero = () => {
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    tagline: '',
    title: '',
    highlighted_text: '',
    title_meta: '',
    description: '',
    description_meta: '',
    is_active: 1,
  });

  // Fetch hero data on component mount
  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/our-solution');
      setHeroData(response.data.data);
      console.log('Fetched solution hero data:', response.data.data);
      
      // Populate form with existing data
      if (response.data.data) {
        setFormData({
          tagline: response.data.data.tagline || '',
          title: response.data.data.title || '',
          highlighted_text: response.data.data.highlighted_text || '',
          title_meta: response.data.data.title_meta || '',
          description: response.data.data.description || '',
          description_meta: response.data.data.description_meta || '',
          is_active: response.data.data.is_active ,
        });
      }
    } catch (err) {
      setError('Failed to fetch hero section data. Please try again.');
      console.error('Error fetching hero data:', err);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Create JSON data
      const data = {
        tagline: formData.tagline.trim(),
        title: formData.title.trim(),
        highlighted_text: formData.highlighted_text.trim(),
        title_meta: formData.title_meta.trim(),
        description: formData.description.trim(),
        description_meta: formData.description_meta.trim(),
        is_active: formData.is_active,
      };

      // Log data for debugging
      console.log('Data to send:', data);

      // Use POST for both create and update
      const endpoint = heroData?.id 
        ? `admin/our-solution/${heroData.id}`
        : '/admin/our-solution';
      
      const method = heroData?.id ? 'put' : 'post';
      
      const response = await api[method](endpoint, data);

      if (response.data.success) {
        setSuccess(response.data.message || 'Hero section saved successfully!');
        fetchHeroData(); // Refresh data
      } else {
        setError(response.data.message || 'Failed to save hero section.');
      }
    } catch (err) {
      console.error('Error saving hero section:', err.response?.data || err);
      
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
                          'Failed to save hero section. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Our Solutions - Hero Section</h1>
          <p className="text-gray-600 mt-2">
            Manage the hero section for the "Our Solutions" page
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

        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Hero Section Configuration
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {heroData?.id 
                ? `Editing existing hero section (ID: ${heroData.id})` 
                : 'Create new hero section'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Main Content */}
              <div className="space-y-6">
                {/* Tagline */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Tagline *
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="e.g., Our Solutions"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Small text above the main heading
                  </p>
                </div>

                {/* Title */}
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
                    placeholder="e.g., Intelligent Energy Solutions"
                  />
                </div>

                {/* Highlighted Text */}
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
                    placeholder="e.g., Built for Tomorrow"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This text will be highlighted differently in the design
                  </p>
                </div>

                {/* Title Meta */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Title Meta (SEO)
                  </label>
                  <input
                    type="text"
                    name="title_meta"
                    value={formData.title_meta}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="Meta title for SEO purposes"
                  />
                </div>
              </div>

              {/* Right Column - Description & Status */}
              <div className="space-y-6">
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
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Main description text for the hero section"
                  />
                </div>

                {/* Description Meta */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description Meta (SEO)
                  </label>
                  <textarea
                    name="description_meta"
                    value={formData.description_meta}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Meta description for SEO purposes"
                  />
                </div>

                {/* Active Toggle */}
                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active === 1 || formData.is_active === '1'}
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
            </div>

         
           

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center space-x-2 px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{heroData?.id ? 'Update Hero Section' : 'Create Hero Section'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      
      </div>
    </div>
  );
};

export default HandleOurSolutionHero;