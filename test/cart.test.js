'use strict';

const { createCart, applyOperation, isCartEmpty, listItems } = require('../src/cart');

describe('cart logic', () => {
  test('createCart starts empty', () => {
    const cart = createCart();
    expect(isCartEmpty(cart)).toBe(true);
    expect(listItems(cart)).toEqual([]);
  });

  test('alta: adds a new product to an empty cart', () => {
    const cart = createCart();
    const result = applyOperation(cart, '12345', 5);

    expect(result.status).toBe('updated');
    expect(listItems(result.cart)).toEqual([{ productId: '12345', quantity: 5 }]);
  });

  test('alta: adding a product does not mutate the original cart', () => {
    const cart = createCart();
    applyOperation(cart, '12345', 5);
    expect(isCartEmpty(cart)).toBe(true);
  });

  test('cambio: increases the quantity of an existing product', () => {
    const cart = new Map([['12345', 5]]);
    const result = applyOperation(cart, '12345', 3);

    expect(result.status).toBe('updated');
    expect(listItems(result.cart)).toEqual([{ productId: '12345', quantity: 8 }]);
  });

  test('cambio: decreases the quantity of an existing product but stays positive', () => {
    const cart = new Map([['12345', 5]]);
    const result = applyOperation(cart, '12345', -2);

    expect(result.status).toBe('updated');
    expect(listItems(result.cart)).toEqual([{ productId: '12345', quantity: 3 }]);
  });

  test('baja: decreasing a product to exactly zero removes it and empties the cart', () => {
    const cart = new Map([['12345', 5]]);
    const result = applyOperation(cart, '12345', -5);

    expect(result.status).toBe('empty');
    expect(isCartEmpty(result.cart)).toBe(true);
  });

  test('baja: decreasing a product to zero removes it but other products remain, preserving order', () => {
    const cart = new Map([
      ['12345', 5],
      ['456', 29],
    ]);
    const result = applyOperation(cart, '12345', -5);

    expect(result.status).toBe('updated');
    expect(listItems(result.cart)).toEqual([{ productId: '456', quantity: 29 }]);
  });

  test('baja: decreasing below zero also removes the product entirely', () => {
    const cart = new Map([['12345', 3]]);
    const result = applyOperation(cart, '12345', -10);

    expect(result.status).toBe('empty');
    expect(isCartEmpty(result.cart)).toBe(true);
  });

  test('oops: decreasing a product that is not in the cart leaves it untouched', () => {
    const cart = new Map([['456', 29]]);
    const result = applyOperation(cart, '12345', -5);

    expect(result.status).toBe('not_in_cart');
    expect(result.productId).toBe('12345');
    expect(result.cart).toBe(cart);
  });

  test('oops: querying an empty cart with a negative delta reports not_in_cart', () => {
    const cart = createCart();
    const result = applyOperation(cart, '12345', -5);

    expect(result.status).toBe('not_in_cart');
  });

  test('numeric-looking productId is normalized to a string key', () => {
    const cart = createCart();
    const result = applyOperation(cart, 12345, 5);

    expect(Array.from(result.cart.keys())).toEqual(['12345']);
  });

  test('adding a second product keeps insertion order even when its id sorts lower numerically', () => {
    const cart = new Map([['12345', 5]]);
    const result = applyOperation(cart, '456', 29);

    expect(listItems(result.cart)).toEqual([
      { productId: '12345', quantity: 5 },
      { productId: '456', quantity: 29 },
    ]);
  });
});
