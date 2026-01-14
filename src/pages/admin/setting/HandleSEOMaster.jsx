import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  Upload, 
  Globe, 
  Search, 
  Eye, 
  FileText, 
  Image as ImageIcon,
  Copy,
  RefreshCw,
  CheckCircle,
  XCircle,
  Settings,
  Tag,
  FileImage,
  Award,
  Layout,
  Type,
  X
} from 'lucide-react';
import { api } from '../../../utils/app';

const HandleSEOMaster = () => {
  // Admin Color Schema
  const colors = {
    primaryBlack: '#0A0A0A',
    pureWhite: '#FFFFFF',
    darkGray: '#1F2937',
    mediumGray: '#4B5563',
    lightGray: '#E5E7EB',
    softBackground: '#F3F4F6',
    accent: '#0A0A0A',
    danger: '#DC2626',
    warning: '#D97706',
    success: '#059669',
    info: '#2563EB'
  };

  // States
  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});
  const [preview, setPreview] = useState({
    com_web_logo_url: null,
    com_mobile_logo_url: null,
    brochure_image_url: null,
    cirtificate_image_url: null
  });
  
  const fileInputRefs = {
    com_web_logo_url: useRef(null),
    com_mobile_logo_url: useRef(null),
    brochure_image_url: useRef(null),
    cirtificate_image_url: useRef(null)
  };

  // Form data including image files - storing both preview and file
  const initialFormData = {
    com_name: '',
    logo_alt: '',
    brochure_alt: '',
    cirtificate_alt: '',
    footer_title: '',
    meta_tag: '',
    meta_description: '',
    meta_keywords: '',
    canonical: '',
    robots: '',
    meta_charset: '',
    meta_view_port: '',
    // Store files separately from preview URLs
    com_web_logo_file: null,
    com_mobile_logo_file: null,
    brochure_image_file: null,
    cirtificate_image_file: null
  };

  const [formData, setFormData] = useState(initialFormData);

  // Fetch SEO data
  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/seo-optimization/show');
      if (response.data?.success) {
        const data = response.data.data;
        setSeoData(data);
        setFormData({
          com_name: data.com_name || '',
          logo_alt: data.logo_alt || '',
          brochure_alt: data.brochure_alt || '',
          cirtificate_alt: data.cirtificate_alt || '',
          footer_title: data.footer_title || '',
          meta_tag: data.meta_tag || '',
          meta_description: data.meta_description || '',
          meta_keywords: data.meta_keywords || '',
          canonical: data.canonical || '',
          robots: data.robots || '',
          meta_charset: data.meta_charset || '',
          meta_view_port: data.meta_view_port || '',
          com_web_logo_file: null,
          com_mobile_logo_file: null,
          brochure_image_file: null,
          cirtificate_image_file: null
        });
        setPreview({
          com_web_logo_url: data.com_web_logo_url,
          com_mobile_logo_url: data.com_mobile_logo_url,
          brochure_image_url: data.brochure_image_url,
          cirtificate_image_url: data.cirtificate_image_url
        });
      }
    } catch (error) {
      console.error('Failed to fetch SEO data:', error);
      alert('Failed to load SEO configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.includes('image/')) {
      alert('Please upload only image files');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    
    // Update preview
    setPreview(prev => ({
      ...prev,
      [fieldName]: previewUrl
    }));

    // Map preview field name to file field name
    const fileFieldMap = {
      'com_web_logo_url': 'com_web_logo_file',
      'com_mobile_logo_url': 'com_mobile_logo_file',
      'brochure_image_url': 'brochure_image_file',
      'cirtificate_image_url': 'cirtificate_image_file'
    };

    const fileFieldName = fileFieldMap[fieldName];
    
    // Update form data with the file
    setFormData(prev => ({
      ...prev,
      [fileFieldName]: file
    }));

    // Set uploading state for this specific image
    setUploadingImages(prev => ({
      ...prev,
      [fieldName]: true
    }));

    // Simulate upload completion (remove if you want immediate preview)
    setTimeout(() => {
      setUploadingImages(prev => ({
        ...prev,
        [fieldName]: false
      }));
    }, 500);
  };

  const removeImage = (fieldName) => {
    setPreview(prev => ({
      ...prev,
      [fieldName]: null
    }));

    // Map preview field name to file field name
    const fileFieldMap = {
      'com_web_logo_url': 'com_web_logo_file',
      'com_mobile_logo_url': 'com_mobile_logo_file',
      'brochure_image_url': 'brochure_image_file',
      'cirtificate_image_url': 'cirtificate_image_file'
    };

    const fileFieldName = fileFieldMap[fieldName];
    
    setFormData(prev => ({
      ...prev,
      [fileFieldName]: null
    }));
  };

  const handleSave = async () => {
    if (!seoData?.id) {
      alert('No SEO configuration found');
      return;
    }

    try {
      setSaving(true);
      
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Add text fields
      const textFields = [
        'com_name', 'logo_alt', 'brochure_alt', 'cirtificate_alt',
        'footer_title', 'meta_tag', 'meta_description', 'meta_keywords',
        'canonical', 'robots', 'meta_charset', 'meta_view_port'
      ];
      
      textFields.forEach(field => {
        if (formData[field] !== undefined && formData[field] !== null) {
          formDataToSend.append(field, formData[field]);
        }
      });

      // Add image files if they exist - using correct field names without _url suffix
      const imageFieldMap = {
        'com_web_logo_file': 'com_web_logo', // Backend expects 'com_web_logo' not 'com_web_logo_url'
        'com_mobile_logo_file': 'com_mobile_logo',
        'brochure_image_file': 'brochure_image',
        'cirtificate_image_file': 'cirtificate_image'
      };

      Object.keys(imageFieldMap).forEach(fileField => {
        if (formData[fileField] instanceof File) {
          formDataToSend.append(imageFieldMap[fileField], formData[fileField]);
        }
      });

      // Debug log FormData entries
      console.log('FormData being sent:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }

      // Send the request
      const response = await api.post(`/admin/seo-optimization/update/${seoData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        alert('SEO configuration updated successfully!');
        fetchSEOData(); // Refresh data
        
        // Reset file inputs
        Object.keys(fileInputRefs).forEach(key => {
          if (fileInputRefs[key].current) {
            fileInputRefs[key].current.value = '';
          }
        });
      }
    } catch (error) {
      console.error('Failed to save SEO data:', error);
      console.error('Error details:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to save SEO configuration');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text) => {
    if (!text) {
      alert('No text to copy');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colors.primaryBlack }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.softBackground }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: colors.primaryBlack }}>
                SEO Master Configuration
              </h1>
              <p className="text-lg" style={{ color: colors.mediumGray }}>
                Manage your website's SEO settings and metadata
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchSEOData}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50"
                style={{ 
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack
                }}
              >
                <RefreshCw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Company Information Card */}
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: colors.lightGray }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primaryBlack}10` }}>
                    <Settings className="w-5 h-5" style={{ color: colors.primaryBlack }} />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: colors.primaryBlack }}>
                    Company Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="com_name"
                      value={formData.com_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="Enter company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Footer Title *
                    </label>
                    <input
                      type="text"
                      name="footer_title"
                      value={formData.footer_title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="Enter footer description"
                    />
                  </div>
                </div>
              </div>

              {/* Image Alt Tags Card */}
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: colors.lightGray }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.info}10` }}>
                    <ImageIcon className="w-5 h-5" style={{ color: colors.info }} />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: colors.primaryBlack }}>
                    Image Alt Tags
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Logo Alt Text
                    </label>
                    <input
                      type="text"
                      name="logo_alt"
                      value={formData.logo_alt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="Alt text for company logo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Brochure Alt Text
                    </label>
                    <input
                      type="text"
                      name="brochure_alt"
                      value={formData.brochure_alt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="Alt text for brochure image"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Certificate Alt Text
                    </label>
                    <input
                      type="text"
                      name="cirtificate_alt"
                      value={formData.cirtificate_alt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="Alt text for certificate image"
                    />
                  </div>
                </div>
              </div>

              {/* Meta Tags Card */}
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: colors.lightGray }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.success}10` }}>
                    <Tag className="w-5 h-5" style={{ color: colors.success }} />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: colors.primaryBlack }}>
                    Meta Tags & SEO
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Meta Title/Tag
                      <span className="text-xs font-normal ml-2" style={{ color: colors.mediumGray }}>
                        (Recommended: 50-60 characters)
                      </span>
                    </label>
                    <textarea
                      name="meta_tag"
                      value={formData.meta_tag}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all resize-none"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="Enter meta title/tag"
                    />
                    <div className="text-xs mt-1 text-right" style={{ color: colors.mediumGray }}>
                      {formData.meta_tag.length} characters
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Meta Description
                      <span className="text-xs font-normal ml-2" style={{ color: colors.mediumGray }}>
                        (Recommended: 150-160 characters)
                      </span>
                    </label>
                    <textarea
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all resize-none"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="Enter meta description"
                    />
                    <div className="text-xs mt-1 text-right" style={{ color: colors.mediumGray }}>
                      {formData.meta_description.length} characters
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Meta Keywords
                      <span className="text-xs font-normal ml-2" style={{ color: colors.mediumGray }}>
                        (Separate with commas)
                      </span>
                    </label>
                    <textarea
                      name="meta_keywords"
                      value={formData.meta_keywords}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all resize-none"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced SEO Card */}
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: colors.lightGray }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.warning}10` }}>
                    <Globe className="w-5 h-5" style={{ color: colors.warning }} />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: colors.primaryBlack }}>
                    Advanced SEO Settings
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Canonical URL
                    </label>
                    <input
                      type="url"
                      name="canonical"
                      value={formData.canonical}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="https://example.com/"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Robots Meta Tag
                    </label>
                    <input
                      type="text"
                      name="robots"
                      value={formData.robots}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="index, follow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Meta Charset
                    </label>
                    <input
                      type="text"
                      name="meta_charset"
                      value={formData.meta_charset}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="UTF-8"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      Meta Viewport
                    </label>
                    <input
                      type="text"
                      name="meta_view_port"
                      value={formData.meta_view_port}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="width=device-width, initial-scale=1"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: colors.lightGray }}>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="group w-full flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold border transition-all duration-300 disabled:opacity-50"
                  style={{ 
                    backgroundColor: colors.primaryBlack,
                    borderColor: colors.primaryBlack,
                    color: colors.pureWhite
                  }}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span className="group-hover:text-primaryBlack">Save SEO Configuration</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Images */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Preview Card */}
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: colors.lightGray }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.info}10` }}>
                    <Eye className="w-5 h-5" style={{ color: colors.info }} />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: colors.primaryBlack }}>
                    Preview & Info
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm" style={{ color: colors.mediumGray }}>Configuration ID</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono font-semibold" style={{ color: colors.primaryBlack }}>
                        #{seoData?.id}
                      </p>
                      <button
                        onClick={() => copyToClipboard(seoData?.id)}
                        className="p-1 rounded hover:bg-gray-100"
                        title="Copy ID"
                      >
                        <Copy className="w-3 h-3" style={{ color: colors.mediumGray }} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm" style={{ color: colors.mediumGray }}>Last Updated</p>
                    <p className="font-medium" style={{ color: colors.primaryBlack }}>
                      {formatDate(seoData?.updated_at)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm" style={{ color: colors.mediumGray }}>Created On</p>
                    <p className="font-medium" style={{ color: colors.primaryBlack }}>
                      {formatDate(seoData?.created_at)}
                    </p>
                  </div>

                  <div className="pt-4 border-t" style={{ borderColor: colors.lightGray }}>
                    <button
                      onClick={() => copyToClipboard(formData.meta_tag)}
                      disabled={!formData.meta_tag}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        borderColor: colors.lightGray,
                        color: colors.primaryBlack
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      Copy Meta Tag
                    </button>
                  </div>
                </div>
              </div>

              {/* Images Management */}
              <div className="bg-white rounded-xl border p-6" style={{ borderColor: colors.lightGray }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.success}10` }}>
                    <FileImage className="w-5 h-5" style={{ color: colors.success }} />
                  </div>
                  <h2 className="text-xl font-semibold" style={{ color: colors.primaryBlack }}>
                    Image Management
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Web Logo */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium" style={{ color: colors.primaryBlack }}>
                        Web Logo
                      </label>
                      <div className="flex gap-2">
                        {preview.com_web_logo_url && (
                          <button
                            onClick={() => removeImage('com_web_logo_url')}
                            className="text-xs px-2 py-1 rounded border transition-all hover:bg-red-50"
                            style={{ 
                              borderColor: colors.danger,
                              color: colors.danger
                            }}
                          >
                            <X className="w-3 h-3 inline" />
                          </button>
                        )}
                        <button
                          onClick={() => fileInputRefs.com_web_logo_url.current?.click()}
                          className="text-xs px-3 py-1 rounded border transition-all hover:bg-gray-50"
                          style={{ 
                            borderColor: colors.lightGray,
                            color: colors.primaryBlack
                          }}
                        >
                          {preview.com_web_logo_url ? 'Change' : 'Upload'}
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRefs.com_web_logo_url}
                        onChange={(e) => handleFileChange(e, 'com_web_logo_url')}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div className="relative">
                      {uploadingImages.com_web_logo_url ? (
                        <div className="w-full h-32 flex items-center justify-center rounded-lg border bg-gray-50" style={{ borderColor: colors.lightGray }}>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: colors.primaryBlack }}></div>
                        </div>
                      ) : (
                        <img
                          src={preview.com_web_logo_url || 'https://via.placeholder.com/300x100?text=Upload+Web+Logo'}
                          alt="Web Logo"
                          className="w-full h-32 object-contain rounded-lg border bg-gray-50 p-4"
                          style={{ borderColor: colors.lightGray }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x100?text=Logo+Not+Found';
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Mobile Logo */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium" style={{ color: colors.primaryBlack }}>
                        Mobile Logo
                      </label>
                      <div className="flex gap-2">
                        {preview.com_mobile_logo_url && (
                          <button
                            onClick={() => removeImage('com_mobile_logo_url')}
                            className="text-xs px-2 py-1 rounded border transition-all hover:bg-red-50"
                            style={{ 
                              borderColor: colors.danger,
                              color: colors.danger
                            }}
                          >
                            <X className="w-3 h-3 inline" />
                          </button>
                        )}
                        <button
                          onClick={() => fileInputRefs.com_mobile_logo_url.current?.click()}
                          className="text-xs px-3 py-1 rounded border transition-all hover:bg-gray-50"
                          style={{ 
                            borderColor: colors.lightGray,
                            color: colors.primaryBlack
                          }}
                        >
                          {preview.com_mobile_logo_url ? 'Change' : 'Upload'}
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRefs.com_mobile_logo_url}
                        onChange={(e) => handleFileChange(e, 'com_mobile_logo_url')}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div className="relative">
                      {uploadingImages.com_mobile_logo_url ? (
                        <div className="w-full h-32 flex items-center justify-center rounded-lg border bg-gray-50" style={{ borderColor: colors.lightGray }}>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: colors.primaryBlack }}></div>
                        </div>
                      ) : (
                        <img
                          src={preview.com_mobile_logo_url || 'https://via.placeholder.com/200x200?text=Upload+Mobile+Logo'}
                          alt="Mobile Logo"
                          className="w-full h-32 object-contain rounded-lg border bg-gray-50 p-4"
                          style={{ borderColor: colors.lightGray }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/200x200?text=Logo+Not+Found';
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Brochure Image */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium" style={{ color: colors.primaryBlack }}>
                        Brochure Image
                      </label>
                      <div className="flex gap-2">
                        {preview.brochure_image_url && (
                          <button
                            onClick={() => removeImage('brochure_image_url')}
                            className="text-xs px-2 py-1 rounded border transition-all hover:bg-red-50"
                            style={{ 
                              borderColor: colors.danger,
                              color: colors.danger
                            }}
                          >
                            <X className="w-3 h-3 inline" />
                          </button>
                        )}
                        <button
                          onClick={() => fileInputRefs.brochure_image_url.current?.click()}
                          className="text-xs px-3 py-1 rounded border transition-all hover:bg-gray-50"
                          style={{ 
                            borderColor: colors.lightGray,
                            color: colors.primaryBlack
                          }}
                        >
                          {preview.brochure_image_url ? 'Change' : 'Upload'}
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRefs.brochure_image_url}
                        onChange={(e) => handleFileChange(e, 'brochure_image_url')}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div className="relative">
                      {uploadingImages.brochure_image_url ? (
                        <div className="w-full h-48 flex items-center justify-center rounded-lg border bg-gray-50" style={{ borderColor: colors.lightGray }}>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: colors.primaryBlack }}></div>
                        </div>
                      ) : (
                        <img
                          src={preview.brochure_image_url || 'https://via.placeholder.com/300x400?text=Upload+Brochure'}
                          alt="Brochure"
                          className="w-full h-48 object-cover rounded-lg border bg-gray-50"
                          style={{ borderColor: colors.lightGray }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x400?text=Brochure+Not+Found';
                          }}
                        />
                      )}
                      {preview.brochure_image_url && !uploadingImages.brochure_image_url && (
                        <div className="absolute bottom-2 right-2">
                          <div className="px-2 py-1 rounded bg-black/70 text-white text-xs">
                            <FileText className="w-3 h-3 inline mr-1" />
                            Brochure
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certificate Image */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium" style={{ color: colors.primaryBlack }}>
                        Certificate Image
                      </label>
                      <div className="flex gap-2">
                        {preview.cirtificate_image_url && (
                          <button
                            onClick={() => removeImage('cirtificate_image_url')}
                            className="text-xs px-2 py-1 rounded border transition-all hover:bg-red-50"
                            style={{ 
                              borderColor: colors.danger,
                              color: colors.danger
                            }}
                          >
                            <X className="w-3 h-3 inline" />
                          </button>
                        )}
                        <button
                          onClick={() => fileInputRefs.cirtificate_image_url.current?.click()}
                          className="text-xs px-3 py-1 rounded border transition-all hover:bg-gray-50"
                          style={{ 
                            borderColor: colors.lightGray,
                            color: colors.primaryBlack
                          }}
                        >
                          {preview.cirtificate_image_url ? 'Change' : 'Upload'}
                        </button>
                      </div>
                      <input
                        type="file"
                        ref={fileInputRefs.cirtificate_image_url}
                        onChange={(e) => handleFileChange(e, 'cirtificate_image_url')}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <div className="relative">
                      {uploadingImages.cirtificate_image_url ? (
                        <div className="w-full h-48 flex items-center justify-center rounded-lg border bg-gray-50" style={{ borderColor: colors.lightGray }}>
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2" style={{ borderColor: colors.primaryBlack }}></div>
                        </div>
                      ) : (
                        <img
                          src={preview.cirtificate_image_url || 'https://via.placeholder.com/400x300?text=Upload+Certificate'}
                          alt="Certificate"
                          className="w-full h-48 object-cover rounded-lg border bg-gray-50"
                          style={{ borderColor: colors.lightGray }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x300?text=Certificate+Not+Found';
                          }}
                        />
                      )}
                      {preview.cirtificate_image_url && !uploadingImages.cirtificate_image_url && (
                        <div className="absolute bottom-2 right-2">
                          <div className="px-2 py-1 rounded bg-black/70 text-white text-xs">
                            <Award className="w-3 h-3 inline mr-1" />
                            Certificate
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleSEOMaster;