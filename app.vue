<script setup></script>

<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
.page-enter-active,
.page-leave-active {
  transition: 0.4s ease-in-out;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
