<script setup>
import { ref, computed } from 'vue'

// ===== ESTADO COMPARTIDO (solo vive aquí, en el componente raíz) =====

// Arreglo 1: lo que la tienda vende
const productos = ref([
  { id: 1, imagen: 'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg', descripcion: 'Cien años de soledad · Gabriel García Márquez', valor: 68000, descuento: 15, categoria: 'Literatura' },
  { id: 2, imagen: 'https://covers.openlibrary.org/b/isbn/9780307389732-L.jpg', descripcion: 'El amor en los tiempos del cólera · Gabriel García Márquez', valor: 72000, descuento: 0, categoria: 'Literatura' },
  { id: 3, imagen: 'https://covers.openlibrary.org/b/isbn/9780060934347-L.jpg', descripcion: 'Don Quijote de la Mancha · Miguel de Cervantes', valor: 85000, descuento: 20, categoria: 'Literatura' },
  { id: 4, imagen: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg', descripcion: 'El principito · Antoine de Saint-Exupéry', valor: 38000, descuento: 10, categoria: 'Infantiles' },
  { id: 5, imagen: 'https://covers.openlibrary.org/b/isbn/9781400034956-L.jpg', descripcion: 'Crónica de una muerte anunciada · Gabriel García Márquez', valor: 45000, descuento: 0, categoria: 'Literatura' },
  { id: 6, imagen: 'https://covers.openlibrary.org/b/isbn/9780802133908-L.jpg', descripcion: 'Pedro Páramo · Juan Rulfo', valor: 42000, descuento: 25, categoria: 'Literatura' },
  { id: 7, imagen: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg', descripcion: '1984 · George Orwell', valor: 52000, descuento: 10, categoria: 'Literatura' },
  { id: 8, imagen: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg', descripcion: 'Orgullo y prejuicio · Jane Austen', valor: 48000, descuento: 30, categoria: 'Literatura' },
  { id: 9, imagen: 'https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg', descripcion: 'Drácula · Bram Stoker', valor: 49000, descuento: 15, categoria: 'Terror' },
  { id: 10, imagen: 'https://covers.openlibrary.org/b/isbn/9780486282114-L.jpg', descripcion: 'Frankenstein · Mary Shelley', valor: 39000, descuento: 0, categoria: 'Terror' },
  { id: 11, imagen: 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg', descripcion: 'El resplandor · Stephen King', valor: 62000, descuento: 20, categoria: 'Terror' },
  { id: 12, imagen: 'https://covers.openlibrary.org/b/isbn/9780141439761-L.jpg', descripcion: 'Alicia en el país de las maravillas · Lewis Carroll', valor: 35000, descuento: 10, categoria: 'Infantiles' },
  { id: 13, imagen: 'https://covers.openlibrary.org/b/isbn/9780142410370-L.jpg', descripcion: 'Matilda · Roald Dahl', valor: 36000, descuento: 0, categoria: 'Infantiles' },
  { id: 14, imagen: 'https://covers.openlibrary.org/b/isbn/9780142410318-L.jpg', descripcion: 'Charlie y la fábrica de chocolate · Roald Dahl', valor: 37000, descuento: 25, categoria: 'Infantiles' },
])

// Arreglo 2: lo que la persona compra. Cada elemento es { producto, cantidad }
const carrito = ref([])

// Categorías para filtrar el catálogo
const categorias = ['Todos', 'Literatura', 'Infantiles', 'Terror']
const categoriaElegida = ref('Todos')

const mostrarCarrito = ref(false)
const mostrarPago = ref(false)
const mostrarFactura = ref(false)
const musicaActiva = ref(false)
const consecutivo = ref(1)
const fecha = ref('')
const metodoPago = ref('')

// ===== VALORES CALCULADOS (computed) =====

// Suma de las cantidades: es el numerito rojo del carrito
const cantidadItems = computed(() => {
  let total = 0
  for (const item of carrito.value) {
    total = total + item.cantidad
  }
  return total
})

// Libros que se muestran según la categoría elegida
const productosFiltrados = computed(() => {
  if (categoriaElegida.value === 'Todos') {
    return productos.value
  }
  const lista = []
  for (const producto of productos.value) {
    if (producto.categoria === categoriaElegida.value) {
      lista.push(producto)
    }
  }
  return lista
})

// Total que paga el cliente (con descuento), para mostrarlo en la ventana de pago
const totalCompra = computed(() => {
  let total = 0
  for (const item of carrito.value) {
    const valorConDescuento = Math.round(item.producto.valor * (1 - item.producto.descuento / 100))
    total = total + valorConDescuento * item.cantidad
  }
  return total
})

const numeroFactura = computed(() => 'FAC-000' + consecutivo.value)

// ===== SONIDOS (los archivos están en la carpeta public) =====

let audioMusica = null

// Reproduce un sonido corto
function reproducir(archivo) {
  new Audio(archivo).play()
}

// Enciende o apaga la música de fondo
function alternarMusica() {
  if (audioMusica === null) {
    audioMusica = new Audio('/musica.wav')
    audioMusica.loop = true
    audioMusica.volume = 0.3
  }
  musicaActiva.value = !musicaActiva.value
  if (musicaActiva.value) {
    audioMusica.play()
  } else {
    audioMusica.pause()
  }
}

// ===== FUNCIONES: los hijos avisan con emits y el padre cambia los datos =====

// Si el producto ya está en el carrito sube su cantidad; si no, lo agrega
function agregarProducto(producto) {
  reproducir('/agregar.wav')
  const encontrado = buscarEnCarrito(producto.id)
  if (encontrado) {
    encontrado.cantidad++
  } else {
    carrito.value.push({ producto: producto, cantidad: 1 })
  }
}

// Busca en el carrito el renglón de un producto
function buscarEnCarrito(id) {
  return carrito.value.find((item) => item.producto.id === id)
}

function incrementar(id) {
  buscarEnCarrito(id).cantidad++
}

function decrementar(id) {
  const item = buscarEnCarrito(id)
  if (item.cantidad > 1) {
    item.cantidad--
  }
}

function eliminar(id) {
  carrito.value = carrito.value.filter((item) => item.producto.id !== id)
}

// "Finalizar compra" ahora abre primero la ventana de pago
function finalizarCompra() {
  mostrarCarrito.value = false
  mostrarPago.value = true
}

function pagar(metodo) {
  metodoPago.value = metodo
  fecha.value = new Date().toLocaleDateString('es-CO')
  mostrarPago.value = false
  mostrarFactura.value = true
  reproducir('/pago.wav')
}

function nuevaCompra() {
  carrito.value = []
  mostrarFactura.value = false
  consecutivo.value++
}
</script>

<template>
  <v-app>
    <AppHeader
      nombre-tienda="Libreando"
      :cantidad-items="cantidadItems"
      :musica-activa="musicaActiva"
      @ver-carrito="mostrarCarrito = !mostrarCarrito"
      @alternar-musica="alternarMusica"
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
          :productos="productosFiltrados"
          :categorias="categorias"
          :categoria-elegida="categoriaElegida"
          @cambiar-categoria="categoriaElegida = $event"
          @agregar-producto="agregarProducto"
        />

        <!-- Pago simulado: ventana emergente -->
        <PagoCompra v-if="mostrarPago" :total="totalCompra" @pagar="pagar" @cancelar="mostrarPago = false" />

        <!-- Factura: ventana emergente (v-dialog dentro del componente) -->
        <FacturaCompra
          v-if="mostrarFactura"
          :items="carrito"
          :numero-factura="numeroFactura"
          :fecha="fecha"
          :metodo-pago="metodoPago"
          @nueva-compra="nuevaCompra"
        />
      </v-container>
    </v-main>

    <!-- Carrito: panel vertical a la derecha (v-navigation-drawer dentro del componente) -->
    <CarritoCompra
      :items="carrito"
      :abierto="mostrarCarrito"
      @cerrar="mostrarCarrito = false"
      @incrementar="incrementar"
      @decrementar="decrementar"
      @eliminar="eliminar"
      @finalizar-compra="finalizarCompra"
    />

    <AppFooter nombre-tienda="Libreando" :año="2026" contacto="ventas@entrelineas.edu.co" />
  </v-app>
</template>
