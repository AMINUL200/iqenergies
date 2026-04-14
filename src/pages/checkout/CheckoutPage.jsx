import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  ArrowRight,
  Zap,
  CreditCard,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../utils/app";
import PageLoader from "../../component/common/PageLoader";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    mobile: "",
    email: "",
    installation_address: "",
    pincode: "",
    state: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [paymentMode, setPaymentMode] = useState("online"); // "online" or "cod"
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState("");

  // Available payment methods (can be expanded later)
  const paymentMethods = [
    {
      id: "razorpay",
      name: "Razorpay",
      description: "Pay with Credit/Debit Card, UPI, Net Banking",
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      mode: "online",
    },
  ];

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const fetchStateFromPincode = async (pincode) => {
    if (pincode.length !== 6) return;

    try {
      setPincodeLoading(true);
      setPincodeError("");

      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await res.json();

      if (data[0]?.Status === "Success") {
        const postOffice = data[0].PostOffice[0];

        setFormData((prev) => ({
          ...prev,
          state: postOffice.State,
        }));
      } else {
        setPincodeError("Invalid pincode");
        setFormData((prev) => ({ ...prev, state: "" }));
      }
    } catch (error) {
      setPincodeError("Failed to fetch state");
    } finally {
      setPincodeLoading(false);
    }
  };

  const fetchCheckoutData = async () => {
    try {
      const res = await api.get("/cart");
      if (res.data?.success) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load checkout data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Calculate subtotal from sell_price
  const calculateSubtotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      const sellPrice = parseFloat(item.product?.sell_price) || 0;
      const quantity = item.quantity || 1;
      return total + (sellPrice * quantity);
    }, 0);
  };

  // Calculate total savings from discount
  const calculateTotalSavings = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((savings, item) => {
      const originalPrice = parseFloat(item.product?.price) || 0;
      const sellPrice = parseFloat(item.product?.sell_price) || 0;
      const quantity = item.quantity || 1;
      return savings + ((originalPrice - sellPrice) * quantity);
    }, 0);
  };

  const handlePaymentModeChange = (mode) => {
    setPaymentMode(mode);
    if (mode === "cod") {
      setPaymentMethod("cod");
      setShowPaymentDropdown(false);
    } else {
      // Set to first available online payment method
      setPaymentMethod(paymentMethods[0]?.id || "razorpay");
    }
  };

  const handlePaymentMethodSelect = (methodId) => {
    setPaymentMethod(methodId);
    setShowPaymentDropdown(false);
  };

  const handlePlaceOrder = async () => {
    if (processing) return;

    // Validate required fields
    const requiredFields = [
      "customer_name",
      "mobile",
      "email",
      "installation_address",
      "pincode",
      "state",
    ];

    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        alert(`Please fill in ${field.replace("_", " ")}`);
        return;
      }
    }

    if (!cart?.items?.length) {
      alert("Your cart is empty");
      return;
    }

    try {
      setProcessing(true);

      const orderData = {
        ...formData,
        payment_method: paymentMethod,
        items: cart.items.map((item) => ({
          product_id: item.product_id || item.product?.id,
          quantity: item.quantity,
        })),
      };

      // Step 1: Create Order
      const orderResponse = await api.post("/checkout", orderData);

      if (orderResponse.data?.success) {
        const order = orderResponse.data.order;
        const orderId = order.id || order.order_id;
        
        console.log("Order created:", order);

        // Step 2: If payment method is online, initiate payment
        if (paymentMode === "online") {
          await handleOnlinePayment(orderId, order);
        } else {
          // For COD, navigate to success page
          navigate(`/order-success?order_id=${orderId}`);
        }
      } else {
        throw new Error(orderResponse.data?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleOnlinePayment = async (orderId, orderData) => {
    if (paymentMethod === "razorpay") {
      await initiateRazorpayPayment(orderId, orderData);
    }
  };

  const initiateRazorpayPayment = async (orderId, orderData) => {
    try {
      // Step 2: Initiate payment with backend
      const paymentResponse = await api.post("/payment-initiate", {
        order_id: orderId,
        gateway: "razorpay"
      });

      console.log("Payment initiation response:", paymentResponse);

      if (!paymentResponse.data?.success) {
        throw new Error(paymentResponse.data?.message || "Payment initiation failed");
      }

      const paymentData = paymentResponse.data.data;
      console.log("Payment initiated:", paymentData);

      // Step 3: Load Razorpay script and open payment modal
      await loadRazorpayScript(paymentData, orderId);
      
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert(error.message || "Failed to initiate payment. Please try again.");
      setProcessing(false);
    }
  };

  const loadRazorpayScript = (paymentData, orderId) => {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (window.Razorpay) {
        openRazorpayModal(paymentData, orderId);
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        openRazorpayModal(paymentData, orderId);
        resolve();
      };
      script.onerror = () => {
        reject(new Error("Failed to load Razorpay script"));
        setProcessing(false);
        alert("Failed to load payment gateway. Please try again.");
      };
      document.body.appendChild(script);
    });
  };

  const openRazorpayModal = (paymentData, orderId) => {
    const options = {
      key: paymentData.razorpay_key,
      amount: paymentData.amount, // Amount in paise
      currency: paymentData.currency || "INR",
      name: "IQ Energies",
      description: `Order #${paymentData.order_number}`,
      order_id: paymentData.razorpay_order_id,
      handler: async (response) => {
        // Payment successful - verify payment
        await verifyRazorpayPayment(response, orderId);
      },
      prefill: {
        name: paymentData.customer?.name || formData.customer_name,
        email: paymentData.customer?.email || formData.email,
        contact: paymentData.customer?.mobile || formData.mobile,
      },
      theme: {
        color: "#4CAF50", // Green color matching your theme
      },
      modal: {
        ondismiss: () => {
          console.log("Payment modal closed");
          setProcessing(false);
        },
      },
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Pay via Bank',
              instruments: [
                {
                  method: 'card',
                  issuers: ['MASTERCARD', 'VISA']
                },
                {
                  method: 'netbanking',
                  banks: ['ICICI', 'HDFC', 'SBI', 'AXIS']
                },
              ]
            },
            upi: {
              name: "Pay via UPI",
              instruments: [
                {
                  method: 'upi'
                }
              ]
            }
          },
          sequence: ['block.banks', 'block.upi'],
          preferences: {
            show_default_blocks: true,
          }
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Failed to open Razorpay modal:", error);
      setProcessing(false);
      alert("Failed to open payment gateway. Please try again.");
    }
  };

  const verifyRazorpayPayment = async (response, orderId) => {
    try {
      setProcessing(true);
      console.log(response);
      
      const verifyResponse = await api.post("/payment-verify", {
        order_id: orderId,
        gateway: "razorpay",
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });

      if (verifyResponse.data?.success) {
        // Payment successful
        console.log("Payment verified successfully");
        
        // Navigate to success page with order and payment details
        navigate(`/order-success?order_id=${orderId}&payment_id=${response.razorpay_payment_id}&order_number=${verifyResponse.data.data?.order_number || ''}`);
      } else {
        // Payment verification failed
        console.error("Payment verification failed:", verifyResponse.data?.message);
        alert("Payment verification failed. Please contact support.");
        setProcessing(false);
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      alert("Payment verification failed. Please contact support.");
      setProcessing(false);
    }
  };

  const getSelectedPaymentMethod = () => {
    if (paymentMode === "cod") {
      return {
        name: "Cash on Delivery",
        description: "Pay when product is installed",
        icon: <Wallet className="w-5 h-5 text-orange-600" />,
      };
    }
    return (
      paymentMethods.find((method) => method.id === paymentMethod) ||
      paymentMethods[0]
    );
  };

  const selectedPayment = getSelectedPaymentMethod();

  if (loading) return <PageLoader />;

  return (
    <section className="bg-white py-16 md:py-24 md:pt-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ================= HEADER ================= */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border border-green-200 mb-6">
            <Zap className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700 uppercase">
              Secure Checkout
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
            Complete Your Order
          </h1>

          <p className="text-lg text-gray-600 mt-4">
            Please review your product and share your details. Our team will
            contact you for confirmation and installation.
          </p>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* ================= LEFT : CUSTOMER FORM ================= */}
          <div className="space-y-8">
            <div className="border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Customer Details
              </h2>

              <div className="space-y-6">
                <input
                  type="text"
                  name="customer_name"
                  placeholder="Full Name"
                  value={formData.customer_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                  required
                />

                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                  required
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                  required
                />

                <textarea
                  name="installation_address"
                  placeholder="Installation Address"
                  rows={3}
                  value={formData.installation_address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                  required
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, ""); // numbers only
                        setFormData((prev) => ({ ...prev, pincode: value }));

                        if (value.length === 6) {
                          fetchStateFromPincode(value);
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                      required
                      maxLength={6}
                    />
                    {pincodeLoading && (
                      <p className="text-sm text-gray-500 mt-1">
                        Fetching state...
                      </p>
                    )}
                    {pincodeError && (
                      <p className="text-sm text-red-500 mt-1">{pincodeError}</p>
                    )}
                  </div>

                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* ================= PAYMENT METHOD ================= */}
            <div className="border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Method
              </h2>

              <div className="space-y-6">
                {/* Payment Mode Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handlePaymentModeChange("online")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      paymentMode === "online"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-900">Online</span>
                    <span className="text-xs text-gray-600 mt-1">Pay Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePaymentModeChange("cod")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      paymentMode === "cod"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-2">
                      <Wallet className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="font-semibold text-gray-900">COD</span>
                    <span className="text-xs text-gray-600 mt-1">
                      Pay on Delivery
                    </span>
                  </button>
                </div>

                {/* Online Payment Methods Dropdown (only shown when online is selected) */}
                {paymentMode === "online" && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setShowPaymentDropdown(!showPaymentDropdown)
                      }
                      className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                          {selectedPayment.icon}
                        </div>
                        <div className="text-left">
                          <span className="font-semibold text-gray-900 block">
                            {selectedPayment.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {selectedPayment.description}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          showPaymentDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {showPaymentDropdown && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => handlePaymentMethodSelect(method.id)}
                            className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors ${
                              paymentMethod === method.id ? "bg-green-50" : ""
                            }`}
                          >
                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                              {method.icon}
                            </div>
                            <div className="text-left">
                              <span className="font-semibold text-gray-900 block">
                                {method.name}
                              </span>
                              <span className="text-sm text-gray-600">
                                {method.description}
                              </span>
                            </div>
                          </button>
                        ))}

                        <div className="p-4 border-t border-gray-200">
                          <p className="text-sm text-gray-500 text-center">
                            More payment options coming soon...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* COD Information */}
                {paymentMode === "cod" && (
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                    <div className="flex items-start gap-3">
                      <Wallet className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Cash on Delivery
                        </h3>
                        <p className="text-sm text-gray-600">
                          Pay when the product is delivered and installed. Our
                          team will collect payment during installation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= RIGHT : ORDER SUMMARY ================= */}
          <div className="border border-gray-200 rounded-2xl p-8 shadow-sm bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>

            {/* Cart Items */}
            {cart?.items?.length > 0 ? (
              <div className="space-y-4 mb-6">
                {cart.items.map((item, index) => {
                  const product = item.product;
                  const originalPrice = parseFloat(product?.price) || 0;
                  const sellPrice = parseFloat(product?.sell_price) || 0;
                  const discountPercentage = parseFloat(product?.discount_percentage) || 0;
                  const quantity = item.quantity || 1;
                  const totalSellPrice = sellPrice * quantity;
                  const totalOriginalPrice = originalPrice * quantity;
                  const savings = (originalPrice - sellPrice) * quantity;

                  return (
                    <div
                      key={index}
                      className="flex gap-4 items-center p-4 bg-white rounded-xl"
                    >
                      <img
                        src={
                          product?.images?.[0]?.web_image_url ||
                          product?.images?.[0]?.mobile_image_url ||
                          "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400"
                        }
                        alt={product?.title || "Product"}
                        className="w-24 h-24 rounded-xl object-cover border"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">
                          {product?.title || "Product"}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity:{" "}
                          <strong>
                            {quantity} Unit{quantity > 1 ? "s" : ""}
                          </strong>
                        </p>
                        
                        {/* Price Display */}
                        <div className="mt-2 space-y-1">
                          {/* Selling Price */}
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">
                              ₹{totalSellPrice.toFixed(2)}
                            </span>
                            
                            {/* Original Price with strikethrough if discounted */}
                            {discountPercentage > 0 && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{totalOriginalPrice.toFixed(2)}
                              </span>
                            )}
                            
                            {/* Discount Badge */}
                            {discountPercentage > 0 && (
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-600">
                                Save {discountPercentage}%
                              </span>
                            )}
                          </div>
                          
                          {/* Savings Amount */}
                          {savings > 0 && (
                            <p className="text-xs text-green-600 font-medium">
                              You save ₹{savings.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No items in cart
              </div>
            )}

            {/* Price Summary */}
            <div className="space-y-4 border-t border-gray-200 pt-4">
              {/* Subtotal */}
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
              </div>

              {/* Installation & Support (Included) */}
              <div className="flex justify-between text-gray-700">
                <span>Installation & Support</span>
                <span className="text-green-600 font-medium">Included</span>
              </div>

              {/* Total Savings */}
              {calculateTotalSavings() > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Total Savings</span>
                  <span className="text-green-600 font-medium">
                    -₹{calculateTotalSavings().toFixed(2)}
                  </span>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 pt-3"></div>

              {/* Total Amount */}
              <div className="flex justify-between font-bold text-lg text-gray-900">
                <span>Total Amount</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>

              {/* Tax Info Note */}
              <p className="text-xs text-gray-500 text-center pt-2">
                All taxes included in the price
              </p>
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={processing}
              className={`w-full mt-8 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 ${
                processing ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  {paymentMode === "online"
                    ? "Proceed to Payment"
                    : "Place Order (COD)"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Payment Info */}
            <div className="mt-4 text-center text-sm text-gray-600">
              {paymentMode === "online" ? (
                <p>You will be redirected to a secure payment page</p>
              ) : (
                <p>No payment required now. Pay during installation.</p>
              )}
            </div>

            {/* Trust */}
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              100% Secure & Trusted Process
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;