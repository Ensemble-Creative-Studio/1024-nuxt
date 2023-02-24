<script setup>
import MouseManager from '@/utils/MouseManager'
import KeyboardManager from '@/utils/KeyboardManager'
import { clamp, normalize } from '@/utils/math'
import { contain } from '@/utils/geometry'
import { parseTime } from '@/utils/string'
import { closest } from '@/utils/dom'

const props = defineProps({
  vimeoId: String,
})

const $video = ref(null)

onMounted(() => {
  console.log($video.value)
})

function setVideo($event) {
  console.log($video.value)
  console.log($event);
}
</script>

<template>
  <div class="VideoPlayer">
    <video
      class="video"
      ref="$video"
      autoplay
      muted
      controls
      @loadedmetadata="setVideo($event)"
    >
      <source
        :src="props.vimeoId"
        type="video/mp4"
      />
    </video>
  </div>
</template>

<style lang="scss">
.VideoPlayer {
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
