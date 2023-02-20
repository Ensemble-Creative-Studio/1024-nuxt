<template>
  <button class="GoBackButton" @click="goBack()">Go back</button>
</template>

<script setup>
const router = useRouter()

function goBack() {
  router.go(-1)
}
</script>

<style lang="scss">
.GoBackButton {
  background-color: $white;
  color: $black;
  padding: 1rem;
  cursor: pointer;
}
</style>
