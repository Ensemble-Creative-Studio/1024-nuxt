<script setup>
import MouseManager from '@/utils/MouseManager'
import KeyboardManager from '@/utils/KeyboardManager'
import { clamp, normalize } from '@/utils/math'
import { contain } from '@/utils/geometry'
import { parseTime } from '@/utils/string'
import { closest } from '@/utils/dom'

const props = defineProps({
  id: String,
})
</script>

<template>
  <div class="VideoPlayer">
    <img src="" alt="" />
    <video src=""></video>
    <div class="controls">Controls for video {{ id }}</div>
  </div>
</template>

<style lang="scss">
.VideoPlayer {
  border: 0.1rem solid $white;
  position: relative;
  aspect-ratio: 110 / 62;

  .controls {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
