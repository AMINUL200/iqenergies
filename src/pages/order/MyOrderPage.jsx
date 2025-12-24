import React, { useState } from "react";
import {
  Package,
  Calendar,
  CreditCard,
  ArrowRight,
  Search,
  Filter,
  Download,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronDown,
  AlertCircle,
  Star,
  MessageSquare,
  FileText,
  BarChart,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyOrderPage = () => {
    const navigate = useNavigate();
  /* ================= BRAND COLORS ================= */
  const colors = {
    primary: "#4CAF50",
    primaryLight: "#E8F5E9",
    primaryDark: "#388E3C",
    secondary: "#0F766E",
    text: "#1F2933",
    muted: "#6B7280",
    border: "#E5E7EB",
    bgSoft: "#F9FAFB",
    bgLight: "#FFFFFF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  };

  // 🔥 Dummy Orders Data
  const initialOrders = [
    {
      id: "IQE-10231",
      product: "Solar Panel 550W Mono PERC",
      category: "Solar Panels",
      date: "12 Aug 2025",
      price: "₹18,999",
      status: "delivered",
      estimatedDelivery: "15 Aug 2025",
      quantity: 4,
      rating: 4.5,
      trackingId: "TRK7890123456",
      paymentMethod: "UPI",
      warranty: "25 years",
      customerSupport: "Available",
    },
    {
      id: "IQE-10218",
      product: "MPPT Solar Charge Controller 60A",
      category: "Controllers",
      date: "03 Aug 2025",
      price: "₹4,499",
      status: "processing",
      estimatedDelivery: "10 Aug 2025",
      quantity: 1,
      rating: null,
      trackingId: "TRK1234567890",
      paymentMethod: "Credit Card",
      warranty: "5 years",
      customerSupport: "Available",
    },
    {
      id: "IQE-10195",
      product: "Hybrid Inverter 3kW with Wi-Fi",
      category: "Inverters",
      date: "28 Jul 2025",
      price: "₹42,000",
      status: "cancelled",
      estimatedDelivery: "05 Aug 2025",
      quantity: 1,
      rating: null,
      trackingId: null,
      paymentMethod: "Net Banking",
      warranty: "10 years",
      customerSupport: "Closed",
    },
    {
      id: "IQE-10172",
      product: "Lithium Battery 5kWh LiFePO4",
      category: "Batteries",
      date: "15 Jul 2025",
      price: "₹65,000",
      status: "shipped",
      estimatedDelivery: "20 Jul 2025",
      quantity: 2,
      rating: 4.8,
      trackingId: "TRK3456789012",
      paymentMethod: "Debit Card",
      warranty: "10 years",
      customerSupport: "Available",
    },
    {
      id: "IQE-10150",
      product: "Solar Mounting Structure Kit",
      category: "Accessories",
      date: "05 Jul 2025",
      price: "₹12,500",
      status: "delivered",
      estimatedDelivery: "08 Jul 2025",
      quantity: 1,
      rating: 4.2,
      trackingId: "TRK9012345678",
      paymentMethod: "COD",
      warranty: "2 years",
      customerSupport: "Available",
    },
  ];

  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedOrder, setExpandedOrder] = useState(null);

  /* ================= FILTERS & STATS ================= */
  const statusOptions = [
    { value: "all", label: "All Status", icon: BarChart },
    { value: "processing", label: "Processing", icon: RefreshCw },
    { value: "shipped", label: "Shipped", icon: Truck },
    { value: "delivered", label: "Delivered", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Solar Panels", label: "Solar Panels" },
    { value: "Inverters", label: "Inverters" },
    { value: "Batteries", label: "Batteries" },
    { value: "Controllers", label: "Controllers" },
    { value: "Accessories", label: "Accessories" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "price-low", label: "Price: Low to High" },
  ];

  /* ================= STATS CALCULATION ================= */
  const stats = {
    total: orders.length,
    delivered: orders.filter(o => o.status === "delivered").length,
    processing: orders.filter(o => o.status === "processing").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalValue: orders.reduce((sum, order) => {
      const price = parseInt(order.price.replace(/[^0-9]/g, ""));
      return sum + price;
    }, 0),
  };

  /* ================= FILTERED ORDERS ================= */
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        selectedStatus === "all" || order.status === selectedStatus;
      
      const matchesCategory = 
        selectedCategory === "all" || order.category === selectedCategory;
      
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "price-high":
          return parseInt(b.price.replace(/[^0-9]/g, "")) - 
                 parseInt(a.price.replace(/[^0-9]/g, ""));
        case "price-low":
          return parseInt(a.price.replace(/[^0-9]/g, "")) - 
                 parseInt(b.price.replace(/[^0-9]/g, ""));
        default:
          return 0;
      }
    });

  /* ================= STATUS CONFIGURATION ================= */
  const statusConfig = {
    delivered: {
      label: "Delivered",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      icon: CheckCircle,
      progress: 100,
    },
    processing: {
      label: "Processing",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      icon: RefreshCw,
      progress: 30,
    },
    shipped: {
      label: "Shipped",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: Truck,
      progress: 70,
    },
    cancelled: {
      label: "Cancelled",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      icon: XCircle,
      progress: 0,
    },
  };

  /* ================= HANDLERS ================= */
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const downloadInvoice = (orderId) => {
    alert(`Downloading invoice for ${orderId}`);
    // Implement actual download logic here
  };

  const trackOrder = (trackingId) => {
    // alert(`Tracking order: ${trackingId}`);
    // Implement tracking logic here
    navigate(`/orders/${trackingId}`);
  };

  const contactSupport = (orderId) => {
    alert(`Contacting support for ${orderId}`);
    // Implement support contact logic here
  };

  const rateProduct = (orderId) => {
    alert(`Rate product for ${orderId}`);
    // Implement rating logic here
  };

  /* ================= COMPONENTS ================= */
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}
      >
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  const ProgressBar = ({ percentage }) => (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className="h-full transition-all duration-500"
        style={{ 
          width: `${percentage}%`,
          backgroundColor: colors.primary 
        }}
      />
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: colors.text }}>
            {value}
          </p>
        </div>
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 lg:px-16 py-10 md:pt-40">
      {/* ================= HEADER SECTION ================= */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: colors.text }}
            >
              My Orders
            </h1>
            <p className="mt-1 text-sm" style={{ color: colors.muted }}>
              Track and manage your IQEnergies purchases
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: colors.primary,
              color: colors.bgLight,
            }}
          >
            <FileText size={18} />
            Download All Invoices
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <StatCard
            title="Total Orders"
            value={stats.total}
            icon={Package}
            color={colors.primary}
          />
          <StatCard
            title="Delivered"
            value={stats.delivered}
            icon={CheckCircle}
            color={colors.success}
          />
          <StatCard
            title="In Progress"
            value={stats.processing}
            icon={RefreshCw}
            color={colors.warning}
          />
          <StatCard
            title="Total Spent"
            value={`₹${(stats.totalValue / 1000).toFixed(0)}K`}
            icon={TrendingUp}
            color={colors.secondary}
          />
        </div>
      </div>

      {/* ================= FILTERS & SEARCH ================= */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              size={18} 
            />
            <input
              type="text"
              placeholder="Search by order ID, product, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              style={{ color: colors.text }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                <Filter size={16} />
                <span style={{ color: colors.text }}>Status</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedStatus(option.value)}
                    className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 ${
                      selectedStatus === option.value ? 'bg-green-50' : ''
                    }`}
                  >
                    {option.icon && <option.icon size={14} />}
                    <span style={{ color: colors.text }}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                <Package size={16} />
                <span style={{ color: colors.text }}>Category</span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {categoryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedCategory(option.value)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                      selectedCategory === option.value ? 'bg-green-50' : ''
                    }`}
                  >
                    <span style={{ color: colors.text }}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2.5 border border-gray-200 rounded-lg hover:border-gray-300 transition">
                <Calendar size={16} />
                <span style={{ color: colors.text }}>
                  {sortOptions.find(s => s.value === sortBy)?.label}
                </span>
                <ChevronDown size={16} />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                      sortBy === option.value ? 'bg-green-50' : ''
                    }`}
                  >
                    <span style={{ color: colors.text }}>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ORDERS LIST ================= */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const status = statusConfig[order.status];
          
          return (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: `${colors.primary}15` }}
                    >
                      <Package size={24} style={{ color: colors.primary }} />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                          {order.product}
                        </h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {order.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <p style={{ color: colors.muted }}>
                          Order ID: <span className="font-medium">{order.id}</span>
                        </p>
                        <span style={{ color: colors.muted }}>•</span>
                        <span className="flex items-center gap-1" style={{ color: colors.muted }}>
                          <Calendar size={14} />
                          {order.date}
                        </span>
                        <span style={{ color: colors.muted }}>•</span>
                        <span className="flex items-center gap-1 font-medium" style={{ color: colors.primary }}>
                          <CreditCard size={14} />
                          {order.price}
                        </span>
                        <span style={{ color: colors.muted }}>•</span>
                        <span style={{ color: colors.muted }}>
                          Qty: {order.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <StatusBadge status={order.status} />
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="flex items-center gap-2 text-sm font-medium transition hover:gap-3 group"
                      style={{ color: colors.primary }}
                    >
                      {expandedOrder === order.id ? 'Hide Details' : 'View Details'}
                      <ArrowRight 
                        size={16} 
                        className={`transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Order Placed</span>
                    <span>Estimated: {order.estimatedDelivery}</span>
                  </div>
                  <ProgressBar percentage={status.progress} />
                </div>
              </div>

              {/* Expanded Details */}
              {expandedOrder === order.id && (
                <div 
                  className="border-t border-gray-100 p-5 animate-fadeIn"
                  style={{ backgroundColor: colors.bgSoft }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Order Details */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-2">Order Details</h4>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-gray-600">Payment:</span>{' '}
                          <span className="font-medium">{order.paymentMethod}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-600">Warranty:</span>{' '}
                          <span className="font-medium">{order.warranty}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-600">Support:</span>{' '}
                          <span className={`font-medium ${
                            order.customerSupport === 'Available' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {order.customerSupport}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Tracking */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-2">Tracking</h4>
                      {order.trackingId ? (
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="text-gray-600">Tracking ID:</span>{' '}
                            <span className="font-medium">{order.trackingId}</span>
                          </p>
                          <button
                            onClick={() => trackOrder(order.trackingId)}
                            className="flex items-center gap-2 text-sm font-medium transition hover:gap-3"
                            style={{ color: colors.primary }}
                          >
                            <Truck size={14} />
                            Track Order
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No tracking available</p>
                      )}
                    </div>

                    {/* Rating */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-2">Product Rating</h4>
                      {order.rating ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < Math.floor(order.rating)
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{order.rating}/5</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => rateProduct(order.id)}
                          className="flex items-center gap-2 text-sm font-medium transition hover:gap-3"
                          style={{ color: colors.primary }}
                        >
                          <Star size={14} />
                          Rate Product
                        </button>
                      )}
                    </div>

                    {/* Actions */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 mb-2">Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => downloadInvoice(order.id)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          style={{ color: colors.text }}
                        >
                          <Download size={14} />
                          Invoice
                        </button>
                        <button
                          onClick={() => contactSupport(order.id)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                          style={{ color: colors.text }}
                        >
                          <MessageSquare size={14} />
                          Support
                        </button>
                        {order.status === 'delivered' && (
                          <button
                            className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                            style={{ color: colors.text }}
                          >
                            <RefreshCw size={14} />
                            Return
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Warranty Info */}
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <div className="flex items-start gap-2">
                      <Shield size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Warranty Protection
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Your product is covered by a {order.warranty} warranty. 
                          Contact support for any technical issues or repairs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div
            className="mt-12 flex flex-col items-center justify-center text-center py-12"
            style={{ color: colors.muted }}
          >
            <Package size={64} className="mb-4 opacity-30" />
            <h3 className="text-xl font-medium mb-2" style={{ color: colors.text }}>
              No Orders Found
            </h3>
            <p className="max-w-md mx-auto">
              No orders match your current filters. Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedStatus("all");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                color: colors.bgLight,
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* ================= FOOTER NOTE ================= */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Need help with an order?{' '}
          <button 
            onClick={() => contactSupport('general')}
            className="font-medium hover:underline"
            style={{ color: colors.primary }}
          >
            Contact Customer Support
          </button>
        </p>
      </div>
    </div>
  );
};

export default MyOrderPage;

/* CSS Animations */
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
`;

export const MyOrderPageStyles = () => <style>{styles}</style>;