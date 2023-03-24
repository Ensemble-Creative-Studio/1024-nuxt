<script setup>
import gsap from 'gsap'

const props = defineProps({
  projects: [Object],
  order: String,
  displayMode: String,
  gridModeCols: Number,
})

// Animations
const $projects = ref()
const $tl = ref()
const $ctx = ref()

// onMounted(() => {
//   $ctx.value = gsap.context((self) => {
//     const project = self.selector('.ProjectsGrid .item')
//     $tl.value = gsap.to(project, {
//       y: 0,
//       delay: 1,
//       duration: 1,
//       autoAlpha: 1,
//       ease: 'power3.out',
//       stagger: 0.1,
//     })
//   }, $projects.value)
// })

// onBeforeUnmount(() => {
//   gsap.to($projectsGrid.value.$el, {
//     delay: 0,
//     duration: 2,
//     rotate: 100,
//     ease: 'power3.out',
//   })
// })
</script>

<template>
  <ul
    :class="[
      gridModeCols === 3 ? 'ProjectsGrid--three-items' : 'ProjectsGrid--four-items',
      'ProjectsGrid',
    ]"
    ref="$projects"
  >
    <template v-for="item in projects">
      <li class="item">
        <NuxtLink
          class="item__link"
          :to="{ name: 'projects-slug', params: { slug: item.slug.current } }"
          :key="item._id"
        >
          <div class="item__thumbnail">
            <SanityImage
              v-if="item.mainImage"
              :asset-id="item.mainImage.asset._ref"
              auto="format"
            />
            <video
              v-if="item.mainVideoUrl"
              :src="item.mainVideoUrl"
              muted
              loop
              autoplay
              playsinline
              webkit-playsinline
            ></video>
          </div>
          <h3 class="item__title">{{ item.title }}</h3>
        </NuxtLink>
      </li>
    </template>
  </ul>
</template>

<style lang="scss">
.ProjectsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 1rem;
  row-gap: 2rem;
  padding: 0 1.5rem;
  overflow: hidden;

  @include viewport-375 {
    padding: 0 1rem;
  }

  &--three-items {
    grid-template-columns: repeat(3, 1fr);

    @include viewport-375 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .item {
    // opacity: 0;
    // transform: translateY(5rem);

    @include viewport-375 {
      grid-column: auto / span 2;
    }

    &__thumbnail {
      aspect-ratio: 1 / 1;
      position: relative;

      img {
        object-fit: cover;
        height: 100%;
        filter: grayscale(100%);
        transition: 0.25s ease-in-out;
      }

      video {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        visibility: hidden;
        transition: 0.25s ease-in-out;
      }
    }

    &:hover img {
      filter: grayscale(0);
    }

    &:hover video {
      opacity: 1;
      visibility: visible;
    }

    &__title {
      margin-top: 1rem;
    }
  }
}
</style>
