import 'vuetify/styles'
import { createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import '../assets/class.css'

const dark = {
  colors: {
    surface: '#C0812D',
    primary: '#A60014',
    secondary: '#D96429',
    error: '#E90049',
    success: '#079C27',
    info: '#AE01FE',

    background: '#000',
    // 'primary-darken-1': '#202424',
    // 'secondary-darken-1': '#018786',
    // warning: '#FB8C00',
  },
}

const light = {
  colors: {
    surface: '#860000',
    primary: '#202424',
    secondary: '#FFE6C0',
    error: '#DE041A',
    success: '#079C27',
    info: '#AE01FE',

    // background: '#FFFFFF',
    // 'primary-darken-1': '#202424',
    // 'secondary-darken-1': '#018786',
    // warning: '#FB8C00',
  },
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    date: {
      locale: {
        en: 'pt',
      }
    },
    theme: {
      defaultFont: ['Roboto', 'sans-serif'],
      defaultTheme: 'dark',
      themes: {
        light, dark
      },
    },
    icons: {
      defaultSet: 'mdi',
    },
  })
  
  nuxtApp.vueApp.use(vuetify, {
    iconfont: 'md'
  })
})
