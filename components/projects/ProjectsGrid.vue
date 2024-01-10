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
      onComplete: () => {
        // $ctx.value = null
      },
    })
  }, $projectsGrid.value)
}
const addVideoHoverListeners = () => {
  const items = $projectsGrid.value.querySelectorAll('.item');

  items.forEach((item) => {
    const video = item.querySelector('video');

    item.addEventListener('mouseenter', () => {
     if (video) {
        video.play();
      }
    });

    item.addEventListener('mouseleave', () => {
   
          if (video) {
        video.pause();
        setTimeout(() => {
          video.currentTime = 0;
        }, 200);
    
      }
    });
  });
};

onMounted(() => {
  showProjects();
  // Add video hover listeners after the projects are displayed
  addVideoHoverListeners();
});


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
      gridModeCols === 6 ? 'ProjectsGrid--six-items' : 'ProjectsGrid--four-items',
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
  column-gap: 4rem;
  row-gap: 5rem;
  padding: 0 2.5rem;
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
      pointer-events: none;

      img {
        object-fit: cover;
        height: 100%;
        width:100%;
        aspect-ratio: 1 / 1;

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

  &--six-items {
    grid-template-columns: repeat(6, 1fr);

    @include viewport-992 {
      // grid-template-columns: repeat(6, 1fr);
    }

    .item {
      @include viewport-768 {
        grid-column: auto / span 2;
      }

      @include viewport-480 {
        grid-column: auto / span 3;
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
