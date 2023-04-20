<script setup>
import gsap from 'gsap'

const { isMobile } = useDevice()

const query = groq`*[_type == "home"][0]
  {
    ...,
    featuredProjects[] -> {
      ...,
      categories[] -> {
        title,
        slug
      }
    }
  }
`
const sanity = useSanity()
const { data } = await useAsyncData('home', () => sanity.fetch(query))
const home = data.value

// Animations
const $ctx = ref()
const $index = ref()

const tl = gsap.timeline()

onMounted(() => {
  // Only for desktop
  if (!isMobile) {
    $ctx.value = gsap.context((self) => {
      const chunks = self.selector('.title__chunk')

      for (let i = chunks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[chunks[i], chunks[j]] = [chunks[j], chunks[i]]
      }

      tl.to(chunks, {
        duration: 2.5,
        autoAlpha: 1,
        ease: 'power2.out',
        stagger: 0.03,
      })
    }, $index.value)
  }
})

const $baseline = home.baseline

const splitBaseline = computed(() => {
  return $baseline.split(' ')
})

onBeforeUnmount(() => {
  if ($ctx.value) {
    $ctx.value.revert()
  }
})
</script>

<template>
  <div class="index" ref="$index">
    <Head>
      <Title>1024</Title>
      <Meta name="description" content="1024 architecture website" />
    </Head>
    <section class="hero" v-if="!isMobile">
      <GridContainer>
        <h1 class="title">
          <span class="title__chunk" v-for="(word, index) in splitBaseline" :key="index">
            {{ word }}{{ index !== splitBaseline.length - 1 ? ' ' : '' }}
          </span>
        </h1>
      </GridContainer>
    </section>
    <FeaturedProjects v-if="!isMobile" :projects="home.featuredProjects" />
    <MobileFeaturedProjects v-else :baseline="home.baseline" :projects="home.featuredProjects" />
  </div>
</template>

<style lang="scss" scoped>
.index {
  .hero {
    height: 100vh;
    width: 100%;
    padding-top: 30rem;
    position: fixed;
    top: 0;
    left: 0;

    @include viewport-480 {
      display: none;
    }

    .title {
      grid-column: 2 / span 8;
      max-width: 110rem;
      font-size: $desktop-h4;
      font-weight: $extra-light;
      position: sticky;
      bottom: 50%;

      @include viewport-1200 {
        grid-column: 1 / -1;
      }

      @include viewport-1024 {
        font-size: $mobile-h2;
      }

      @include viewport-480 {
        display: none;
      }

      &__chunk {
        opacity: 0;

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .FeaturedProjects {
    // margin-top: -2rem;
  }
}
</style>
