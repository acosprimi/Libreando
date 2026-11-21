<script setup>
import { ref } from 'vue'

const productosStore = useProductosStore()
const { productos } = storeToRefs(productosStore)
const mostrarCarrito = ref(false)
const mostrarPago = ref(false)
const mostrarFactura = ref(false)
</script>

<template>
  <v-app>
    <AppHeader
      nombre-tienda="Libreando"
      @ver-carrito="mostrarCarrito = !mostrarCarrito"
    />

    <v-main>
      <v-container>
        <!-- Portada -->
        <v-card color="secondary" rounded="xl" flat class="pa-6 pa-md-10 mb-8">
          <v-row align="center">
            <v-col cols="12" md="7">
              <h1 class="text-h4 text-md-h2 font-weight-bold">Libros para todos los gustos</h1>
              <p class="text-h6 mt-3 mb-6">Hasta 30 % de descuento en libros seleccionados.</p>
              <v-btn color="white" size="large" variant="flat" href="#catalogo">Ver catálogo</v-btn>
            </v-col>

            <!-- Tres portadas de adorno (solo en pantallas grandes) -->
            <v-col cols="5" class="d-none d-md-flex justify-center ga-4">
              <v-img
                v-for="libro in productos.slice(0, 3)"
                :key="libro.id"
                :src="libro.imagen"
                :alt="libro.descripcion"
                max-width="110"
                height="165"
                class="rounded elevation-8"
              />
            </v-col>
          </v-row>
        </v-card>

        <ListaProductos
        />

        <!-- Pago simulado: ventana emergente -->
        <PagoCompra
          v-if="mostrarPago"
          @pago-confirmado="mostrarPago = false; mostrarFactura = true"
          @cancelar="mostrarPago = false"
        />

        <!-- Factura: ventana emergente (v-dialog dentro del componente) -->
        <FacturaCompra
          v-if="mostrarFactura"
          @nueva-compra="mostrarFactura = false"
        />
      </v-container>
    </v-main>

    <!-- Carrito: panel vertical a la derecha (v-navigation-drawer dentro del componente) -->
    <CarritoCompra
      :abierto="mostrarCarrito"
      @cerrar="mostrarCarrito = false"
      @finalizar-compra="mostrarCarrito = false; mostrarPago = true"
    />

    <AppFooter nombre-tienda="Libreando" :año="2026" contacto="ventas@entrelineas.edu.co" />
  </v-app>
</template>
