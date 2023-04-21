<script setup>
const isNavActive = useState('isNavActive')

function toggleNav() {
  isNavActive.value = !isNavActive.value
}
</script>

<template>
  <header class="SiteHeader">
    <SiteLogo />
    <div :class="[isNavActive && 'active', 'menu-icon']" @click="toggleNav()">
      <input class="menu-icon__checkbox" type="checkbox" />
      <div class="burger">
        <span class="burger__horizontal"></span>
        <span class="burger__horizontal"></span>
        <span class="burger__horizontal"></span>
        <span class="burger__vertical burger__vertical--left"></span>
        <span class="burger__vertical burger__vertical--right"></span>
      </div>
    </div>
  </header>
</template>

<style lang="scss">
.SiteHeader {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 10rem;
  padding: 2rem;
  width: 100%;
  z-index: 40;
  mix-blend-mode: difference;

  @include viewport-480 {
    background-color: $black;
    padding: 1rem;
    height: 6rem;
  }

  .SiteLogo {
    svg {
      width: 9rem;
    }
  }
}

// Rename and refactor this later
.menu-icon {
  position: relative;
  width: 29px;
  height: 20px;
  cursor: pointer;

  .menu-icon__checkbox {
    display: block;
    width: 100%;
    height: 100%;
    position: relative;
    pointer-events: none;
    z-index: 2;
    -webkit-touch-callout: none;
    position: absolute;
    opacity: 0;
  }

  .burger {
    pointer-events: none;
    margin: auto;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 30px;
    height: 20px;

    &__horizontal {
      position: absolute;
      display: block;
      width: 100%;
      height: 2.4px;
      background-color: $white;
      border-radius: 1px;
      // transition: all 0.5s cubic-bezier(0.1, 0.82, 0.76, 0.965);

      &:nth-child(1) {
        top: 0;
      }

      &:nth-child(2) {
        top: 50%;
        transform: translateY(-50%);
      }

      &:nth-child(3) {
        bottom: 0;
      }
    }

    &__vertical {
      opacity: 0;
      position: absolute;
      display: block;
      width: 65%;
      height: 2.4px;
      background-color: $white;
      border-radius: 1px;

      &--left {
        transform: rotate(90deg) translateY(0px);
        transform-origin: top left;
        top: 0px;
        left: 3px;
      }

      &--right {
        transform: rotate(90deg) translateY(0px);
        transform-origin: top left;
        bottom: 18px;
        right: -18px;
      }
    }
  }

  &.active {
    .burger__horizontal {
      &:nth-child(1) {
        transform: rotate(35deg);
        top: 9px;
      }

      &:nth-child(3) {
        transform: rotate(-35deg);
        bottom: 8.5px;
      }
    }

    .burger__vertical {
      animation: 0.2s blink forwards;
    }
  }
}

@keyframes blink {
  0% {
    opacity: 0;
  }

  10% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
