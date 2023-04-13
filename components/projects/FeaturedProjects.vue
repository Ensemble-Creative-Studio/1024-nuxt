<script setup>
const props = defineProps({
  projects: [Object],
})
</script>

<template>
  <div class="FeaturedProjects">
    <FeaturedProject :project="project" v-for="project in projects" :key="project._id" />
  </div>
</template>

<style lang="scss">
.FeaturedProjects {
  margin-top: -2rem;
}
</style>
