import React, { useState } from "react";
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
} from "lucide-react";

const OrderTrackingPage = () => {
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

  // 🔥 Order Data (Simulated API Response)
  const [order, setOrder] = useState({
    id: "IQE-10231",
    date: "12 Aug 2025",
    status: "delivered",
    estimatedDelivery: "15 Aug 2025",
    actualDelivery: "14 Aug 2025",
    deliveryAgent: {
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      rating: 4.8,
      vehicle: "Tata Ace",
      vehicleNo: "WB-12-AB-1234",
    },
    product: {
      name: "Solar Panel 550W Mono PERC",
      description: "High efficiency monocrystalline solar panel with PERC technology",
      sku: "SP-550W-MONO-PERC",
      qty: 4,
      price: 18999,
      warranty: "25 years",
      rating: 4.7,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
    },
    address: {
      name: "Aminul Islam",
      phone: "+91 98765 43210",
      email: "aminul@example.com",
      location: "Murarai, Birbhum",
      city: "West Bengal",
      pincode: "731219",
      country: "India",
      coordinates: "24.396308, 87.848854",
    },
    payment: {
      method: "UPI (PhonePe)",
      subtotal: 75996,
      shipping: 0,
      tax: 13679,
      discount: 2000,
      total: 87675,
      transactionId: "TXN6789012345",
      paidAt: "12 Aug 2025, 10:30 AM",
    },
    tracking: {
      trackingId: "TRK7890123456",
      courier: "IQE Express",
      service: "Premium Delivery",
      estimatedWeight: "22 kg",
      dimensions: "200x100x3.5 cm",
    },
    timeline: [
      {
        id: 1,
        status: "ordered",
        title: "Order Placed",
        description: "Your order has been received",
        timestamp: "12 Aug, 10:30 AM",
        completed: true,
      },
      {
        id: 2,
        status: "confirmed",
        title: "Order Confirmed",
        description: "Payment verified and order confirmed",
        timestamp: "12 Aug, 11:45 AM",
        completed: true,
      },
      {
        id: 3,
        status: "processing",
        title: "Processing",
        description: "Order is being prepared for shipment",
        timestamp: "12 Aug, 2:30 PM",
        completed: true,
      },
      {
        id: 4,
        status: "shipped",
        title: "Shipped",
        description: "Package has left our warehouse",
        timestamp: "13 Aug, 9:15 AM",
        completed: true,
      },
      {
        id: 5,
        status: "out_for_delivery",
        title: "Out for Delivery",
        description: "Package is with delivery agent",
        timestamp: "14 Aug, 8:00 AM",
        completed: true,
      },
      {
        id: 6,
        status: "delivered",
        title: "Delivered",
        description: "Package successfully delivered",
        timestamp: "14 Aug, 3:45 PM",
        completed: true,
      },
    ],
  });

  const [showQR, setShowQR] = useState(false);
  const [showMap, setShowMap] = useState(false);

  /* ================= STATUS CONFIG ================= */
  const statusConfig = {
    ordered: { color: colors.info, label: "Ordered", icon: Package },
    confirmed: { color: colors.purple, label: "Confirmed", icon: CheckCircle },
    processing: { color: colors.warning, label: "Processing", icon: RefreshCw },
    shipped: { color: colors.info, label: "Shipped", icon: Truck },
    out_for_delivery: { color: colors.success, label: "Out for Delivery", icon: Navigation },
    delivered: { color: colors.success, label: "Delivered", icon: CheckCircle },
  };

  /* ================= HANDLERS ================= */
  const downloadInvoice = () => {
    alert(`Downloading invoice for ${order.id}`);
    // Implement download logic
  };

  const printOrder = () => {
    window.print();
  };

  const contactSupport = () => {
    alert("Connecting to support...");
    // Implement support logic
  };

  const trackOnMap = () => {
    setShowMap(true);
    alert("Opening map with tracking...");
  };

  const shareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order ${order.id}`,
        text: `Track my IQEnergies order: ${order.tracking.trackingId}`,
        url: window.location.href,
      });
    } else {
      alert("Order link copied to clipboard!");
    }
  };

  const requestCallback = () => {
    alert("Support will call you shortly!");
  };

  const rateDelivery = () => {
    alert("Opening rating modal...");
  };

  /* ================= COMPONENTS ================= */
  const StatusIndicator = ({ status, current }) => {
    const config = statusConfig[status];
    
    return (
      <div className="relative flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            current ? 'animate-pulse' : ''
          }`}
          style={{
            backgroundColor: config.color + '20',
            border: `2px solid ${config.color}`,
          }}
        >
          <config.icon size={16} style={{ color: config.color }} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm" style={{ color: colors.text }}>
            {config.label}
          </p>
          {current && (
            <p className="text-xs mt-1" style={{ color: colors.muted }}>
              Current Status
            </p>
          )}
        </div>
      </div>
    );
  };

  const TimelineStep = ({ step, isLast }) => (
    <div className="relative">
      <div className="flex gap-3">
        {/* Timeline Dot */}
        <div className="flex flex-col items-center">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
              step.completed
                ? 'bg-green-500 border-2 border-green-500'
                : 'bg-white border-2 border-gray-300'
            }`}
          >
            {step.completed ? (
              <CheckCircle size={12} className="text-white" />
            ) : (
              <Clock size={12} className="text-gray-400" />
            )}
          </div>
          
          {/* Vertical Line */}
          {!isLast && (
            <div
              className={`w-0.5 h-full ${
                step.completed ? 'bg-green-500' : 'bg-gray-200'
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
                {step.title}
              </p>
              <p className="text-sm mt-1" style={{ color: colors.muted }}>
                {step.description}
              </p>
            </div>
            <span className="text-sm font-medium" style={{ color: colors.muted }}>
              {step.timestamp}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 lg:px-16 py-10 pt-30 md:pt-40">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <Home size={14} />
              <ChevronRight size={14} />
              <span>Orders</span>
              <ChevronRight size={14} />
              <span className="font-medium" style={{ color: colors.text }}>
                {order.id}
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
            <button
              onClick={downloadInvoice}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              style={{ color: colors.text }}
            >
              <Download size={16} />
              Invoice
            </button>
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
          style={{ borderLeft: `4px solid ${colors.primary}` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <p className="text-xl font-bold mt-1" style={{ color: colors.primary }}>
                {statusConfig[order.status].label}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.muted }}>
                Updated: {order.timeline[order.timeline.length - 1].timestamp}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <Package size={24} style={{ color: colors.primary }} />
            </div>
          </div>
        </div>

        {/* Tracking Info */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tracking ID</p>
              <p className="text-lg font-mono font-bold mt-1" style={{ color: colors.text }}>
                {order.tracking.trackingId}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Truck size={12} className="text-gray-400" />
                <p className="text-xs" style={{ color: colors.muted }}>
                  {order.tracking.courier} • {order.tracking.service}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowQR(!showQR)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <QrCode size={24} style={{ color: colors.text }} />
            </button>
          </div>

          {/* QR Code */}
          {showQR && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Scan to Track</p>
                <button
                  onClick={() => navigator.clipboard.writeText(order.tracking.trackingId)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Copy ID
                </button>
              </div>
              <div className="bg-white p-3 rounded-lg flex justify-center">
                {/* QR Code Placeholder */}
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <div className="text-xs font-bold mb-1">IQE</div>
                    <div className="text-xs">TRACK</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivery</p>
              <p className="text-lg font-bold mt-1" style={{ color: colors.success }}>
                {order.status === 'delivered' ? 'Delivered' : 'In Transit'}
              </p>
              <p className="text-xs mt-1" style={{ color: colors.muted }}>
                {order.status === 'delivered'
                  ? `Delivered on ${order.actualDelivery}`
                  : `Est. delivery: ${order.estimatedDelivery}`}
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${colors.success}15` }}
            >
              <Truck size={24} style={{ color: colors.success }} />
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
                onClick={() => alert("Refreshing tracking...")}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>

            <div className="space-y-1">
              {order.timeline.map((step, index) => (
                <TimelineStep
                  key={step.id}
                  step={step}
                  isLast={index === order.timeline.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg" style={{ color: colors.text }}>
                Product Details
              </h3>
              <button
                onClick={() => alert("Viewing product details...")}
                className="flex items-center gap-2 text-sm font-medium"
                style={{ color: colors.primary }}
              >
                View Product
                <ExternalLink size={14} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0">
                <div className="w-full sm:w-48 h-48 bg-gradient-to-br from-green-50 to-green-100 rounded-xl overflow-hidden">
                  <img
                    src={order.product.image}
                    alt={order.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <h4 className="font-bold text-xl" style={{ color: colors.text }}>
                  {order.product.name}
                </h4>
                <p className="text-sm mt-2" style={{ color: colors.muted }}>
                  {order.product.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-gray-500">SKU</p>
                    <p className="font-medium">{order.product.sku}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Quantity</p>
                    <p className="font-medium">{order.product.qty} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="font-medium">₹{order.product.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Warranty</p>
                    <p className="font-medium">{order.product.warranty}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < Math.floor(order.product.rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{order.product.rating}/5</span>
                  <span className="text-sm text-gray-500">
                    ({order.product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
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
                  <p className="font-medium">{order.address.name}</p>
                  <p className="text-sm text-gray-600">{order.address.phone}</p>
                  <p className="text-sm text-gray-600">{order.address.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Home size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm">{order.address.location}</p>
                  <p className="text-sm">
                    {order.address.city}, {order.address.pincode}
                  </p>
                  <p className="text-sm">{order.address.country}</p>
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
              <button
                onClick={() => alert("Editing address...")}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                style={{ color: colors.text }}
              >
                Edit
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
                <span className="font-medium">₹{order.payment.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (18%)</span>
                <span>₹{order.payment.tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">-₹{order.payment.discount.toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-3 mt-2">
                <div className="flex justify-between font-bold">
                  <span style={{ color: colors.text }}>Total Amount</span>
                  <span className="text-lg">₹{order.payment.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <p className="text-xs text-gray-500">
                  <span className="font-medium">Payment Method:</span> {order.payment.method}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Transaction ID:</span> {order.payment.transactionId}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Paid at:</span> {order.payment.paidAt}
                </p>
              </div>
            </div>
          </div>

          {/* Support & Actions */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4" style={{ color: colors.text }}>
              Need Help?
            </h3>

            <div className="space-y-3">
              <button
                onClick={contactSupport}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <MessageSquare size={18} className="text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium" style={{ color: colors.text }}>
                      Chat Support
                    </p>
                    <p className="text-xs text-gray-500">24/7 Available</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
              </button>

              <button
                onClick={requestCallback}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <Phone size={18} className="text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium" style={{ color: colors.text }}>
                      Request Callback
                    </p>
                    <p className="text-xs text-gray-500">Get a call in 30 mins</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
              </button>

              <button
                onClick={rateDelivery}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-50">
                    <Star size={18} className="text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium" style={{ color: colors.text }}>
                      Rate Delivery
                    </p>
                    <p className="text-xs text-gray-500">Share your experience</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WARRANTY BANNER ================= */}
      <div className="mt-8 p-5 rounded-xl" style={{ backgroundColor: `${colors.primary}10` }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Shield size={24} style={{ color: colors.primary }} />
            <div>
              <h3 className="font-semibold" style={{ color: colors.primaryDark }}>
                Warranty Protection Active
              </h3>
              <p className="text-sm mt-1" style={{ color: colors.muted }}>
                Your {order.product.warranty} warranty is now active. 
                Keep your invoice safe for any future claims.
              </p>
            </div>
          </div>
          <button
            onClick={() => alert("Viewing warranty details...")}
            className="px-4 py-2 rounded-lg font-medium transition hover:scale-105 whitespace-nowrap"
            style={{
              backgroundColor: colors.primary,
              color: 'white',
            }}
          >
            View Warranty
          </button>
        </div>
      </div>
    </div>
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