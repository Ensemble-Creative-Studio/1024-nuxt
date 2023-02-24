<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const $anchors = ref(null)

let tl

onMounted(() => {
  tl = gsap.timeline({
    paused: true,
    defaults: { ease: 'power3.out' },
  })
  tl.to($anchors.value, {
    y: 0,
    duration: 0.5,
  })

  gsap.registerPlugin(ScrollTrigger)

  ScrollTrigger.create({
    markers: true,
    trigger: $anchors.value,
    start: '50% 50%',
    onEnter: () => {
      tl.play()
    },
    onLeaveBack: () => {
      tl.reverse()
    },
  })
})

onBeforeUnmount(() => {
  tl.to($anchors.value, {
    y: 5,
    duration: 0.5,
  })
})

onUnmounted(() => {
  tl.kill()
  tl = null
})
</script>

<template>
  <div class="BottomAnchors" ref="$anchors">
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
  transform: translateY(5rem);

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
