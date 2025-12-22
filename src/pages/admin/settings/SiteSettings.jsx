import React, { useState } from "react";

const SiteSettings = () => {
  const [logoPreview, setLogoPreview] = useState(null);

  // handle logo preview
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full min-h-screen px-6 py-8 bg-gray-100">

      {/* Page Title */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Site Settings
      </h2>

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-10">

        {/* Logo Upload */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Website Logo
          </h3>

          <div className="flex items-center space-x-6">
            <div className="w-28 h-28 border rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">No Logo</span>
              )}
            </div>

            <label className="px-4 py-2 bg-gray-800 text-white rounded-xl cursor-pointer hover:bg-gray-900 transition">
              Upload Logo
              <input type="file" className="hidden" onChange={handleLogoUpload} />
            </label>
          </div>
        </div>

        {/* Website Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-600 text-sm font-medium">Website Name</label>
            <input
              type="text"
              placeholder="Enter Website Name"
              className="mt-1 w-full p-3 rounded-xl border focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm font-medium">Support Email</label>
            <input
              type="email"
              placeholder="example@domain.com"
              className="mt-1 w-full p-3 rounded-xl border focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Social Links Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Social Media Links
          </h3>

          <div className="space-y-4">
            {[
              { label: "Facebook URL", icon: "📘" },
              { label: "Instagram URL", icon: "📸" },
              { label: "Twitter (X) URL", icon: "🐦" },
              { label: "LinkedIn URL", icon: "💼" },
              { label: "YouTube URL", icon: "▶️" },
            ].map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <span className="text-2xl">{item.icon}</span>
                <input
                  type="text"
                  placeholder={item.label}
                  className="flex-1 p-3 rounded-xl border focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white rounded-xl shadow-lg hover:opacity-90 transition-all text-lg font-semibold">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
