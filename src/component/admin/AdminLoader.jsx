import React from 'react';

const AdminLoader = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer ring - subtle animation */}
        <div className="w-20 h-20 border-4 border-gray-100 rounded-full"></div>
        
        {/* Main spinner */}
        <div className="absolute top-0 left-0 w-20 h-20">
          <div className="w-full h-full border-4 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
        </div>
        
        {/* Optional: Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 rounded-full"></div>
      </div>
      
      {/* Optional loading text */}
      <div className="absolute bottom-1/4 text-gray-900 font-medium animate-pulse">
        Loading...
      </div>
    </div>
  );
};

// Alternative version with different styles - choose one or use as variant

export const AdminLoaderInline = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12">
          <div className="w-full h-full border-4 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export const AdminLoaderSmall = () => {
  return (
    <div className="inline-flex items-center justify-center">
      <div className="relative">
        <div className="w-6 h-6 border-2 border-gray-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-6 h-6">
          <div className="w-full h-full border-2 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export const AdminLoaderWithText = ({ text = "Processing..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16">
          <div className="w-full h-full border-4 border-transparent border-t-gray-900 rounded-full animate-spin"></div>
        </div>
      </div>
      <span className="text-gray-900 font-medium">{text}</span>
    </div>
  );
};

// Compact version for buttons or small spaces
export const AdminLoaderButton = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-5 h-5 border-2 border-gray-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-5 h-5">
          <div className="w-full h-full border-2 border-transparent border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

// For dark backgrounds
export const AdminLoaderDark = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20">
          <div className="w-full h-full border-4 border-transparent border-t-white rounded-full animate-spin"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
      </div>
      <div className="absolute bottom-1/4 text-white font-medium animate-pulse">
        Loading...
      </div>
    </div>
  );
};

export default AdminLoader;