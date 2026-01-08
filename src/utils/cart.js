// cart.js
// Get cart from localStorage
export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : {};
};

// Save cart to localStorage
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Add or update product with full product info
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();

  if (cart[product.id]) {
    cart[product.id].quantity += quantity;
  } else {
    cart[product.id] = {
      product: product, // Store full product object
      quantity: quantity,
      addedAt: new Date().toISOString(),
    };
  }

  saveCart(cart);
  return cart;
};

// Update quantity
export const updateQuantity = (productId, quantity) => {
  const cart = getCart();

  if (quantity <= 0) {
    delete cart[productId];
  } else if (cart[productId]) {
    cart[productId].quantity = quantity;
  }

  saveCart(cart);
  return cart;
};

// Remove product from cart
export const removeFromCart = (productId) => {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
  return cart;
};

// Get total items count
export const getCartCount = () => {
  const cart = getCart();
  return Object.values(cart).reduce(
    (total, item) => total + item.quantity,
    0
  );
};

// Get cart items array
export const getCartItems = () => {
  const cart = getCart();
  return Object.values(cart);
};

// Get total cart value
export const getCartTotal = () => {
  const cart = getCart();
  return Object.values(cart).reduce(
    (total, item) => total + (item.product.price * item.quantity),
    0
  );
};

// Clear entire cart
export const clearCart = () => {
  localStorage.removeItem("cart");
};