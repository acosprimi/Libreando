<script setup>
import { ref } from 'vue'

defineProps({
  abierto: { type: Boolean, default: false },
})
const emit = defineEmits(['finalizar-compra', 'cerrar'])
const carritoStore = useCarritoStore()
const { detalleLineas, subtotalSinDescuento, total, descuentos, estaVacio } = storeToRefs(carritoStore)
const errorCarrito = ref('')

function alCambiar(visible) {
  if (visible === false) emit('cerrar')
}

const formatoCOP = (numero) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(numero)

function incrementar(productoId) {
  errorCarrito.value = carritoStore.incrementar(productoId)
}
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
    <v-card-text v-if="estaVacio">
      El carrito está vacío.
    </v-card-text>

    <!-- Un renglón por producto -->
    <v-list v-else class="flex-grow-1 overflow-y-auto">
      <v-list-item v-for="item in detalleLineas" :key="item.productoId">
        <template #prepend>
          <v-img :src="item.producto.imagen" width="50" height="70" class="mr-3" />
        </template>

        <v-list-item-title class="text-wrap">{{ item.producto.descripcion }}</v-list-item-title>
        <v-list-item-subtitle>{{ formatoCOP(item.valorConDescuento) }} c/u · {{ item.stock }} disponibles</v-list-item-subtitle>

        <div class="d-flex align-center mt-2">
          <v-btn size="small" :disabled="item.cantidad === 1" @click="carritoStore.decrementar(item.productoId)">−</v-btn>
          <strong class="mx-3">{{ item.cantidad }}</strong>
          <v-btn size="small" :disabled="item.cantidad >= item.stock" @click="incrementar(item.productoId)">+</v-btn>
          <v-btn size="small" color="error" variant="text" class="ml-3" @click="carritoStore.quitar(item.productoId)">
            Quitar
          </v-btn>
        </div>

        <!-- Subtotal del renglón: precio × cantidad -->
        <template #append>
          <strong>{{ formatoCOP(item.subtotal) }}</strong>
        </template>
      </v-list-item>
    </v-list>

    <v-alert v-if="errorCarrito" type="error" density="compact" class="mx-4">
      {{ errorCarrito }}
    </v-alert>

    <v-card-text>
      <div>Subtotal sin descuento: {{ formatoCOP(subtotalSinDescuento) }}</div>
      <div class="text-error">Descuentos: − {{ formatoCOP(descuentos) }}</div>
      <div class="text-h6 font-weight-bold">Total: {{ formatoCOP(total) }}</div>
    </v-card-text>

    <v-card-actions class="mt-auto">
      <v-btn block color="primary" variant="flat" size="large" :disabled="estaVacio" @click="emit('finalizar-compra')">
        Finalizar compra
      </v-btn>
    </v-card-actions>
  </v-card>
  </v-navigation-drawer>
</template>
