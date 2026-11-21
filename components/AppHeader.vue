<script setup>
import { ref, onBeforeUnmount } from 'vue'

defineProps({
  nombreTienda: { type: String, required: true },
})

const emit = defineEmits(['ver-carrito'])
const carritoStore = useCarritoStore()
const { cantidadItems } = storeToRefs(carritoStore)
const musicaActiva = ref(false)
let audioMusica = null

function alternarMusica() {
  if (!audioMusica) {
    audioMusica = new Audio('/musica.wav')
    audioMusica.loop = true
    audioMusica.volume = 0.3
  }

  musicaActiva.value = !musicaActiva.value
  if (musicaActiva.value) audioMusica.play()
  else audioMusica.pause()
}

onBeforeUnmount(() => audioMusica?.pause())
</script>

<template>
  <v-app-bar color="secondary" elevation="2">
    <img src="/logo.svg" alt="Logo" width="38" height="38" class="ml-4 mr-2" />
    <v-app-bar-title class="font-weight-bold">{{ nombreTienda }}</v-app-bar-title>

    <v-btn variant="outlined" class="mr-4" @click="alternarMusica">
      Música: {{ musicaActiva ? 'sí' : 'no' }}
    </v-btn>

    <v-badge :content="cantidadItems" :model-value="true" color="error" class="mr-6">
      <v-btn variant="flat" @click="emit('ver-carrito')">Carrito</v-btn>
    </v-badge>
  </v-app-bar>
</template>
