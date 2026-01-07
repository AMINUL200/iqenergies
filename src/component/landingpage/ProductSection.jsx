import React, { useState, useEffect } from "react";
import {
  Sun,
  Wind,
  Droplets,
  ArrowRight,
  Zap,
  Shield,
  TrendingUp,
  Leaf,
  Battery,
  Home,
  Factory,
  Cpu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  residential: Home,
  commercial: Factory,
  industrial: Factory,
  inverter: Cpu,
  controller: Cpu,
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
  if (lowerName.includes("inverter") || lowerName.includes("controller"))
    return Cpu;

  return Zap; // Default icon
};

// Function to get theme configuration based on category
const getCategoryTheme = (categoryKey) => {
  const categoryThemes = {
    // Predefined themes for common categories
    solar: {
      gradient: "from-amber-500 to-orange-600",
      border: "border-amber-500/30",
      light: "bg-amber-500/10",
      text: "text-amber-400",
    },
    wind: {
      gradient: "from-gray-200 to-white",
      border: "border-white/30",
      light: "bg-white/10",
      text: "text-gray-200",
    },
    hydro: {
      gradient: "from-blue-500 to-indigo-600",
      border: "border-blue-500/30",
      light: "bg-blue-500/10",
      text: "text-blue-400",
    },
    water: {
      gradient: "from-blue-400 to-cyan-500",
      border: "border-blue-400/30",
      light: "bg-blue-400/10",
      text: "text-blue-300",
    },
    battery: {
      gradient: "from-purple-500 to-pink-600",
      border: "border-purple-500/30",
      light: "bg-purple-500/10",
      text: "text-purple-400",
    },
    storage: {
      gradient: "from-purple-500 to-pink-600",
      border: "border-purple-500/30",
      light: "bg-purple-500/10",
      text: "text-purple-400",
    },
    default: {
      gradient: "from-green-500 to-emerald-600",
      border: "border-green-500/30",
      light: "bg-green-500/10",
      text: "text-green-400",
    },
  };

  const lowerKey = categoryKey?.toLowerCase() || "default";

  // Find matching theme
  for (const [key, theme] of Object.entries(categoryThemes)) {
    if (lowerKey.includes(key)) {
      return theme;
    }
  }

  // Generate dynamic theme for unknown categories
  return generateDynamicTheme(categoryKey);
};

// Generate theme for unknown categories using string hash
const generateDynamicTheme = (categoryKey) => {
  if (!categoryKey) return getCategoryTheme("default");

  // Create a simple hash from the category name
  const hash = categoryKey.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  // Color options for dynamic themes
  const colorOptions = [
    { gradient: "from-purple-500 to-pink-600", text: "text-purple-400" },
    { gradient: "from-cyan-500 to-blue-600", text: "text-cyan-400" },
    { gradient: "from-emerald-500 to-teal-600", text: "text-emerald-400" },
    { gradient: "from-violet-500 to-purple-600", text: "text-violet-400" },
    { gradient: "from-rose-500 to-pink-600", text: "text-rose-400" },
  ];

  const colorIndex = Math.abs(hash) % colorOptions.length;
  const selectedColor = colorOptions[colorIndex];

  return {
    gradient: selectedColor.gradient,
    border: selectedColor.text.replace("text-", "border-") + "/30",
    light: selectedColor.text.replace("text-", "bg-") + "/10",
    text: selectedColor.text,
  };
};

const ProductSection = ({ productData = [] }) => {
  const [activeTab, setActiveTab] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});

  const navigate = useNavigate();

  // Process product data to extract categories and group products
  useEffect(() => {
    if (!productData || productData.length === 0) return;

    const categories = {};
    const groupedProducts = {};

    // First pass: collect all unique categories
    productData.forEach((product) => {
      const category = product.category;
      if (!category || !category.name) return;

      const categoryName = category.name.trim();
      const categorySlug =
        category.slug || categoryName.toLowerCase().replace(/\s+/g, "-");

      if (!categories[categorySlug]) {
        categories[categorySlug] = {
          key: categorySlug,
          label: categoryName,
          icon: getCategoryIcon(categoryName),
        };
      }
    });

    // Second pass: group products by category
    productData.forEach((product) => {
      const category = product.category;
      if (!category || !category.name) return;

      const categorySlug =
        category.slug || category.name.toLowerCase().replace(/\s+/g, "-");

      if (!groupedProducts[categorySlug]) {
        groupedProducts[categorySlug] = [];
      }

      // Find primary image
      const primaryImage =
        product.images?.find((img) => img.is_primary) || product.images?.[0];
      const imageUrl =
        primaryImage?.web_image_url || primaryImage?.mobile_image_url;

      // Get product icon based on title if available, otherwise use category icon
      let productIcon = Zap; // default
      if (product.title) {
        const lowerTitle = product.title.toLowerCase();
        if (lowerTitle.includes("solar")) productIcon = Sun;
        else if (lowerTitle.includes("wind")) productIcon = Wind;
        else if (lowerTitle.includes("hydro") || lowerTitle.includes("water"))
          productIcon = Droplets;
        else if (
          lowerTitle.includes("battery") ||
          lowerTitle.includes("storage")
        )
          productIcon = Battery;
        else if (
          lowerTitle.includes("inverter") ||
          lowerTitle.includes("controller")
        )
          productIcon = Cpu;
        else if (lowerTitle.includes("charge")) productIcon = Zap;
        else productIcon = getCategoryIcon(category.name);
      }

      groupedProducts[categorySlug].push({
        id: product.id,
        title: product.title,
        image:
          imageUrl ||
          `https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop`,
        icon: productIcon,
        price: parseFloat(product.price) || 0,
        category: category.name,
        slug: product.slug,
        short_description: product.short_description,
        rating: parseFloat(product.rating) || 0,
        delivery_time: product.delivery_time,
        product_type: product.product_type,
      });
    });

    // Convert categories object to array
    const categoryTabs = Object.values(categories);

    // Sort tabs alphabetically
    categoryTabs.sort((a, b) => a.label.localeCompare(b.label));

    setTabs(categoryTabs);
    setProductsByCategory(groupedProducts);

    // Set active tab to first category if not set
    if (categoryTabs.length > 0 && !activeTab) {
      setActiveTab(categoryTabs[0].key);
    }
  }, [productData]);

  // Get products for active tab
  const getActiveProducts = () => {
    if (!activeTab || !productsByCategory[activeTab]) return [];
    return productsByCategory[activeTab].slice(0, 4); // 👈 LIMIT TO 4
  };

  // Get theme for active tab
  const getActiveTheme = () => {
    if (!activeTab) return getCategoryTheme("default");

    // Find the active tab's label
    const activeTabData = tabs.find((tab) => tab.key === activeTab);
    if (!activeTabData) return getCategoryTheme("default");

    return getCategoryTheme(activeTabData.label);
  };

  // If no product data, show empty state
  if (!productData || productData.length === 0) {
    return (
      <section className="relative py-10 md:py-20 bg-[#0A1A2F]" id="products">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-semibold text-green-400 tracking-wide">
                Our Products
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Sustainable Energy Products
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Coming Soon
              </span>
            </h2>
            <p className="text-gray-400 mt-4 text-lg">
              Our product catalog is being updated. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const theme = getActiveTheme();
  const activeProducts = getActiveProducts();

  return (
    <section className="relative py-10 md:py-20 bg-[#0A1A2F]" id="products">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="max-w-4xl mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-semibold text-green-400 tracking-wide">
              Our Products
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Sustainable Energy Products
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Built for the Future
            </span>
          </h2>
        </div>

        {/* ================= FILTER BUTTONS ================= */}
        {tabs.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              const tabTheme = getCategoryTheme(tab.label);

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300
                    ${
                      isActive
                        ? `bg-gradient-to-r ${tabTheme.gradient} text-black shadow-lg`
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* ================= PRODUCT GRID ================= */}
        {activeProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeProducts.map((product) => {
              const Icon = product.icon;

              return (
                <div
                  key={product.id}
                  className={`group rounded-2xl overflow-hidden bg-white/5 border ${theme.border} transition-all duration-300 hover:-translate-y-1`}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&auto=format&fit=crop`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                    {/* Icon */}
                    <div
                      className={`absolute top-4 right-4 p-3 rounded-xl ${theme.light}`}
                    >
                      <Icon className={`w-5 h-5 ${theme.text}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {product.title}
                    </h3>

                    {/* Short Description */}
                    {product.short_description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {product.short_description}
                      </p>
                    )}

                    

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3">
                      {/* Add to Cart */}
                      <button
                        onClick={() => console.log("Add to cart:", product)}
                        className={`flex items-center gap-2 font-semibold ${theme.text} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        Add to Cart
                      </button>

                      {/* More Details */}
                      <button
                        onClick={() =>
                          navigate(`/product/${product.slug || product.id}`)
                        }
                        className={`flex items-center gap-2 font-semibold ${theme.text} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        Details
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400 text-lg">
              No products found in this category.
            </p>
          </div>
        )}

        {/* ================= VIEW ALL BUTTON ================= */}
        {tabs.length > 1 && (
          <div className="mt-14 flex justify-center">
            <button
              onClick={() => navigate("/products")}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl
                 font-semibold text-white
                 bg-gradient-to-r from-green-500 to-green-600
                 hover:from-green-600 hover:to-green-700
                 shadow-lg transition-all duration-300"
            >
              View All Products
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
