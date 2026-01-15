import React, { useState, useEffect } from "react";
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
import { api } from "../../utils/app";
import InvoiceGenerator from "../invoic/InvoiceGenerator";

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

  // State for orders
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders"); // Adjust API endpoint as needed

      if (response.data?.success) {
        setOrders(response.data.data || []);
      } else {
        console.error("Failed to fetch orders:", response.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= FORMAT FUNCTIONS ================= */
  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* ================= INVOICE HANDLERS ================= */
  const handleViewInvoice = (order) => {
    // Prepare order data for invoice with all required fields
    const invoiceOrder = {
      ...order,
      order_number: order.order_number,
      order_date: order.order_date,
      customer: {
        name: order.customer_name,
        email: order.email,
        mobile: order.mobile,
        address: order.installation_address,
        state: order.state,
        pincode: order.pincode,
      },
      amounts: {
        subtotal: order.subtotal,
        total: order.total,
        cgst: order.cgst || 0,
        sgst: order.sgst || 0,
        igst: order.igst || 0,
      },
      items: order.items.map(item => ({
        ...item,
        base_price: (parseFloat(item.total) / parseFloat(item.quantity || 1)).toFixed(2),
        quantity: item.quantity || 1,
      })),
      payment_method: order.payment_method || "online",
      payment_status: order.payment_status,
    };
    
    setSelectedOrderForInvoice(invoiceOrder);
    setShowInvoiceModal(true);
  };

  const handleCloseInvoice = () => {
    setShowInvoiceModal(false);
    setSelectedOrderForInvoice(null);
  };

  /* ================= FILTERS & STATS ================= */
  const statusOptions = [
    { value: "all", label: "All Status", icon: BarChart },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle },
    { value: "pending", label: "Pending", icon: Clock },
    { value: "cancelled", label: "Cancelled", icon: XCircle },
    { value: "processing", label: "Processing", icon: RefreshCw },
    { value: "shipped", label: "Shipped", icon: Truck },
    { value: "delivered", label: "Delivered", icon: CheckCircle },
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
    confirmed: orders.filter((o) => o.order_status === "confirmed").length,
    pending: orders.filter((o) => o.order_status === "pending").length,
    paid: orders.filter((o) => o.payment_status === "paid").length,
    totalValue: orders.reduce((sum, order) => {
      return sum + parseFloat(order.total || 0);
    }, 0),
  };

  /* ================= STATUS CONFIGURATION ================= */
  const statusConfig = {
    confirmed: {
      label: "Confirmed",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      icon: CheckCircle,
      progress: 25,
    },
    pending: {
      label: "Pending",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      icon: Clock,
      progress: 10,
    },
    processing: {
      label: "Processing",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: RefreshCw,
      progress: 50,
    },
    shipped: {
      label: "Shipped",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      icon: Truck,
      progress: 75,
    },
    delivered: {
      label: "Delivered",
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: CheckCircle,
      progress: 100,
    },
    cancelled: {
      label: "Cancelled",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      icon: XCircle,
      progress: 0,
    },
    installation_scheduled: {
      color: colors.info,
      label: "Installation Scheduled",
      icon: Calendar,
      progress: 100,
      description: "Installation date has been scheduled",
    },
  };

  /* ================= PAYMENT STATUS CONFIG ================= */
  const paymentStatusConfig = {
    paid: {
      label: "Paid",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    pending: {
      label: "Pending",
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    failed: {
      label: "Failed",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  };

  /* ================= FILTERED ORDERS ================= */
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        selectedStatus === "all" || order.order_status === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.order_date.split("-").reverse().join("-"));
      const dateB = new Date(b.order_date.split("-").reverse().join("-"));

      switch (sortBy) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "price-high":
          return parseFloat(b.total) - parseFloat(a.total);
        case "price-low":
          return parseFloat(a.total) - parseFloat(b.total);
        default:
          return 0;
      }
    });

  /* ================= HANDLERS ================= */
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const viewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const contactSupport = (orderNumber) => {
    alert(`Contacting support for ${orderNumber}`);
    // Implement support contact logic here
  };

  const retryPayment = (orderId) => {
    alert(`Retrying payment for order ${orderId}`);
    // Implement payment retry logic here
  };

  /* ================= COMPONENTS ================= */
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.pending;
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

  const PaymentStatusBadge = ({ status }) => {
    const config = paymentStatusConfig[status] || paymentStatusConfig.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${config.color} ${config.bgColor}`}
      >
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
          backgroundColor: colors.primary,
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

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 md:px-8 lg:px-16 py-10 md:pt-40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
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
              onClick={() => fetchOrders()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: colors.primary,
                color: colors.bgLight,
              }}
            >
              <RefreshCw size={18} />
              Refresh Orders
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
              title="Confirmed"
              value={stats.confirmed}
              icon={CheckCircle}
              color={colors.success}
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              color={colors.warning}
            />
            <StatCard
              title="Total Spent"
              value={formatCurrency(stats.totalValue)}
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
                placeholder="Search by order number, customer name or product..."
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
                        selectedStatus === option.value ? "bg-green-50" : ""
                      }`}
                    >
                      {option.icon && <option.icon size={14} />}
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
                    {sortOptions.find((s) => s.value === sortBy)?.label}
                  </span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                        sortBy === option.value ? "bg-green-50" : ""
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
            const status =
              statusConfig[order.order_status] || statusConfig.pending;
            const paymentStatus =
              paymentStatusConfig[order.payment_status] ||
              paymentStatusConfig.pending;

            return (
              <div
                key={order.order_id}
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
                          <h3
                            className="font-semibold text-lg"
                            style={{ color: colors.text }}
                          >
                            Order #{order.order_number}
                          </h3>
                          <StatusBadge status={order.order_status} />
                          <PaymentStatusBadge status={order.payment_status} />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                          <span
                            className="flex items-center gap-1"
                            style={{ color: colors.muted }}
                          >
                            <Calendar size={14} />
                            {formatDate(order.order_date)}
                          </span>
                          <span style={{ color: colors.muted }}>•</span>
                          <span
                            className="flex items-center gap-1 font-medium"
                            style={{ color: colors.primary }}
                          >
                            <CreditCard size={14} />
                            {formatCurrency(order.total)}
                          </span>
                          <span style={{ color: colors.muted }}>•</span>
                          <span style={{ color: colors.muted }}>
                            Customer: {order.customer_name}
                          </span>
                        </div>

                        {/* Products Preview */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {order.items.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-8 h-8 rounded-md object-cover"
                              />
                              <span className="text-sm text-gray-600 truncate max-w-[150px]">
                                {item.title} × {item.quantity || 1}
                              </span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-sm text-gray-500">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => viewOrderDetails(order.order_id)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all hover:scale-105"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.bgLight,
                          }}
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        <button
                          onClick={() => toggleOrderDetails(order.order_id)}
                          className="flex items-center gap-2 text-sm font-medium transition hover:gap-3 group"
                          style={{ color: colors.primary }}
                        >
                          {expandedOrder === order.order_id
                            ? "Hide Details"
                            : "Quick View"}
                          <ArrowRight
                            size={16}
                            className={`transition-transform ${
                              expandedOrder === order.order_id ? "rotate-90" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Order Placed</span>
                      <span>Status: {status.label}</span>
                    </div>
                    <ProgressBar percentage={status.progress} />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.order_id && (
                  <div
                    className="border-t border-gray-100 p-5 animate-fadeIn"
                    style={{ backgroundColor: colors.bgSoft }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Order Details */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-500 mb-2">
                          Order Details
                        </h4>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="text-gray-600">Order Number:</span>{" "}
                            <span className="font-medium">
                              {order.order_number}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Order Date:</span>{" "}
                            <span className="font-medium">
                              {formatDate(order.order_date)}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Total Amount:</span>{" "}
                            <span className="font-medium">
                              {formatCurrency(order.total)}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Payment Method:</span>{" "}
                            <span className="font-medium">
                              {order.payment_method === "razorpay" ? "Online Payment" : 
                               order.payment_method === "cod" ? "Cash on Delivery" : 
                               order.payment_method || "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-500 mb-2">
                          Customer Details
                        </h4>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="text-gray-600">Name:</span>{" "}
                            <span className="font-medium">
                              {order.customer_name}
                            </span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Email:</span>{" "}
                            <span className="font-medium">{order.email}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Mobile:</span>{" "}
                            <span className="font-medium">{order.mobile}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Address:</span>{" "}
                            <span className="font-medium">
                              {order.installation_address}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-500 mb-2">
                          Payment Details
                        </h4>
                        <div className="space-y-2">
                          <p className="text-sm">
                            <span className="text-gray-600">Status:</span>{" "}
                            <PaymentStatusBadge status={order.payment_status} />
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Amount:</span>{" "}
                            <span className="font-medium">
                              {formatCurrency(order.total)}
                            </span>
                          </p>
                          {order.payment?.payment_id && (
                            <p className="text-sm">
                              <span className="text-gray-600">Payment ID:</span>{" "}
                              <span className="font-medium">
                                {order.payment.payment_id}
                              </span>
                            </p>
                          )}
                          {order.payment?.paid_at && (
                            <p className="text-sm">
                              <span className="text-gray-600">Paid At:</span>{" "}
                              <span className="font-medium">
                                {order.payment.paid_at}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Items Summary */}
                      <div>
                        <h4 className="font-medium text-sm text-gray-500 mb-2">
                          Items ({order.items.length})
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-8 h-8 rounded-md object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{item.title}</p>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity || 1} •{" "}
                                  {formatCurrency(item.total)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => viewOrderDetails(order.order_id)}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all hover:scale-105"
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.bgLight,
                          }}
                        >
                          <Eye size={16} />
                          View Full Order Details
                        </button>

                        {/* Invoice Button - Only show for paid orders */}
                        {order.payment_status === "paid" && (
                          <>
                            <button
                              onClick={() => handleViewInvoice(order)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                              style={{ color: colors.text }}
                            >
                              <FileText size={14} />
                              View Invoice
                            </button>

                            <button
                              onClick={() => handleViewInvoice(order)}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                              style={{ color: colors.text }}
                            >
                              <Download size={14} />
                              Download Invoice
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty State */}
          {filteredOrders.length === 0 && !loading && (
            <div
              className="mt-12 flex flex-col items-center justify-center text-center py-12"
              style={{ color: colors.muted }}
            >
              <Package size={64} className="mb-4 opacity-30" />
              <h3
                className="text-xl font-medium mb-2"
                style={{ color: colors.text }}
              >
                {orders.length === 0 ? "No Orders Yet" : "No Orders Found"}
              </h3>
              <p className="max-w-md mx-auto mb-6">
                {orders.length === 0
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : "No orders match your current filters. Try adjusting your search or filters."}
              </p>
              <div className="flex gap-3">
                {orders.length === 0 ? (
                  <button
                    onClick={() => navigate("/products")}
                    className="px-6 py-2.5 rounded-lg font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.bgLight,
                    }}
                  >
                    Browse Products
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedStatus("all");
                    }}
                    className="px-6 py-2.5 rounded-lg font-medium transition-all hover:scale-105"
                    style={{
                      backgroundColor: colors.primary,
                      color: colors.bgLight,
                    }}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        
      </div>

      {/* ================= INVOICE GENERATOR MODAL ================= */}
      <InvoiceGenerator
        order={selectedOrderForInvoice}
        onClose={handleCloseInvoice}
        isOpen={showInvoiceModal}
      />
    </>
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