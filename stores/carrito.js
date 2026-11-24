import { useProductosStore } from './productos.js'

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    lineas: [],
  }),

  getters: {
    detalleLineas() {
      const productosStore = useProductosStore()
      return this.lineas.flatMap((linea) => {
        const producto = productosStore.porId(linea.productoId)
        return producto
          ? [{
              productoId: linea.productoId,
              cantidad: linea.cantidad,
              producto,
              stock: producto.stock,
              valorConDescuento: productosStore.valorConDescuento(producto),
            }]
          : []
      }).map((linea) => ({
        ...linea,
        subtotal: linea.valorConDescuento * linea.cantidad,
      }))
    },
    cantidadItems: (state) => state.lineas.reduce((total, linea) => total + linea.cantidad, 0),
    subtotalSinDescuento() {
      return this.detalleLineas.reduce((total, linea) => total + linea.producto.valor * linea.cantidad, 0)
    },
    total() {
      return this.detalleLineas.reduce((suma, linea) => suma + linea.subtotal, 0)
    },
    descuentos() {
      return this.subtotalSinDescuento - this.total
    },
    estaVacio: (state) => state.lineas.length === 0,
    cantidadPorProducto: (state) => (productoId) =>
      state.lineas.find((linea) => linea.productoId === productoId)?.cantidad ?? 0,
  },

  actions: {
    agregar(productoId) {
      const productosStore = useProductosStore()
      const producto = productosStore.porId(productoId)
      if (!producto) return 'No se encontró ese libro.'

      const linea = this.lineas.find((item) => item.productoId === productoId)
      const cantidadActual = linea?.cantidad ?? 0
      if (cantidadActual >= producto.stock) return 'No hay más unidades disponibles de este libro.'

      if (linea) linea.cantidad++
      else this.lineas.push({ productoId, cantidad: 1 })
      return ''
    },

    incrementar(productoId) {
      const productosStore = useProductosStore()
      const producto = productosStore.porId(productoId)
      const linea = this.lineas.find((item) => item.productoId === productoId)
      if (!producto || !linea) return 'No se encontró ese libro en el carrito.'
      if (linea.cantidad >= producto.stock) return 'No hay más unidades disponibles de este libro.'
      linea.cantidad++
      return ''
    },

    decrementar(productoId) {
      const linea = this.lineas.find((item) => item.productoId === productoId)
      if (!linea) return
      if (linea.cantidad > 1) linea.cantidad--
    },

    quitar(productoId) {
      this.lineas = this.lineas.filter((linea) => linea.productoId !== productoId)
    },

    vaciar() {
      this.lineas = []
    },
  },
})
