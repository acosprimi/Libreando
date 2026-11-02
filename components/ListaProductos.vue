<script setup>
defineProps({
  productos: { type: Array, required: true },
  categorias: { type: Array, required: true },
  categoriaElegida: { type: String, required: true },
})

// Este componente reenvía el aviso de la tarjeta y avisa cuando se elige otra categoría
const emit = defineEmits(['agregar-producto', 'cambiar-categoria'])
</script>

<template>
  <h2 id="catalogo" class="text-h4 font-weight-bold mb-4">Catálogo</h2>

  <!-- Categorías: v-chip-group deja elegir una etiqueta a la vez -->
  <v-chip-group
    :model-value="categoriaElegida"
    mandatory
    selected-class="bg-primary"
    class="mb-4"
    @update:model-value="emit('cambiar-categoria', $event)"
  >
    <v-chip v-for="categoria in categorias" :key="categoria" :value="categoria" size="large">
      {{ categoria }}
    </v-chip>
  </v-chip-group>

  <p class="text-medium-emphasis mb-4">{{ productos.length }} libros</p>

  <v-row>
    <v-col v-for="producto in productos" :key="producto.id" cols="12" sm="6" lg="4" xl="3">
      <ProductoCard :producto="producto" @agregar-al-carrito="emit('agregar-producto', $event)" />
    </v-col>
  </v-row>
</template>
