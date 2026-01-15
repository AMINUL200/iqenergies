import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard, 
  Calendar, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Download,
  Printer,
  Mail,
  Phone,
  FileText,
  Box,
  Tag,
  DollarSign,
  Percent,
  Layers,
  RefreshCw,
  Edit,
  Save,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../../utils/app';
import AdminLoader from '../../../component/admin/AdminLoader';

const HandleOrdersDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    note: ''
  });
  const [isEditingStatus, setIsEditingStatus] = useState(false);

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/orders/${id}`);
      
      if (response.data?.success) {
        setOrderData(response.data.data);
      } else {
        toast.error('Failed to load order details');
        navigate('/admin/handle-orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error(error.response?.data?.message || 'Failed to load order details');
      navigate('/admin/handle-orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!statusUpdate.status) {
      toast.error('Please select a status');
      return;
    }

    try {
      setUpdatingStatus(true);
      const response = await api.post(`/admin/orders/${id}/status`, statusUpdate);
      
      if (response.data?.success) {
        toast.success('Order status updated successfully!');
        setIsEditingStatus(false);
        setStatusUpdate({ status: '', note: '' });
        fetchOrderDetails(); // Refresh data
      } else {
        toast.error(response.data?.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'installation_scheduled':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'installation_scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // Status options for dropdown
  const statusOptions = [
    { value: 'confirmed', label: 'Confirmed' },
    // { value: 'processing', label: 'Processing' },
    // { value: 'shipped', label: 'Shipped' },
    { value: 'installation_scheduled', label: 'Installation Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  if (loading) {
    return <AdminLoader />;
  }

  if (!orderData) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Order not found</h3>
        <button
          onClick={() => navigate('/admin/handle-orders')}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const { order, status_timeline } = orderData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <button
                onClick={() => navigate('/admin/handle-orders')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Orders
              </button>
              
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-900 rounded-xl">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Order #{order.order_number}
                  </h1>
                  <p className="text-gray-600">
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={fetchOrderDetails}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Summary & Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Card */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Tag className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Order Status
                  </h2>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                    <span className="flex items-center gap-2">
                      {getStatusIcon(order.order_status)}
                      {order.order_status.replace('_', ' ').toUpperCase()}
                    </span>
                  </span>
                  
                  {!isEditingStatus ? (
                    <button
                      onClick={() => setIsEditingStatus(true)}
                      className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    >
                      <Edit className="w-3 h-3" />
                      Change Status
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditingStatus(false)}
                      className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    >
                      <X className="w-3 h-3" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {isEditingStatus ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Status
                    </label>
                    <select
                      value={statusUpdate.status}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="">Select Status</option>
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note (Optional)
                    </label>
                    <textarea
                      value={statusUpdate.note}
                      onChange={(e) => setStatusUpdate(prev => ({ ...prev, note: e.target.value }))}
                      rows="3"
                      placeholder="Add a note about this status change..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleStatusUpdate}
                      disabled={updatingStatus || !statusUpdate.status}
                      className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {updatingStatus ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Update Status
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditingStatus(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Payment Status</div>
                      <div className={`px-2 py-1 rounded-full text-sm font-medium inline-block ${
                        order.payment_status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.payment_status.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Payment Method</div>
                      <div className="font-medium">{order.payment_method}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Items</div>
                      <div className="font-medium">{order.items.length}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Order Total</div>
                      <div className="font-medium">₹{order.total}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Package className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Items
                </h2>
              </div>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {item.product?.images?.[0]?.web_image_url ? (
                        <img
                          src={item.product.images[0].web_image_url}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      
                      <div>
                        <h3 className="font-medium text-gray-900">{item.product?.title}</h3>
                        <p className="text-sm text-gray-600">Model: {item.product?.model_no || 'N/A'}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium text-gray-900">₹{item.price_including_gst}</div>
                      <div className="text-sm text-gray-600">Base: ₹{item.base_price}</div>
                      <div className="text-sm text-gray-600">GST: ₹{item.gst_amount}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="mt-8 pt-8 border-t">
                <div className="space-y-2 max-w-md ml-auto">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CGST ({order.cgst}%)</span>
                    <span>₹{order.cgst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SGST ({order.sgst}%)</span>
                    <span>₹{order.sgst}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IGST ({order.igst}%)</span>
                    <span>₹{order.igst}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-gray-900">₹{order.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Details
                </h2>
              </div>

              {order.payments?.length > 0 ? (
                <div className="space-y-4">
                  {order.payments.map((payment) => (
                    <div key={payment.id} className="p-4 border rounded-lg">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Payment ID</div>
                          <div className="font-medium">{payment.gateway_payment_id}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Amount</div>
                          <div className="font-medium">₹{payment.amount} {payment.currency}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Status</div>
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                            payment.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {payment.status.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Paid At</div>
                          <div className="font-medium">{formatDate(payment.paid_at)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No payment details available</p>
              )}
            </div>
          </div>

          {/* Right Column - Customer Info & Timeline */}
          <div className="lg:col-span-1 space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Customer Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Customer Name</div>
                  <div className="font-medium flex items-center gap-2">
                    {order.user?.image_url && (
                      <img
                        src={order.user.image_url}
                        alt={order.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    {order.customer_name}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-600 mb-1">Contact Details</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <a href={`tel:${order.mobile}`} className="hover:text-blue-600">
                        {order.mobile}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <a href={`mailto:${order.email}`} className="hover:text-blue-600">
                        {order.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-1">Installation Address</div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <div className="font-medium">{order.installation_address}</div>
                      <div className="text-sm text-gray-600">
                        {order.state}, {order.pincode}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-600 mb-1">Account Details</div>
                  <div className="text-sm">
                    <div>User ID: {order.user_id}</div>
                    <div>Registered: {formatDate(order.user?.created_at)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order Timeline
                </h2>
              </div>

              <div className="space-y-4">
                {status_timeline?.length > 0 ? (
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {status_timeline.map((status, index) => (
                      <div key={status.id} className="relative flex items-start gap-4 mb-6 last:mb-0">
                        {/* Status dot */}
                        <div className={`z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-gray-900' : 'bg-white border-2 border-gray-300'
                        }`}>
                          {getStatusIcon(status.status)}
                        </div>
                        
                        {/* Status content */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900 capitalize">
                                {status.status.replace('_', ' ')}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">{status.note}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(status.created_at).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No timeline available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleOrdersDetails;