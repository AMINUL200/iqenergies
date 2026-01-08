import React, { useState, useEffect } from "react";
import { CheckCircle, Shield, Zap, ArrowRight, Star, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../utils/app";

const reviews = [
  {
    name: "Rahul Sharma",
    rating: 5,
    comment:
      "Excellent solar panel quality. Installation was smooth and performance is outstanding.",
  },
  {
    name: "Ananya Das",
    rating: 4,
    comment: "Good efficiency and solid build quality. Value for money.",
  },
  {
    name: "Mohammed Ali",
    rating: 5,
    comment: "Reduced my electricity bill significantly. Highly recommended!",
  },
];

const ProductDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchProductDetails();
  }, [slug]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch product by slug
      const response = await api.get(`/product-details/${slug}`);
      
      if (response.data.success) {
        setProduct(response.data.data);
        
        // Find primary image index
        if (response.data.data.images && response.data.data.images.length > 0) {
          const primaryIndex = response.data.data.images.findIndex(img => img.is_primary);
          setActiveImage(primaryIndex >= 0 ? primaryIndex : 0);
        }
      } else {
        setError("Product not found");
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError("Failed to load product details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const numericRating = parseFloat(rating);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= Math.round(numericRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // Navigation functions for images
  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setActiveImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Get current active image
  const getActiveImage = () => {
    if (!product?.images || product.images.length === 0) return null;
    return product.images[activeImage];
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-gray-900 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl text-gray-900 mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-white hover:text-gray-900 border border-gray-900 transition-colors font-medium"
          >
            Browse Products
          </button>
        </div>
      </section>
    );
  }

  const activeImageData = getActiveImage();

  return (
    <section className="bg-white py-16 md:py-24 md:pt-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ================= PRODUCT SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ================= IMAGE SECTION ================= */}
          <div className="relative">
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg mb-4">
              {activeImageData ? (
                <>
                  <img
                    src={activeImageData.web_image_url}
                    alt={activeImageData.alt_text || product.title}
                    className="w-full h-[400px] object-cover"
                  />
                  
                  {/* Navigation Arrows */}
                  {product.images && product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-900" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-900" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                  <Zap className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Image Counter */}
            {product.images && product.images.length > 1 && (
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {activeImage + 1} / {product.images.length}
              </div>
            )}

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto py-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setActiveImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      activeImage === index 
                        ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image.web_image_url}
                      alt={image.alt_text || product.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= DETAILS SECTION ================= */}
          <div className="space-y-8">
            {/* Category */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700 uppercase">
                {product.category?.name || "Product"}
              </span>
              {product.sub_category && (
                <span className="text-xs text-gray-500">• {product.sub_category.name}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600">({product.rating})</span>
            </div>

            {/* Short Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              {product.short_description}
            </p>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-gray-900">
                ₹{formatPrice(product.price)}
              </span>
              <span className="text-sm text-gray-500">(Per Unit)</span>
              {product.is_preorder && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Pre-order
                </span>
              )}
            </div>

            {/* Delivery Time */}
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">Delivery:</span>
              <span>{product.delivery_time}</span>
            </div>

            {/* Product Type */}
            <div className="flex items-center gap-2 text-gray-600">
              <span className="font-medium">Type:</span>
              <span>{product.product_type}</span>
            </div>

            {/* ================= FEATURES ================= */}
            {product.features && product.features.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {product.features
                  .filter(feature => feature.is_active)
                  .map((feature, index) => (
                    <div key={feature.id} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <span className="text-gray-700">{feature.feature_text}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* ================= BUY BOX ================= */}
            <div className="border border-gray-200 rounded-2xl p-6 space-y-6 bg-gray-50">
              {/* Quantity */}
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Quantity</span>
                <span className="font-semibold text-gray-900">1 Unit</span>
              </div>

              {/* Buy Now */}
              <button
                onClick={() => navigate(`/checkout?product=${product.slug}`)}
                className="w-full group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300"
              >
                {product.is_preorder ? "Pre-order Now" : "Buy Now"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Trust */}
              <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                <Shield className="w-4 h-4 text-green-600" />
                Secure & Trusted Checkout
              </div>
            </div>
          </div>
        </div>

        {/* ================= PRODUCT DESCRIPTION ================= */}
        {product.description && (
          <div className="mt-20 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Description
            </h2>
            <div 
              className="text-gray-600 leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={createMarkup(product.description)}
            />
          </div>
        )}

        {/* ================= PRODUCT INFORMATION ================= */}
        {product.information && product.information.is_active && (
          <div className="mt-20 max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Product Information
            </h2>
            <div 
              className="text-gray-600 leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={createMarkup(product.information.information)}
            />
          </div>
        )}

      

       
      </div>
    </section>
  );
};

export default ProductDetails;