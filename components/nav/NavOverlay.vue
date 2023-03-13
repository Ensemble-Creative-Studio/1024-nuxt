<template>
  <div class="NavOverlay"></div>
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
  // animation: show 0.5s ease-in-out forwards;
  // animation-delay: 0.25s;
}

// @keyframes show {
//   0% {
//     pointer-events: none;
//   }
//   100% {
//     pointer-events: all;
//   }
// }
</style>
