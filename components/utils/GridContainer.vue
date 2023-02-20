<template>
  <div class="GridContainer">
    <slot />
  </div>
</template>

<style lang="scss">
.GridContainer {
  @include grid(12, 1fr, 1, 0);
  width: 100%;
  padding: 0 2rem;
}
</style>
