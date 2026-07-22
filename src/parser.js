'use strict';

/**
 * Parses a "<productId> <quantity>" command line, space-delimited.
 * Returns null when the line doesn't match that shape so the TUI can
 * reprompt instead of crashing on malformed input.
 */
function parseCommand(line) {
  const parts = line.trim().split(/\s+/).filter(Boolean);

  if (parts.length !== 2) {
    return null;
  }

  const [productId, quantityRaw] = parts;
  if (!/^-?\d+$/.test(quantityRaw)) {
    return null;
  }

  return { productId, quantity: parseInt(quantityRaw, 10) };
}

module.exports = { parseCommand };
