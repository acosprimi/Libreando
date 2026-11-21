<script setup>
const emit = defineEmits(['nueva-compra'])
const pedidosStore = usePedidosStore()
const { ultimoPedido, totalSinDescuentoUltimoPedido, descuentosUltimoPedido, subtotalUltimoPedido, ivaUltimoPedido, totalUltimoPedido } = storeToRefs(pedidosStore)

const formatoCOP = (numero) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(numero)
</script>

<template>
  <!-- v-dialog = ventanita emergente. :model-value="true" la muestra mientras el padre tenga el componente con v-if -->
  <v-dialog :model-value="true" persistent max-width="900" scrollable>
  <v-card class="pa-4">
    <div class="d-flex align-center ga-3 px-4 pt-2">
      <img src="/logo.svg" alt="Logo" width="40" height="40" />
      <h2 class="text-h5 font-weight-bold">Factura de compra</h2>
    </div>
    <v-card-subtitle>
      N.º {{ ultimoPedido.numero }} · Fecha: {{ ultimoPedido.fecha }} · Pagada con {{ ultimoPedido.metodoPago }}
    </v-card-subtitle>
    <v-card-subtitle>Comprador: {{ ultimoPedido.comprador }}</v-card-subtitle>

    <v-table>
      <thead>
        <tr>
          <th>Descripción</th>
          <th>Cant.</th>
          <th>Valor unit.</th>
          <th>Desc.</th>
          <th>Valor c/desc.</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in ultimoPedido.lineas" :key="item.producto.id">
          <td>{{ item.producto.descripcion }}</td>
          <td>{{ item.cantidad }}</td>
          <td>{{ formatoCOP(item.producto.valor) }}</td>
          <td>{{ item.producto.descuento }}%</td>
          <td>{{ formatoCOP(item.valorConDescuento) }}</td>
          <td>{{ formatoCOP(item.subtotal) }}</td>
        </tr>
      </tbody>
    </v-table>

    <v-card-text class="text-right">
      <div>Total sin descuento: {{ formatoCOP(totalSinDescuentoUltimoPedido) }}</div>
      <div class="text-error">Total descuentos: − {{ formatoCOP(descuentosUltimoPedido) }}</div>
      <div>Subtotal: {{ formatoCOP(subtotalUltimoPedido) }}</div>
      <div>IVA (19 %): {{ formatoCOP(ivaUltimoPedido) }}</div>
      <div class="text-h6 font-weight-bold">Total a pagar: {{ formatoCOP(totalUltimoPedido) }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" variant="outlined" @click="emit('nueva-compra')">Nueva compra</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>
