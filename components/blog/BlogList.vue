<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const props = defineProps({
  blog: [Object],
})

const { isMobile } = useDevice()
</script>

<template>
  <ul class="BlogList">
    <li class="item" v-for="item in blog">
      <div class="item__container">
        <VideoPlayer
          v-if="item.mainVideo"
          :vimeoUrl="item.mainVideoUrl"
          :quality="isMobile ? 'sd' : 'hd'"
        />
        <Swiper
          :slides-per-view="1"
          :space-between="10"
          :grab-cursor="true"
          v-else-if="item.gallery"
        >
          <SwiperSlide v-for="media in item.gallery.medias">
            <SanityImage
              :asset-id="media.asset._ref"
              auto="format"
              :q="75"
              :key="media._id"
            />
          </SwiperSlide>
        </Swiper>
        <NuxtLink
          class="item__link"
          :to="{ name: 'blog-slug', params: { slug: item.slug.current } }"
          :key="item._id"
        >
          <div class="item__meta">
            <h3 class="item__title">{{ item.title }}</h3>
            <p class="item__excerpt">
              {{ item.excerpt }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </li>
  </ul>
</template>

<style lang="scss">
.BlogList {
  @include grid(12, 1fr, 1, 0);
  padding: 0 2rem;
  margin-top: 12rem;

  @include viewport-375 {
    padding: 0 1rem;
    margin-top: 15rem;
  }

  .item {
    grid-column: 3 / span 8;

    @include viewport-375 {
      grid-column: 1 / -1;
    }

    &:not(:first-child) {
      margin-top: 12rem;
    }

    &__container {
      .swiper {
        overflow: visible;
        aspect-ratio: 110 / 62;

        &-wrapper {
          height: 100%;
        }

        &-slide {
          height: 100%;

          img {
            height: 100%;
          }
        }
      }
    }

    &__meta {
      margin-top: 2rem;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      @include viewport-375 {
        @include grid(12, 1fr, 1, 0);
      }
    }

    &__title {
      flex: 1;
      text-decoration: underline;
      text-decoration-thickness: from-font;
      text-underline-offset: 0.5rem;

      @include viewport-375 {
        grid-column: 1 / -1;
      }
    }

    &__excerpt {
      flex: 1;
      margin-left: 1rem;

      @include viewport-375 {
        margin-left: 0;
        margin-top: 2rem;
        grid-column: 2 / span 10;
      }
    }
  }
}
</style>
