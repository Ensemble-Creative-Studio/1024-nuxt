<script setup>
const { isMobile } = useDevice()

const query = groq`*[_type == "home"][0]
  {
    baseline,
    firstProject -> {
      ...,
      categories[] -> {
        title,
        slug
      }
    },
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
</script>

<template>
  <div class="index">
    <Head>
      <Title>1024</Title>
      <Meta name="description" content="1024 architecture website" />
    </Head>
    <FeaturedProjects
      :baseline="home.baseline"
      :firstProject="home.firstProject"
      :projects="home.featuredProjects"
      v-if="!isMobile"
    />
    <MobileFeaturedProjects
      v-else
      :baseline="home.baseline"
      :firstProject="home.firstProject"
      :projects="home.featuredProjects"
    />
  </div>
</template>
