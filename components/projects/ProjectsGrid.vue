<script setup>
const props = defineProps({
  projects: [Object],
})
</script>

<template>
  <ul class="ProjectsGrid">
    <li class="item" v-for="item in projects">
      <NuxtLink
        class="item__link"
        :to="{ name: 'projects-slug', params: { slug: item.slug.current } }"
        :key="item._id"
      >
        <div class="item__thumbnail">
          <SanityImage
            v-if="item.mainImage"
            :asset-id="item.mainImage.asset._ref"
            auto="format"
          />
        </div>
        <h3 class="item__title">{{ item.title }}</h3>
      </NuxtLink>
    </li>
  </ul>
</template>

<style lang="scss">
.ProjectsGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 1rem;
  row-gap: 2rem;
  padding: 0 1.5rem;
  
  @include viewport-375 {
    padding: 0 1rem;
  }

  // .item.animated {
  //   transition: all 0.5s ease-in-out;
  // }

  &--three-items {
    grid-template-columns: repeat(3, 1fr);

    @include viewport-375 {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .item {
    @include viewport-375 {
      grid-column: auto / span 2;
    }

    &__thumbnail {
      aspect-ratio: 1 / 1;

      img {
        object-fit: cover;
        height: 100%;
        filter: grayscale(100%);
        transition: 0.25s ease-in-out;
      }
    }

    &:hover img {
      filter: grayscale(0);
    }

    &__title {
      margin-top: 1rem;
    }
  }
}
</style>
