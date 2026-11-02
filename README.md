# Libreando · Tienda de libros (Nuxt 3 + Vuetify)

    npm install
    npm run dev

`app.vue` guarda los datos (arreglos `productos` y `carrito`) y los reparte con **props**.
Los componentes hijos avisan con **emits**. No usa Pinia, provide/inject ni event bus.

    app.vue
    ├── AppHeader       props: nombreTienda, cantidadItems, musicaActiva     emits: ver-carrito, alternar-musica
    ├── ListaProductos  props: productos, categorias, categoriaElegida   emits: agregar-producto, cambiar-categoria
    │   └── ProductoCard props: producto                         emits: agregar-al-carrito
    ├── CarritoCompra   props: items, abierto   emits: cerrar, incrementar, decrementar, eliminar, finalizar-compra
    ├── PagoCompra      props: total                             emits: pagar, cancelar
    ├── FacturaCompra   props: items, numeroFactura, fecha, metodoPago       emits: nueva-compra
    └── AppFooter       props: nombreTienda, año, contacto
