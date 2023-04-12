<script setup>
const props = defineProps({
  projects: [Object],
  categories: [Object],
  order: String,
  displayMode: String,
})

console.log(props.projects)
</script>

<template>
  <ul class="ProjectsList">
    <template v-for="item in projects">
      <li class="item">
        <NuxtLink
          class="item__link"
          :to="{ name: 'projects-slug', params: { slug: item.slug.current } }"
          :key="item._id"
        >
          <div class="item__container">
            <div class="item__date" v-if="item.releaseDate">
              {{ item.releaseDate.slice(0, 4) }}
            </div>
            <div class="item__meta">
              <h3 class="item__title" v-if="item.title">{{ item.title }}</h3>
              <ul class="item__categories item__categories--mobile" v-if="item.categories">
                <li class="item__category" v-for="category in item.categories">
                  {{ category.title }}
                </li>
              </ul>
            </div>
            <ul class="item__categories" v-if="item.categories">
              <li class="item__category" v-for="category in item.categories">
                {{ category.title }}
              </li>
            </ul>
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
                autoplay
                playsinline
                webkit-playsinline
              ></video>
            </div>
          </div>
        </NuxtLink>
      </li>
    </template>
  </ul>
</template>

<style lang="scss">
.ProjectsList {
  grid-column: 1 / -1;

  .item {
    font-size: $desktop-list;
    border-top: 0.1rem solid $dark-grey;
    transition: background-color 0.6s ease-in-out;

    @include viewport-375 {
      font-size: $mobile-list;
    }

    &:hover {
      background-color: $dark-dark-grey;
    }

    &__container {
      @include grid(12, 1fr, 1, 0);
      padding: 0 2rem;
      align-items: center;
      position: relative;

      @include viewport-375 {
        padding: 0 1rem;
      }
    }

    &__date {
      grid-column: 1 / span 1;
      color: $medium-grey;

      @include viewport-375 {
        grid-column: 1 / span 2;
      }
    }

    &__meta {
      grid-column: 2 / span 2;

      @include viewport-375 {
        grid-column: 3 / span 6;
      }
    }

    &__categories {
      grid-column: 4 / span 4;
      display: flex;
      color: $medium-grey;

      @include viewport-375 {
        display: none;
        grid-row: 2;
        grid-column: 3 / span 6;
        flex-direction: column;
      }

      &--mobile {
        display: none;

        @include viewport-375 {
          display: flex;
        }
      }
    }

    &__category {
      &:not(:last-child) {
        &::after {
          content: ',\00a0';
        }
      }
    }

    &__thumbnail {
      grid-column: 11 / -1;
      max-width: 21rem;
      margin-left: auto;
      padding: 1.5rem 0;
      position: relative;

      @include viewport-375 {
        grid-column: 9 / span 5;
      }

      img {
        aspect-ratio: 210 / 140;
        object-fit: cover;
        filter: grayscale(100%);
        transition: 0.25s ease-in-out;
      }

      video {
        position: absolute;
        aspect-ratio: 210 / 140;
        top: 1.5rem;
        left: 0;
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
  }
}
</style>
