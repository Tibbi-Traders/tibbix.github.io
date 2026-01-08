(function () {
  const CART_KEY = "tt-cart";

  function readCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function notify() {
    document.dispatchEvent(new CustomEvent("cart:updated"));
  }

  function writeCart(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    notify();
  }

  function getCart() {
    return readCart();
  }

  function clearCart() {
    writeCart([]);
  }

  function addToCart(product, quantity, variantLabel) {
    const items = readCart();
    const existing = items.find((item) => item.id === product.id && item.variantLabel === variantLabel);
    const qty = Math.max(Number(quantity) || 1, product.minOrderQty || 1);
    if (existing) {
      existing.quantity += qty;
    } else {
      items.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        packSize: product.packSize,
        minOrderQty: product.minOrderQty || 1,
        image: product.images && product.images[0] ? product.images[0] : "assets/images/placeholder.svg",
        stockStatus: product.stockStatus,
        variantLabel: variantLabel || "",
        quantity: qty
      });
    }
    writeCart(items);
    return items;
  }

  function updateQuantity(id, variantLabel, nextQty) {
    const items = readCart();
    const item = items.find((entry) => entry.id === id && entry.variantLabel === variantLabel);
    if (!item) return items;
    const qty = Math.max(Number(nextQty) || 1, item.minOrderQty || 1);
    item.quantity = qty;
    writeCart(items);
    return items;
  }

  function removeItem(id, variantLabel) {
    const items = readCart().filter(
      (entry) => !(entry.id === id && entry.variantLabel === variantLabel)
    );
    writeCart(items);
    return items;
  }

  function getCartCount() {
    return readCart().length;
  }

  window.tibbiStore = {
    getCart,
    clearCart,
    addToCart,
    updateQuantity,
    removeItem,
    getCartCount
  };
})();

