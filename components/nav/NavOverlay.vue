<script setup>
const isNavActive = useState('isNavActive')

function closeNav() {
  isNavActive.value = false
}
</script>

<template>
  <div class="NavOverlay" @mouseover="closeNav"></div>
</template>

<style lang="scss">
.NavOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  mix-blend-mode: difference;
  background-color: $white;
}
</style>
