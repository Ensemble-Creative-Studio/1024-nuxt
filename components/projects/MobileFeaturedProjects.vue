<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCreative } from 'swiper'

import 'swiper/css'
import 'swiper/css/effect-creative'

const modules = [EffectCreative]

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

const projectTitles = computed(() => {
  return props.projects.map((project) => project.title)
})

const $swiper = ref()
const activeSlideIndex = ref(-1)

const onSlideChange = ($event) => {
  activeSlideIndex.value = $event.activeIndex - 1
}

const footerTransform = computed(() => {
  if (activeSlideIndex.value === -1) {
    return 'translateX(85%)'
  } else {
    return `translateX(-${activeSlideIndex.value * 50}%)`
  }
})
</script>

<template>
  <div class="MobileFeaturedProjects">
    <swiper
      ref="$swiper"
      @slideChange="onSlideChange($event)"
      class="MobileFeaturedProjects__slider"
      :grabCursor="true"
      :space-between="0"
      :effect="'creative'"
      :speed="700"
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
          {{ baseline }}
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
    </swiper>
    <div class="MobileFeaturedProjects__footer" :style="{ transform: footerTransform }">
      <h2
        :class="[
          index === activeSlideIndex && 'test--active',
          'test',
          'MobileFeaturedProjects__title',
        ]"
        v-for="(title, index) in projectTitles"
        :key="title"
      >
        {{ title }}
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

  &__slider {
    height: 100%;
    width: 100%;

    .baseline {
      font-size: $mobile-h4;
      padding: 0 1rem 2.4rem 1rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
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

    .test {
      font-size: $mobile-h4;
      color: $medium-grey;
      min-width: 50%;

      &:not(:last-child) {
        margin-right: 1rem;
      }

      &--active {
        color: $white;
      }
    }
  }
}
</style>
