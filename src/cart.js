'use strict';

// A Map (rather than a plain object) preserves insertion order even when
// product ids look numeric, so the cart always lists items in the order
// they were added instead of JS's ascending-numeric-key reordering.
function createCart() {
  return new Map();
}

function isCartEmpty(cart) {
  return cart.size === 0;
}

function listItems(cart) {
  return Array.from(cart, ([productId, quantity]) => ({ productId, quantity }));
}

/**
 * Applies a delta (positive or negative) to a product's quantity in the cart.
 * Never mutates the cart passed in; returns a new cart plus a status describing
 * what happened, so callers can pick the right message without re-deriving state.
 */
function applyOperation(cart, productId, quantity) {
  const id = String(productId);
  const hadProduct = cart.has(id);

  if (!hadProduct && quantity <= 0) {
    return { cart, status: 'not_in_cart', productId: id };
  }

  const currentQty = hadProduct ? cart.get(id) : 0;
  const newQty = currentQty + quantity;
  const nextCart = new Map(cart);

  if (newQty <= 0) {
    nextCart.delete(id);
    const status = isCartEmpty(nextCart) ? 'empty' : 'updated';
    return { cart: nextCart, status, productId: id };
  }

  nextCart.set(id, newQty);
  return { cart: nextCart, status: 'updated', productId: id };
}

module.exports = { createCart, applyOperation, isCartEmpty, listItems };
