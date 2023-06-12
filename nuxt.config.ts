import { NuxtConfig } from '@nuxt/types'

const sanityConfig = {
  projectId: 'fdic53fd',
}

const config: NuxtConfig & { sanity: typeof sanityConfig } = {
  modules: ['@nuxtjs/sanity', '@nuxtjs/device'],
  sanity: sanityConfig,
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  // proxy: {
  //   proxies: {
  //     '/api': {
  //       target: 'https://player.vimeo.com/video/',
  //       changeOrigin: true,
  //       rewrite: (path: any) => path.replace(/^\/api/, ''),
  //     },
  //   },
  // },
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
}

export default config
