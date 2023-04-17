<script setup>
import gsap from 'gsap'

const props = defineProps({
  projects: [Object],
  order: String,
  displayMode: String,
  gridModeCols: Number,
})

const $projectsGrid = ref()
const $tl = ref()
const $ctx = ref()

// Define GSAP animations
const showProjects = () => {
  $ctx.value = gsap.context((self) => {
    const projects = self.selector('.ProjectsGrid .item')

    $tl.value = gsap.to(projects, {
      y: 0,
      delay: 0.5,
      duration: 1.5,
      autoAlpha: 1,
      ease: 'power3.out',
      stagger: 0.1,
    })
  }, $projectsGrid.value)
}

const updateProjects = () => {
  window.scrollTo(0, 0)

  const projects = $projectsGrid.value.querySelectorAll('.ProjectsGrid .item')
  projects.forEach((project) => {
    project.style.opacity = '1'
    project.style.transform = 'translateY(0)'
  })
}

const hideProjects = () => {
  $ctx.value = gsap.context((self) => {
    const projects = self.selector('.ProjectsGrid .item')

    $tl.value = gsap.to(projects, {
      y: 30,
      autoAlpha: 0,
      ease: 'none',
    })
  }, $projectsGrid.value)
}

onMounted(() => {
  showProjects()
})

onBeforeUnmount(() => {
  hideProjects()
})

watch(
  () => props.projects,
  () => {
    setTimeout(() => {
      updateProjects()
    }, 0)
  }
)
</script>

<template>
  <ul
    :class="[
      gridModeCols === 3 ? 'ProjectsGrid--three-items' : 'ProjectsGrid--four-items',
      'ProjectsGrid',
    ]"
    ref="$projectsGrid"
    v-if="projects.length > 0"
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
              v-if="item.thumbnailImage || item.mainImage"
              :asset-id="
                item.thumbnailImage ? item.thumbnailImage.asset._ref : item.mainImage.asset._ref
              "
              auto="format"
            />
            <video
              v-if="item.thumbnailVideoUrl"
              :src="item.thumbnailVideoUrl"
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
  <div v-else class="ProjectsGrid--empty">No project matching your filters</div>
</template>

<style lang="scss">
.ProjectsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 1rem;
  row-gap: 2rem;
  padding: 0 1.5rem;
  overflow: hidden;

  @include viewport-480 {
    padding: 0 1rem;
  }

  .item {
    opacity: 0;
    transform: translateY(3rem);

    @include viewport-768 {
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

  &--three-items {
    grid-template-columns: repeat(3, 1fr);

    @include viewport-480 {
      grid-template-columns: repeat(4, 1fr);
    }

    .item {
      @include viewport-768 {
        grid-column: auto / span 1;
      }

      @include viewport-480 {
        grid-column: auto / span 2;
      }
    }
  }

  &--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
}
</style>
