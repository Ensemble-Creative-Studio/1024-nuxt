<script setup>
const props = defineProps({
  color: String,
})
</script>

<template>
  <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect y="0.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="5" y="0.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="10" y="0.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="15" y="0.5" width="2" height="2" rx="1" :fill="color" />
    <rect y="5.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="5" y="5.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="10" y="5.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="15" y="5.5" width="2" height="2" rx="1" :fill="color" />
    <rect y="10.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="5" y="10.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="10" y="10.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="15" y="10.5" width="2" height="2" rx="1" :fill="color" />
    <rect y="15.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="5" y="15.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="10" y="15.5" width="2" height="2" rx="1" :fill="color" />
    <rect x="15" y="15.5" width="2" height="2" rx="1" :fill="color" />
  </svg>
</template>
