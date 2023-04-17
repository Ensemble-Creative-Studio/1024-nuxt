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
  font-size: $desktop-filters-main;
  color: $medium-grey;
  width: 100%;
  border-top: 0.1rem solid $dark-grey;
  transform: translateY(5rem);

  @include viewport-480 {
    font-size: $mobile-filters-main;
    justify-content: center;
    transform: translateY(0) !important;
  }

  .BottomAnchors__list {
    display: flex;
    align-items: center;

    .BottomAnchors__item {
      button {
        transition: color 0.3s ease-in-out;

        &:hover {
          color: $white;
          cursor: pointer;
        }
      }

      &:not(:first-child) {
        margin-left: 2rem;

        @include viewport-480 {
          margin-left: 1.5rem;
        }
      }
    }
  }
}
</style>
