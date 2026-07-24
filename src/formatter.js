'use strict';

const { listItems } = require('./cart');

const NAME_PROMPT = 'Por favor ingrese su nombre.';
const FIRST_QUESTION = 'Que deseas modificar en tu carrito?';
const FOLLOW_UP_QUESTION = 'Que más deseas hacer?';
const GOODBYE = 'Adiós fue un gusto atenderte!';
const INVALID_COMMAND = `Formato inválido, usa: <id producto> <cantidad>. ${FOLLOW_UP_QUESTION}`;

function formatGreeting(name) {
  const firstName = name.trim().split(/\s+/)[0];
  return `Hola ${firstName}! ${FIRST_QUESTION}`;
}

function formatInvalidCommand() {
  return INVALID_COMMAND;
}

function formatResult(result, cart) {
  const { status, productId } = result;

  if (status === 'empty') {
    return `Tu carrito está vacío, que más deseas hacer?`;
  }

  if (status === 'not_in_cart') {
    return `Oops parece que no tienes el producto ${productId} agregado a tu carrito. ${FOLLOW_UP_QUESTION}`;
  }

  const lines = [
    'Tu carrito es:',
    ...listItems(cart).map((item) => `  - ${item.productId} con ${item.quantity} unidades`),
    FOLLOW_UP_QUESTION,
  ];
  return lines.join('\n');
}

module.exports = {
  NAME_PROMPT,
  GOODBYE,
  formatGreeting,
  formatInvalidCommand,
  formatResult,
};
