export const useProductosStore = defineStore('productos', {
  state: () => ({
    productos: [
      { id: 1, imagen: 'https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg', descripcion: 'Cien años de soledad · Gabriel García Márquez', valor: 68000, descuento: 15, categoria: 'Literatura', stock: 10 },
      { id: 2, imagen: 'https://covers.openlibrary.org/b/isbn/9780307389732-L.jpg', descripcion: 'El amor en los tiempos del cólera · Gabriel García Márquez', valor: 72000, descuento: 0, categoria: 'Literatura', stock: 10 },
      { id: 3, imagen: 'https://covers.openlibrary.org/b/isbn/9780060934347-L.jpg', descripcion: 'Don Quijote de la Mancha · Miguel de Cervantes', valor: 85000, descuento: 20, categoria: 'Literatura', stock: 10 },
      { id: 4, imagen: 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg', descripcion: 'El principito · Antoine de Saint-Exupéry', valor: 38000, descuento: 10, categoria: 'Infantiles', stock: 10 },
      { id: 5, imagen: 'https://covers.openlibrary.org/b/isbn/9781400034956-L.jpg', descripcion: 'Crónica de una muerte anunciada · Gabriel García Márquez', valor: 45000, descuento: 0, categoria: 'Literatura', stock: 10 },
      { id: 6, imagen: 'https://covers.openlibrary.org/b/isbn/9780802133908-L.jpg', descripcion: 'Pedro Páramo · Juan Rulfo', valor: 42000, descuento: 25, categoria: 'Literatura', stock: 10 },
      { id: 7, imagen: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg', descripcion: '1984 · George Orwell', valor: 52000, descuento: 10, categoria: 'Literatura', stock: 10 },
      { id: 8, imagen: 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg', descripcion: 'Orgullo y prejuicio · Jane Austen', valor: 48000, descuento: 30, categoria: 'Literatura', stock: 10 },
      { id: 9, imagen: 'https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg', descripcion: 'Drácula · Bram Stoker', valor: 49000, descuento: 15, categoria: 'Terror', stock: 10 },
      { id: 10, imagen: 'https://covers.openlibrary.org/b/isbn/9780486282114-L.jpg', descripcion: 'Frankenstein · Mary Shelley', valor: 39000, descuento: 0, categoria: 'Terror', stock: 10 },
      { id: 11, imagen: 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg', descripcion: 'El resplandor · Stephen King', valor: 62000, descuento: 20, categoria: 'Terror', stock: 10 },
      { id: 12, imagen: 'https://covers.openlibrary.org/b/isbn/9780141439761-L.jpg', descripcion: 'Alicia en el país de las maravillas · Lewis Carroll', valor: 35000, descuento: 10, categoria: 'Infantiles', stock: 10 },
      { id: 13, imagen: 'https://covers.openlibrary.org/b/isbn/9780142410370-L.jpg', descripcion: 'Matilda · Roald Dahl', valor: 36000, descuento: 0, categoria: 'Infantiles', stock: 10 },
      { id: 14, imagen: 'https://covers.openlibrary.org/b/isbn/9780142410318-L.jpg', descripcion: 'Charlie y la fábrica de chocolate · Roald Dahl', valor: 37000, descuento: 25, categoria: 'Infantiles', stock: 10 },
    ],
    categorias: ['Todos', 'Literatura', 'Infantiles', 'Terror'],
    categoriaElegida: 'Todos',
  }),

  getters: {
    porId: (state) => (id) => state.productos.find((producto) => producto.id === id),
    // valorConDescuento = valor × (1 − descuento / 100). Única fuente de esta fórmula.
    valorConDescuento: () => (producto) =>
      Math.round(producto.valor * (1 - producto.descuento / 100)),
    productosFiltrados(state) {
      if (this.categoriaElegida === 'Todos') return state.productos
      return state.productos.filter((producto) => producto.categoria === this.categoriaElegida)
    },
  },

  actions: {
    seleccionarCategoria(categoria) {
      if (this.categorias.includes(categoria)) this.categoriaElegida = categoria
    },

    descontarStock(productoId, cantidad) {
      const producto = this.porId(productoId)
      if (!producto || cantidad < 1 || producto.stock < cantidad) return false
      producto.stock -= cantidad
      return true
    },
  },
})
