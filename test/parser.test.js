'use strict';

const { parseCommand } = require('../src/parser');

describe('parseCommand', () => {
  test('parses a positive quantity', () => {
    expect(parseCommand('12345 5')).toEqual({ productId: '12345', quantity: 5 });
  });

  test('parses a negative quantity', () => {
    expect(parseCommand('12345 -5')).toEqual({ productId: '12345', quantity: -5 });
  });

  test('tolerates repeated whitespace between tokens', () => {
    expect(parseCommand('12345    5')).toEqual({ productId: '12345', quantity: 5 });
  });

  test('trims leading and trailing whitespace', () => {
    expect(parseCommand('  456 29  ')).toEqual({ productId: '456', quantity: 29 });
  });

  test('returns null when the quantity is missing', () => {
    expect(parseCommand('12345')).toBeNull();
  });

  test('returns null when there are too many tokens', () => {
    expect(parseCommand('12345 5 6')).toBeNull();
  });

  test('returns null when the quantity is not numeric', () => {
    expect(parseCommand('12345 abc')).toBeNull();
  });

  test('returns null for an empty line', () => {
    expect(parseCommand('')).toBeNull();
  });

  test('returns null for a plain word like bye', () => {
    expect(parseCommand('bye')).toBeNull();
  });
});
