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
})

const modules = [EffectCreative]

const projectTitles = computed(() => {
  return props.projects.map((project) => project.title)
})

const $swiper = ref()
const activeSlideIndex = ref(-1)
// const currentProgress = ref(0)

const onSwiper = ($event) => {
  $swiper.value = $event
}

const onSlideChange = () => {
  activeSlideIndex.value = $swiper.value.activeIndex - 1
}

// const onSliderMove = ($event) => {
//   console.log($event.progress)
//   currentProgress.value = $event.progress
// }

const footerTransform = computed(() => {
  if (activeSlideIndex.value === -1) {
    return 'translateX(calc(100% - 5rem))'
  } else {
    return `translateX(-${activeSlideIndex.value * 50}%)`
  }
})

const $ctx = ref()
const $tl = ref()
const $mobileFeaturedProjects = ref()

watch(activeSlideIndex, (newValue) => {
  if (newValue === projectTitles.value.length) {
    $swiper.value.allowTouchMove = false

    $ctx.value = gsap.context((self) => {
      const blog = self.selector('.MobileFeaturedProjects__footer')

      $tl.value = gsap.to(blog, {
        y: -400,
        duration: 1,
        autoAlpha: 1,
        delay: 1,
        ease: 'power3.out',
      })
    }, $mobileFeaturedProjects.value)

    setTimeout(() => {
      router.push('/projects')
    }, 1000)
  }
})

onBeforeUnmount(() => {
  $ctx.value.revert()
})
</script>

<template>
  <div class="MobileFeaturedProjects" ref="$mobileFeaturedProjects">
    <swiper
      @swiper="onSwiper($event)"
      @slideChange="onSlideChange($event)"
      :prevent-interaction-on-transition="true"
      class="MobileFeaturedProjects__slider"
      :grabCursor="true"
      :slides-per-view="1"
      :space-between="10"
      :effect="'creative'"
      :speed="600"
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
      <swiper-slide>
        <div class="baseline">
          <GridContainer>
            <h1 class="baseline__title">{{ baseline }}</h1>
          </GridContainer>
        </div>
      </swiper-slide>
      <swiper-slide v-for="(project, index) in projects">
        <NuxtLink
          :key="project._id"
          :to="{
            name: 'projects-slug',
            params: { slug: project.slug.current },
          }"
          :class="[
            index === activeSlideIndex - 1 && 'MobileFeaturedProject--previous',
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
      <swiper-slide></swiper-slide>
    </swiper>
    <div class="MobileFeaturedProjects__footer" :style="{ transform: footerTransform }">
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
      >
        All projects
      </h2>
    </div>
  </div>
</template>

<style lang="scss">
.MobileFeaturedProjects {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
  height: 100%;
  width: 100%;
  padding-top: 6rem;
  overflow: hidden;

  &__slider {
    height: 100%;
    width: 100%;

    .swiper-slide {
      &:nth-child(2) {
        transform: translateX(-5rem);
      }
    }

    .baseline {
      height: 100%;
      background-color: $black;

      .GridContainer {
        height: inherit;
        align-items: center;
      }

      &__title {
        grid-column: 1 / span 10;
        font-size: $mobile-h4;
      }
    }

    .MobileFeaturedProject {
      height: 100%;
      width: 100%;
      position: relative;
      padding: 0 1rem;
      background-color: $black;

      &__overlay {
        z-index: 10;
        background-color: $black;
        opacity: 0.8;
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
          opacity: 0.9;
          visibility: visible;
        }
      }

      &__thumbnail {
        height: calc(100% - 7rem);

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
        font-weight: $extra-light;
        padding: 1rem;
      }
    }
  }

  &__footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    height: 7rem;
    display: flex;
    align-items: center;
    padding: 0 1rem;
    z-index: 100;
    will-change: transform;
    transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
  }

  &__title {
    font-size: $mobile-h4;
    color: $medium-grey;
    min-width: 50%;
    transition: color 0.5s ease-in-out;

    &:not(:last-child) {
      margin-right: 1rem;
    }

    &--active {
      color: $white;
    }
  }
}
</style>
