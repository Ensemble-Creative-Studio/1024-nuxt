<script setup>
import gsap from 'gsap'
import { wait } from './../../utils/wait'

const sanity = useSanity()
const router = useRouter()

const $ctx = ref()
const $blogPage = ref()
const $pagination = ref()

const tl = gsap.timeline()
const blog = ref([])

const itemsPerPage = 3
const currentPage = ref(1)

// if (router.currentRoute.value.query.page) {
//   currentPage.value = parseInt(router.currentRoute.value.query.page)
// }

const GET_BLOG_COUNT = groq`count(*[_type == 'blog'])`
const { data: blogCount } = useSanityQuery(GET_BLOG_COUNT)

const totalPages = blogCount.value / itemsPerPage

// Calculate offset and limit based on current page
const offset = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const GET_BLOG = groq`*[_type == "blog"]|order(_createdAt desc)[$offset...$limit]
  {
    ...,
    "videoUrl": video.asset->url,
  }
`

blog.value = await sanity.fetch(GET_BLOG, { offset: offset.value, limit: itemsPerPage })

watch(() => currentPage.value, async (data) => {
  tl.to($pagination.value, { opacity: 0, duration: 0 })

  tl.to($blogPage.value,
    {
      opacity: 0,
      duration: 0.5,
      onComplete: async () => {
        goToPage(data)
        await wait(500)
        tl.to($blogPage.value, { opacity: 1, duration: 0.5 })
      }
    }
  )

  tl.to($pagination.value, { opacity: 1, duration: 0.5 })
})

const changePage = (index) => {
  currentPage.value = index
}

const goToPage = async (index) => {
  window.scrollTo(0, 0)
  currentPage.value = index
  router.push({ query: { page: index } })

  blog.value = await sanity.fetch(GET_BLOG, { offset: offset.value, limit: itemsPerPage })
}
</script>

<template>
  <div class="blog" ref="$blogPage">
    <Head>
      <Title>1024 | Blog</Title>
      <Meta name="description" content="Contact page description" />
    </Head>
    <BlogList :blog="blog" :page="currentPage" />
    <!-- Uncomment this later -->
    <!-- <section class="pagination" ref="$pagination">
      <GridContainer>
        <div class="pagination__container">
          <button
            class="pagination__button pagination__button--previous"
            v-if="currentPage !== 1"
            @click="changePage(currentPage - 1)"
          >
            Previous
          </button>
          <span
            class="pagination__separator"
            v-if="currentPage !== totalPages && currentPage !== 1"
          >
            -
          </span>
          <button
            class="pagination__button pagination__button--next"
            v-if="currentPage !== totalPages"
            @click="changePage(currentPage + 1)"
          >
            Next
          </button>
          <span class="pagination__separator">/</span>
          <div class="pagination__pages">
            <button
              class="pagination__page"
              v-if="currentPage - 1 > 0"
              @click="changePage(currentPage - 1)"
            >
              {{ currentPage - 1 < 10 ? `0${currentPage - 1}` : currentPage - 1 }}
            </button>
            <button class="pagination__page pagination__page--active">
              {{ currentPage < 10 ? `0${currentPage}` : currentPage }}
            </button>
            <button
              class="pagination__page"
              v-if="currentPage !== totalPages"
              @click="changePage(currentPage + 1)"
            >
              {{ currentPage + 1 < 10 ? `0${currentPage + 1}` : currentPage + 1 }}
            </button>
            <button
              class="pagination__page"
              v-if="currentPage + 1 < totalPages"
              @click="changePage(currentPage + 1)"
            >
              ...
            </button>
            <button
              class="pagination__page"
              v-if="currentPage + 1 < totalPages"
              @click="changePage(totalPages)"
            >
              {{ totalPages < 10 ? `0${totalPages}` : totalPages }}
            </button>
          </div>
        </div>
      </GridContainer>
    </section> -->
  </div>
</template>

<style lang="scss" scoped>
.blog {
  .pagination {
    padding-top: 12rem;
    padding-bottom: 12rem;
    font-size: $desktop-list;

    @include viewport-480 {
      margin-top: 9rem;
      padding-bottom: 4rem;
      font-size: $mobile-list;
    }

    &__container {
      grid-column: 3 / span 8;
      display: flex;
      align-items: center;

      @include viewport-480 {
        grid-column: 1 / -1;
        display: block;
      }
    }

    &__separator {
      margin: 0 2rem;
    }

    &__button {
      text-decoration: underline;
      text-decoration-thickness: from-font;
      text-underline-offset: 0.5rem;
      cursor: pointer;
    }

    &__pages {
      display: flex;
      align-items: center;

      @include viewport-480 {
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
