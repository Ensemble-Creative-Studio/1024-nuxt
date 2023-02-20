<template>
  <NuxtLink
    class="Project"
    :to="{
      name: 'projects',
      params: { slug: project.slug.current },
    }"
  >
    <header class="Project__header">
      <h2 class="Project__title">{{ project.title }}</h2>
      <div class="Project__categories">
        <span
          class="Project__category"
          v-for="categoryTitle in project.categoriesTitles"
          >{{ categoryTitle }}</span
        >
      </div>
      <span class="Project__date">{{ project._createdAt }}</span>
    </header>
    <div class="Project__container">
      <div class="Project__video" v-if="project.video">
        <video ref="$projectVideo" muted loop>
          <source :src="project.videoUrl" type="video/mp4" />
        </video>
      </div>
    </div>
    <footer class="Project__footer" v-if="project.gallery">
      <!-- <div class="Project__gallery" v-if="project.gallery.images">
        <SanityImage
          class="Project__image"
          v-for="child in project.gallery.images"
          :key="child._id"
          :asset-id="child.asset._ref"
          auto="format"
        />
      </div> -->
    </footer>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  project: [Object],
})

const $projectVideo = ref(null)

onBeforeMount(async () => {
  if ($projectVideo) {
    // $projectVideo.play()
    console.log('Before component is mounted')
  }
})

onMounted(() => {
  if ($projectVideo) {
    // $projectVideo.play()
    console.log('Component is mounted')
  }
})

onUnmounted(() => {
  if ($projectVideo) {
    // $projectVideo.pause()
    console.log('Component is destroyed')
  }
})
</script>

<style lang="scss">
.Project {
  padding: 1.5rem 0;
  border-bottom: 0.1rem solid gray;

  &__title {
    font-size: 3.2rem;
    font-weight: bold;
    display: block;
  }

  &__video {
    margin-top: 1.5rem;
  }

  &__gallery {
    display: flex;
    margin-top: 1.5rem;
  }

  &__image {
    height: 15rem;
    border: 0.1rem solid gray;
  }

  &__categories {
    display: flex;
  }

  &__category {
    &:not(:last-child) {
      &::after {
        content: ',\00a0';
      }
    }
  }
}
</style>
