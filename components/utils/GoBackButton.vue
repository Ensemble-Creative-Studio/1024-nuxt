<template>
  <button class="GoBackButton" @click="goBack()">Back</button>
</template>

<script setup>
const router = useRouter()

function goBack() {
  router.go(-1)
}
</script>

<style lang="scss">
.GoBackButton {
  cursor: pointer;
  text-decoration: underline;
  text-decoration-thickness: from-font;
  text-underline-offset: 0.5rem;
}
</style>
