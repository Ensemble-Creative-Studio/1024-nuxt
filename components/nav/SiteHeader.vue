<script setup>
const isNavActive = useState('isNavActive')

function toggleNav() {
  console.log('Toggle nav')
  isNavActive.value = !isNavActive.value
  console.log(isNavActive.value)
}
</script>

<template>
  <header class="SiteHeader">
    <SiteLogo />
    <button @click="toggleNav()">Toggle Nav</button>
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
  z-index: 30;

  .SiteLogo {
    svg {
      width: 9rem;
    }
  }
}
</style>
