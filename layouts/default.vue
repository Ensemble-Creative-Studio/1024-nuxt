<script setup>
const isNavActive = useState('isNavActive', () => false)
const route = useRoute()

const query = groq`*[_type == "navMenu"][0]
  {
    ...,
  }
`
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
</script>

<template>
  <div class="layout">
    <SiteHeader />
    <NavMenu :isNavActive="isNavActive" :navMenu="navMenu" />
    <slot />
  </div>
</template>
