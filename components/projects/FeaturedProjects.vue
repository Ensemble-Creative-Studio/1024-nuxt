<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = defineProps({
  projects: [Object],
})

const $featuredProjects = ref()
const $ctx = ref()

onMounted(() => {
  $ctx.value = gsap.context((self) => {
    const panels = self.selector('.FeaturedProject')
    const panelTitles = self.selector('.FeaturedProject__title')

    // REFACTOR
    setTimeout(() => {
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          pin: true,
          pinSpacing: false,
          id: `pin-${i}`,
          onUpdate: (self) => {
            if (self.progress > 0.5) {
              panel.classList.add('off')
            } else {
              panel.classList.remove('off')
            }
          },
        })

        ScrollTrigger.create({
          trigger: panel,
          top: '100% 100%',
          id: `title-${i}`,
          onEnter: () => {
            panelTitles[i].classList.add('FeaturedProject__title--active')
          },
          onLeave: () => {
            panelTitles[i].classList.remove('FeaturedProject__title--active')
          },
          onEnterBack: () => {
            panelTitles[i].classList.add('FeaturedProject__title--active')
          },
          onLeaveBack: () => {
            panelTitles[i].classList.remove('FeaturedProject__title--active')
          },
        })
      })
    }, 500)
  }, $featuredProjects.value)
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill()
  })

  $ctx.value.revert()
})
</script>

<template>
  <div class="FeaturedProjects" ref="$featuredProjects">
    <FeaturedProject :project="project" v-for="project in projects" :key="project._id" />
  </div>
</template>

<style lang="scss">
.content-wrapper {
  &--grayscale {
    .index {
      .FeaturedProjects {
        .FeaturedProject {
          &.off {
            img,
            video {
              filter: grayscale(0) invert(0) !important; // WIP
            }
          }
        }
      }
    }
  }
}

.FeaturedProjects {
  margin-top: calc(100vh - 2rem); // TODO

  @include viewport-480 {
    margin-top: calc(100vh + 6rem); // TODO
  }

  .FeaturedProject {
    height: 120vh;
    position: relative;
    transition: filter 0.5s ease;

    &.off {
      filter: invert(1) grayscale(1);
    }

    @include viewport-480 {
      margin-top: 0;
    }

    &__footer {
      display: flex;
      position: sticky;
      padding: 1.5rem 2rem;
      width: 100%;
      left: 0;
      bottom: 0;

      @include viewport-480 {
        font-size: $mobile-h2;
        left: 1rem;
        bottom: 1rem;
      }
    }

    &__title {
      font-size: $desktop-h4;
      font-weight: $extra-light;
      opacity: 0;
      transform: translateY(10rem);
      transition: 1s cubic-bezier(0.16, 1, 0.3, 1);
      transition-property: opacity, transform;

      &--active {
        opacity: 1;
        transform: translateY(0);
      }
    }

    &__thumbnail {
      height: 100%;

      img,
      video {
        height: 100%;
        object-fit: cover;
      }
    }
  }
}
</style>
