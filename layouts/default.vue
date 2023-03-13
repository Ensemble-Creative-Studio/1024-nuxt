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
</script>

<template>
  <div class="layout">
    <SiteHeader />
    <NavMenu v-if="isNavActive" :isNavActive="isNavActive" :navMenu="navMenu" />
    <Transition>
      <NavOverlay v-if="isNavActive" @click.native="closeMenu()" />
    </Transition>
    <slot />
  </div>
</template>

<style lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
