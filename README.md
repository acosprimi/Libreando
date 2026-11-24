# Libreando · Tienda de libros (Nuxt 3 + Vuetify + Pinia)

    npm install
    npm run dev

Pinia está registrado como módulo de Nuxt en `nuxt.config.ts`. Los datos compartidos se guardan en tres stores dentro de `stores/`:

- `useProductosStore`: catálogo, categorías y existencias; filtra libros, descuenta stock y calcula el precio con descuento (`valorConDescuento`, única fuente de esa fórmula).
- `useCarritoStore`: guarda solo el ID del libro y su cantidad. Sus getters consultan productos para calcular líneas y totales.
- `usePedidosStore`: valida y confirma compras, guarda el historial de pedidos de la sesión, descuenta stock y vacía el carrito. También calcula los importes de la factura.

`AppHeader`, `ListaProductos`, `ProductoCard`, `CarritoCompra`, `PagoCompra` y `FacturaCompra` usan los stores directamente; el carrito y los totales ya no viajan por props ni por eventos encadenados. Los estados de interfaz (por ejemplo, si el panel lateral o una ventana están abiertos) siguen siendo locales porque no necesitan compartirse. El formulario envía los datos a una action, donde se validan antes de registrar el pedido.

El estado vive en memoria: se reinicia al recargar la página. El pago es una simulación; no se envían ni se almacenan datos a un proveedor de pagos.
