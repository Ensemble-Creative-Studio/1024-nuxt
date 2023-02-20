<script setup>
const props = defineProps({
  project: [Object],
})

const $projectVideo = ref(null)
const isMenuOpen = ref(false)
</script>

<template>
  <NuxtLink
    class="FeaturedProject"
    :to="{
      name: 'projects-slug',
      params: { slug: project.slug.current },
    }"
  >
    <SanityImage
      class="FeaturedProject__thumbnail"
      v-if="!project.mainVideo"
      :asset-id="project.mainImage.asset._ref"
      auto="format"
      :q="75"
    />
    <video
      class="FeaturedProject__video"
      v-if="project.mainVideo"
      src=""
    ></video>
    <h2 class="FeaturedProject__title">{{ project.title }}</h2>
  </NuxtLink>
</template>

<style lang="scss">
.FeaturedProject {
  height: 100vh;
  position: relative;
  margin-top: -2rem;

  &__title {
    font-size: $main-text-size;
    font-weight: $extra-light;
    position: absolute;
    bottom: calc(1.5rem + 2rem);
    left: 2rem;
  }

  &__thumbnail,
  &__video {
    height: 100%;
    object-fit: cover;
  }

  &:last-child {
    .FeaturedProject__title {
      bottom: 1.5rem;
    }
  }
}
</style>
