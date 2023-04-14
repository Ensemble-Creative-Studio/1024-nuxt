<script setup>
import gsap from 'gsap'

const sanity = useSanity()
const router = useRouter()

const $ctx = ref()
const $blogPage = ref()
const $tl = ref()

const itemsPerPage = 3
const currentPage = ref(1)

if (router.currentRoute.value.query.page) {
  currentPage.value = parseInt(router.currentRoute.value.query.page)
}

// Calculate offset and limit based on current page
const offset = (currentPage.value - 1) * itemsPerPage
const limit = itemsPerPage

const GET_BLOG_COUNT = groq`count(*[_type == 'blog'])`
const { data: blogCount } = await useAsyncData('blogCount', () => sanity.fetch(GET_BLOG_COUNT))

const GET_BLOG = groq`*[_type == "blog"] | order(_createdAt desc)[${offset}...${offset + limit}]
  {
    ...,
    "videoUrl": video.asset->url,
  }
`
const { data } = await useAsyncData('blog', () => sanity.fetch(GET_BLOG))
const blog = data.value

const totalPages = computed(() => {
  return blogCount.value / itemsPerPage
})

const goToPage = (index) => {
  currentPage.value = index
  router.push({ query: { page: index } })

  setTimeout(() => {
    window.location.reload(true)
  }, 0)
}

// Watch for changes in currentPage and trigger BlogList component re-render
// watch(currentPage, (newPage) => {
//   console.log(newPage)
// })

onMounted(() => {
  $ctx.value = gsap.context((self) => {
    const blog = self.selector('.BlogList')

    $tl.value = gsap.to(blog, {
      delay: 1,
      duration: 1,
      autoAlpha: 1,
      ease: 'power3.out',
    })
  }, $blogPage.value)
})

onBeforeUnmount(() => {
  $ctx.value.revert()
})
</script>

<template>
  <div class="blog" ref="$blogPage">
    <Head>
      <Title>1024 | Blog</Title>
      <Meta name="description" content="Contact page description" />
    </Head>
    <BlogList :blog="blog" />
    <section class="pagination">
      <GridContainer>
        <div class="pagination__container">
          <button
            class="pagination__button pagination__button--previous"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>
          <span class="pagination__separator" v-if="currentPage !== totalPages">-</span>
          <button
            class="pagination__button pagination__button--next"
            v-if="currentPage !== totalPages"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
          <span class="pagination__separator">/</span>
          <div class="pagination__pages">
            <button
              class="pagination__page"
              v-if="currentPage - 1 > 0"
              @click="goToPage(currentPage - 1)"
            >
              {{ currentPage - 1 < 10 ? `0${currentPage - 1}` : currentPage - 1 }}
            </button>
            <button class="pagination__page pagination__page--active">
              {{ currentPage < 10 ? `0${currentPage}` : currentPage }}
            </button>
            <button
              class="pagination__page"
              v-if="currentPage !== totalPages"
              @click="goToPage(currentPage + 1)"
            >
              {{ currentPage + 1 < 10 ? `0${currentPage + 1}` : currentPage + 1 }}
            </button>
            <button
              class="pagination__page"
              v-if="currentPage + 1 < totalPages"
              @click="goToPage(currentPage + 1)"
            >
              ...
            </button>
            <button
              class="pagination__page"
              v-if="currentPage + 1 < totalPages"
              @click="goToPage(totalPages)"
            >
              {{ totalPages < 10 ? `0${totalPages}` : totalPages }}
            </button>
          </div>
        </div>
      </GridContainer>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.blog {
  .pagination {
    padding-top: 12rem;
    padding-bottom: 12rem;
    font-size: $desktop-list;

    @include viewport-375 {
      margin-top: 9rem;
      padding-bottom: 4rem;
      font-size: $mobile-list;
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
      cursor: pointer;
    }

    &__pages {
      display: flex;
      align-items: center;

      @include viewport-375 {
        margin-top: 2rem;
      }
    }

    &__page {
      cursor: pointer;
      color: $medium-grey;

      &:not(:first-child) {
        margin-left: 2rem;
      }

      &--active {
        color: $white;
      }
    }
  }
}
</style>
