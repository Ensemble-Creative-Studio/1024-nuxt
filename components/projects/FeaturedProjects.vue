<script setup>
const props = defineProps({
  projects: [Object],
})
</script>

<template>
  <div class="FeaturedProjects">
    <div class="FeaturedProjects__container">
      <FeaturedProject
        :project="project"
        v-for="project in projects"
        :key="project._id"
      />
    </div>
  </div>
</template>
