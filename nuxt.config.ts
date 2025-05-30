import { NuxtConfig } from '@nuxt/types'

const sanityConfig = {
  projectId: 'fdic53fd',
}

const config: NuxtConfig & { sanity: typeof sanityConfig } = {
  modules: ['@nuxtjs/sanity', '@nuxtjs/device', 'nuxt-lazy-load'],
  plugins: [
    '~/plugins/sanity-image-builder.js',
  ],
  sanity: sanityConfig,
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
  components: [
    '~/components/nav',
    '~/components/utils',
    '~/components/projects',
    '~/components/news',
    '~/components/icons',
  ],
  build: {
    transpile: ['gsap'],
  },
}

export default config
