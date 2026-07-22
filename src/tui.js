'use strict';

const readline = require('readline');
const { createCart, applyOperation } = require('./cart');
const { parseCommand } = require('./parser');
const {
  NAME_PROMPT,
  GOODBYE,
  formatGreeting,
  formatInvalidCommand,
  formatResult,
} = require('./formatter');

const EXIT_COMMAND = 'bye';

function startTui({ input = process.stdin, output = process.stdout } = {}) {
  const rl = readline.createInterface({ input, output, terminal: false });
  let cart = createCart();
  let stage = 'ask_name';

  output.write(`${NAME_PROMPT}\n> `);

  rl.on('line', (rawLine) => {
    if (stage === 'ask_name') {
      output.write(`${formatGreeting(rawLine)}\n> `);
      stage = 'cart';
      return;
    }

    const line = rawLine.trim();
    if (line.toLowerCase() === EXIT_COMMAND) {
      output.write(`${GOODBYE}\n`);
      rl.close();
      return;
    }

    const command = parseCommand(line);
    if (!command) {
      output.write(`${formatInvalidCommand()}\n> `);
      return;
    }

    const result = applyOperation(cart, command.productId, command.quantity);
    cart = result.cart;
    output.write(`${formatResult(result, cart)}\n> `);
  });

  return rl;
}

module.exports = { startTui };
