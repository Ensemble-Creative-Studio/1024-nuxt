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

const GET_BLOG = groq`*[_type == "blog"] | order(_createdAt desc)[${offset}...${offset + limit}]
  {
    ...,
    "videoUrl": video.asset->url,
  }
`
const { data } = await useAsyncData('blog', () => sanity.fetch(GET_BLOG))
const blog = data.value

const totalPages = computed(() => {
  return blog.length / itemsPerPage + 1
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
          <!-- Render previous button with updated route query parameter for previous page -->
          <button
            class="pagination__button pagination__button--previous"
            @click="goToPage(currentPage - 1)"
          >
            Previous
          </button>
          <span class="pagination__separator">-</span>
          <!-- Render next button with updated route query parameter for next page -->
          <button
            class="pagination__button pagination__button--next"
            @click="goToPage(currentPage + 1)"
          >
            Next
          </button>
          <span class="pagination__separator">/</span>
          <ul class="pagination__pages">
            <!-- Render page numbers with updated route query parameter for respective page -->
            <li v-for="page in totalPages" :key="page" @click="goToPage(page)">{{ page }}</li>
          </ul>
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
