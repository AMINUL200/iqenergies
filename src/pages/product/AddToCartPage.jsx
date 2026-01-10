import React, { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, Percent } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageLoader from "../../component/common/PageLoader";

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
      const items = Object.values(cart).map(item => {
        const product = item.product;
        return {
          id: product.id,
          title: product.title,
          price: product.sellingPrice || parseFloat(product.price) || 0,
          originalPrice: product.originalPrice || parseFloat(product.price) || 0,
          discountPercentage: product.discountPercentage || 0,
          quantity: item.quantity,
          image: product.image,
          product: product, // Store full product object
        };
      });
      
      setCartItems(items);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate price breakdowns
  const calculateCartSummary = () => {
    const subtotal = cartItems.reduce(
      (acc, item) => acc + (item.price * item.quantity),
      0
    );
    
    const totalOriginalPrice = cartItems.reduce(
      (acc, item) => acc + (item.originalPrice * item.quantity),
      0
    );
    
    const totalSaved = totalOriginalPrice - subtotal;
    const tax = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + tax;
    
    return {
      subtotal,
      totalOriginalPrice,
      totalSaved,
      tax,
      totalAmount,
      totalItems: cartItems.reduce((acc, item) => acc + item.quantity, 0),
      totalProducts: cartItems.length
    };
  };

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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <PageLoader/>
  }

  const cartSummary = calculateCartSummary();

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
              ({cartSummary.totalItems} items)
            </span>
          </div>
          
          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 
                       hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Cart
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* ================= CART ITEMS ================= */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => {
              const itemTotal = item.price * item.quantity;
              const itemOriginalTotal = item.originalPrice * item.quantity;
              const itemSaved = itemOriginalTotal - itemTotal;
              
              return (
                <div
                  key={item.id}
                  className="flex gap-6 p-6 rounded-2xl bg-white/5 backdrop-blur-xl
                             border border-white/10 hover:border-green-500/40 transition-all"
                >
                  {/* Image */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-28 h-28 rounded-xl object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800";
                      }}
                    />
                    
                    {/* Discount Badge */}
                    {item.discountPercentage > 0 && (
                      <div className="absolute -top-2 -right-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-red-500 text-white">
                          <Percent className="w-3 h-3" />
                          {item.discountPercentage}%
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">
                      {item.title}
                    </h3>
                    
                    {/* Price Information */}
                    <div className="mb-4 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-bold text-lg">
                          ₹{item.price.toLocaleString("en-IN")}
                        </span>
                        
                        {/* Original Price with strikethrough */}
                        {item.discountPercentage > 0 && (
                          <>
                            <span className="text-gray-400 text-sm line-through">
                              ₹{item.originalPrice.toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-gray-500">
                              (Save {item.discountPercentage}%)
                            </span>
                          </>
                        )}
                      </div>
                      
                      {/* Per Unit */}
                      <div className="text-sm text-gray-400">
                        Per unit • {item.quantity} × ₹{item.price.toLocaleString("en-IN")}
                      </div>
                    </div>

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

                      {/* Item Total Price */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">
                          ₹{itemTotal.toLocaleString("en-IN")}
                        </div>
                        
                        {/* Savings for this item */}
                        {itemSaved > 0 && (
                          <div className="text-xs text-green-400">
                            Saved ₹{itemSaved.toLocaleString("en-IN")}
                          </div>
                        )}
                        
                        {/* Original Total */}
                        {item.discountPercentage > 0 && (
                          <div className="text-xs text-gray-400 line-through">
                            ₹{itemOriginalTotal.toLocaleString("en-IN")}
                          </div>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 
                                   hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-xl
                          border border-white/10 h-fit sticky top-6">
            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            {/* Price Breakdown */}
            <div className="space-y-4 text-gray-300 mb-6">
              {/* Original Price */}
              {cartSummary.totalSaved > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Original Price</span>
                  <span className="line-through">
                    ₹{cartSummary.totalOriginalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal ({cartSummary.totalItems} items)</span>
                <span className="font-medium text-white">
                  ₹{cartSummary.subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              
              {/* Discount/Savings */}
              {cartSummary.totalSaved > 0 && (
                <div className="flex justify-between text-green-400">
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3" />
                    Discount Applied
                  </span>
                  <span className="font-medium">
                    -₹{cartSummary.totalSaved.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
              
              {/* Delivery */}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-400 font-medium">FREE</span>
              </div>
              
              {/* Tax */}
              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>₹{cartSummary.tax.toLocaleString("en-IN")}</span>
              </div>
              
              {/* Divider */}
              <div className="border-t border-white/10 pt-4">
                {/* Total Amount */}
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total Amount</span>
                  <span className="text-green-400">
                    ₹{cartSummary.totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                
                {/* Total Savings */}
                {cartSummary.totalSaved > 0 && (
                  <div className="mt-2 text-sm text-green-400 text-right">
                    You save ₹{cartSummary.totalSaved.toLocaleString("en-IN")}!
                  </div>
                )}
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate("/checkout")}
              className="mt-8 w-full flex items-center justify-center gap-3
                         px-6 py-4 rounded-xl font-semibold
                         bg-gradient-to-r from-green-500 to-green-600
                         hover:from-green-600 hover:to-green-700
                         transition-all shadow-lg hover:shadow-xl hover:shadow-green-500/30"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate("/products")}
              className="mt-4 w-full text-center text-gray-400 font-medium 
                         hover:text-white transition-colors py-3"
            >
              Continue Shopping
            </button>

            {/* Cart Statistics */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">
                Cart Summary
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-gray-400">Total Products</div>
                  <div className="text-white font-bold">{cartSummary.totalProducts}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-gray-400">Total Items</div>
                  <div className="text-white font-bold">{cartSummary.totalItems}</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-gray-400">Savings</div>
                  <div className="text-green-400 font-bold">
                    ₹{cartSummary.totalSaved.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-gray-400">Delivery</div>
                  <div className="text-green-400 font-bold">FREE</div>
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default AddToCartPage;