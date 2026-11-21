import { useCarritoStore } from './carrito.js'
import { useProductosStore } from './productos.js'

export const usePedidosStore = defineStore('pedidos', {
  state: () => ({
    pedidos: [],
    siguienteNumero: 1,
  }),

  getters: {
    ultimoPedido: (state) => state.pedidos.at(-1) ?? null,
    numeroPedidos: (state) => state.pedidos.length,
    totalSinDescuentoUltimoPedido() {
      return this.ultimoPedido?.lineas.reduce(
        (total, linea) => total + linea.producto.valor * linea.cantidad,
        0,
      ) ?? 0
    },
    subtotalUltimoPedido() {
      return this.ultimoPedido?.lineas.reduce((total, linea) => total + linea.subtotal, 0) ?? 0
    },
    descuentosUltimoPedido() {
      return this.totalSinDescuentoUltimoPedido - this.subtotalUltimoPedido
    },
    ivaUltimoPedido() {
      return Math.round(this.subtotalUltimoPedido * 0.19)
    },
    totalUltimoPedido() {
      return this.subtotalUltimoPedido + this.ivaUltimoPedido
    },
  },

  actions: {
    confirmarPedido({ nombre, metodoPago, numeroTarjeta = '', titular = '', celular = '' }) {
      const nombreComprador = nombre.trim()
      if (!nombreComprador) return { error: 'Escribe el nombre del comprador.' }

      const metodosPermitidos = ['Tarjeta', 'Nequi', 'Efectivo']
      if (!metodosPermitidos.includes(metodoPago)) return { error: 'Selecciona un método de pago válido.' }

      if (metodoPago === 'Tarjeta') {
        const digitosTarjeta = numeroTarjeta.replace(/\D/g, '')
        if (digitosTarjeta.length < 12 || digitosTarjeta.length > 19) {
          return { error: 'El número de tarjeta debe tener entre 12 y 19 dígitos.' }
        }
        if (!titular.trim()) return { error: 'Escribe el nombre del titular de la tarjeta.' }
      }

      if (metodoPago === 'Nequi' && !/^\d{10}$/.test(celular)) {
        return { error: 'El número de Nequi debe tener 10 dígitos.' }
      }

      const carritoStore = useCarritoStore()
      const productosStore = useProductosStore()
      if (carritoStore.estaVacio) return { error: 'Agrega al menos un libro antes de pagar.' }

      const lineas = carritoStore.detalleLineas
      for (const linea of lineas) {
        const producto = productosStore.porId(linea.productoId)
        if (!producto || producto.stock < linea.cantidad) {
          return { error: `No hay suficiente stock de "${linea.producto.descripcion}".` }
        }
      }

      const pedido = {
        numero: `FAC-${String(this.siguienteNumero).padStart(4, '0')}`,
        fecha: new Date().toLocaleDateString('es-CO'),
        comprador: nombreComprador,
        metodoPago,
        lineas: lineas.map((linea) => ({
          producto: { ...linea.producto },
          cantidad: linea.cantidad,
          valorConDescuento: linea.valorConDescuento,
          subtotal: linea.subtotal,
        })),
      }

      for (const linea of lineas) {
        productosStore.descontarStock(linea.productoId, linea.cantidad)
      }

      this.pedidos.push(pedido)
      this.siguienteNumero++
      carritoStore.vaciar()
      return { pedido }
    },
  },
})
