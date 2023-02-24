<script setup>
const props = defineProps({
  projects: [Object],
  categories: [Object],
})
</script>

<template>
  <ul class="ProjectsList">
    <li class="item" v-for="item in projects">
      <NuxtLink
        class="item__link"
        :to="{ name: 'projects-slug', params: { slug: item.slug.current } }"
        :key="item._id"
      >
        <div class="item__container">
          <div class="item__date">{{ item.releaseDate.slice(0, 4) }}</div>
          <h3 class="item__title" v-if="item.title">{{ item.title }}</h3>
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
          </div>
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss">
.ProjectsList {
  grid-column: 1 / -1;

  .item {
    font-size: $list-text-size;
    border-top: 0.1rem solid $dark-grey;
    transition: background-color 0.6s ease-in-out;

    // Maybe delete it
    &:last-child {
      border-bottom: 0.1rem solid $dark-grey;
    }

    &:hover {
      background-color: $dark-dark-grey;
    }

    &__container {
      @include grid(12, 1fr, 1, 0);
      padding: 0 2rem;
      align-items: center;
      position: relative;
    }

    &__date {
      grid-column: 1 / span 1;
    }

    &__title {
      grid-column: 2 / span 2;
    }

    &__categories {
      grid-column: 4 / span 4;
      display: flex;
      color: $medium-grey;
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

      img {
        aspect-ratio: 210 / 140;
        object-fit: cover;
      }
    }
  }
}
</style>
