<script setup>
import { ref, computed } from 'vue'

// Prop: total a pagar (lo calcula el padre)
defineProps({
  total: { type: Number, required: true },
})

// Emits: el hijo avisa si el cliente pagó o canceló
const emit = defineEmits(['pagar', 'cancelar'])

const formatoCOP = (numero) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(numero)

// Datos propios del formulario (no vienen del padre, por eso son ref locales)
const metodo = ref('Tarjeta')
const numeroTarjeta = ref('')
const titular = ref('')
const celular = ref('')
const procesando = ref(false)

// Número de referencia inventado para pagar en efectivo (6 cifras al azar)
const referencia = Math.floor(100000 + Math.random() * 900000)

// El botón solo se activa cuando el método elegido tiene sus datos escritos
const puedePagar = computed(() => {
  if (metodo.value === 'Tarjeta') {
    return numeroTarjeta.value !== '' && titular.value !== ''
  }
  if (metodo.value === 'Nequi') {
    return celular.value !== ''
  }
  return true // Efectivo no necesita escribir nada
})

// Simulación: espera 1,5 segundos como si estuviera pagando o verificando, y avisa al padre
function pagar() {
  procesando.value = true
  setTimeout(() => {
    procesando.value = false
    emit('pagar', metodo.value) // avisa y envía el método elegido
  }, 1500)
}
</script>

<template>
  <v-dialog :model-value="true" persistent max-width="480">
    <v-card class="pa-4">
      <div class="d-flex align-center ga-3 px-4 pt-2">
        <img src="/logo.svg" alt="Logo" width="40" height="40" />
        <h2 class="text-h5 font-weight-bold">Pagar compra</h2>
      </div>

      <v-card-text>
        <p class="mb-2">Método de pago</p>
        <v-btn-toggle v-model="metodo" mandatory color="primary" divided class="mb-4">
          <v-btn value="Tarjeta">Tarjeta</v-btn>
          <v-btn value="Nequi">Nequi</v-btn>
          <v-btn value="Efectivo">Efectivo</v-btn>
        </v-btn-toggle>

        <!-- Tarjeta: puede escribir cualquier número -->
        <div v-if="metodo === 'Tarjeta'">
          <v-text-field v-model="numeroTarjeta" label="Número de tarjeta" inputmode="numeric" maxlength="19" variant="outlined" />
          <v-text-field v-model="titular" label="Nombre del titular" variant="outlined" />
        </div>

        <!-- Nequi: cualquier número de celular -->
        <div v-else-if="metodo === 'Nequi'">
          <v-text-field v-model="celular" label="Número de celular" prefix="+57" inputmode="numeric" maxlength="10" variant="outlined" />
        </div>

        <!-- Efectivo: se muestra una referencia para pagar en un punto Efecty -->
        <div v-else>
          <v-card variant="tonal" color="primary" class="pa-4 text-center">
            <p>Número de referencia para pagar en Efecty</p>
            <p class="text-h4 font-weight-bold my-2">{{ referencia }}</p>
                      </v-card>
        </div>

        <p class="text-h6 font-weight-bold mt-2">Total: {{ formatoCOP(total) }}</p>
      </v-card-text>

      <v-card-actions>
        <v-btn :disabled="procesando" @click="emit('cancelar')">Cancelar</v-btn>
        <v-spacer />
        <v-btn color="primary" variant="flat" :disabled="!puedePagar" :loading="procesando" @click="pagar">
          {{ metodo === 'Efectivo' ? 'Verificar pago' : 'Pagar con ' + metodo }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
