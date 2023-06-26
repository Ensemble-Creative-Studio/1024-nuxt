<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCreative } from 'swiper'

import gsap from 'gsap'

import 'swiper/css'
import 'swiper/css/effect-creative'

const router = useRouter()

const props = defineProps({
  baseline: {
    type: String,
    required: true,
  },
  projects: {
    type: Array,
    required: true,
  },
  firstProject: {
    type: Object,
    required: true,
  },
})

// Animations
const $ctx = ref()
const $tl = ref()
const $mobileFeaturedProjects = ref()

const tl = gsap.timeline()

onMounted(() => {
  $ctx.value = gsap.context((self) => {
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
  }, $mobileFeaturedProjects.value)
})

const splitBaseline = computed(() => {
  return props.baseline.split(' ')
})

const modules = [EffectCreative]

const projectTitles = computed(() => {
  const temp = props.projects.map((project) => project.title)
  temp.unshift(props.firstProject.title)
  return temp
})

const $swiper = ref()
const activeSlideIndex = ref(-1)
const totalOffsetWidth = ref(0)

const onSwiper = ($event) => {
  $swiper.value = $event
}

const onSlideChange = () => {
  activeSlideIndex.value = $swiper.value.activeIndex - 1
}

let previousSlideIndex = 0

watch(activeSlideIndex, (newValue) => {
  const currentTitle = document.querySelectorAll('.MobileFeaturedProjects__title')[newValue - 1]

  if (currentTitle !== undefined && newValue !== 0) {
    if (newValue > previousSlideIndex) {
      totalOffsetWidth.value += currentTitle.offsetWidth + 70
    } else if (newValue < previousSlideIndex) {
      const prevTitle = document.querySelectorAll('.MobileFeaturedProjects__title')[
        previousSlideIndex - 1
      ]
      totalOffsetWidth.value -= prevTitle.offsetWidth + 70
    }
  } else {
    totalOffsetWidth.value = 0
  }

  previousSlideIndex = newValue

  if (newValue === projectTitles.value.length) {
    $swiper.value.allowTouchMove = false

    $ctx.value = gsap.context((self) => {
      const projectsLabel = self.selector('.MobileFeaturedProjects__title:last-child')

      $tl.value = gsap.to(projectsLabel, {
        y: -200,
        duration: 1,
        autoAlpha: 0,
        delay: 1,
        ease: 'power3.out',
      })

      setTimeout(() => {
        router.push('/projects')
      }, 800)
    }, $mobileFeaturedProjects.value)
  }
})

const footerTransform = computed(() => {
  if (activeSlideIndex.value === -1) {
    return 'translateX(calc(50%))'
  } else {
    return `translateX(calc(-${totalOffsetWidth.value}px + 10px))`
  }
})

// onBeforeUnmount(() => {
//   $ctx.value = null
// })
</script>

<template>
  <div class="MobileFeaturedProjects" ref="$mobileFeaturedProjects">
    <swiper
      @swiper="onSwiper($event)"
      @slideChange="onSlideChange($event)"
      :prevent-interaction-on-transition="true"
      class="MobileFeaturedProjects__slider"
      :space-between="10"
      :grabCursor="true"
      :slides-per-view="'auto'"
      :speed="600"
      :effect="'creative'"
      :creativeEffect="{
        prev: {
          translate: ['-100%', 0, -300],
        },
        next: {
          translate: ['100%', 0, 0],
        },
      }"
      :modules="modules"
    >
      <swiper-slide class="baseline">
        <GridContainer>
          <h1 class="title">
            <span class="title__chunk" v-for="(word, index) in splitBaseline" :key="index">
              {{ word }}{{ index !== splitBaseline.length - 1 ? ' ' : '' }}
            </span>
          </h1>
        </GridContainer>
      </swiper-slide>
      <swiper-slide>
        <NuxtLink
          :to="{
            name: 'projects-slug',
            params: { slug: firstProject.slug.current },
          }"
          :class="[
            activeSlideIndex === 1 && 'MobileFeaturedProject--previous',
            'MobileFeaturedProject',
          ]"
        >
          <div class="MobileFeaturedProject__overlay"></div>
          <div class="MobileFeaturedProject__thumbnail">
            <video
              v-if="firstProject.mainVideoUrl"
              :src="firstProject.mainVideoUrl"
              autoplay
              muted
              loop
              playsinline
              webkit-playsinline
            ></video>
            <SanityImage
              v-else
              :asset-id="firstProject.mainImage.asset._ref"
              auto="format"
              :q="75"
            />
          </div>
        </NuxtLink>
      </swiper-slide>
      <swiper-slide v-for="(project, index) in projects">
        <NuxtLink
          :key="project._id"
          :to="{
            name: 'projects-slug',
            params: { slug: project.slug.current },
          }"
          :class="[
            index === activeSlideIndex - 2 && 'MobileFeaturedProject--previous',
            'MobileFeaturedProject',
          ]"
        >
          <div class="MobileFeaturedProject__overlay"></div>
          <div class="MobileFeaturedProject__thumbnail">
            <video
              v-if="project.mainVideoUrl"
              :src="project.mainVideoUrl"
              autoplay
              muted
              loop
              playsinline
              webkit-playsinline
            ></video>
            <SanityImage v-else :asset-id="project.mainImage.asset._ref" auto="format" :q="75" />
          </div>
        </NuxtLink>
      </swiper-slide>
      <swiper-slide class="empty"></swiper-slide>
    </swiper>
    <div class="MobileFeaturedProjects__footer">
      <div class="MobileFeaturedProjects__inner-footer" :style="{ transform: footerTransform }">
        <h2
          :class="[
            index === activeSlideIndex && 'MobileFeaturedProjects__title--active',
            'MobileFeaturedProjects__title',
          ]"
          v-for="(title, index) in projectTitles"
          :key="title"
        >
          {{ title }}
        </h2>
        <h2
          :class="[
            projectTitles.length === activeSlideIndex && 'MobileFeaturedProjects__title--active',
            'MobileFeaturedProjects__title',
          ]"
          class="MobileFeaturedProjects__title--all-projects"
        >
          All projects
        </h2>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.MobileFeaturedProjects {
  height: 100%;
  width: 100%;
  position: fixed;

  &__slider {
    height: inherit;
    z-index: 0;

    .swiper-slide {
      &.baseline {
        width: 85% !important;
      }

      width: 100% !important;

      .empty {
        background-color: $black;
      }
    }

    .baseline {
      height: 100%;
      background-color: $black;

      .GridContainer {
        height: inherit;
        align-items: center;
      }

      .title {
        grid-column: 1 / span 10;
        font-size: $mobile-h4;

        &__chunk {
          opacity: 0;

          &:first-child {
            margin-left: 0;
          }
        }
      }
    }

    .MobileFeaturedProject {
      position: relative;
      padding: 0 1rem;
      background-color: $black;
      height: 100%;

      &__overlay {
        z-index: 10;
        background-color: $black;
        opacity: 1;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        visibility: hidden;
        transition: ease-in-out 0.5s;
      }

      &--previous {
        .MobileFeaturedProject__overlay {
          opacity: 1;
          visibility: visible;
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

      &__title {
        position: absolute;
        bottom: 0;
        font-size: $mobile-h2;
        padding: 1rem;
      }
    }
  }

  &__footer {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 7rem;
    z-index: 10;
    pointer-events: none;
    justify-content: flex-start;
    background-color: $black;
  }

  &__inner-footer {
    height: 7rem;
    display: flex;
    align-items: center;
    will-change: transform;
    transition: transform 0.5s ease-in-out;
  }

  &__title {
    font-size: $mobile-h2;
    white-space: nowrap;
    color: $medium-grey;
    transition: color 0.5s ease-in-out;

    &:not(:last-child) {
      margin-right: 7rem;
    }

    &--active {
      color: $white;
    }

    &--all-projects {
      text-decoration: underline;
      text-decoration-thickness: from-font;
      text-underline-offset: 0.5rem;
    }
  }
}
</style>
