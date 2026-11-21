export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['vuetify-nuxt-module', '@pinia/nuxt'],
  css: ['~/assets/main.css'],
  vuetify: {
    vuetifyOptions: {
      // Colores de toda la tienda
      theme: {
        defaultTheme: 'tienda',
        themes: {
          tienda: {
            colors: {
              background: '#eceaf0',
              primary: '#1f5d4a',
              secondary: '#1a2233',
              error: '#b3261e',
            },
          },
        },
      },
      // Estilo por defecto de botones y tarjetas
      defaults: {
        VBtn: { rounded: 'lg', class: 'text-none' },
        VCard: { rounded: 'lg' },
      },
    },
  },
  app: {
    head: { title: 'Libreando · Librería en línea',
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&display=swap',
        },
      ],
    },
  },
})