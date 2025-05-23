// resources/js/app.ts
import '../css/app.css'
import '@mdi/font/css/materialdesignicons.css'
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { ZiggyVue } from 'ziggy-js'
import vuetify from './plugins/vuetify'
import AppLayout from './layouts/AppLayout.vue'

createInertiaApp({
  title: (title) => `${title} - Laravel`,
  resolve: async (name) => {
    const pages = import.meta.glob('./pages/**/*.vue')
    const page = pages[`./pages/${name}.vue`]
    const module = await page()
    return (module as any).default
  },
  setup({ el, App, props, plugin }) {
    const app = createApp({
      render: () =>
        h(AppLayout, null, {
          default: () => h(App, props)
        })
    })

    app.use(plugin)
    app.use(vuetify)
    app.use(ZiggyVue)

    app.mount(el)
  }
})
