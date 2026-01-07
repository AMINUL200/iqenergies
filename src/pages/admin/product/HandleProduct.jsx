import React, { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  EyeOff,
  Package,
  Image as ImageIcon,
  Upload,
  Star,
  Info,
  FileText,
} from "lucide-react";
import AdminLoader from "../../../component/admin/AdminLoader";
import { api } from "../../../utils/app";
import CustomTextEditor from "../../../component/form/TextEditor";

const HandleProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Image management states
  const [showImageForm, setShowImageForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFormData, setImageFormData] = useState({
    alt_text: "",
    is_primary: false,
  });
  const [imageFiles, setImageFiles] = useState({
    web_image: null,
    mobile_image: null,
  });

  // Information management states
  const [showInfoForm, setShowInfoForm] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoFormData, setInfoFormData] = useState({
    information: "",
    is_active: true,
  });

  const [formData, setFormData] = useState({
    category_id: "",
    sub_category_id: "",
    title: "",
    short_description: "",
    description: "",
    price: "",
    rating: "",
    delivery_time: "",
    product_type: "",
    is_preorder: false,
    is_active: true,
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const categoriesResponse = await api.get("/admin/category-list");
      setCategories(categoriesResponse.data.data || []);

      // Fetch subcategories
      const subcategoriesResponse = await api.get("/admin/sub-category-list");
      setSubcategories(subcategoriesResponse.data.data || []);

      // Fetch products
      const productsResponse = await api.get("/admin/product-list");
      setProducts(productsResponse.data.data || []);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get product images from product data
  const getProductImages = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product?.images || [];
  };

  // Get product information from product data
  const getProductInformation = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product?.information || null;
  };

  // Filter subcategories based on selected category
  const getFilteredSubcategories = () => {
    if (!formData.category_id) return [];

    return subcategories.filter(
      (sub) => Number(sub.category_id) === Number(formData.category_id)
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      let updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // When category changes, reset subcategory properly
      if (name === "category_id") {
        updated.sub_category_id = "";
      }

      return updated;
    });
  };

  useEffect(() => {
    if (!formData.category_id) return;

    const filtered = subcategories.filter(
      (sub) => Number(sub.category_id) === Number(formData.category_id)
    );

    // Auto-select first subcategory if none selected
    if (filtered.length > 0 && !formData.sub_category_id) {
      setFormData((prev) => ({
        ...prev,
        sub_category_id: String(filtered[0].id),
      }));
    }
  }, [formData.category_id, subcategories]);

  const handleAddNew = () => {
    if (categories.length === 0) {
      setError("Please create at least one category first.");
      return;
    }

    setFormData({
      category_id: categories[0]?.id || "",
      sub_category_id: "",
      title: "",
      short_description: "",
      description: "",
      price: "",
      rating: "",
      delivery_time: "",
      product_type: "",
      is_preorder: false,
      is_active: true,
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setFormData({
      category_id: String(product.category_id),
      sub_category_id: String(product.sub_category_id),
      title: product.title || "",
      short_description: product.short_description || "",
      description: product.description || "",
      price: product.price || "",
      rating: product.rating || "",
      delivery_time: product.delivery_time || "",
      product_type: product.product_type || "",
      is_preorder: Boolean(product.is_preorder),
      is_active: Boolean(product.is_active),
    });

    setEditingId(product.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Prepare data for API
      const data = {
        category_id: formData.category_id,
        sub_category_id: Number(formData.sub_category_id),
        title: formData.title.trim(),
        short_description: formData.short_description.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating) || 0,
        delivery_time: formData.delivery_time.trim(),
        product_type: formData.product_type.trim(),
        is_preorder: formData.is_preorder,
        is_active: formData.is_active,
      };

      // API endpoint
      const endpoint = editingId
        ? `/admin/product-update/${editingId}`
        : "/admin/product-store";

      const response = await api.post(endpoint, data);

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            `Product ${editingId ? "updated" : "created"} successfully!`
        );

        await fetchData();
        setShowForm(false);
        setEditingId(null);
        setFormData({
          category_id: categories[0]?.id || "",
          sub_category_id: "",
          title: "",
          short_description: "",
          description: "",
          price: "",
          rating: "",
          delivery_time: "",
          product_type: "",
          is_preorder: false,
          is_active: true,
        });

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(
          response.data.message ||
            `Failed to ${editingId ? "update" : "create"} product.`
        );
      }
    } catch (err) {
      console.error("Error saving product:", err.response?.data || err);

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        let errorMessage = "Validation failed:\n";

        Object.keys(errors).forEach((key) => {
          errorMessage += `${key}: ${errors[key].join(", ")}\n`;
        });

        setError(errorMessage);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          `Failed to ${
            editingId ? "update" : "create"
          } product. Please try again.`;
        setError(errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product? This will also delete all associated images and information."
      )
    ) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(`/admin/product-delete/${id}`);

      if (response.data.success) {
        setSuccess("Product deleted successfully!");
        await fetchData();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to delete product.");
      }
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      console.error("Error deleting product:", err);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      setError(null);
      const response = await api.put(`/admin/product-status/${id}`, {
        is_active: !currentStatus,
      });

      if (response.data.success) {
        setSuccess("Product status updated successfully!");
        await fetchData();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to update product status.");
      }
    } catch (err) {
      setError("Failed to update product status. Please try again.");
      console.error("Error updating product status:", err);
    }
  };

  // ========== IMAGE MANAGEMENT FUNCTIONS ==========

  const handleOpenImageForm = (product) => {
    setSelectedProduct(product);
    setShowImageForm(true);

    // Check if product has any images
    const hasImages = product.images && product.images.length > 0;

    setImageFormData({
      alt_text: "",
      is_primary: !hasImages, // Auto-set as primary if no images exist
    });
    setImageFiles({
      web_image: null,
      mobile_image: null,
    });
  };

  const handleCloseImageForm = () => {
    setShowImageForm(false);
    setSelectedProduct(null);
    setImageFormData({
      alt_text: "",
      is_primary: false,
    });
    setImageFiles({
      web_image: null,
      mobile_image: null,
    });
  };

  const handleImageInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setImageFiles((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else if (type === "checkbox") {
      setImageFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setImageFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      setError("No product selected for image upload.");
      return;
    }

    if (!imageFiles.web_image) {
      setError("Please select at least a web image.");
      return;
    }

    try {
      setUploadingImages(true);
      setError(null);

      const formDataObj = new FormData();
      formDataObj.append("product_id", selectedProduct.id);
      formDataObj.append("alt_text", imageFormData.alt_text || "");
      formDataObj.append("is_primary", imageFormData.is_primary ? "1" : "0");

      if (imageFiles.web_image) {
        formDataObj.append("web_image", imageFiles.web_image);
      }

      if (imageFiles.mobile_image) {
        formDataObj.append("mobile_image", imageFiles.mobile_image);
      }

      const response = await api.post(
        "/admin/product-image-store",
        formDataObj
      );

      if (response.data.success) {
        setSuccess("Image uploaded successfully!");

        // Refresh product data to get updated images
        await fetchData();

        // Reset form
        setImageFormData({
          alt_text: "",
          is_primary: false,
        });
        setImageFiles({
          web_image: null,
          mobile_image: null,
        });

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to upload image.");
      }
    } catch (err) {
      console.error("Error uploading image:", err.response?.data || err);

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        let errorMessage = "Validation failed:\n";

        Object.keys(errors).forEach((key) => {
          errorMessage += `${key}: ${errors[key].join(", ")}\n`;
        });

        setError(errorMessage);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to upload image. Please try again.";
        setError(errorMessage);
      }
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSetPrimaryImage = async (imageId) => {
    try {
      setError(null);
      const response = await api.post(
        `/admin/product-image-primary/${imageId}`
      );

      if (response.data.success) {
        setSuccess("Primary image updated successfully!");
        await fetchData(); // Refresh to get updated product data

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to set primary image.");
      }
    } catch (err) {
      setError("Failed to set primary image. Please try again.");
      console.error("Error setting primary image:", err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(
        `/admin/product-image-delete/${imageId}`
      );

      if (response.data.success) {
        setSuccess("Image deleted successfully!");
        await fetchData(); // Refresh to get updated product data

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.data.message || "Failed to delete image.");
      }
    } catch (err) {
      setError("Failed to delete image. Please try again.");
      console.error("Error deleting image:", err);
    }
  };

  // ========== INFORMATION MANAGEMENT FUNCTIONS ==========

  const handleOpenInfoForm = (product) => {
    setSelectedProduct(product);

    // Get existing information if available
    const existingInfo = product.information;

    setInfoFormData({
      information: existingInfo?.information || "",
      is_active: existingInfo?.is_active ?? true,
    });

    setShowInfoForm(true);
  };

  const handleCloseInfoForm = () => {
    setShowInfoForm(false);
    setSelectedProduct(null);
    setInfoFormData({
      information: "",
      is_active: true,
    });
  };

  const handleInfoInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setInfoFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setInfoFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProduct) {
      setError("No product selected for information.");
      return;
    }

    if (!infoFormData.information.trim()) {
      setError("Please enter product information.");
      return;
    }

    try {
      setSavingInfo(true);
      setError(null);

      const data = {
        product_id: selectedProduct.id,
        information: infoFormData.information.trim(),
        is_active: infoFormData.is_active,
      };

      // Check if information already exists
      const existingInfo = getProductInformation(selectedProduct.id);
      const endpoint = existingInfo
        ? `/admin/product-information-update/${existingInfo.id}`
        : "/admin/product-information-store";

      const response = await api.post(endpoint, data);

      if (response.data.success) {
        setSuccess(
          response.data.message ||
            `Product information ${
              existingInfo ? "updated" : "added"
            } successfully!`
        );

        await fetchData(); // Refresh to get updated product data
        handleCloseInfoForm();

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(
          response.data.message ||
            `Failed to ${existingInfo ? "update" : "add"} product information.`
        );
      }
    } catch (err) {
      console.error(
        "Error saving product information:",
        err.response?.data || err
      );

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        let errorMessage = "Validation failed:\n";

        Object.keys(errors).forEach((key) => {
          errorMessage += `${key}: ${errors[key].join(", ")}\n`;
        });

        setError(errorMessage);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to save product information. Please try again.";
        setError(errorMessage);
      }
    } finally {
      setSavingInfo(false);
    }
  };

  const handleDeleteInformation = async (productId) => {
    const info = getProductInformation(productId);
    if (!info) {
      setError("No information found to delete.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to delete this product information?"
      )
    ) {
      return;
    }

    try {
      setError(null);
      const response = await api.delete(
        `/admin/product-information-delete/${info.id}`
      );

      if (response.data.success) {
        setSuccess("Product information deleted successfully!");
        await fetchData(); // Refresh to get updated product data

        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(
          response.data.message || "Failed to delete product information."
        );
      }
    } catch (err) {
      setError("Failed to delete product information. Please try again.");
      console.error("Error deleting product information:", err);
    }
  };

  if (loading) {
    return <AdminLoader />;
  }

  const productImages = selectedProduct
    ? getProductImages(selectedProduct.id)
    : [];
  const productInformation = selectedProduct
    ? getProductInformation(selectedProduct.id)
    : null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage products for your e-commerce store
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

        {/* ========== PRODUCT FORM SECTION ========== */}
        <div className="mb-8">
          {showForm ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      category_id: categories[0]?.id || "",
                      sub_category_id: "",
                      title: "",
                      short_description: "",
                      description: "",
                      price: "",
                      rating: "",
                      delivery_time: "",
                      product_type: "",
                      is_preorder: false,
                      is_active: true,
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category & Subcategory Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category *
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Subcategory
                    </label>
                    <select
                      name="sub_category_id"
                      value={formData.sub_category_id}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.category_id}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg"
                    >
                      <option value="">Select a subcategory</option>
                      {getFilteredSubcategories().map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Title & Product Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      placeholder="e.g., High-Efficiency Solar Panel"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Product Type *
                    </label>
                    <input
                      type="text"
                      name="product_type"
                      value={formData.product_type}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      placeholder="e.g., Residential, Commercial, Industrial"
                    />
                  </div>
                </div>

                {/* Price & Rating */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900"
                      placeholder="45000.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Rating (0-5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900"
                      placeholder="4.8"
                    />
                  </div>
                </div>

                {/* Delivery Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Delivery Time *
                  </label>
                  <input
                    type="text"
                    name="delivery_time"
                    value={formData.delivery_time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                    placeholder="e.g., 3-5 days"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none"
                    placeholder="Brief product description for listings"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Full Description *
                  </label>
                  <CustomTextEditor
                    value={formData.description}
                    onChange={(content) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: content,
                      }))
                    }
                    placeholder="Write detailed product description, features, specs, etc..."
                    height={300}
                  />
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="is_preorder"
                          checked={formData.is_preorder}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div
                          className={`block w-14 h-8 rounded-full ${
                            formData.is_preorder ? "bg-gray-900" : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                            formData.is_preorder
                              ? "transform translate-x-6"
                              : ""
                          }`}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        Pre-order Product
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Enable if product is available for pre-order only
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={formData.is_active}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div
                          className={`block w-14 h-8 rounded-full ${
                            formData.is_active ? "bg-gray-900" : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                            formData.is_active ? "transform translate-x-6" : ""
                          }`}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        Active
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.is_active
                        ? "Product will be visible on site"
                        : "Product will be hidden on site"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        category_id: categories[0]?.id || "",
                        sub_category_id: "",
                        title: "",
                        short_description: "",
                        description: "",
                        price: "",
                        rating: "",
                        delivery_time: "",
                        product_type: "",
                        is_preorder: false,
                        is_active: true,
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
                        <span>
                          {editingId ? "Update Product" : "Create Product"}
                        </span>
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
              <Package className="w-5 h-5" />
              <span>Add New Product</span>
            </button>
          )}
        </div>

        {/* ========== PRODUCT INFORMATION MANAGEMENT SECTION ========== */}
        {showInfoForm && selectedProduct && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Manage Information for:{" "}
                <span className="text-blue-600">{selectedProduct.title}</span>
              </h2>
              <button
                onClick={handleCloseInfoForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <Info className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Product Information
                </h3>
              </div>

              {productInformation ? (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm font-medium text-blue-800">
                      Existing Information (ID: #{productInformation.id})
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          productInformation.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {productInformation.is_active ? "Active" : "Inactive"}
                      </span>
                      <button
                        onClick={() =>
                          handleDeleteInformation(selectedProduct.id)
                        }
                        className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Information"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-line mt-2" dangerouslySetInnerHTML={{__html:productInformation.information}}>
                  </div>
                  <div className="text-xs text-gray-500 mt-3">
                    Last updated:{" "}
                    {new Date(
                      productInformation.updated_at
                    ).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700">
                      No information added yet. Add new information below.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleInfoSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Product Information *
                </label>
                <CustomTextEditor
                  value={infoFormData.information}
                  onChange={(content) =>
                    setInfoFormData((prev) => ({
                      ...prev,
                      information: content,
                    }))
                  }
                  placeholder="Enter product features, specifications, warranty, usage details, etc..."
                  height={350}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Provide detailed information about the product features,
                  specifications, and benefits
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={infoFormData.is_active}
                      onChange={handleInfoInputChange}
                      className="sr-only"
                    />
                    <div
                      className={`block w-14 h-8 rounded-full ${
                        infoFormData.is_active ? "bg-gray-900" : "bg-gray-300"
                      }`}
                    ></div>
                    <div
                      className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                        infoFormData.is_active ? "transform translate-x-6" : ""
                      }`}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Active Information
                  </span>
                </label>
                <p className="text-xs text-gray-500">
                  {infoFormData.is_active
                    ? "Information will be visible on site"
                    : "Information will be hidden on site"}
                </p>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseInfoForm}
                  className="px-6 py-3 border border-gray-200 rounded-lg text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingInfo}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingInfo ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>
                        {productInformation
                          ? "Update Information"
                          : "Add Information"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========== PRODUCT IMAGE MANAGEMENT SECTION ========== */}
        {showImageForm && selectedProduct && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Manage Images for:{" "}
                <span className="text-blue-600">{selectedProduct.title}</span>
              </h2>
              <button
                onClick={handleCloseImageForm}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Add Image Form */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add New Image
              </h3>
              <form onSubmit={handleImageUpload} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Web Image *
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        name="web_image"
                        onChange={handleImageInputChange}
                        accept="image/*"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                      />
                      {imageFiles.web_image && (
                        <span className="text-sm text-green-600">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 800x800px, JPG/PNG format
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Mobile Image (Optional)
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        name="mobile_image"
                        onChange={handleImageInputChange}
                        accept="image/*"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
                      />
                      {imageFiles.mobile_image && (
                        <span className="text-sm text-green-600">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended: 400x400px, JPG/PNG format
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      name="alt_text"
                      value={imageFormData.alt_text}
                      onChange={handleImageInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
                      placeholder="Image description for SEO"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Describe the image for accessibility and SEO
                    </p>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="is_primary"
                          checked={imageFormData.is_primary}
                          onChange={handleImageInputChange}
                          className="sr-only"
                        />
                        <div
                          className={`block w-14 h-8 rounded-full ${
                            imageFormData.is_primary
                              ? "bg-gray-900"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
                            imageFormData.is_primary
                              ? "transform translate-x-6"
                              : ""
                          }`}
                        ></div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          Set as Primary Image
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          Primary image will be shown as main product image
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={uploadingImages || !imageFiles.web_image}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImages ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        <span>Upload Image</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Product Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Existing Images ({productImages.length})
              </h3>

              {productImages.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-xl">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No images uploaded yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Upload your first image using the form above
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productImages.map((image) => (
                    <div
                      key={image.id}
                      className={`border rounded-xl p-4 ${
                        image.is_primary
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="mb-3">
                        <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden mb-2">
                          {image.web_image_url ? (
                            <img
                              src={image.web_image_url}
                              alt={image.alt_text}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="font-medium mb-1">
                            Alt: {image.alt_text || "No alt text"}
                          </div>
                          {image.mobile_image_url && (
                            <div className="text-xs text-green-600">
                              ✓ Mobile version available
                            </div>
                          )}
                          <div className="text-xs text-gray-400">
                            Uploaded:{" "}
                            {new Date(image.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          {image.is_primary ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Star className="w-3 h-3 mr-1" />
                              Primary
                            </span>
                          ) : (
                            <button
                              onClick={() => handleSetPrimaryImage(image.id)}
                              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                            >
                              Set as Primary
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========== PRODUCTS LIST SECTION ========== */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Products List
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {products.length} product(s) found •{" "}
              {products.filter((p) => p.is_active).length} active
            </p>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">No products found</div>
              <button
                onClick={handleAddNew}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
              >
                Create Your First Product
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
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Price
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                      Images
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
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{product.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-4 ">
                          {product.short_description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Type: {product.product_type}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {product.category?.name || "N/A"}
                        </div>
                        {product.sub_category && (
                          <div className="text-xs text-gray-500 mt-1">
                            Sub: {product.sub_category.name}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{parseFloat(product.price).toLocaleString("en-IN")}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleStatusToggle(product.id, product.is_active)
                          }
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            product.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.is_active ? (
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
                        {product.is_preorder && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              Pre-order
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.information ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FileText className="w-3 h-3 mr-1" />
                              Added
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Not Added
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleOpenInfoForm(product)}
                          className="mt-1 inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors"
                        >
                          <Info className="w-3 h-3 mr-1" />
                          {product.information ? "Edit Info" : "Add Info"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.images?.length || 0} image(s)
                        </div>
                        {product.images?.some((img) => img.is_primary) && (
                          <div className="text-xs text-green-600">
                            Primary set
                          </div>
                        )}
                        <button
                          onClick={() => handleOpenImageForm(product)}
                          className="mt-1 inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors"
                        >
                          <ImageIcon className="w-3 h-3 mr-1" />
                          Manage Images
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Product"
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

export default HandleProduct;
