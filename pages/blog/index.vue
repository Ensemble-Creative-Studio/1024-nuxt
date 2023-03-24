<script setup>
// Fetch data
const sanity = useSanity()

const GET_BLOG = groq`*[_type == "blog"] | order(_createdAt desc)
  {
    ...,
    "videoUrl": video.asset->url,
  }
`
const { data } = await useAsyncData('blog', () => sanity.fetch(GET_BLOG))
const blog = data.value
</script>

<template>
  <div class="blog">
    <Head>
      <Title>1024 | Blog</Title>
      <Meta name="description" content="Contact page description" />
    </Head>
    <BlogList :blog="blog" />
    <section class="pagination">
      <GridContainer>
        <div class="pagination__container">
          <button class="pagination__button pagination__button--previous">
            Previous
          </button>
          <span class="pagination__separator">-</span>
          <button class="pagination__button pagination__button--next">
            Next
          </button>
          <span class="pagination__separator">/</span>
          <ul class="pagination__pages">
            <li>01</li>
            <li>02</li>
            <li>03</li>
            <li>...</li>
            <li>20</li>
          </ul>
        </div>
      </GridContainer>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.blog {
  .pagination {
    margin-top: 12rem;
    padding-bottom: 12rem;
    font-size: $list-text-size;

    @include viewport-375 {
      margin-top: 9rem;
      padding-bottom: 4rem;
      font-size: $mobile-list-text-size;
    }

    &__container {
      grid-column: 3 / span 8;
      display: flex;
      align-items: center;

      @include viewport-375 {
        grid-column: 1 / -1;
        display: block;
      }
    }

    &__separator {
      margin: 0 2rem;
    }

    // &__previous {
    // }

    // &__next {
    // }

    &__button {
      text-decoration: underline;
      text-decoration-thickness: from-font;
      text-underline-offset: 0.5rem;
    }

    &__pages {
      display: flex;
      align-items: center;

      @include viewport-375 {
        margin-top: 2rem;
      }

      li {
        &:not(:first-child) {
          margin-left: 2rem;
        }
      }
    }
  }
}
</style>
