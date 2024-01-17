<script setup>
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger) 
const props = defineProps({
  projects: [Object],
  categories: [Object],
  order: String,
  displayMode: String,
})

// Animations
const $tl = ref()
const $ctx = ref()
const $projectsList = ref()

const showProjects = () => {
  $ctx.value = gsap.context((self) => {
    const projects = self.selector('.ProjectsList .item')

    $tl.value = gsap.to(projects, {
      delay: 0.5,
      duration: 1,
      autoAlpha: 1,
      ease: 'power3.out',
      stagger: 0.1,
    })
  }, $projectsList.value)
}

const updateProjects = () => {
  window.scrollTo(0, 0)

  const projects = $projectsList.value.querySelectorAll('.ProjectsList .item')
  projects.forEach((project) => {
    project.style.opacity = '1'
  })
}

const hideProjects = () => {
  $ctx.value = gsap.context((self) => {
    const projects = self.selector('.ProjectsList .item')

    $tl.value = gsap.to(projects, {
      duration: 0.5,
      autoAlpha: 0,
      ease: 'power3.out',
      stagger: 0.1,
      onComplete: () => {
        // $ctx.value = null
      },
    })
  }, $projectsList.value)
}

const addVideoHoverListeners = () => {
  const items = $projectsList.value.querySelectorAll('.item');

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
const addVideoScrollTriggers = () => {
  if (window.innerWidth <= 768) { // Assuming 768px as a breakpoint for mobile devices
    const items = $projectsList.value.querySelectorAll('.item');

    items.forEach((item) => {
      const video = item.querySelector('video');

      if (video) {
        // Set initial opacity to 0
        video.style.opacity = '0';

        ScrollTrigger.create({
          trigger: item,
    
          start: "top center+=100", 
          end: "top center-=400",
          onEnter: () => { 
            video.play();
            video.style.opacity = '1';
             video.style.visibility = 'visible'
          },
          onLeave: () => {
            video.pause();
            video.style.opacity = '0'; // Set opacity to 0 when video is not playing
                  video.style.visibility = 'hidden'
          },
          onEnterBack: () => { 
            video.play(); 
            video.style.opacity = '1';
                  video.style.visibility = 'visible'
          },
          onLeaveBack: () => {
            video.pause();
            video.style.opacity = '0';
                      video.style.visibility = 'hidden'
          },
        });
      }
    });
  }
};
onMounted(() => {
  showProjects();
  // Add video hover listeners after the projects are displayed
  addVideoHoverListeners();
      addVideoScrollTriggers();
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
  <ul class="ProjectsList" ref="$projectsList" v-if="projects.length > 0">
    <template v-for="item in projects">
      <li class="item">
        <NuxtLink
          class="item__link"
          :to="{ name: 'projects-slug', params: { slug: item.slug.current } }"
          :key="item._id"
        >
          <div class="item__container">
            <div class="item__thumbnail">
              <SanityImage
                v-if="item.mainImage"
                :asset-id="item.mainImage.asset._ref"
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
            <div class="item__meta">
              <h3 class="item__title" v-if="item.title">{{ item.title }}</h3>
              <ul class="item__categories item__categories--mobile" v-if="item.categories">
                <li class="item__category" v-for="category in item.categories">
                  {{ category.title }}
                </li>
              </ul>
            </div>
            <div class="item__date" v-if="item.releaseDate">
              {{ item.releaseDate.slice(0, 4) }}
            </div>
            <ul class="item__categories" v-if="item.categories">
              <li class="item__category" v-for="category in item.categories">
                {{ category.title }}
              </li>
            </ul>
          </div>
        </NuxtLink>
      </li>
    </template>
  </ul>
  <div v-else class="ProjectsList--empty">No project matching your filters</div>
</template>

<style lang="scss">
.ProjectsList {
  grid-column: 1 / -1;
  padding-bottom: 5rem;

  &--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .item {
    font-size: $desktop-list;
    border-top: 0.1rem solid $dark-grey;
    transition: background-color 0.2s ease-in-out;
    opacity: 0;
    // height: 16rem;

    @include viewport-768 {
      font-size: $tablet-list;
      height: auto;
      padding: 2rem 0;
    }

    @include viewport-480 {
      font-size: $mobile-list;
    }

    &:hover {
      background-color: $dark-dark-grey;
    }

    &__link {
      height: 100%;
    }

    &__container {
      @include grid(12, 1fr, 1, 0);
      padding: 1rem 2rem;
      align-items: center;
      position: relative;
      height: 100%;

      @include viewport-480 {
        padding: 0 1rem;
      }
    }

    &__date {
      grid-column: auto / span 2;
      color: $medium-grey;

      @include viewport-480 {
        grid-column: 11 / span 2;
      }
    }

    &__meta {
      grid-column: 3 / span 2;

      @include viewport-768 {
        grid-column: 3 / span 6;
      }

      @include viewport-480 {
        grid-column: 6 / span 5;
      }
    }

    &__categories {
      grid-column: auto / span 6;
      color: $medium-grey;

      // REWORK
      @include viewport-768 {
        display: none;
        grid-row: 2;
        grid-column: 3 / span 6;
        flex-direction: column;
      }

      &--mobile {
        display: none;

        @include viewport-768 {
          display: block;
        }
      }
    }

    &__category {
      display: inline-block;

      &:not(:last-child) {
        &::after {
          content: ',\00a0';
        }
      }
    }

    &__thumbnail {
      grid-column: auto / span 2;
      margin-left: 0;
      position: relative;
      pointer-events: none;

      @include viewport-480 {
        grid-column: auto / span 4;
      }

      img {
        aspect-ratio: 1 / 1;
        width: 50%;
        object-fit: cover;
        filter: grayscale(100%);
        transition: 0.25s ease-in-out;

        @include viewport-480 {
          width: 100%;
        }
      }

      video {
        width: 50%;
        top: 0;
        position: absolute;
        aspect-ratio: 1 / 1;
        left: 0;
        object-fit: cover;
        opacity: 0;
        visibility: hidden;
        transition: 0.25s ease-in-out;

        @include viewport-480 {
          width: 100%;
        }
      }
    }

    &:hover img {
      filter: grayscale(0);
    }

    &:hover video {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
