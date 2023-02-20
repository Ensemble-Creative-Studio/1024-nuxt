<script setup>
const isNavActive = useState('isNavActive', () => false)
const route = useRoute()

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
    <NavMenu :isNavActive="isNavActive" />
    <slot />
  </div>
</template>
