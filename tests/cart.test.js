const {
  createCart,
  addItem,
  removeItem,
  subtotal,
  applyDiscount,
  total,
} = require('../src/cart');

describe('addItem', () => {
  test('adds a new item to the cart', () => {
    const cart = addItem(createCart(), { sku: 'book', price: 12.5 });
    expect(cart.items).toEqual([{ sku: 'book', price: 12.5, quantity: 1 }]);
  });

  test('increments quantity when the sku already exists', () => {
    const cart = createCart();
    addItem(cart, { sku: 'pen', price: 1, quantity: 2 });
    addItem(cart, { sku: 'pen', price: 1, quantity: 3 });
    expect(cart.items[0].quantity).toBe(5);
  });

  test('rejects invalid input', () => {
    expect(() => addItem(createCart(), { price: 1 })).toThrow('sku is required');
    expect(() => addItem(createCart(), { sku: 'x', price: -1 })).toThrow('price');
    expect(() => addItem(createCart(), { sku: 'x', price: 1, quantity: 0 })).toThrow('quantity');
  });
});

describe('removeItem', () => {
  test('removes an item by sku', () => {
    const cart = createCart();
    addItem(cart, { sku: 'a', price: 1 });
    addItem(cart, { sku: 'b', price: 2 });
    removeItem(cart, 'a');
    expect(cart.items.map((i) => i.sku)).toEqual(['b']);
  });
});

describe('subtotal', () => {
  test('sums price * quantity', () => {
    const cart = createCart();
    addItem(cart, { sku: 'a', price: 10, quantity: 2 });
    addItem(cart, { sku: 'b', price: 0.1, quantity: 3 });
    expect(subtotal(cart)).toBe(20.3);
  });

  test('is 0 for an empty cart', () => {
    expect(subtotal(createCart())).toBe(0);
  });
});

describe('applyDiscount', () => {
  test('applies a percentage discount', () => {
    expect(applyDiscount(200, 10)).toBe(180);
  });

  test('0% leaves the amount unchanged', () => {
    expect(applyDiscount(50, 0)).toBe(50);
  });
});

describe('total', () => {
  test('defaults to no discount and US tax', () => {
    const cart = addItem(createCart(), { sku: 'a', price: 100 });
    expect(total(cart)).toBe(100);
  });
});
