<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { isMobile } = useDevice()

const props = defineProps({
  firstProject: [Object],
  projects: [Object],
  baseline: [String],
})

const handleScroll = () => {
  let scrollTop = window.scrollY

  if (scrollTop < window.innerHeight) {
    $hero.value.style.opacity = 1 - (scrollTop / window.innerHeight) * 5
  }
}

const splitBaseline = computed(() => {
  return props.baseline.split(' ')
})

const $featuredProjects = ref()
const $ctx = ref(null)
const $baseline = ref(null)

const tl = gsap.timeline()

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
            if (panelTitles[i]) panelTitles[i].classList.add('FeaturedProject__title--active')
          },
        })

        ScrollTrigger.create({
          trigger: $baseline.value,
          top: '100% 200%',
          onEnter: () => {
            if (!isMobile) {
              const chunks = self.selector('.title__chunk')
              for (let i = chunks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[chunks[i], chunks[j]] = [chunks[j], chunks[i]]
              }
              tl.to(chunks, {
                duration: 2.5,
                autoAlpha: 1,
                ease: 'power2.out',
                stagger: 0.03,
              })
            }
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

  removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="FeaturedProjects" ref="$featuredProjects">
    <FeaturedProject :project="firstProject" />
    <div class="FeaturedProject hero" v-if="!isMobile" ref="$baseline">
      <GridContainer>
        <h1 class="title">
          <span class="title__chunk" v-for="(word, index) in splitBaseline" :key="index">
            {{ word }}{{ index !== splitBaseline.length - 1 ? ' ' : '' }}
          </span>
        </h1>
      </GridContainer>
    </div>
    <FeaturedProject :project="project" v-for="project in projects" :key="project._id" />
  </div>
</template>

<style lang="scss">
.FeaturedProjects {
  .FeaturedProject {
    height: 120vh;
    position: relative;
    transition: filter 0.5s ease-in-out;

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

  .hero {
    background-color: $black;
    height: 120vh;
    z-index: auto;
    float: none;
    display: block;
    margin: 0px;
    inset: 0px;
    overflow: visible;
    box-sizing: border-box;
    padding: 0px;

    @include viewport-480 {
      display: none;
    }

    .title {
      grid-column: 2 / span 8;
      max-width: 110rem;
      font-size: $desktop-h4;
      position: sticky;
      margin-top: 28rem;
      bottom: 50%;

      @include viewport-1200 {
        grid-column: 1 / -1;
      }

      @include viewport-1024 {
        font-size: $mobile-h2;
      }

      @include viewport-480 {
        display: none;
      }

      &__chunk {
        opacity: 0;

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
