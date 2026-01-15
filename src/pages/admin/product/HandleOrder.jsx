import React, { useState, useEffect } from "react";
import {
  Package,
  Users,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  ChevronDown,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  BarChart,
  TrendingUp,
  Wallet,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../utils/app";
import InvoiceGenerator from "../../invoic/InvoiceGenerator";

const HandleOrder = () => {
  const navigate = useNavigate();

  // Admin Color Schema
  const colors = {
    primaryBlack: "#0A0A0A",
    pureWhite: "#FFFFFF",
    darkGray: "#1F2937",
    mediumGray: "#4B5563",
    lightGray: "#E5E7EB",
    softBackground: "#F3F4F6",
    accent: "#0A0A0A",
    danger: "#DC2626",
    warning: "#D97706",
    success: "#059669",
    info: "#2563EB",
    purple: "#8B5CF6",
  };

  // States
  const [allOrders, setAllOrders] = useState([]); // Store all orders from API
  const [filteredOrders, setFilteredOrders] = useState([]); // Orders after filtering
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPayment, setFilterPayment] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    last_page: 1,
    per_page: 10,
    from: 1,
    to: 1,
    current_page: 1,
  });

  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  // Status options
  const statusOptions = [
    { value: "all", label: "All Status", color: colors.mediumGray },
    { value: "pending", label: "Pending", color: colors.warning },
    { value: "confirmed", label: "Confirmed", color: colors.info },
    { value: "processing", label: "Processing", color: colors.purple },
    {
      value: "installation_scheduled",
      label: "Installation Scheduled",
      color: colors.info,
    },
    { value: "completed", label: "Completed", color: colors.success },
    { value: "cancelled", label: "Cancelled", color: colors.danger },
  ];

  const paymentStatusOptions = [
    { value: "all", label: "All Payments", color: colors.mediumGray },
    { value: "paid", label: "Paid", color: colors.success },
    { value: "pending", label: "Pending", color: colors.warning },
    { value: "failed", label: "Failed", color: colors.danger },
  ];

  const paymentMethodOptions = [
    { value: "all", label: "All Methods", color: colors.mediumGray },
    { value: "razorpay", label: "Razorpay", color: colors.info },
    { value: "cod", label: "Cash on Delivery", color: colors.success },
  ];

  // Status configuration
  const statusConfig = {
    pending: {
      label: "Pending",
      color: colors.warning,
      bgColor: `${colors.warning}15`,
      icon: Clock,
    },
    confirmed: {
      label: "Confirmed",
      color: colors.info,
      bgColor: `${colors.info}15`,
      icon: CheckCircle,
    },
    processing: {
      label: "Processing",
      color: colors.purple,
      bgColor: `${colors.purple}15`,
      icon: RefreshCw,
    },
    installation_scheduled: {
      label: "Installation Scheduled",
      color: colors.info,
      bgColor: `${colors.info}15`,
      icon: Calendar,
    },
    completed: {
      label: "Completed",
      color: colors.success,
      bgColor: `${colors.success}15`,
      icon: CheckCircle,
    },
    cancelled: {
      label: "Cancelled",
      color: colors.danger,
      bgColor: `${colors.danger}15`,
      icon: XCircle,
    },
  };

  const paymentStatusConfig = {
    paid: {
      label: "Paid",
      color: colors.success,
      bgColor: `${colors.success}15`,
    },
    pending: {
      label: "Pending",
      color: colors.warning,
      bgColor: `${colors.warning}15`,
    },
    failed: {
      label: "Failed",
      color: colors.danger,
      bgColor: `${colors.danger}15`,
    },
  };

  const paymentMethodConfig = {
    razorpay: {
      label: "Razorpay",
      color: colors.info,
      bgColor: `${colors.info}15`,
    },
    cod: {
      label: "COD",
      color: colors.success,
      bgColor: `${colors.success}15`,
    },
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/admin/orders`);

      if (response.data?.success) {
        const ordersData = response.data.data.data || [];
        setAllOrders(ordersData);

        // Apply initial filtering
        applyFilters(ordersData);

        // Set pagination info from API
        if (response.data.data) {
          setPagination({
            total: response.data.data.total || ordersData.length,
            last_page: response.data.data.last_page || 1,
            per_page: response.data.data.per_page || 10,
            from: 1,
            to: Math.min(itemsPerPage, ordersData.length),
            current_page: 1,
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      alert("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to orders
  const applyFilters = (orders) => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.order_number?.toLowerCase().includes(term) ||
          order.customer?.name?.toLowerCase().includes(term) ||
          order.customer?.email?.toLowerCase().includes(term) ||
          order.customer?.mobile?.includes(term)
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (order) => order.order_status === filterStatus
      );
    }

    // Apply payment status filter
    if (filterPayment !== "all") {
      filtered = filtered.filter(
        (order) => order.payment_status === filterPayment
      );
    }

    // Apply payment method filter
    if (filterPaymentMethod !== "all") {
      filtered = filtered.filter(
        (order) => order.payment_method === filterPaymentMethod
      );
    }

    // Calculate pagination
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = filtered.slice(startIndex, endIndex);

    setFilteredOrders(paginatedOrders);
    setPagination((prev) => ({
      ...prev,
      total: totalItems,
      last_page: totalPages,
      from: startIndex + 1,
      to: Math.min(endIndex, totalItems),
      current_page: currentPage,
    }));
  };

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters when search or filters change
  useEffect(() => {
    if (allOrders.length > 0) {
      setCurrentPage(1); // Reset to first page when filters change
      applyFilters(allOrders);
    }
  }, [
    searchTerm,
    filterStatus,
    filterPayment,
    filterPaymentMethod,
    itemsPerPage,
  ]);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      setCurrentPage(page);
      applyFilters(allOrders);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // Format currency
  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const [day, month, year] = dateString.split("-");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Calculate statistics from ALL orders (not filtered)
  const calculateStats = () => {
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce(
      (sum, order) => sum + parseFloat(order.amounts?.total || 0),
      0
    );
    const paidOrders = allOrders.filter(
      (o) => o.payment_status === "paid"
    ).length;
    const pendingOrders = allOrders.filter(
      (o) => o.order_status === "pending"
    ).length;

    return {
      totalOrders,
      totalRevenue,
      paidOrders,
      pendingOrders,
      avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    };
  };

  const stats = calculateStats();

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium`}
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
          border: `1px solid ${config.color}40`,
        }}
      >
        {config.label}
      </span>
    );
  };

  // Payment badge component
  const PaymentBadge = ({ status }) => {
    const config = paymentStatusConfig[status] || paymentStatusConfig.pending;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium`}
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
          border: `1px solid ${config.color}40`,
        }}
      >
        {config.label}
      </span>
    );
  };

  // Payment method badge component
  const PaymentMethodBadge = ({ method }) => {
    const config = paymentMethodConfig[method] || {
      label: method || "N/A",
      color: colors.mediumGray,
      bgColor: `${colors.mediumGray}15`,
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs`}
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
        }}
      >
        {config.label}
      </span>
    );
  };

  const handleDownloadInvoice = (order) => {
    setInvoiceOrder(order);
    setShowInvoice(true);
  };

  // Loading state
  if (loading && allOrders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2"
          style={{ borderColor: colors.primaryBlack }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.softBackground }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ color: colors.primaryBlack }}
              >
                Orders Management
              </h1>
              <p className="text-lg" style={{ color: colors.mediumGray }}>
                View and manage all customer orders
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchOrders()}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50"
                style={{
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack,
                }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-white rounded-xl border p-6"
            style={{ borderColor: colors.lightGray }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.mediumGray }}>
                  Total Orders
                </p>
                <h3
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.primaryBlack }}
                >
                  {stats.totalOrders}
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: colors.mediumGray }}
                >
                  Showing {pagination.from}-{pagination.to} of{" "}
                  {pagination.total}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${colors.info}10` }}
              >
                <Package className="w-6 h-6" style={{ color: colors.info }} />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl border p-6"
            style={{ borderColor: colors.lightGray }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.mediumGray }}>
                  Total Revenue
                </p>
                <h3
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.success }}
                >
                  {formatCurrency(stats.totalRevenue)}
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: colors.mediumGray }}
                >
                  {stats.totalOrders > 0
                    ? formatCurrency(stats.avgOrderValue)
                    : "₹0"}{" "}
                  average
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${colors.success}10` }}
              >
                <TrendingUp
                  className="w-6 h-6"
                  style={{ color: colors.success }}
                />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl border p-6"
            style={{ borderColor: colors.lightGray }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.mediumGray }}>
                  Paid Orders
                </p>
                <h3
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.success }}
                >
                  {stats.paidOrders}
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: colors.mediumGray }}
                >
                  {stats.totalOrders > 0
                    ? Math.round((stats.paidOrders / stats.totalOrders) * 100)
                    : 0}
                  % success
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${colors.success}10` }}
              >
                <Wallet className="w-6 h-6" style={{ color: colors.success }} />
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-xl border p-6"
            style={{ borderColor: colors.lightGray }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: colors.mediumGray }}>
                  Pending Orders
                </p>
                <h3
                  className="text-3xl font-bold mt-2"
                  style={{ color: colors.warning }}
                >
                  {stats.pendingOrders}
                </h3>
                <p
                  className="text-xs mt-1"
                  style={{ color: colors.mediumGray }}
                >
                  Needs attention
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${colors.warning}10` }}
              >
                <Clock className="w-6 h-6" style={{ color: colors.warning }} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          className="bg-white rounded-xl border p-6 mb-8"
          style={{ borderColor: colors.lightGray }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: colors.mediumGray }}
                />
                <input
                  type="text"
                  placeholder="Search by order number, customer name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all"
                  style={{
                    borderColor: colors.lightGray,
                    backgroundColor: colors.softBackground,
                    color: colors.primaryBlack,
                  }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Order Status Filter */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:border-gray-300 transition"
                  style={{
                    borderColor: colors.lightGray,
                    color: colors.primaryBlack,
                  }}
                >
                  <Filter size={16} />
                  <span>Status</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilterStatus(option.value)}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 ${
                        filterStatus === option.value ? "bg-green-50" : ""
                      }`}
                      style={{ color: colors.primaryBlack }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Status Filter */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:border-gray-300 transition"
                  style={{
                    borderColor: colors.lightGray,
                    color: colors.primaryBlack,
                  }}
                >
                  <CreditCard size={16} />
                  <span>Payment Status</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  {paymentStatusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilterPayment(option.value)}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 ${
                        filterPayment === option.value ? "bg-green-50" : ""
                      }`}
                      style={{ color: colors.primaryBlack }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Filter */}
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-4 py-2.5 border rounded-lg hover:border-gray-300 transition"
                  style={{
                    borderColor: colors.lightGray,
                    color: colors.primaryBlack,
                  }}
                >
                  <FileText size={16} />
                  <span>Payment Method</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  {paymentMethodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilterPaymentMethod(option.value)}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 ${
                        filterPaymentMethod === option.value
                          ? "bg-green-50"
                          : ""
                      }`}
                      style={{ color: colors.primaryBlack }}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: option.color }}
                      />
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items per page */}
              <div className="flex items-center gap-2">
                <select
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  className="px-3 py-2.5 rounded-lg border focus:outline-none"
                  style={{
                    borderColor: colors.lightGray,
                    backgroundColor: colors.softBackground,
                    color: colors.primaryBlack,
                  }}
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div
          className="bg-white rounded-xl border overflow-hidden mb-6"
          style={{ borderColor: colors.lightGray }}
        >
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package
                className="w-12 h-12 mx-auto mb-4"
                style={{ color: colors.lightGray }}
              />
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: colors.primaryBlack }}
              >
                No orders found
              </h3>
              <p style={{ color: colors.mediumGray }}>
                {searchTerm ||
                filterStatus !== "all" ||
                filterPayment !== "all" ||
                filterPaymentMethod !== "all"
                  ? "Try changing your search or filter criteria"
                  : "No orders have been placed yet"}
              </p>
            </div>
          ) : (
            <div className="max-w-[400px] md:max-w-[700px] lg:max-w-[1140px] overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr style={{ backgroundColor: colors.softBackground }}>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Order Details
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Customer
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Amount
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Status
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Payment
                      </span>
                    </th>
                    <th className="py-4 px-6 text-left">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: colors.primaryBlack }}
                      >
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.order_id}
                      className="border-t hover:bg-gray-50 transition-colors"
                      style={{ borderColor: colors.lightGray }}
                    >
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <Package
                                className="w-4 h-4"
                                style={{ color: colors.mediumGray }}
                              />
                              <span
                                className="font-medium"
                                style={{ color: colors.primaryBlack }}
                              >
                                {order.order_number}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar
                                className="w-4 h-4"
                                style={{ color: colors.mediumGray }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: colors.mediumGray }}
                              >
                                {formatDate(order.order_date)}
                              </span>
                            </div>
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: colors.mediumGray }}
                          >
                            {order.items?.length || 0} item
                            {order.items?.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <Users
                                className="w-4 h-4"
                                style={{ color: colors.mediumGray }}
                              />
                              <span
                                className="font-medium"
                                style={{ color: colors.primaryBlack }}
                              >
                                {order.customer?.name || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone
                                className="w-4 h-4"
                                style={{ color: colors.mediumGray }}
                              />
                              <span
                                className="text-sm"
                                style={{ color: colors.mediumGray }}
                              >
                                {order.customer?.mobile || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Mail
                                className="w-4 h-4"
                                style={{ color: colors.mediumGray }}
                              />
                              <span
                                className="text-sm truncate max-w-[180px]"
                                style={{ color: colors.mediumGray }}
                              >
                                {order.customer?.email || "N/A"}
                              </span>
                            </div>
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: colors.mediumGray }}
                          >
                            {order.customer?.address}, {order.customer?.pincode}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div
                            className="font-bold text-lg"
                            style={{ color: colors.primaryBlack }}
                          >
                            {formatCurrency(order.amounts?.total || 0)}
                          </div>
                          <div
                            className="text-xs space-y-1"
                            style={{ color: colors.mediumGray }}
                          >
                            <div>
                              Subtotal:{" "}
                              {formatCurrency(order.amounts?.subtotal || 0)}
                            </div>
                            <div>
                              Tax:{" "}
                              {formatCurrency(
                                parseFloat(order.amounts?.cgst || 0) +
                                  parseFloat(order.amounts?.sgst || 0) +
                                  parseFloat(order.amounts?.igst || 0)
                              )}
                            </div>
                            <PaymentMethodBadge method={order.payment_method} />
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={order.order_status} />
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <PaymentBadge status={order.payment_status} />
                          {order.payment?.payment_id && (
                            <div
                              className="text-xs font-mono truncate max-w-[150px]"
                              style={{ color: colors.mediumGray }}
                            >
                              ID: {order.payment.payment_id}
                            </div>
                          )}
                          {order.payment?.paid_at && (
                            <div
                              className="text-xs"
                              style={{ color: colors.mediumGray }}
                            >
                              Paid: {order.payment.paid_at}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/orders/${order.order_id}`)
                            }
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                            style={{
                              borderColor: colors.lightGray,
                              color: colors.primaryBlack,
                            }}
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button
                            onClick={() => handleDownloadInvoice(order)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all hover:bg-gray-50"
                            style={{
                              borderColor: colors.lightGray,
                              color: colors.primaryBlack,
                            }}
                          >
                            <Download className="w-4 h-4" />
                            Invoice
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

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm" style={{ color: colors.mediumGray }}>
              Showing {pagination.from} to {pagination.to} of {pagination.total}{" "}
              orders
            </div>

            <div className="flex items-center gap-2">
              {/* First page button */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack,
                }}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Previous page button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack,
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const totalPages = pagination.last_page;
                  const maxVisible = 5;

                  let startPage = Math.max(
                    1,
                    currentPage - Math.floor(maxVisible / 2)
                  );
                  let endPage = Math.min(
                    totalPages,
                    startPage + maxVisible - 1
                  );

                  if (endPage - startPage + 1 < maxVisible) {
                    startPage = Math.max(1, endPage - maxVisible + 1);
                  }

                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          currentPage === i
                            ? "border"
                            : "border hover:bg-gray-50"
                        }`}
                        style={{
                          borderColor:
                            currentPage === i
                              ? colors.primaryBlack
                              : colors.lightGray,
                          backgroundColor:
                            currentPage === i
                              ? colors.primaryBlack
                              : "transparent",
                          color:
                            currentPage === i
                              ? colors.pureWhite
                              : colors.primaryBlack,
                        }}
                      >
                        {i}
                      </button>
                    );
                  }
                  return pages;
                })()}
              </div>

              {/* Next page button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.last_page}
                className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack,
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last page button */}
              <button
                onClick={() => handlePageChange(pagination.last_page)}
                disabled={currentPage === pagination.last_page}
                className="p-2 rounded-lg border transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: colors.lightGray,
                  color: colors.primaryBlack,
                }}
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {showInvoice && invoiceOrder && (
        <InvoiceGenerator
          order={invoiceOrder}
          onClose={() => {
            setShowInvoice(false);
            setInvoiceOrder(null);
          }}
          isOpen={showInvoice}
        />
      )}
    </div>
  );
};

export default HandleOrder;
