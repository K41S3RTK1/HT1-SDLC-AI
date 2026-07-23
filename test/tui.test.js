'use strict';

const { PassThrough } = require('stream');
const { startTui } = require('../src/tui');

function runTui(lines) {
  const input = new PassThrough();
  const output = new PassThrough();
  let transcript = '';
  output.on('data', (chunk) => {
    transcript += chunk.toString();
  });

  const rl = startTui({ input, output });

  return new Promise((resolve) => {
    rl.on('close', () => resolve(transcript));
    for (const line of lines) {
      input.write(`${line}\n`);
    }
    input.end();
  });
}

describe('TUI integration', () => {
  test('replicates the full golden-path conversation from the product mock', async () => {
    const transcript = await runTui([
      'Rodrigo Custodio',
      '12345 5',
      '12345 -5',
      '12345 -5',
      '456 29',
      'bye',
    ]);

    expect(transcript).toContain('Por favor ingrese su nombre.');
    expect(transcript).toContain('Hola Rodrigo! Que deseas modificar en tu carrito?');
    expect(transcript).toContain('Tu carrito es:\n  - 12345 con 5 unidades\nQue más deseas hacer?');
    expect(transcript).toContain('Tu carrito está vacío, que más deseas hacer?');
    expect(transcript).toContain(
      'Oops parece que no tienes el producto 12345 agregado a tu carrito. Que más deseas hacer?'
    );
    expect(transcript).toContain('Tu carrito es:\n  - 456 con 29 unidades\nQue más deseas hacer?');
    expect(transcript).toContain('Adiós fue un gusto atenderte!');

    const goodbyeIndex = transcript.indexOf('Adiós fue un gusto atenderte!');
    expect(transcript.indexOf('> ', goodbyeIndex)).toBe(-1);
  });

  test('reprompts on malformed input without crashing or losing cart state', async () => {
    const transcript = await runTui(['Ana', '12345 5', 'not-a-command', '12345 2', 'bye']);

    expect(transcript).toContain('Formato inválido, usa: <id producto> <cantidad>.');
    expect(transcript).toContain('Tu carrito es:\n  - 12345 con 7 unidades\nQue más deseas hacer?');
  });

  test('exit command is case-insensitive and trims whitespace', async () => {
    const transcript = await runTui(['Ana', '  BYE  ']);
    expect(transcript).toContain('Adiós fue un gusto atenderte!');
  });
});
