import { resolve } from 'path'
export default defineNuxtConfig({
  app: {
    server: {
      host: '0.0.0.0',
    },
    head: {
        titleTemplate: "Almeida's Cortes",
        htmlAttrs: {
          lang: 'pt-br'
        },
        meta: [
            { charset: 'UTF-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            { hid: 'description', name: 'description', content: ''},
            { name: 'format-detection', content: 'telephone=no' },
            { hid: 'd4sign-domain-verification', name: 'd4sign-domain-verification',content: 'd3f378e8-f6ab-47cd-a98b-4cb40d038c52'},
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: './assets/images/logo.png' }//favicon
        ],
    },
  },

  alias: {
    'svg': resolve(__dirname, './assets/images/svg'),
    'node_modules': resolve(__dirname, './node_modules'),
    './': resolve( './*')
  },

  vue: {
    config: {
      silent: true
    }
  },

  runtimeConfig: {
    API_BACKEND: process.env.API_BACKEND,

    public: {
      API_BACKEND: process.env.API_BACKEND
    }
  },

  css: [
    "@/assets/class.css",
  ],

  buildModules: [
    "@nuxtjs/dotenv"
  ],

  build: {        
    transpile: ['vuetify'], 
  },

  vite: {    
    define: {        
      'process.env.DEBUG': false,    
    },  
  },

  plugins: [  
    '~/plugins/toastify.js',
    '~/plugins/axios.js',
    '~/plugins/vueTheMask.js',
    '~/plugins/formattePreco.js',
    '~/plugins/validateForm.js',
    '~/plugins/formatteDateDB.js',
  ],

  vue: {  
    compilerOptions: {
      isCustomElement: (tag) => ['lite-youtube'].includes(tag),
    },
  },

  devtools: { enabled: true },

  components: [
    {path: '~/components', extensions: ['.vue'], }, 
    {path: '~/layouts', extensions: ['.vue'], },
  ],

  compatibilityDate: '2025-03-14',
})