<script setup>
const isNavActive = useState('isNavActive')

function toggleNav() {
  isNavActive.value = !isNavActive.value
}
</script>

<template>
  <header class="SiteHeader">
    <SiteLogo />
    <div :class="[isNavActive && 'menu-icon--active', 'menu-icon']" @click="toggleNav()">
      <input class="menu-icon__checkbox" type="checkbox" />
      <div class="burger">
        <span class="burger__bar burger__bar--top"></span>
        <span class="burger__bar burger__bar--right"></span>
        <span class="burger__bar burger__bar--bottom"></span>
        <span class="burger__bar burger__bar--left"></span>
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
    width: 20px;
    height: 20px;

    &__bar {
      position: absolute;
      display: block;
      width: 100%;
      height: 2.4px;
      background-color: $white;
      transition: all 0.5s cubic-bezier(0.1, 0.82, 0.76, 0.965);

      &--top {
        top: 0;
        transform: translateY(0);
      }

      &--right {
        top: 50%;
        transform: translateY(-50%) rotate(90deg);
        right: -50%;
      }

      &--bottom {
        bottom: 0;
        transform: translateY(0);
      }

      &--left {
        top: 50%;
        left: -50%;
        transform: translateY(-50%) rotate(90deg);
      }
    }
  }

  &--active {
    .burger {
      &__bar {
        &--top {
          transform: translateY(8.5px);
        }

        &--right {
          transform: translateY(-50%) translateX(-10px) rotate(90deg);
        }

        &--bottom {
          transform: translateY(-8.5px);
        }

        &--left {
          transform: translateY(-50%) translateX(10px) rotate(90deg);
        }
      }
    }
  }
}
</style>
