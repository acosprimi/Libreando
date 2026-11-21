<script setup>
const productosStore = useProductosStore()
const { productosFiltrados, categorias, categoriaElegida } = storeToRefs(productosStore)
</script>

<template>
  <h2 id="catalogo" class="text-h4 font-weight-bold mb-4">Catálogo</h2>

  <!-- Categorías: v-chip-group deja elegir una etiqueta a la vez -->
  <v-chip-group
    :model-value="categoriaElegida"
    mandatory
    selected-class="bg-primary"
    class="mb-4"
    @update:model-value="productosStore.seleccionarCategoria"
  >
    <v-chip v-for="categoria in categorias" :key="categoria" :value="categoria" size="large">
      {{ categoria }}
    </v-chip>
  </v-chip-group>

  <p class="text-medium-emphasis mb-4">{{ productosFiltrados.length }} libros</p>

  <v-row>
    <v-col v-for="producto in productosFiltrados" :key="producto.id" cols="12" sm="6" lg="4" xl="3">
      <ProductoCard :producto="producto" />
    </v-col>
  </v-row>
</template>
