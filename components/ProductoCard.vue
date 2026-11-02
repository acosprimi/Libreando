<script setup>
import { computed } from 'vue'

const props = defineProps({
  producto: { type: Object, required: true },
})
const emit = defineEmits(['agregar-al-carrito'])

// valorConDescuento = valor × (1 − descuento / 100)
const valorConDescuento = computed(() => {
  return Math.round(props.producto.valor * (1 - props.producto.descuento / 100))
})

// Muestra los números como pesos colombianos
const formatoCOP = (numero) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(numero)
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
      <v-btn block color="primary" variant="flat" @click="emit('agregar-al-carrito', producto)">
        Comprar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
