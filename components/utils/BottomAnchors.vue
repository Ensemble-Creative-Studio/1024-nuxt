<template>
  <div class="BottomAnchors">
    <slot />
  </div>
</template>

<style lang="scss">
.BottomAnchors {
  height: 5rem;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  z-index: 10;
  background-color: $black;
  font-size: 1.8rem;
  color: $medium-grey;
  width: 100%;
  border-top: 0.1rem solid $dark-grey;

  .BottomAnchors__list {
    display: flex;
    align-items: center;

    .BottomAnchors__item {
      &:not(:first-child) {
        margin-left: 2rem;
      }
    }
  }
}
</style>
