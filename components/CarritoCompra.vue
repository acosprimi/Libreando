<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: { type: Array, required: true }, // cada elemento: { producto, cantidad }
  abierto: { type: Boolean, default: false }, // ¿el panel está abierto?
})
const emit = defineEmits(['incrementar', 'decrementar', 'eliminar', 'finalizar-compra', 'cerrar'])

// Si el panel se cierra (clic afuera), le avisamos al padre
function alCambiar(visible) {
  if (visible === false) {
    emit('cerrar')
  }
}

function valorConDescuento(producto) {
  return Math.round(producto.valor * (1 - producto.descuento / 100))
}

const formatoCOP = (numero) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(numero)

// Total sin descuento
const subtotalSinDescuento = computed(() => {
  let suma = 0
  for (const item of props.items) {
    suma = suma + item.producto.valor * item.cantidad
  }
  return suma
})

// Total con descuento (lo que paga el cliente)
const total = computed(() => {
  let suma = 0
  for (const item of props.items) {
    suma = suma + valorConDescuento(item.producto) * item.cantidad
  }
  return suma
})

const descuentos = computed(() => subtotalSinDescuento.value - total.value)
</script>

<template>
  <v-navigation-drawer :model-value="abierto" location="right" temporary width="420" @update:model-value="alCambiar">
  <v-card flat rounded="0" class="h-100 d-flex flex-column">
    <div class="d-flex justify-space-between align-center pa-4">
      <h2 class="text-h5 font-weight-bold">Tu carrito</h2>
      <v-btn variant="text" @click="emit('cerrar')">Cerrar ✕</v-btn>
    </div>
    <v-divider />

    <!-- Carrito vacío -->
    <v-card-text v-if="items.length === 0">
      El carrito está vacío.
    </v-card-text>

    <!-- Un renglón por producto -->
    <v-list v-else class="flex-grow-1 overflow-y-auto">
      <v-list-item v-for="item in items" :key="item.producto.id">
        <template #prepend>
          <v-img :src="item.producto.imagen" width="50" height="70" class="mr-3" />
        </template>

        <v-list-item-title class="text-wrap">{{ item.producto.descripcion }}</v-list-item-title>
        <v-list-item-subtitle>{{ formatoCOP(valorConDescuento(item.producto)) }} c/u</v-list-item-subtitle>

        <div class="d-flex align-center mt-2">
          <v-btn size="small" :disabled="item.cantidad === 1" @click="emit('decrementar', item.producto.id)">−</v-btn>
          <strong class="mx-3">{{ item.cantidad }}</strong>
          <v-btn size="small" @click="emit('incrementar', item.producto.id)">+</v-btn>
          <v-btn size="small" color="error" variant="text" class="ml-3" @click="emit('eliminar', item.producto.id)">
            Quitar
          </v-btn>
        </div>

        <!-- Subtotal del renglón: precio × cantidad -->
        <template #append>
          <strong>{{ formatoCOP(valorConDescuento(item.producto) * item.cantidad) }}</strong>
        </template>
      </v-list-item>
    </v-list>

    <v-card-text>
      <div>Subtotal sin descuento: {{ formatoCOP(subtotalSinDescuento) }}</div>
      <div class="text-error">Descuentos: − {{ formatoCOP(descuentos) }}</div>
      <div class="text-h6 font-weight-bold">Total: {{ formatoCOP(total) }}</div>
    </v-card-text>

    <v-card-actions class="mt-auto">
      <v-btn block color="primary" variant="flat" size="large" :disabled="items.length === 0" @click="emit('finalizar-compra')">
        Finalizar compra
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-navigation-drawer>
</template>
