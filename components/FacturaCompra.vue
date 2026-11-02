<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true },
  numeroFactura: { type: String, required: true },
  fecha: { type: String, required: true },
  metodoPago: { type: String, required: true },
})
const emit = defineEmits(['nueva-compra'])

function valorConDescuento(producto) {
  return Math.round(producto.valor * (1 - producto.descuento / 100))
}

const formatoCOP = (numero) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(numero)

const totalSinDescuento = computed(() => {
  let suma = 0
  for (const item of props.items) {
    suma = suma + item.producto.valor * item.cantidad
  }
  return suma
})

// Subtotal = lo que cuestan los productos ya con descuento
const subtotal = computed(() => {
  let suma = 0
  for (const item of props.items) {
    suma = suma + valorConDescuento(item.producto) * item.cantidad
  }
  return suma
})

const totalDescuentos = computed(() => totalSinDescuento.value - subtotal.value)
const iva = computed(() => Math.round(subtotal.value * 0.19)) // IVA del 19 %
const totalPagar = computed(() => subtotal.value + iva.value)
</script>

<template>
  <!-- v-dialog = ventanita emergente. :model-value="true" la muestra mientras el padre tenga el componente con v-if -->
  <v-dialog :model-value="true" persistent max-width="900" scrollable>
  <v-card class="pa-4">
    <div class="d-flex align-center ga-3 px-4 pt-2">
      <img src="/logo.svg" alt="Logo" width="40" height="40" />
      <h2 class="text-h5 font-weight-bold">Factura de compra</h2>
    </div>
    <v-card-subtitle>N.º {{ numeroFactura }} · Fecha: {{ fecha }} · Pagada con {{ metodoPago }}</v-card-subtitle>

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
        <tr v-for="item in items" :key="item.producto.id">
          <td>{{ item.producto.descripcion }}</td>
          <td>{{ item.cantidad }}</td>
          <td>{{ formatoCOP(item.producto.valor) }}</td>
          <td>{{ item.producto.descuento }}%</td>
          <td>{{ formatoCOP(valorConDescuento(item.producto)) }}</td>
          <td>{{ formatoCOP(valorConDescuento(item.producto) * item.cantidad) }}</td>
        </tr>
      </tbody>
    </v-table>

    <v-card-text class="text-right">
      <div>Total sin descuento: {{ formatoCOP(totalSinDescuento) }}</div>
      <div class="text-error">Total descuentos: − {{ formatoCOP(totalDescuentos) }}</div>
      <div>Subtotal: {{ formatoCOP(subtotal) }}</div>
      <div>IVA (19 %): {{ formatoCOP(iva) }}</div>
      <div class="text-h6 font-weight-bold">Total a pagar: {{ formatoCOP(totalPagar) }}</div>
    </v-card-text>

    <v-card-actions>
      <v-btn color="primary" variant="outlined" @click="emit('nueva-compra')">Nueva compra</v-btn>
    </v-card-actions>
  </v-card>
  </v-dialog>
</template>
