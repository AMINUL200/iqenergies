import React, { useState } from 'react';
import { 
  Headphones, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  Upload, 
  CheckCircle, 
  FileText, 
  Image as ImageIcon,
  Send,
  Shield,
  User,
  Home
} from 'lucide-react';

const CustomerSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    file: null,
    filePreview: null
  });
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isValidFile = file.type.includes('image/') || file.type.includes('pdf') || file.name.endsWith('.pdf');
      if (isValidFile) {
        setFormData(prev => ({ 
          ...prev, 
          file,
          filePreview: file.type.includes('image/') ? URL.createObjectURL(file) : null
        }));
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
      const isValidFile = file.type.includes('image/') || file.type.includes('pdf') || file.name.endsWith('.pdf');
      if (isValidFile) {
        setFormData(prev => ({ 
          ...prev, 
          file,
          filePreview: file.type.includes('image/') ? URL.createObjectURL(file) : null
        }));
      } else {
        alert('Please upload only images or PDF files.');
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ 
      ...prev, 
      file: null,
      filePreview: null 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form data:', formData);
    setSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        file: null,
        filePreview: null
      });
      setSubmitted(false);
    }, 3000);
  };

  const supportInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: "+1 (555) 123-4567",
      description: "Available 24/7 for urgent inquiries",
      color: "bg-[#4CAF50]"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: "support@energycompany.com",
      description: "Response within 24 hours",
      color: "bg-[#0F766E]"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Business Hours",
      details: "Mon - Fri: 8 AM - 6 PM",
      description: "Saturday: 9 AM - 4 PM",
      color: "bg-[#F59E0B]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FAFC] to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#4CAF50] to-[#0F766E]">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1F2933]">Customer Support</h1>
                <p className="text-[#6B7280] mt-1">We're here to help you with any questions</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-[#6B7280]">
              <Home className="w-4 h-4" />
              <span>/</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-1 gap-8">
         

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-[#4CAF50] to-[#0F766E] p-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-white" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">Send us a Message</h2>
                    <p className="text-white/90 mt-1">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {submitted && (
                <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-800">Message Sent Successfully!</h3>
                      <p className="text-green-600 text-sm mt-1">
                        Thank you for contacting us. We'll get back to you soon.
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
                    <label className="block text-sm font-medium text-[#1F2933] mb-2">
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-[#1F2933] mb-2">
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
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Subject Field */}
                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#4CAF50] focus:ring-2 focus:ring-[#4CAF50]/20 outline-none transition-all resize-none"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#1F2933] mb-2">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Attach File (Optional)
                    </div>
                    <span className="text-sm text-[#6B7280] font-normal">
                      Upload images or PDF files (Max 5MB)
                    </span>
                  </label>

                  {/* Drag & Drop Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                      isDragging 
                        ? 'border-[#4CAF50] bg-[#4CAF50]/5' 
                        : 'border-gray-300 hover:border-[#4CAF50]/50'
                    }`}
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
                    />
                    
                    {formData.file ? (
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          {formData.filePreview ? (
                            <>
                              <img 
                                src={formData.filePreview} 
                                alt="Preview" 
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <ImageIcon className="w-5 h-5 text-[#4CAF50]" />
                            </>
                          ) : (
                            <FileText className="w-12 h-12 text-[#4CAF50]" />
                          )}
                          <div className="text-left">
                            <p className="font-medium text-[#1F2933] truncate max-w-xs">
                              {formData.file.name}
                            </p>
                            <p className="text-sm text-[#6B7280]">
                              {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto w-16 h-16 rounded-full bg-[#4CAF50]/10 flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-[#4CAF50]" />
                        </div>
                        <p className="text-[#1F2933] font-medium mb-2">
                          Drag & drop files here
                        </p>
                        <p className="text-[#6B7280] text-sm mb-4">
                          or click to browse files
                        </p>
                        <label
                          htmlFor="file-upload"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4CAF50] to-[#0F766E] text-white font-semibold rounded-xl hover:shadow-lg transition-all cursor-pointer"
                        >
                          <Upload className="w-5 h-5" />
                          Choose File
                        </label>
                        <p className="text-xs text-[#6B7280] mt-4">
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
                    disabled={submitted}
                    className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#4CAF50] to-[#0F766E] text-white font-semibold hover:shadow-xl hover:shadow-[#4CAF50]/30 transition-all duration-300 ${
                      submitted ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {submitted ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-sm text-[#6B7280] mt-3">
                    By submitting, you agree to our Privacy Policy
                  </p>
                </div>
              </form>
            </div>

            {/* Additional Info */}
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-[#F59E0B]/10 to-[#F97316]/10 p-6 rounded-2xl border border-[#F59E0B]/20">
                <h3 className="font-semibold text-[#1F2933] mb-2">Technical Support</h3>
                <p className="text-sm text-[#6B7280]">
                  Need help with installation or technical issues? Our experts are here to assist you.
                </p>
              </div>
              <div className="bg-gradient-to-r from-[#38BDF8]/10 to-[#2563EB]/10 p-6 rounded-2xl border border-[#38BDF8]/20">
                <h3 className="font-semibold text-[#1F2933] mb-2">Sales Inquiries</h3>
                <p className="text-sm text-[#6B7280]">
                  Interested in our products? Contact our sales team for quotes and consultations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default CustomerSupport;