import React from "react";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const cartItems = [
  {
    id: 1,
    title: "High-Efficiency Solar Panels",
    price: 18500,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800",
  },
  {
    id: 2,
    title: "Rooftop Solar Systems",
    price: 24500,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800",
  },
];

const AddToCartPage = () => {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

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
                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-semibold">{item.quantity}</span>
                      <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove */}
                    <button className="flex items-center gap-2 text-red-400 hover:text-red-500">
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
                          border border-white/10 h-fit">
            <h2 className="text-2xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹ {subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between text-lg font-semibold text-white">
                <span>Total</span>
                <span>₹ {subtotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Checkout */}
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

            {/* Continue Shopping */}
            <button
              onClick={() => navigate("/products")}
              className="mt-4 w-full text-center text-green-400 font-semibold hover:text-green-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartPage;
