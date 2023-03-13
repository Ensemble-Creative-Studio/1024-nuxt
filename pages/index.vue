<script setup>
import gsap from 'gsap'

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
const home = data._rawValue

const $main = ref()
const $tl = ref()
const $ctx = ref()

onMounted(() => {
  $ctx.value = gsap.context((self) => {
    const title = self.selector('.hero .title')
    $tl.value = gsap.to(title, {
      y: 0,
      delay: 1,
      duration: 1,
      autoAlpha: 1,
      ease: 'power3.out',
    })
  }, $main.value)
})

onUnmounted(() => {
  $ctx.value.revert()
})
</script>

<template>
  <div class="index">
    <Head>
      <Title>1024</Title>
      <Meta name="description" content="1024 architecture website" />
    </Head>
    <section class="hero" ref="$main">
      <GridContainer>
        <h1 class="title" ref="$title">
          {{ home.baseline }}
        </h1>
      </GridContainer>
    </section>
    <FeaturedProjects :projects="home.featuredProjects" />
  </div>
</template>

<style lang="scss" scoped>
.index {
  .hero {
    height: 100vh;
    padding-top: 30rem;

    @include viewport-375 {
      height: auto;
      padding-top: 15rem; //
    }

    .title {
      grid-column: 2 / span 8;
      font-size: $main-text-size;
      font-weight: $extra-light;
      opacity: 0;
      transform: translateY(10rem);

      @include viewport-375 {
        grid-column: 1 / span 10;
        font-size: $mobile-secondary-text-size;
      }
    }
  }
}
</style>
