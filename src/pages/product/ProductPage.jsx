import React, { useState, useEffect } from "react";
import {
  Sun,
  Wind,
  Droplets,
  Zap,
  Shield,
  TrendingUp,
  Battery,
  CloudSnow,
  Waves,
  Thermometer,
  Grid,
  List,
  ShoppingCart,
  Star,
  Clock,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/app";
import PageLoader from "../../component/common/PageLoader";

/* ================= ICON MAPPING ================= */
const iconMapping = {
  // Default icons for common energy categories
  solar: Sun,
  "solar energy": Sun,
  "solar-energy": Sun,
  wind: Wind,
  "wind energy": Wind,
  "wind-energy": Wind,
  hydro: Droplets,
  "hydro energy": Droplets,
  "hydro-energy": Droplets,
  water: Droplets,
  "water energy": Droplets,
  battery: Battery,
  storage: Battery,
  residential: Zap,
  commercial: Shield,
  industrial: TrendingUp,
  inverter: Battery,
  controller: Battery,
  charge: Zap,
  power: Zap,
  energy: Zap,
  default: Zap,
};

// Function to get appropriate icon based on category name
const getCategoryIcon = (categoryName) => {
  if (!categoryName) return Zap;

  const lowerName = categoryName.toLowerCase().trim();

  // Check for exact matches first
  for (const [key, icon] of Object.entries(iconMapping)) {
    if (lowerName === key || lowerName.includes(key)) {
      return icon;
    }
  }

  // Fallback based on keywords
  if (lowerName.includes("solar")) return Sun;
  if (lowerName.includes("wind")) return Wind;
  if (lowerName.includes("hydro") || lowerName.includes("water"))
    return Droplets;
  if (lowerName.includes("battery") || lowerName.includes("storage"))
    return Battery;

  return Zap; // Default icon
};

// Function to get product icon based on title
const getProductIcon = (productTitle, categoryName) => {
  if (!productTitle) return getCategoryIcon(categoryName);

  const lowerTitle = productTitle.toLowerCase();

  // Check for keywords in title
  if (lowerTitle.includes("solar")) return Sun;
  if (lowerTitle.includes("wind")) return Wind;
  if (lowerTitle.includes("hydro") || lowerTitle.includes("water"))
    return Droplets;
  if (lowerTitle.includes("battery") || lowerTitle.includes("storage"))
    return Battery;
  if (lowerTitle.includes("charge") || lowerTitle.includes("controller"))
    return Zap;
  if (lowerTitle.includes("inverter")) return Battery;
  if (lowerTitle.includes("heater") || lowerTitle.includes("thermal"))
    return Thermometer;
  if (lowerTitle.includes("light")) return Sun;
  if (lowerTitle.includes("monitor")) return Grid;
  if (lowerTitle.includes("mount")) return Shield;

  return getCategoryIcon(categoryName);
};

// Function to get theme configuration based on category
const getCategoryTheme = (categoryName) => {
  const categoryThemes = {
    // Predefined themes for common categories
    solar: {
      primary: "#F97316",
      secondary: "#FACC15",
      accent: "#DC2626",
      background: "#FFF7ED",
      textPrimary: "#3B2F2F",
      textMuted: "#92400E",
      gradient: "from-orange-500 via-amber-500 to-orange-600",
      light: "bg-orange-500/10",
      border: "border-orange-500/20",
      badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      button:
        "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600",
    },
    wind: {
      primary: "#64748B",
      secondary: "#CBD5E1",
      accent: "#2DD4BF",
      background: "#FFFFFF",
      textPrimary: "#1E293B",
      textMuted: "#475569",
      gradient: "from-slate-500 via-slate-400 to-slate-600",
      light: "bg-slate-500/10",
      border: "border-slate-500/20",
      badge: "bg-slate-500/20 text-slate-300 border-slate-500/30",
      button:
        "bg-gradient-to-r from-slate-500 to-slate-400 hover:from-slate-600 hover:to-slate-500",
    },
    hydro: {
      primary: "#2563EB",
      secondary: "#38BDF8",
      accent: "#0EA5A4",
      background: "#F0F9FF",
      textPrimary: "#0F172A",
      textMuted: "#1E40AF",
      gradient: "from-blue-500 via-cyan-500 to-blue-600",
      light: "bg-blue-500/10",
      border: "border-blue-500/20",
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      button:
        "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
    },
    water: {
      primary: "#2563EB",
      secondary: "#38BDF8",
      accent: "#0EA5A4",
      background: "#F0F9FF",
      textPrimary: "#0F172A",
      textMuted: "#1E40AF",
      gradient: "from-blue-500 via-cyan-500 to-blue-600",
      light: "bg-blue-500/10",
      border: "border-blue-500/20",
      badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      button:
        "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
    },
    default: {
      primary: "#10B981",
      secondary: "#34D399",
      accent: "#059669",
      background: "#ECFDF5",
      textPrimary: "#064E3B",
      textMuted: "#065F46",
      gradient: "from-green-500 via-emerald-500 to-green-600",
      light: "bg-green-500/10",
      border: "border-green-500/20",
      badge: "bg-green-500/20 text-green-300 border-green-500/30",
      button:
        "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
    },
  };

  if (!categoryName) return categoryThemes.default;

  const lowerName = categoryName.toLowerCase().trim();

  // Find matching theme
  for (const [key, theme] of Object.entries(categoryThemes)) {
    if (lowerName.includes(key)) {
      return theme;
    }
  }

  return categoryThemes.default;
};

const ProductPage = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("default");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const navigate = useNavigate();

  // Fetch product data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Replace this with your actual API call
        const response = await api.get("/show-products");
        const data = await response.data.data;
        console.log(response.data.data);
        
        setProductData(data);

        // Process categories from data
        const categories = {};
        data.forEach((product) => {
          const category = product.category;
          if (category && category.name) {
            const categorySlug =
              category.slug || category.name.toLowerCase().replace(/\s+/g, "-");
            if (!categories[categorySlug]) {
              categories[categorySlug] = {
                key: categorySlug,
                label: category.name,
                icon: getCategoryIcon(category.name),
                count: 0,
              };
            }
            categories[categorySlug].count += 1;
          }
        });

        const categoryTabs = Object.values(categories);
        categoryTabs.sort((a, b) => a.label.localeCompare(b.label));
        setTabs(categoryTabs);

        if (categoryTabs.length > 0) {
          setActiveTab(categoryTabs[0].key);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Get current theme based on active tab
  const getCurrentTheme = () => {
    if (!activeTab) return getCategoryTheme("default");
    const activeTabData = tabs.find((tab) => tab.key === activeTab);
    return getCategoryTheme(activeTabData?.label || "default");
  };

  // Get products for active tab
  const getProductsForActiveTab = () => {
    if (!activeTab || productData.length === 0) return [];

    return productData.filter((product) => {
      const category = product.category;
      if (!category || !category.name) return false;

      const categorySlug =
        category.slug || category.name.toLowerCase().replace(/\s+/g, "-");
      return categorySlug === activeTab;
    });
  };

  // Process product for display
  const processProduct = (product) => {
    // Find primary image
    const primaryImage =
      product.images?.find((img) => img.is_primary) || product.images?.[0];
    const imageUrl =
      primaryImage?.web_image_url || primaryImage?.mobile_image_url;

    // Get icon
    const icon = getProductIcon(product.title, product.category?.name);

    // Parse product type
    let productType = "residential";
    if (product.product_type) {
      const lowerType = product.product_type.toLowerCase();
      if (lowerType.includes("commercial")) productType = "commercial";
      if (lowerType.includes("industrial")) productType = "industrial";
      if (lowerType.includes("utility")) productType = "industrial";
    }

    return {
      id: product.id,
      title: product.title,
      description: product.short_description || "No description available",
      image:
        imageUrl ||
        "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
      icon: icon,
      price: parseFloat(product.price) || 0,
      rating: parseFloat(product.rating) || 0,
      inStock: !product.is_preorder,
      deliveryTime: product.delivery_time || "Not specified",
      category: productType,
      slug: product.slug,
      product_type: product.product_type,
    };
  };

  // Filter and sort products
  const currentProducts = getProductsForActiveTab();
  const processedProducts = currentProducts.map(processProduct);

  const filteredProducts = processedProducts
    .filter(
      (product) =>
        selectedCategory === "all" || product.category === selectedCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return a.id - b.id;
      }
    });

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(processedProducts.map((p) => p.category)),
  ];

  const colors = getCurrentTheme();

  if (loading) {
    return <PageLoader/>;
  }

  if (productData.length === 0) {
    return (
      <div
        className="min-h-screen pt-20 md:pt-30"
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center py-20">
            <div
              className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: colors.primary + "10",
                border: `2px dashed ${colors.primary}30`,
              }}
            >
              <Sun
                className="w-12 h-12"
                style={{ color: colors.primary, opacity: 0.5 }}
              />
            </div>
            <h3
              className="text-2xl font-bold mb-2"
              style={{ color: colors.textPrimary }}
            >
              No Products Available
            </h3>
            <p
              className="mb-6 max-w-md mx-auto"
              style={{ color: colors.textMuted }}
            >
              Our product catalog is currently being updated. Please check back
              soon!
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-lg font-semibold text-white"
              style={{ background: colors.button }}
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 md:pt-30"
      style={{ backgroundColor: colors.background }}
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white shadow-md"
            style={{ background: colors.button }}
          >
            <Filter className="w-5 h-5" />
            {showMobileFilters ? "Hide Filters" : "Show Filters"}
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar - Responsive */}
        <div
          className={`${
            showMobileFilters ? "block" : "hidden"
          } md:block bg-white rounded-2xl shadow-lg mb-8 overflow-hidden`}
        >
          <div className="p-4 md:p-6">
            {/* Category Tabs - Responsive */}
            {tabs.length > 0 && (
              <div className="mb-6 md:mb-6">
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    const tabColors = getCategoryTheme(tab.label);

                    return (
                      <button
                        key={tab.key}
                        onClick={() => {
                          setActiveTab(tab.key);
                          setSelectedCategory("all");
                        }}
                        className={`flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 py-2 sm:px-4 sm:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 relative group ${
                          isActive ? "shadow-md" : "hover:scale-[1.02]"
                        }`}
                        style={{
                          background: isActive
                            ? `linear-gradient(135deg, ${tabColors.primary}, ${tabColors.secondary})`
                            : "transparent",
                          color: isActive ? "white" : tabColors.textPrimary,
                          border: `2px solid ${
                            isActive ? "transparent" : tabColors.primary + "20"
                          }`,
                        }}
                      >
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-sm md:text-base whitespace-nowrap">
                          {tab.label}
                        </span>
                        <span className="text-xs opacity-70">
                          ({tab.count})
                        </span>

                        {/* Active indicator */}
                        {isActive && (
                          <div
                            className="absolute -bottom-1 md:-bottom-2 left-1/2 transform -translate-x-1/2 w-8 md:w-12 h-0.5 md:h-1 rounded-full"
                            style={{ backgroundColor: tabColors.accent }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* View Controls - Responsive */}
            <div className="mt-6 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* View Toggle and Filters Row */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* View Toggle */}
                <div
                  className="flex items-center bg-gray-50 rounded-lg p-1 border"
                  style={{ borderColor: colors.border }}
                >
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "grid"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-100"
                    }`}
                    style={{
                      color:
                        viewMode === "grid" ? colors.primary : colors.textMuted,
                    }}
                  >
                    <Grid className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === "list"
                        ? "bg-white shadow-sm"
                        : "hover:bg-gray-100"
                    }`}
                    style={{
                      color:
                        viewMode === "list" ? colors.primary : colors.textMuted,
                    }}
                  >
                    <List className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                {/* Mobile Stats */}
                <div className="sm:hidden flex items-center gap-2">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: colors.primary }}
                  >
                    {filteredProducts.length} items
                  </div>
                </div>
              </div>

              {/* Sort and Filter Dropdowns - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all text-sm md:text-base appearance-none"
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      focusRingColor: colors.primary,
                    }}
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Menu
                      className="w-4 h-4"
                      style={{ color: colors.textMuted }}
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 md:px-4 md:py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 transition-all text-sm md:text-base appearance-none"
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      focusRingColor: colors.primary,
                    }}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all"
                          ? "All Types"
                          : category.charAt(0).toUpperCase() +
                            category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <Menu
                      className="w-4 h-4"
                      style={{ color: colors.textMuted }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List View - Responsive */}
        {filteredProducts.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl md:hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{ border: `1px solid ${colors.border}` }}
                >
                  {/* Product Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <div
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold capitalize"
                        style={{
                          backgroundColor: colors.primary + "20",
                          color: colors.textMuted,
                        }}
                      >
                        {product.category}
                      </div>
                    </div>

                    {/* Rating */}
                    {product.rating > 0 && (
                      <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-2 h-2 sm:w-3 sm:h-3 ${
                                i < Math.floor(product.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-300 text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-white ml-1">
                          {product.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Content */}
                  <div className="p-3 sm:p-4 md:p-5">
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <h3
                        className="font-bold text-sm sm:text-base md:text-lg line-clamp-2"
                        style={{ color: colors.textPrimary }}
                      >
                        {product.title}
                      </h3>
                      <div
                        className="p-1 sm:p-2 rounded-lg flex-shrink-0 ml-2"
                        style={{ backgroundColor: colors.light }}
                      >
                        <product.icon
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: colors.primary }}
                        />
                      </div>
                    </div>

                    <p
                      className="text-xs sm:text-sm mb-4 sm:mb-5 line-clamp-3"
                      style={{ color: colors.textMuted }}
                    >
                      {product.description}
                    </p>

                    {/* Delivery Info */}
                    <div
                      className="flex items-center gap-2 text-xs mb-4"
                      style={{ color: colors.textMuted }}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{product.deliveryTime}</span>
                      {!product.inStock && (
                        <span className="ml-2 px-2 py-0.5 rounded text-xs bg-red-500/10 text-red-500">
                          Pre-order
                        </span>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div
                      className="flex flex-col gap-3 pt-4 border-t"
                      style={{ borderColor: colors.border }}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="text-lg sm:text-xl md:text-2xl font-bold"
                          style={{ color: colors.primary }}
                        >
                          ₹ {product.price.toLocaleString("en-IN")}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => console.log("Add to cart:", product)}
                          className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 text-sm flex-1"
                          style={{
                            background: colors.button,
                            opacity: product.inStock ? 1 : 0.5,
                            cursor: product.inStock ? "pointer" : "not-allowed",
                          }}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? (
                            <>
                              <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>Add to Cart</span>
                            </>
                          ) : (
                            "Notify Me"
                          )}
                        </button>

                        <button
                          onClick={() =>
                            navigate(`/product/${product.slug || product.id}`)
                          }
                          className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-1 sm:gap-2 text-sm border"
                          style={{
                            borderColor: colors.primary,
                            color: colors.primary,
                          }}
                        >
                          <span>Details</span>
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View - Responsive */
            <div className="space-y-3 md:space-y-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ border: `1px solid ${colors.border}` }}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-1/4 h-48 md:h-auto relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop";
                        }}
                      />
                      <div className="absolute top-3 left-3">
                        <div
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold capitalize"
                          style={{
                            backgroundColor: colors.primary + "20",
                            color: colors.textMuted,
                          }}
                        >
                          {product.category}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-3/4 p-3 sm:p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-0">
                        <div className="flex-1">
                          <div className="flex items-start gap-2 md:gap-3 mb-2">
                            <div
                              className="p-1 md:p-2 rounded-lg flex-shrink-0"
                              style={{ backgroundColor: colors.light }}
                            >
                              <product.icon
                                className="w-4 h-4 md:w-5 md:h-5"
                                style={{ color: colors.primary }}
                              />
                            </div>
                            <div>
                              <h3
                                className="text-base sm:text-lg md:text-xl font-bold mb-1"
                                style={{ color: colors.textPrimary }}
                              >
                                {product.title}
                              </h3>
                              <p
                                className="text-sm md:text-base mb-3 md:mb-4 line-clamp-2"
                                style={{ color: colors.textMuted }}
                              >
                                {product.description}
                              </p>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-xs md:text-sm">
                            <div className="flex items-center gap-1 md:gap-2">
                              <Clock
                                className="w-3 h-3 md:w-4 md:h-4"
                                style={{ color: colors.textMuted }}
                              />
                              <span style={{ color: colors.textMuted }}>
                                {product.deliveryTime}
                              </span>
                              {!product.inStock && (
                                <span className="ml-2 px-2 py-0.5 rounded text-xs bg-red-500/10 text-red-500">
                                  Pre-order
                                </span>
                              )}
                            </div>
                            {product.rating > 0 && (
                              <div className="flex items-center gap-1 md:gap-2">
                                <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
                                <span style={{ color: colors.textMuted }}>
                                  {product.rating}/5
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="mt-3 md:mt-0 md:ml-4 lg:ml-6 flex flex-col">
                          <div
                            className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4"
                            style={{ color: colors.primary }}
                          >
                            ₹ {product.price.toLocaleString("en-IN")}
                          </div>
                          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2">
                            <button
                              onClick={() =>
                                console.log("Add to cart:", product)
                              }
                              className="px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold text-white transition-all hover:scale-105 flex items-center justify-center gap-1 md:gap-2 text-sm"
                              style={{
                                background: colors.button,
                                opacity: product.inStock ? 1 : 0.5,
                              }}
                              disabled={!product.inStock}
                            >
                              <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                              {product.inStock ? "Add to Cart" : "Notify Me"}
                            </button>
                            <button
                              onClick={() =>
                                navigate(
                                  `/product/${product.slug || product.id}`
                                )
                              }
                              className="px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-1 md:gap-2 text-sm"
                              style={{
                                border: `2px solid ${colors.primary}`,
                                color: colors.primary,
                              }}
                            >
                              Details
                              <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* No Products Message */
          <div className="text-center py-12 md:py-20 px-4">
            <div
              className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: colors.primary + "10",
                border: `2px dashed ${colors.primary}30`,
              }}
            >
              <Sun
                className="w-8 h-8 md:w-12 md:h-12"
                style={{ color: colors.primary, opacity: 0.5 }}
              />
            </div>
            <h3
              className="text-xl md:text-2xl font-bold mb-2"
              style={{ color: colors.textPrimary }}
            >
              No Products Found
            </h3>
            <p
              className="mb-4 md:mb-6 text-sm md:text-base max-w-md mx-auto"
              style={{ color: colors.textMuted }}
            >
              Try adjusting your filters or browse other energy categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSortBy("default");
                }}
                className="px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold text-white text-sm md:text-base"
                style={{ background: colors.button }}
              >
                Reset Filters
              </button>
              <button
                onClick={() => {
                  const otherTab = tabs.find((t) => t.key !== activeTab);
                  if (otherTab) {
                    setActiveTab(otherTab.key);
                    setSelectedCategory("all");
                  }
                }}
                className="px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold border text-sm md:text-base"
                style={{
                  borderColor: colors.primary,
                  color: colors.primary,
                }}
              >
                Browse Other Categories
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
