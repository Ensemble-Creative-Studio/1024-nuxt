<script setup>
const isNavActive = useState('isNavActive')

function toggleNav() {
  isNavActive.value = !isNavActive.value
}
</script>

<template>
  <header class="SiteHeader">
    <SiteLogo />
    <div
      :class="[isNavActive && 'active', 'menu-icon']"
      @click="toggleNav()"
    >
      <input class="menu-icon__cheeckbox" type="checkbox" />
      <div>
        <span></span>
        <span></span>
        <span></span>
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

  .menu-icon__cheeckbox {
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

  div {
    pointer-events: none;
    margin: auto;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    width: 30px;
    height: 20px;
  }

  span {
    position: absolute;
    display: block;
    width: 100%;
    height: 2.4px;
    background-color: $white;
    border-radius: 1px;
    transition: all 0.5s cubic-bezier(0.1, 0.82, 0.76, 0.965);

    &:first-of-type {
      top: 0;
    }

    &:nth-of-type(2) {
      top: 50%;
      transform: translateY(-50%);
    }

    &:last-of-type {
      bottom: 0;
    }
  }

  &.active {
    span {
      &:first-of-type {
        transform: rotate(45deg);
        top: 9px;
      }

      &:last-of-type {
        transform: rotate(-45deg);
        bottom: 8.5px;
      }
    }
  }
}
</style>
