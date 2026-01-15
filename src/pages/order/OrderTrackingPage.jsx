import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  Truck,
  Clock,
  Download,
  Printer,
  MessageSquare,
  Phone,
  RefreshCw,
  Share2,
  Bell,
  AlertCircle,
  Shield,
  Star,
  ChevronRight,
  Home,
  User,
  Navigation,
  QrCode,
  FileText,
  ExternalLink,
  XCircle,
  Info,
} from "lucide-react";
import { api } from "../../utils/app";
import PageLoader from "../../component/common/PageLoader";
import InvoiceGenerator from "../invoic/InvoiceGenerator";

const OrderTrackingPage = () => {
  const { orderId } = useParams();
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
    softBg: "#F9FAFB",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    purple: "#8B5CF6",
  };

  // State for order data
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  /* ================= FETCH ORDER DATA ================= */
  const fetchOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/orders/${orderId}/tracking`);
      
      if (response.data?.success) {
        setOrder(response.data.data);
      } else {
        setError("Failed to load order data");
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.response?.data?.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  /* ================= INVOICE HANDLERS ================= */
  const handleViewInvoice = () => {
    if (!order?.order) return;
    
    const orderData = order.order;
    const products = order.products;
    
    // Prepare order data for invoice
    const invoiceOrder = {
      order_id: orderData.order_id,
      order_number: orderData.order_number,
      order_date: orderData.order_date,
      order_status: orderData.order_status,
      payment_status: orderData.payment_status,
      total: orderData.total,
      payment_method: orderData.payment_method,
      payment_id: orderData.payment_id,
      customer: {
        name: orderData.customer_name,
        email: orderData.email,
        mobile: orderData.mobile,
        address: orderData.installation_address,
        state: orderData.state,
        pincode: orderData.pincode,
      },
      amounts: {
        subtotal: orderData.subtotal,
        total: orderData.total,
        cgst: orderData.cgst || 0,
        sgst: orderData.sgst || 0,
        igst: orderData.igst || 0,
      },
      items: products.map(product => ({
        product_id: product.product_id,
        title: product.title,
        image: product.image,
        quantity: product.quantity || 1,
        base_price: product.price || (parseFloat(product.sell_price) / parseFloat(product.quantity || 1)).toFixed(2),
        total: (parseFloat(product.price || product.sell_price) * parseFloat(product.quantity || 1)).toFixed(2),
      })),
    };
    
    setSelectedOrderForInvoice(invoiceOrder);
    setShowInvoiceModal(true);
  };

  const handleCloseInvoice = () => {
    setShowInvoiceModal(false);
    setSelectedOrderForInvoice(null);
  };

  /* ================= STATUS CONFIG ================= */
  const statusConfig = {
    pending: { 
      color: colors.warning, 
      label: "Pending", 
      icon: Clock,
      progress: 10,
      description: "Order placed by customer"
    },
    confirmed: { 
      color: colors.success, 
      label: "Confirmed", 
      icon: CheckCircle,
      progress: 25,
      description: "Payment verified successfully"
    },
    processing: { 
      color: colors.info, 
      label: "Processing", 
      icon: RefreshCw,
      progress: 50,
      description: "Order is being prepared"
    },
    shipped: { 
      color: colors.purple, 
      label: "Shipped", 
      icon: Truck,
      progress: 75,
      description: "Order has been shipped"
    },
    out_for_delivery: { 
      color: colors.secondary, 
      label: "Out for Delivery", 
      icon: Navigation,
      progress: 90,
      description: "Package is with delivery agent"
    },
    delivered: { 
      color: colors.success, 
      label: "Delivered", 
      icon: CheckCircle,
      progress: 100,
      description: "Package successfully delivered"
    },
    cancelled: { 
      color: colors.error, 
      label: "Cancelled", 
      icon: XCircle,
      progress: 0,
      description: "Order has been cancelled"
    },
    installation_scheduled:{
      color: colors.info,
      label: "Installation Scheduled",
      icon: Calendar,
      progress: 100,
      description: "Installation date has been scheduled"
    }
  };

  /* ================= FORMAT FUNCTIONS ================= */
  const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    const date = new Date(`${year}-${month}-${day}${timePart ? 'T' + timePart : ''}`);
    
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      ...(timePart && { hour: '2-digit', minute: '2-digit' })
    });
  };

  const getLatestStatus = () => {
    if (!order?.tracking || order.tracking.length === 0) {
      return statusConfig.pending;
    }
    const latestTracking = order.tracking[order.tracking.length - 1];
    return statusConfig[latestTracking.status] || statusConfig.pending;
  };

  const calculateProgress = () => {
    const latestStatus = getLatestStatus();
    return latestStatus.progress;
  };

  const getTotalTax = () => {
    if (!order?.order) return 0;
    const { cgst, sgst, igst } = order.order;
    return parseFloat(cgst || 0) + parseFloat(sgst || 0) + parseFloat(igst || 0);
  };

  /* ================= HANDLERS ================= */
  const downloadInvoice = () => {
    handleViewInvoice(); // Open invoice modal which has download option
  };

  const printOrder = () => {
    window.print();
  };

  const contactSupport = () => {
    alert("Connecting to support...");
    // Implement support logic
  };

  const trackOnMap = () => {
    alert("Map tracking feature coming soon!");
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${order?.order?.order_number}`,
        text: `Track my IQEnergies order`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Order link copied to clipboard!");
    }
  };

  const requestCallback = () => {
    alert("Support will call you shortly!");
  };

  const rateDelivery = () => {
    alert("Rating feature coming soon!");
  };

  /* ================= COMPONENTS ================= */
  const TimelineStep = ({ step, isLast, isActive }) => (
    <div className="relative">
      <div className="flex gap-3">
        {/* Timeline Dot */}
        <div className="flex flex-col items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
              isActive
                ? 'bg-green-500 border-2 border-green-500'
                : 'bg-white border-2 border-gray-300'
            }`}
          >
            {isActive ? (
              <CheckCircle size={12} className="text-white" />
            ) : (
              <Clock size={12} className="text-gray-400" />
            )}
          </div>
          
          {/* Vertical Line */}
          {!isLast && (
            <div
              className={`w-0.5 h-full ${
                isActive ? 'bg-green-500' : 'bg-gray-200'
              }`}
              style={{ height: 'calc(100% + 1rem)' }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="font-medium" style={{ color: colors.text }}>
                {step.label}
              </p>
              <p className="text-sm mt-1" style={{ color: colors.muted }}>
                {step.note}
              </p>
            </div>
            <span className="text-sm font-medium" style={{ color: colors.muted }}>
              {formatDate(step.time)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium`}
        style={{ 
          color: config.color,
          backgroundColor: `${config.color}20`,
          border: `1px solid ${config.color}40`
        }}
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

  /* ================= LOADING STATE ================= */
  if (loading) {
    return <PageLoader/>;
  }

  /* ================= ERROR STATE ================= */
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 md:px-8 lg:px-16 py-10 pt-30 md:pt-40">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <AlertCircle size={64} className="mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Unable to Load Order</h2>
            <p className="text-gray-600 mb-6">
              {error || "Order not found or you don't have permission to view it."}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={fetchOrderData}
                className="px-6 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
              >
                <RefreshCw size={16} className="inline mr-2" />
                Retry
              </button>
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { order: orderData, products, tracking } = order;
  const currentStatus = getLatestStatus();
  const progressPercentage = calculateProgress();

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 md:px-8 lg:px-16 py-10 pt-30 md:pt-40">
        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <button 
                  onClick={() => navigate('/orders')}
                  className="flex items-center gap-1 hover:text-green-600 transition"
                >
                  <Home size={14} />
                  <span>Orders</span>
                </button>
                <ChevronRight size={14} />
                <span className="font-medium" style={{ color: colors.text }}>
                  {orderData.order_number}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold" style={{ color: colors.text }}>
                Order Tracking
              </h1>
              <p className="text-sm mt-1" style={{ color: colors.muted }}>
                Track your IQEnergies order in real-time
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Invoice Button */}
              {orderData.payment_status === "paid" && (
                <button
                  onClick={handleViewInvoice}
                  className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
                >
                  <FileText size={16} />
                  View Invoice
                </button>
              )}
              <button
                onClick={printOrder}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                style={{ color: colors.text }}
              >
                <Printer size={16} />
                Print
              </button>
              <button
                onClick={shareOrder}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                style={{ color: colors.text }}
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>

        {/* ================= STATUS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Order Status */}
          <div
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm"
            style={{ borderLeft: `4px solid ${currentStatus.color}` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <p className="text-xl font-bold mt-1" style={{ color: currentStatus.color }}>
                  {currentStatus.label}
                </p>
                <p className="text-xs mt-1" style={{ color: colors.muted }}>
                  {currentStatus.description}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${currentStatus.color}15` }}
              >
                <currentStatus.icon size={24} style={{ color: currentStatus.color }} />
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order Details</p>
                <p className="text-lg font-mono font-bold mt-1" style={{ color: colors.text }}>
                  {orderData.order_number}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={12} className="text-gray-400" />
                  <p className="text-xs" style={{ color: colors.muted }}>
                    Ordered: {formatDate(orderData.order_date)}
                  </p>
                </div>
              </div>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <QrCode size={24} style={{ color: colors.text }} />
              </button>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <p className={`text-lg font-bold mt-1 ${
                  orderData.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {orderData.payment_status === 'paid' ? 'Paid' : 'Pending'}
                </p>
                <p className="text-xs mt-1" style={{ color: colors.muted }}>
                  Method: {orderData.payment_method === 'razorpay' ? 'Online Payment' : 
                           orderData.payment_method === 'cod' ? 'Cash on Delivery' : 
                           orderData.payment_method || 'N/A'}
                </p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${orderData.payment_status === 'paid' ? colors.success : colors.warning}15` }}
              >
                <CreditCard size={24} style={{ 
                  color: orderData.payment_status === 'paid' ? colors.success : colors.warning 
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Timeline */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                  Order Timeline
                </h3>
                <button
                  onClick={fetchOrderData}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: colors.primary }}
                >
                  <RefreshCw size={14} />
                  Refresh
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Order Placed</span>
                  <span>{progressPercentage}% Complete</span>
                </div>
                <ProgressBar percentage={progressPercentage} />
              </div>

              {/* Timeline Steps */}
              <div className="space-y-1">
                {tracking && tracking.length > 0 ? (
                  tracking.map((step, index) => (
                    <TimelineStep
                      key={index}
                      step={step}
                      isLast={index === tracking.length - 1}
                      isActive={true} // All tracking steps are active/complete
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={32} className="mx-auto mb-3" />
                    <p>No tracking information available yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                  Product Details
                </h3>
                <div className="text-sm">
                  <span className="text-gray-500">Total Items: </span>
                  <span className="font-medium">{products.length}</span>
                </div>
              </div>

              {products.map((product, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-6 mb-6 last:mb-0 pb-6 last:pb-0 border-b last:border-b-0 border-gray-100">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-full sm:w-48 h-48 bg-gradient-to-br from-green-50 to-green-100 rounded-xl overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h4 className="font-bold text-xl" style={{ color: colors.text }}>
                      {product.title}
                    </h4>
                    <p className="text-sm mt-2" style={{ color: colors.muted }}>
                      {product.short_description || "No description available"}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">Model No</p>
                        <p className="font-medium">{product.model_no || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="font-medium">{product.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="font-medium">{formatCurrency(product.price || product.sell_price)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Delivery Time</p>
                        <p className="font-medium">{product.delivery_time || "N/A"}</p>
                      </div>
                    </div>

                    {/* Product Features */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">Product Type</p>
                        <p className="font-medium">{product.product_type || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Discount</p>
                        <p className="font-medium text-green-600">
                          {product.discount_percentage}% OFF
                        </p>
                      </div>
                    </div>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center gap-2 mt-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < Math.floor(parseFloat(product.rating))
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium">{product.rating}/5</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT COLUMN ================= */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin size={18} />
                <span style={{ color: colors.text }}>Delivery Address</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{orderData.customer_name}</p>
                    <p className="text-sm text-gray-600">{orderData.mobile}</p>
                    <p className="text-sm text-gray-600">{orderData.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Home size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm">{orderData.installation_address}</p>
                    <p className="text-sm">
                      {orderData.state}, {orderData.pincode}
                    </p>
                    <p className="text-sm">India</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={trackOnMap}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  style={{ color: colors.text }}
                >
                  <Navigation size={14} />
                  Track on Map
                </button>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard size={18} />
                <span style={{ color: colors.text }}>Payment Summary</span>
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST ({parseFloat(orderData.cgst || 0) > 0 ? '9%' : '0%'})</span>
                  <span>{formatCurrency(orderData.cgst)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SGST ({parseFloat(orderData.sgst || 0) > 0 ? '9%' : '0%'})</span>
                  <span>{formatCurrency(orderData.sgst)}</span>
                </div>
                {parseFloat(orderData.igst || 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">IGST (18%)</span>
                    <span>{formatCurrency(orderData.igst)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3 mt-2">
                  <div className="flex justify-between font-bold">
                    <span style={{ color: colors.text }}>Total Amount</span>
                    <span className="text-lg">{formatCurrency(orderData.total)}</span>
                  </div>
                </div>

                {orderData.payment_id && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">Payment ID:</span> {orderData.payment_id}
                    </p>
                  </div>
                )}
              </div>

              {/* Invoice Button in Payment Summary */}
              {orderData.payment_status === "paid" && (
                <div className="mt-4 pt-4 border-t">
                  <button
                    onClick={handleViewInvoice}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition"
                  >
                    <FileText size={16} />
                    View & Download Invoice
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-lg mb-4" style={{ color: colors.text }}>
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleViewInvoice}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <FileText size={16} className="text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium" style={{ color: colors.text }}>Invoice</p>
                      <p className="text-xs" style={{ color: colors.muted }}>Download or print invoice</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-400" />
                </button>
                <button
                  onClick={contactSupport}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <MessageSquare size={16} className="text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium" style={{ color: colors.text }}>Contact Support</p>
                      <p className="text-xs" style={{ color: colors.muted }}>Chat with customer support</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>
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

export default OrderTrackingPage;

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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;

export const OrderTrackingStyles = () => <style>{styles}</style>;