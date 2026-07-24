# Shop 502 — Carrito TUI (POC)

Prueba de concepto de una interfaz de texto (TUI) para el manejo del carrito
de usuarios anónimos de Shop 502. Hoja de trabajo #1 — CC3116 (SDLC + AI).

## Requisitos

- Node.js 20+

## Uso

```bash
npm install
npm start
```

Ejemplo de sesión:

```
Por favor ingrese su nombre.
> Rodrigo Custodio
Hola Rodrigo! Que deseas modificar en tu carrito?
> 12345 5
Tu carrito es:
  - 12345 con 5 unidades
Que más deseas hacer?
> 12345 -5
Tu carrito está vacío, que más deseas hacer?
> 12345 -5
Oops parece que no tienes el producto 12345 agregado a tu carrito. Que más deseas hacer?
> 456 29
Tu carrito es:
  - 456 con 29 unidades
Que más deseas hacer?
> bye
Adiós fue un gusto atenderte!
```

El formato de cada operación es `<id de producto> <cantidad a sumar al carrito>`,
usando espacio como delimitador. La cantidad puede ser negativa para restar
unidades; si el resultado es cero o menos, el producto se elimina del carrito.
Escribe `bye` para terminar la sesión.

## Tests

```bash
npm test              # corre la suite de Jest
npm run test:coverage # corre la suite con reporte de cobertura
```

El umbral mínimo de cobertura (branches/functions/lines/statements) está
configurado en 80% en `package.json` (`jest.coverageThreshold`); si baja de
ese número, `npm run test:coverage` falla.

## Build del binario

```bash
npm run build
```

Genera un ejecutable standalone en `dist/shop502-cart` (Linux x64) usando
[`pkg`](https://github.com/vercel/pkg). No requiere Node.js instalado para
correr.

## Arquitectura

```
index.js         Punto de entrada, arranca el TUI sobre stdin/stdout
src/cart.js       Lógica pura del carrito (altas, bajas, cambios) — sin I/O
src/parser.js     Parseo de comandos "<id> <cantidad>"
src/formatter.js  Construcción de los mensajes que ve el usuario
src/tui.js        Orquestación: conecta readline con cart/parser/formatter
test/             Unit tests (cart, parser, formatter) + integration test del TUI
```

La lógica del carrito es pura e inmutable (recibe un `Map` y devuelve uno
nuevo) para poder probarla sin necesidad de simular stdin/stdout.

## Flujo de trabajo (GitHub Flow)

- `main` está protegida: todo cambio entra vía pull request, nunca push directo.
- Cada feature/fix vive en su propia rama (`feature/...`, `fix/...`).
- El CI (`.github/workflows/ci.yml`) corre la suite de tests en cada PR contra `main`.
- El CD (`.github/workflows/cd.yml`) construye el binario y lo publica como
  GitHub Artifact en cada push a `main` (es decir, en cada merge).

Ver [AGENTS.md](./AGENTS.md) para la guía de contribución pensada para
herramientas de agentic coding (y para desarrolladores humanos nuevos en el repo).
