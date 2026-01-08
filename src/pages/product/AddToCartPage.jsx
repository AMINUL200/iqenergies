import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddToCartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    loadCartItems();
    // Listen for cart updates from other components
    window.addEventListener('cartUpdated', loadCartItems);
    
    return () => {
      window.removeEventListener('cartUpdated', loadCartItems);
    };
  }, []);

  const loadCartItems = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || {};
      const items = Object.values(cart).map(item => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        product: item.product, // Store full product object
      }));
      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price * item.quantity),
    0
  );

  // Handle quantity change
  const handleQuantityChange = (productId, newQuantity) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || {};
      
      if (newQuantity <= 0) {
        // Remove item if quantity is 0 or less
        delete cart[productId];
      } else if (cart[productId]) {
        // Update quantity
        cart[productId].quantity = newQuantity;
      }
      
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCartItems();
      
      // Notify other components about cart update
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  // Handle item removal
  const handleRemoveItem = (productId) => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart")) || {};
      delete cart[productId];
      localStorage.setItem("cart", JSON.stringify(cart));
      loadCartItems();
      
      // Notify other components about cart update
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Clear entire cart
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      localStorage.removeItem("cart");
      setCartItems([]);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1A2F] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-400">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A1A2F] text-white py-16 md:pt-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* ================= HEADER ================= */}
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
              <ShoppingCart className="w-6 h-6 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Your Shopping Cart
            </h1>
          </div>

          {/* ================= EMPTY CART ================= */}
          <div className="text-center py-20">
            <div className="inline-block p-8 rounded-full bg-white/5 mb-6">
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold
                         bg-gradient-to-r from-green-500 to-green-600
                         hover:from-green-600 hover:to-green-700
                         transition-all shadow-lg"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1A2F] text-white py-16 md:pt-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
              <ShoppingCart className="w-6 h-6 text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              Your Shopping Cart
            </h1>
            <span className="text-gray-400 ml-4">
              ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
            </span>
          </div>
          
          <button
            onClick={handleClearCart}
            className="text-red-400 hover:text-red-300 text-sm font-semibold"
          >
            Clear Cart
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ================= CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 p-6 rounded-2xl bg-white/5 backdrop-blur-xl
                           border border-white/10 hover:border-green-500/40 transition-all"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-28 h-28 rounded-xl object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800";
                  }}
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-green-400 font-bold text-lg mb-4">
                    ₹ {item.price.toLocaleString("en-IN")}
                  </p>

                  {/* Quantity + Remove */}
                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-lg font-bold text-white">
                      ₹ {(item.price * item.quantity).toLocaleString("en-IN")}
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="flex items-center gap-2 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl
                          border border-white/10 h-fit sticky top-6">
            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-gray-300 mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                <span>₹ {subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>₹ {(subtotal * 0.18).toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-semibold text-white">
                <span>Total Amount</span>
                <span>₹ {(subtotal * 1.18).toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate("/checkout")}
              className="mt-8 w-full flex items-center justify-center gap-3
                         px-6 py-4 rounded-xl font-semibold
                         bg-gradient-to-r from-green-500 to-green-600
                         hover:from-green-600 hover:to-green-700
                         transition-all shadow-lg"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Continue Shopping Button */}
            <button
              onClick={() => navigate("/products")}
              className="mt-4 w-full text-center text-green-400 font-semibold hover:text-green-300 transition-colors"
            >
              Continue Shopping
            </button>

            {/* Cart Summary */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-sm text-gray-400 space-y-2">
                <div className="flex justify-between">
                  <span>Items in Cart</span>
                  <span className="text-white">{cartItems.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Quantity</span>
                  <span className="text-white">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECURITY NOTE ================= */}
        {/* <div className="mt-12 p-6 rounded-2xl bg-green-500/10 border border-green-500/20">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-green-500/20">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">Secure Shopping</h3>
              <p className="text-gray-300 text-sm">
                Your cart data is stored locally in your browser. It's safe and won't be shared with anyone.
                Your items will remain in your cart even if you close the browser.
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AddToCartPage;