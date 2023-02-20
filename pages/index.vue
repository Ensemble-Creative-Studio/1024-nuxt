<script setup>
const query = groq`*[_type == "home"][0]
  {
    baseline,
    featuredProjects[] -> {
      title,
      slug,
      releaseDate,
      mainImage,
      mainVideo,
      categories[] -> {
        title,
        slug
      }
    }
  }
`
const sanity = useSanity()
const { data } = await useAsyncData('home', () =>
  sanity.fetch(query)
)
const home = data._rawValue
</script>

<template>
  <div class="index">
    <Head>
      <Title>1024</Title>
      <Meta name="description" content="1024 architecture website" />
    </Head>
    <section class="hero">
      <GridContainer>
        <h1 class="title">
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
    padding-top: 26rem;

    .title {
      grid-column: 2 / span 8;
      font-size: $main-text-size;
      font-weight: $extra-light;
    }
  }
}
</style>
