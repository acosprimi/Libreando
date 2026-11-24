<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  producto: { type: Object, required: true },
})
const carritoStore = useCarritoStore()
const productosStore = useProductosStore()
const errorAgregar = ref('')
const cantidadEnCarrito = computed(() => carritoStore.cantidadPorProducto(props.producto.id))

// El cálculo del precio con descuento vive en el store de productos
const valorConDescuento = computed(() => productosStore.valorConDescuento(props.producto))

// Muestra los números como pesos colombianos
const formatoCOP = (numero) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(numero)

function agregarAlCarrito() {
  const error = carritoStore.agregar(props.producto.id)
  if (error) {
    errorAgregar.value = error
    return
  }

  errorAgregar.value = ''
  new Audio('/agregar.wav').play()
}
</script>

<template>
  <v-card hover class="h-100 d-flex flex-column">
    <!-- Imagen del producto -->
    <v-img :src="producto.imagen" :alt="producto.descripcion" height="280" class="bg-grey-lighten-3 pa-4">
      <!-- Etiqueta de descuento (solo si tiene) -->
      <v-chip v-if="producto.descuento > 0" color="error" class="ma-2">-{{ producto.descuento }}%</v-chip>
    </v-img>

    <!-- Categoría y descripción -->
    <v-card-subtitle class="pt-3">{{ producto.categoria }}</v-card-subtitle>
    <v-card-title class="text-wrap text-subtitle-1 font-weight-bold">{{ producto.descripcion }}</v-card-title>

    <v-card-text class="mt-auto">
      <div class="text-medium-emphasis">Disponibles: {{ producto.stock }}</div>
      <!-- Valor del producto (tachado si hay descuento) -->
      <div v-if="producto.descuento > 0" class="text-decoration-line-through">
        {{ formatoCOP(producto.valor) }}
      </div>
      <div v-else>Precio regular</div>

      <!-- Valor con descuento -->
      <div class="text-h5 font-weight-bold text-primary">{{ formatoCOP(valorConDescuento) }}</div>
    </v-card-text>

    <v-card-actions>
      <!-- Botón de compra: avisa al padre y le envía el producto -->
      <v-btn
        block
        color="primary"
        variant="flat"
        :disabled="cantidadEnCarrito >= producto.stock"
        @click="agregarAlCarrito"
      >
        Comprar
      </v-btn>
    </v-card-actions>
    <v-alert v-if="errorAgregar" type="error" density="compact" class="ma-3 mt-0">
      {{ errorAgregar }}
    </v-alert>
  </v-card>
</template>
