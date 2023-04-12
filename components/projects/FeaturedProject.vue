<script setup>
const props = defineProps({
  project: [Object],
})
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
      v-if="project.mainVideoUrl"
      :src="project.mainVideoUrl"
      autoplay
      muted
      loop
      playsinline
      webkit-playsinline
    ></video>
    <h2 class="FeaturedProject__title">{{ project.title }}</h2>
  </NuxtLink>
</template>

<style lang="scss">
.FeaturedProject {
  height: 100vh;
  position: relative;

  @include viewport-375 {
    margin-top: 0;
  }

  &__title {
    font-size: $desktop-h2;
    font-weight: $extra-light;
    position: absolute;
    left: 2rem;
    bottom: 2rem;
    transform: translateY(10rem);

    @include viewport-375 {
      font-size: $mobile-h2;
      left: 1rem;
      bottom: 1rem;
    }
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
