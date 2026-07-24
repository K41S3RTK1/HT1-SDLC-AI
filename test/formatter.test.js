'use strict';

const { formatGreeting, formatInvalidCommand, formatResult } = require('../src/formatter');

describe('formatGreeting', () => {
  test('uses only the first name from a full name', () => {
    expect(formatGreeting('Rodrigo Custodio')).toBe(
      'Hola Rodrigo! Que deseas modificar en tu carrito?'
    );
  });

  test('works with a single-word name', () => {
    expect(formatGreeting('Ana')).toBe('Hola Ana! Que deseas modificar en tu carrito?');
  });
});

describe('formatInvalidCommand', () => {
  test('includes the follow-up question', () => {
    expect(formatInvalidCommand()).toContain('Que más deseas hacer?');
  });
});

describe('formatResult', () => {
  test('formats a single-item cart summary', () => {
    const cart = new Map([['12345', 5]]);
    const result = { status: 'updated', productId: '12345' };

    expect(formatResult(result, cart)).toBe(
      'Tu carrito es:\n  - 12345 con 5 unidades\nQue más deseas hacer?'
    );
  });

  test('formats a multi-item cart summary in insertion order', () => {
    const cart = new Map([
      ['12345', 5],
      ['456', 29],
    ]);
    const result = { status: 'updated', productId: '456' };

    expect(formatResult(result, cart)).toBe(
      'Tu carrito es:\n  - 12345 con 5 unidades\n  - 456 con 29 unidades\nQue más deseas hacer?'
    );
  });

  test('formats the empty-cart message', () => {
    const result = { status: 'empty', productId: '12345' };
    expect(formatResult(result, new Map())).toBe('Tu carrito está vacío, que más deseas hacer?');
  });

  test('formats the not-in-cart message', () => {
    const result = { status: 'not_in_cart', productId: '12345' };
    expect(formatResult(result, new Map([['456', 29]]))).toBe(
      'Oops parece que no tienes el producto 12345 agregado a tu carrito. Que más deseas hacer?'
    );
  });
});
