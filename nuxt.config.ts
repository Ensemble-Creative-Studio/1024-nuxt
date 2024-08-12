import { NuxtConfig } from '@nuxt/types'

const sanityConfig = {
  projectId: 'fdic53fd',
}

const config: NuxtConfig & { sanity: typeof sanityConfig } = {
  modules: ['@nuxtjs/sanity', 'nuxt-lazy-load'],
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
    '~/components/blog',
    '~/components/icons',
  ],
  nitro: {
    prerender: {
      routes: ['/404.html'],
    },
  },
  build: {
    transpile: ['gsap'],
  },
  generate: { fallback: '404.html' },
}

export default config
