import { NuxtConfig } from '@nuxt/types'

const sanityConfig = {
  projectId: 'qy73powj',
}

const config: NuxtConfig & { sanity: typeof sanityConfig } = {
  modules: ['@nuxtjs/sanity', '@nuxtjs/device'],
  sanity: sanityConfig,
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  css: ['@/assets/scss/main/index.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/resources/index.scss" as *;',
        },
      },
    },
  },
}

export default config
