import React, { useState } from "react";

const AdminProfile = () => {
  // Dummy admin data
  const [admin, setAdmin] = useState({
    name: "Aminul Islam",
    username: "aminul_admin",
    email: "admin@example.com",
    role: "Super Admin",
    department: "Management",
    phone: "+91 98765 43210",
    gender: "Male",
    address: "Kolkata, West Bengal, India",
    joinedOn: "12 Jan 2024",
    lastLogin: "08 Nov 2025 • 10:45 AM",
    status: "Active",
    bio: "Passionate about technology, leadership, and building modern web apps.",
    website: "https://yourwebsite.com",
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/",
    twitter: "https://twitter.com/",
    avatar: "https://i.pravatar.cc/200?img=15",
  });

  // Avatar Change Handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setAdmin((prev) => ({ ...prev, avatar: previewURL }));
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 px-6 py-8">

      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Admin Profile
      </h2>

      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-10 max-w-6xl mx-auto">

        {/* Avatar Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start md:space-x-6">
          <img
            src='/image/profile.png'
            alt="Admin Avatar"
            className="w-40 h-40 rounded-2xl shadow-xl object-cover border"
          />

          <div className="text-center md:text-left mt-5 md:mt-0">
            <h3 className="text-3xl font-semibold text-gray-800">
              {admin.name}
            </h3>
            <p className="text-gray-600">{admin.role}</p>

            {/* Change Avatar Button */}
            <label className="mt-4 inline-block px-5 py-2 bg-gray-800 text-white rounded-xl cursor-pointer hover:bg-gray-900 transition">
              Change Avatar
              <input type="file" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {[
            { label: "Username", value: admin.username },
            { label: "Email", value: admin.email },
            { label: "Phone", value: admin.phone },
            { label: "Gender", value: admin.gender },
            { label: "Department", value: admin.department },
            { label: "Status", value: admin.status },
            { label: "Address", value: admin.address },
            { label: "Joined On", value: admin.joinedOn },
            { label: "Last Login", value: admin.lastLogin },
          ].map((item, index) => (
            <div key={index} className="p-4 border rounded-xl bg-gray-50">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="font-medium text-gray-800">{item.value}</p>
            </div>
          ))}

        </div>

        {/* Bio Section */}
        <div className="p-4 border rounded-xl bg-gray-50">
          <p className="text-sm text-gray-500">Bio</p>
          <p className="font-medium text-gray-800 mt-1">{admin.bio}</p>
        </div>

        {/* Social Links */}
        <div className="bg-gray-50 p-5 rounded-xl border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Social Profiles
          </h3>
          <ul className="space-y-3">
            <li><span className="font-medium">🌐 Website:</span> {admin.website}</li>
            <li><span className="font-medium">📘 Facebook:</span> {admin.facebook}</li>
            <li><span className="font-medium">📸 Instagram:</span> {admin.instagram}</li>
            <li><span className="font-medium">💼 LinkedIn:</span> {admin.linkedin}</li>
            <li><span className="font-medium">🐦 Twitter:</span> {admin.twitter}</li>
          </ul>
        </div>

        {/* Edit Button */}
        <div className="flex justify-end">
          <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-md hover:opacity-90 font-semibold transition-all">
            Edit Profile
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminProfile;
