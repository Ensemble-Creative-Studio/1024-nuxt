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
    <video class="video" ref="$video" nocontrols preload="auto" playsinline>
      <source
        :src="'https://player.vimeo.com/video/' + props.id"
        data-res="240"
        type="video/mp4"
      />
      <!-- <source
        :src="'/api/video/' + id"
        data-res="360"
        type="video/mp4"
      />
      <source
        :src="'/api/video/' + id"
        data-res="540"
        type="video/mp4"
      />
      <source
        :src="'/api/video/' + id"
        data-res="720"
        type="video/mp4"
      />
      <source
        :src="'/api/video/' + id"
        data-res="1080"
        type="video/mp4"
      /> -->
    </video>
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
