<script setup>
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
    padding-top: 30rem;

    @include viewport-375 {
      height: auto;
      padding-top: 15rem; //
    }

    .title {
      grid-column: 2 / span 8;
      font-size: $main-text-size;
      font-weight: $extra-light;

      @include viewport-375 {
        grid-column: 1 / span 10;
        font-size: $mobile-secondary-text-size;
      }
    }
  }

  .FeaturedProjects {
    margin-top: 12rem;
  }
}
</style>
