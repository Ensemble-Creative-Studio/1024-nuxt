<script setup>
const isNavActive = useState('isNavActive', () => false)

function closeMenu() {
  isNavActive.value = false
}

const route = useRoute()

const query = groq`*[_type == "navMenu"][0]`
const sanity = useSanity()
const { data } = await useAsyncData('navMenu', () => sanity.fetch(query))
const navMenu = data._rawValue

watch(
  route,
  () => {
    isNavActive.value = false
  },
  { deep: true, immediate: true }
)

const error = useError()
</script>

<template>
  <div class="Error">
    <SiteHeader />
    <NavMenu :isNavActive="isNavActive" :navMenu="navMenu" />
    <Transition>
      <NavOverlay v-if="isNavActive" @click.native="closeMenu()" />
    </Transition>
    <h1 class="Error__title" v-if="error.statusCode >= 400">Error</h1>
    <h1 class="Error__title" v-else>Server Error</h1>
    <p class="Error__baseline" v-if="error.statusCode >= 400">
      The page has not been found ({{ error.statusCode }})
    </p>
    <p class="Error__baseline" v-else>Something went wrong server-side ({{ error.statusCode }})</p>
    <NuxtLink to="/" class="Error__backlink">Go back to home</NuxtLink>
  </div>
</template>

<style lang="scss">
.Error {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__title {
    font-size: 12rem;
    font-weight: $extra-light;
    text-align: center;
  }

  &__backlink {
    margin-top: 6rem;
    text-decoration: underline;
    text-decoration-thickness: from-font;
    text-underline-offset: 0.5rem;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: $medium-grey;
    }
  }
}
</style>
