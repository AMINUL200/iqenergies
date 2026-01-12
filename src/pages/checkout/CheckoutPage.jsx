import React, { useEffect, useState } from "react";
import { ShieldCheck, ArrowRight, Zap, CreditCard, Wallet } from "lucide-react";
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
    avg_monthly_electricity: "",
    state: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchCheckoutData();
  }, []);

  const fetchCheckoutData = async () => {
    try {
      const res = await api.get("/cart");
      if (res.data?.success) {
        setCart(res.data.data);
        console.log(res.data.data);
        
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

  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
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
        total_amount: calculateTotal(),
      };

      // Place order API call
      const response = await api.post("/orders", orderData);

      if (response.data?.success) {
        const orderId = response.data.data?.order_id || response.data.data?.id;
        
        // If payment method is razorpay, handle payment gateway
        if (paymentMethod === "razorpay") {
          await handleRazorpayPayment(orderId, response.data.data);
        } else {
          // For COD, navigate to success page
          navigate(`/order-success?order_id=${orderId}`);
        }
      } else {
        throw new Error(response.data?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleRazorpayPayment = async (orderId, orderData) => {
    try {
      // Load Razorpay script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = async () => {
        // Create payment order with backend
        const paymentResponse = await api.post("/payment/create-order", {
          amount: calculateTotal() * 100, // Convert to paise
          currency: "INR",
          receipt: `order_${orderId}`,
        });

        if (!paymentResponse.data?.success) {
          throw new Error("Payment initialization failed");
        }

        const paymentOrderId = paymentResponse.data.data?.order_id;

        const options = {
          key: "YOUR_RAZORPAY_KEY_ID", // Should be from environment variables
          amount: calculateTotal() * 100,
          currency: "INR",
          name: "Solar Company",
          description: "Solar Panel Purchase",
          order_id: paymentOrderId,
          handler: async function (response) {
            try {
              // Verify payment on backend
              const verifyResponse = await api.post("/payment/verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: orderId,
              });

              if (verifyResponse.data?.success) {
                navigate(`/order-success?order_id=${orderId}&payment_id=${response.razorpay_payment_id}`);
              } else {
                alert("Payment verification failed. Please contact support.");
              }
            } catch (error) {
              console.error("Payment verification error:", error);
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: formData.customer_name,
            email: formData.email,
            contact: formData.mobile,
          },
          theme: {
            color: "#22c55e",
          },
          modal: {
            ondismiss: function() {
              setProcessing(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      script.onerror = () => {
        alert("Failed to load payment gateway. Please try again.");
        setProcessing(false);
      };
    } catch (error) {
      console.error("Razorpay setup error:", error);
      alert("Payment setup failed. Please try again.");
      setProcessing(false);
    }
  };

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
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                    required
                  />

                  <input
                    type="number"
                    name="avg_monthly_electricity"
                    placeholder="Avg Monthly Electricity (kWh)"
                    value={formData.avg_monthly_electricity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                  />
                </div>

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* ================= PAYMENT METHOD ================= */}
            <div className="border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        Online Payment
                      </span>
                      <p className="text-sm text-gray-600">
                        Pay securely with Razorpay
                      </p>
                    </div>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">
                        Cash on Delivery
                      </span>
                      <p className="text-sm text-gray-600">
                        Pay when product is installed
                      </p>
                    </div>
                  </div>
                </label>
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
                {cart.items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center p-4 bg-white rounded-xl">
                    <img
                      src={item.product?.image || "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400"}
                      alt={item.product?.name || "Product"}
                      className="w-24 h-24 rounded-xl object-cover border"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.product?.title || "High-Efficiency Solar Panel"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Quantity: <strong>{item.quantity} Unit{item.quantity > 1 ? 's' : ''}</strong>
                      </p>
                      <p className="text-lg font-semibold text-green-600 mt-2">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No items in cart
              </div>
            )}

            {/* Price Summary */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-700">
                <span>Product Price</span>
                <span>₹{calculateTotal()}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Installation & Support</span>
                <span className="text-green-600">Included</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>GST (18%)</span>
                <span>₹{(calculateTotal() * 0.18).toFixed(2)}</span>
              </div>

              <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-200 pt-3">
                <span>Total Amount</span>
                <span>₹{(calculateTotal() * 1.18).toFixed(2)}</span>
              </div>
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
                "Processing..."
              ) : (
                <>
                  {paymentMethod === "razorpay" ? "Proceed to Payment" : "Place Order (COD)"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Trust */}
            <div className="flex justify-center items-center gap-2 text-sm text-gray-500 mt-4">
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