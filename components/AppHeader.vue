<script setup>
// Props: datos que llegan del padre
defineProps({
  nombreTienda: { type: String, required: true },
  cantidadItems: { type: Number, default: 0 },
  musicaActiva: { type: Boolean, default: false },
})

// Emits: avisos que el hijo le envía al padre
const emit = defineEmits(['ver-carrito', 'alternar-musica'])
</script>

<template>
  <v-app-bar color="secondary" elevation="2">
    <img src="/logo.svg" alt="Logo" width="38" height="38" class="ml-4 mr-2" />
    <v-app-bar-title class="font-weight-bold">{{ nombreTienda }}</v-app-bar-title>

    <v-btn variant="outlined" class="mr-4" @click="emit('alternar-musica')">
      Música: {{ musicaActiva ? 'sí' : 'no' }}
    </v-btn>

    <v-badge :content="cantidadItems" :model-value="true" color="error" class="mr-6">
      <v-btn variant="flat" @click="emit('ver-carrito')">Carrito</v-btn>
    </v-badge>
  </v-app-bar>
</template>
