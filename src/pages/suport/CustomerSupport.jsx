import React, { useState } from 'react';
import { 
  Headphones, 
  MessageSquare, 
  Mail, 
  User, 
  Upload, 
  CheckCircle, 
  FileText, 
  Image as ImageIcon,
  Send,
  Home,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/app';

const CustomerSupport = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    problem_description: '',
    problem_image: null,
    filePreview: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error when user types
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const isValidFile = file.type.includes('image/') || file.type.includes('pdf') || file.name.endsWith('.pdf');
      if (isValidFile) {
        setFormData(prev => ({ 
          ...prev, 
          problem_image: file,
          filePreview: file.type.includes('image/') ? URL.createObjectURL(file) : null
        }));
        setError(''); // Clear error when file is selected
      } else {
        alert('Please upload only images or PDF files.');
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const isValidFile = file.type.includes('image/') || file.type.includes('pdf') || file.name.endsWith('.pdf');
      if (isValidFile) {
        setFormData(prev => ({ 
          ...prev, 
          problem_image: file,
          filePreview: file.type.includes('image/') ? URL.createObjectURL(file) : null
        }));
        setError('');
      } else {
        alert('Please upload only images or PDF files.');
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ 
      ...prev, 
      problem_image: null,
      filePreview: null 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.problem_description.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('problem_description', formData.problem_description);
      
      if (formData.problem_image) {
        formDataToSend.append('problem_image', formData.problem_image);
      }

      // Send data to backend API
      const response = await api.post('/admin/technical-support', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data?.success) {
        setSubmitted(true);
        console.log('Support ticket submitted:', response.data);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            problem_description: '',
            problem_image: null,
            filePreview: null
          });
          setSubmitted(false);
          
          // Redirect to admin technical support page
          navigate('/admin/technical-supports');
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Failed to submit support ticket');
      }
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      setError(error.response?.data?.message || 'Failed to submit support ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.softBackground }}>
      {/* Header */}
      <header className="bg-white border-b" style={{ borderColor: colors.lightGray }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl border" style={{ 
                backgroundColor: colors.primaryBlack,
                borderColor: colors.primaryBlack
              }}>
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: colors.primaryBlack }}>
                  Customer Support
                </h1>
                <p className="text-sm sm:text-base mt-1" style={{ color: colors.mediumGray }}>
                  Submit your technical support request
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm" style={{ color: colors.mediumGray }}>
              <Home className="w-4 h-4" />
              <span>/</span>
              <span>Technical Support</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-1 gap-8">
          <div>
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: colors.lightGray }}>
              {/* Form Header */}
              <div className="p-6 border-b" style={{ 
                borderColor: colors.lightGray,
                backgroundColor: colors.softBackground
              }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg border" style={{ 
                    backgroundColor: colors.primaryBlack,
                    borderColor: colors.primaryBlack
                  }}>
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold" style={{ color: colors.primaryBlack }}>Technical Support Request</h2>
                    <p className="text-sm mt-1" style={{ color: colors.mediumGray }}>
                      We'll create a support ticket and respond within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="m-6 p-4 rounded-lg border" style={{ 
                  backgroundColor: `${colors.danger}10`,
                  borderColor: `${colors.danger}20`
                }}>
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6" style={{ color: colors.danger }} />
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: colors.darkGray }}>
                        Error
                      </h3>
                      <p className="text-sm mt-1" style={{ color: colors.mediumGray }}>
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {submitted && (
                <div className="m-6 p-4 rounded-lg border" style={{ 
                  backgroundColor: `${colors.success}10`,
                  borderColor: `${colors.success}20`
                }}>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6" style={{ color: colors.success }} />
                    <div>
                      <h3 className="font-semibold text-sm" style={{ color: colors.darkGray }}>
                        Support Ticket Submitted Successfully!
                      </h3>
                      <p className="text-sm mt-1" style={{ color: colors.mediumGray }}>
                        Thank you for contacting us. We'll get back to you soon.
                        You will be redirected to the support dashboard shortly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name *
                      </div>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      disabled={loading || submitted}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </div>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading || submitted}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ 
                        borderColor: colors.lightGray,
                        backgroundColor: colors.softBackground,
                        color: colors.primaryBlack
                      }}
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Problem Description Field */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                    Problem Description *
                    <span className="text-sm font-normal block mt-1" style={{ color: colors.mediumGray }}>
                      Please describe your technical issue in detail
                    </span>
                  </label>
                  <textarea
                    name="problem_description"
                    value={formData.problem_description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    disabled={loading || submitted}
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ 
                      borderColor: colors.lightGray,
                      backgroundColor: colors.softBackground,
                      color: colors.primaryBlack
                    }}
                    placeholder="Describe your technical issue in detail. Include any error messages, steps to reproduce, and what you were trying to do..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.primaryBlack }}>
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Attach Screenshot/File (Optional)
                    </div>
                    <span className="text-sm font-normal block mt-1" style={{ color: colors.mediumGray }}>
                      Upload images or PDF files to help us understand the issue (Max 5MB)
                    </span>
                  </label>

                  {/* Drag & Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                      isDragging 
                        ? `border-[${colors.primaryBlack}] bg-[${colors.primaryBlack}]/5` 
                        : `border-gray-300 hover:border-[${colors.primaryBlack}]/50`
                    }`}
                    style={{ 
                      borderColor: isDragging ? colors.primaryBlack : colors.lightGray,
                      backgroundColor: colors.softBackground
                    }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.gif,.pdf,.PDF"
                      disabled={loading || submitted}
                    />
                    
                    {formData.problem_image ? (
                      <div className="flex items-center justify-between p-4 rounded-lg border" style={{ 
                        backgroundColor: colors.pureWhite,
                        borderColor: colors.lightGray
                      }}>
                        <div className="flex items-center gap-3">
                          {formData.filePreview ? (
                            <>
                              <img 
                                src={formData.filePreview} 
                                alt="Preview" 
                                className="w-12 h-12 rounded-lg object-cover border"
                                style={{ borderColor: colors.lightGray }}
                              />
                              <ImageIcon className="w-5 h-5" style={{ color: colors.primaryBlack }} />
                            </>
                          ) : (
                            <FileText className="w-12 h-12" style={{ color: colors.primaryBlack }} />
                          )}
                          <div className="text-left">
                            <p className="font-medium text-sm truncate max-w-xs" style={{ color: colors.primaryBlack }}>
                              {formData.problem_image.name}
                            </p>
                            <p className="text-xs mt-1" style={{ color: colors.mediumGray }}>
                              {(formData.problem_image.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          disabled={loading || submitted}
                          className="text-sm font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: colors.danger }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" 
                          style={{ backgroundColor: `${colors.primaryBlack}10` }}>
                          <Upload className="w-8 h-8" style={{ color: colors.primaryBlack }} />
                        </div>
                        <p className="font-medium mb-2" style={{ color: colors.primaryBlack }}>
                          Drag & drop files here
                        </p>
                        <p className="text-sm mb-4" style={{ color: colors.mediumGray }}>
                          or click to browse files
                        </p>
                        <label
                          htmlFor="file-upload"
                          className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-lg border transition-all cursor-pointer hover:shadow-sm ${
                            loading || submitted ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          style={{ 
                            backgroundColor: colors.primaryBlack,
                            borderColor: colors.primaryBlack,
                            color: colors.pureWhite
                          }}
                        >
                          <Upload className="w-5 h-5" />
                          Choose File
                        </label>
                        <p className="text-xs mt-4" style={{ color: colors.mediumGray }}>
                          Supports: JPG, PNG, GIF, PDF (Max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading || submitted}
                    className={`group w-full flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold border transition-all duration-300 ${
                      loading || submitted ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                    style={{ 
                      backgroundColor: colors.primaryBlack,
                      borderColor: colors.primaryBlack,
                      color: colors.pureWhite
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : submitted ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Submitted Successfully
                      </>
                    ) : (
                      <>
                        <span className="group-hover:text-primaryBlack">Submit Support Request</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-sm mt-3" style={{ color: colors.mediumGray }}>
                    By submitting, you agree to our Privacy Policy and Terms of Service
                  </p>
                </div>
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-6">
              <div className="bg-white p-5 rounded-xl border" style={{ borderColor: colors.lightGray }}>
                <h3 className="font-semibold mb-2" style={{ color: colors.primaryBlack }}>What happens next?</h3>
                <ol className="space-y-3 text-sm" style={{ color: colors.mediumGray }}>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">1.</span>
                    <span>Your request will be assigned a unique ticket number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">2.</span>
                    <span>Our technical team will review your issue</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">3.</span>
                    <span>You'll receive an email confirmation with ticket details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-medium">4.</span>
                    <span>Our team will contact you within 24 hours</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerSupport;