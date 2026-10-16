const TAX_RATES = {
  FR: 0.2,
  DE: 0.19,
  MA: 0.2,
  US: 0,
};

function createCart() {
  return { items: [] };
}

function addItem(cart, { sku, price, quantity = 1 }) {
  if (!sku) throw new Error('sku is required');
  if (typeof price !== 'number' || price < 0) throw new Error('price must be a non-negative number');
  if (!Number.isInteger(quantity) || quantity < 1) throw new Error('quantity must be a positive integer');

  const existing = cart.items.find((item) => item.sku === sku);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ sku, price, quantity });
  }
  return cart;
}

function removeItem(cart, sku) {
  cart.items = cart.items.filter((item) => item.sku !== sku);
  return cart;
}

function subtotal(cart) {
  return round(cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
}

// percent is a number between 0 and 100
function applyDiscount(amount, percent) {
  if (percent < 0 || percent > 100) throw new Error('percent must be between 0 and 100');
  return round(amount - amount * percent);
}

function taxFor(amount, country) {
  const rate = TAX_RATES[country];
  if (rate === undefined) throw new Error(`unsupported country: ${country}`);
  return round(amount * rate);
}

function total(cart, { discountPercent = 0, country = 'US' } = {}) {
  const discounted = applyDiscount(subtotal(cart), discountPercent);
  return round(discounted + taxFor(discounted, country));
}

function round(value) {
  return Math.round(value * 100) / 100;
}

module.exports = {
  createCart,
  addItem,
  removeItem,
  subtotal,
  applyDiscount,
  taxFor,
  total,
};
