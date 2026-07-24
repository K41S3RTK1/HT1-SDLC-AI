# AGENTS.md

Guía para desarrolladores (humanos o agentes) que se integren a este repo.

## Qué es esto

POC de una TUI para el carrito de usuarios anónimos de Shop 502. Node.js
puro (CommonJS), sin dependencias de runtime — solo `jest` y `pkg` como
devDependencies. Ver [README.md](./README.md) para arquitectura y uso.

## Setup

```bash
npm install
npm test
```

Node.js 20+ requerido. No hay build step para desarrollo (`npm start` corre
`index.js` directo con `node`).

## Cómo trabajar en este repo

1. **Nunca commitear directo a `main`.** Toda rama sale de `main` y vuelve
   a `main` vía pull request (GitHub Flow). `main` está protegida.
2. Nombra las ramas por intención: `feature/<algo>`, `fix/<algo>`.
3. Antes de abrir el PR: `npm test` debe pasar y la cobertura no debe bajar
   de 80% (`npm run test:coverage`; el umbral está en `package.json` y hace
   fallar el comando si no se cumple).
4. El PR dispara CI (`.github/workflows/ci.yml`), que corre la suite
   completa. No hagas merge con CI en rojo.
5. Al hacer merge a `main`, CD (`.github/workflows/cd.yml`) construye el
   binario standalone (`pkg`) y lo publica como GitHub Artifact.

## Convenciones de código

- CommonJS (`require`/`module.exports`), no ESM.
- La lógica del carrito (`src/cart.js`) es pura e inmutable: recibe un
  `Map` y devuelve uno nuevo, nunca muta el que recibió. Se usa `Map` (no
  objeto plano) para preservar el orden de inserción de los productos —
  un objeto plano reordena claves que parecen numéricas.
- Separación de responsabilidades: `cart.js` (lógica) no sabe nada de
  strings de UI ni de I/O; `formatter.js` no sabe nada de stdin/stdout;
  `tui.js` es la única pieza que toca `readline`. Si agregas lógica nueva,
  respeta esa frontera — facilita probar sin mockear I/O.
- Sin comentarios explicando el "qué"; solo el "por qué" cuando no es obvio.

## Tests

- `test/cart.test.js`, `test/parser.test.js`, `test/formatter.test.js`:
  unit tests de cada módulo puro.
- `test/tui.test.js`: integration test que simula una sesión completa
  (stdin/stdout con streams en memoria) y verifica el flujo de altas,
  bajas y cambios de principio a fin, incluyendo el transcript exacto
  del mock de producto.
- Si agregas un caso nuevo al carrito (nuevo estado, nuevo mensaje),
  agrega su unit test en el módulo correspondiente y, si cambia el flujo
  visible por el usuario, extiende `test/tui.test.js`.

## Qué NO hacer

- No agregues dependencias de runtime sin necesidad real — el objetivo es
  mantener el binario (`pkg`) chico y el arranque rápido.
- No cambies el formato de los mensajes al usuario sin revisar que sigan
  coincidiendo con el mock de producto (ver README).
- No bypasees el pull request ni el CI para llegar más rápido a `main`.
