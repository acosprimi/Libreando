<script setup>
defineProps({
  nombreTienda: { type: String, required: true },
  anio: { type: Number, required: true },
  contacto: { type: String, default: '' },
})

// Integrantes del grupo
const integrantes = [
  'Cristian Acevedo Pineda',
  'Valeria Altafulla Urango',
  'Acosprimi Polo Romero',
  'Lausabid Polo Romero',
]
</script>

<template>
  <v-footer color="secondary" class="d-block pa-0">
    <v-container>
      <v-row class="py-4">
        <v-col cols="12" md="3">
          <div class="d-flex align-center ga-2 mb-2">
            <img src="/logo.svg" alt="Logo" width="32" height="32" />
            <h3 class="text-h6 font-weight-bold">{{ nombreTienda }}</h3>
          </div>
          <p>Librería en línea</p>
        </v-col>

        <v-col cols="12" md="3">
          <h3 class="text-h6 font-weight-bold mb-2">Integrantes</h3>
          <p v-for="nombre in integrantes" :key="nombre">{{ nombre }}</p>
        </v-col>

        <v-col cols="12" md="3">
          <h3 class="text-h6 font-weight-bold mb-2">Contacto</h3>
          <p>{{ contacto }}</p>
          <p>+57 300 000 0000</p>
          <p>Calle 00 # 00-00, Montería, Córdoba</p>
        </v-col>

        <v-col cols="12" md="3">
          <h3 class="text-h6 font-weight-bold mb-2">Redes sociales</h3>
          <p><a href="#" class="text-white">Instagram</a></p>
          <p><a href="#" class="text-white">Facebook</a></p>
          <p><a href="#" class="text-white">TikTok</a></p>
        </v-col>
      </v-row>

      <v-divider />
      <p class="text-center text-body-2 pt-4">
        © {{ anio }} {{ nombreTienda }} · Universidad de Córdoba · Fundamentos de programación
      </p>
    </v-container>
  </v-footer>
</template>