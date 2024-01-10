<script setup>
import screenfull from 'screenfull'
import { useNuxtApp } from '#app'

// Assuming you have the urlFor function provided via a Nuxt plugin
const { urlFor } = useNuxtApp(); // Access the urlFor function


const { isTouch, isSafari, isAndroid, isIos, isSamsung } = useDevice()

const props = defineProps({
  vimeoUrl: String,
  downloadUrl: String,
  poster: String, // Expect an asset reference for the poster image
})


const $main = ref(null)
const $video = ref(null)
const $timeline = ref(null)

const videoCurrentTime = ref(0)
const videoFormatedCurrentTime = ref(formatTime(videoCurrentTime.value))
const videoDuration = ref(null)
const videoFormatedDuration = ref(formatTime(videoDuration.value))

const isPlaying = ref(false)
const isMuted = ref(false)
const isFullscreen = ref(false)
const isLoaded = ref(false)

let raf = null

function setVideoData() {
  videoDuration.value = $video.value.duration
  videoFormatedDuration.value = formatTime(videoDuration.value)
  isLoaded.value = true
}

function onPlayBtnClick() {
  isPlaying.value = true
  $video.value.play()
  raf = window.requestAnimationFrame(onUpdate)
}

function onPauseBtnClick() {
  isPlaying.value = false
  $video.value.pause()
  window.cancelAnimationFrame(raf)
}

function onUpdate() {
  videoCurrentTime.value = $video.value.currentTime
  raf = window.requestAnimationFrame(onUpdate)
}

function onVisualClick() {
  console.log('onVisualClick')
  isPlaying.value = !isPlaying.value

  if (isPlaying.value === true) {
    onPlayBtnClick()
  } else {
    onPauseBtnClick()
  }
}

function onToggleMuteBtnClick() {
  isMuted.value = !isMuted.value

  if (isMuted.value === true) {
    $video.value.muted = true
  } else {
    $video.value.muted = false
  }
}

function onFullscreenBtnClick() {
  const $fullscreenNode = isIos || isAndroid || isSamsung ? $video.value : $main.value

  screenfull.toggle($fullscreenNode)
  isFullscreen.value = true
}

function onMinimizeBtnClick() {
  isFullscreen.value = false
  screenfull.exit()
}

onMounted(() => {
  screenfull.on('change', onScreenfullChange)

  if (!isLoaded) {
    setVideoData()
  }
})

function onScreenfullChange() {
  isFullscreen.value = screenfull.isFullscreen
}

function onVideoTimeUpdate() {
  videoFormatedCurrentTime.value = formatTime($video.value.currentTime)
}

function formatTime(time) {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  const formatedSeconds = seconds < 10 ? `0${seconds}` : seconds

  return `${minutes}:${formatedSeconds}`
}

function onTimelineClick(event) {
  seekOnTimeline(event.clientX)
}

function seekOnTimeline(userX) {
  const timelineLeft = $timeline.value.getBoundingClientRect().left
  const timelineWidth = $timeline.value.getBoundingClientRect().width
  const userXRelativeToTimeline = userX - timelineLeft

  const seekTime = (userXRelativeToTimeline / timelineWidth) * videoDuration.value

  $video.value.currentTime = seekTime

  onPlayBtnClick()
}

function onVideoEnded() {
  isPlaying.value = false
}

onBeforeUnmount(() => {
  window.cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="VideoPlayer" ref="$main">
  
    <video
      :src="vimeoUrl"
      :poster="poster"
      class="video"
      ref="$video"
      crossorigin="anonymous"
      playsinline
      webkit-playsinline
      @click="onVisualClick"
      @loadedmetadata="setVideoData"
      @timeupdate="onVideoTimeUpdate"
      @ended="onVideoEnded"
    ></video>
    <div class="controls">
      <div class="flex">

      <div class="controls__play-pause">
        <button class="controls__play" @click="onPlayBtnClick" type="button" v-show="!isPlaying">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 12.5V3.5H4.35441L14 7.35125V8.71169L4.35586 12.5H3Z" stroke="white" />
          </svg>
        </button>
        <button class="controls__pause" @click="onPauseBtnClick" type="button" v-show="isPlaying">
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="3.5" width="3" height="9" stroke="white" />
            <rect x="10" y="3.5" width="3" height="9" stroke="white" />
          </svg>
        </button>
      </div>
      <div class="controls__time">
        <div class="controls__current-time">
          {{ videoFormatedCurrentTime }}
        </div>
        <div class="controls__total-time">{{ videoFormatedDuration }}</div>
      </div>
      </div>
<div class="flex">
  <div class="controls__mute">
    <button @click="onToggleMuteBtnClick" type="button" v-show="!isMuted">
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="8.5" width="3" height="5" stroke="white" />
        <rect x="12" y="8.5" width="3" height="5" stroke="white" />
        <path
          d="M15 8C15 4.41015 12.0899 1.5 8.5 1.5C4.91015 1.5 2 4.41015 2 8"
          stroke="white"
        />
      </svg>
    </button>
    <button @click="onToggleMuteBtnClick" type="button" v-show="isMuted">
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="8.5" width="3" height="5" stroke="#727272" />
        <rect x="12" y="8.5" width="3" height="5" stroke="#727272" />
        <path
          d="M15 8C15 4.41015 12.0899 1.5 8.5 1.5C4.91015 1.5 2 4.41015 2 8"
          stroke="#727272"
        />
      </svg>
    </button>
  </div>
  <div class="controls__fullscreen">
    <button @click="onFullscreenBtnClick" type="button" v-show="!isFullscreen">
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2.5 9V14H9.5V9H2.5ZM8.5 13H3.5V10H8.5V13Z" fill="white" />
        <path d="M2.5 2V8H3.5V3H13.5V13H10.5V14H14.5V2H2.5Z" fill="white" />
      </svg>
    </button>
    <button @click="onMinimizeBtnClick" type="button" v-show="isFullscreen">
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M2.5 14V2H14.5V14H2.5ZM8.5 9H3.5V13H8.5V9Z"
          fill="white"
        />
      </svg>
    </button>
  </div>
</div>
  
 
      <div
        class="controls__timeline"
        ref="$timeline"
        @click="onTimelineClick"
        @mousedown="onTimelineMousedown"
        @mouseup="onTimelineMouseup"
        @touchstart="onTimelineTouchstart"
      >
        <div class="controls__timeline-background"></div>
        <div
          class="controls__timeline-current"
          :style="{
            transform: `translate3d(-${100 - (videoCurrentTime / videoDuration) * 100}%, 0, 0)`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.VideoPlayer {
  position: relative;
  background-color: $black;
.flex{
  display: flex;
}
  .controls {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    font-size: $desktop-player;
    padding: 0 1.2rem 1.2rem 1.2rem;

    @include viewport-480 {
      font-size: $mobile-player;
      padding: 0.4rem 0.6rem;
       justify-content: flex-start;
    }

    button {
      text-transform: uppercase;
      cursor: pointer;
      display: block;

      svg {
        margin: 0 auto;
        display: block;
      }
    }

    &__play-pause {
      order: 0;
    }

    &__time {
      order: 1;
      display: flex;
      margin-left: 1.2rem;
    }

    &__total-time {
      margin-left: 1.2rem;
    }

    &__mute {
      order: 2;
      margin-left: 1.2rem;
    }

    &__download {
      margin-left: 1.2rem;
      order: 4;

      @include viewport-480 {
        order: 5;
      }

      @include viewport-320 {
        display: none;
      }
    }

    &__fullscreen {
      order: 3;
      margin-left: 1.2rem;

      @include viewport-480 {
        order: 4;
      }
    }

    &__timeline {
      overflow: hidden;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1rem;
      display: flex;
      align-items: center;
      cursor: pointer;

      @include viewport-480 {
        position: relative;
        width: 5rem;
        order: 4;
        margin-left: 1.2rem;
      }

      &-background {
        position: absolute;
        bottom: 0;
        height: 0.1rem;
        background-color: #737373;
        opacity: 0.8;
        width: 100%;

        @include viewport-480 {
          bottom: 50%;
          transform: translateY(calc(50% + 0.1rem));
        }
      }

      &-current {
        height: 0.2rem;
        background-color: $white;
        position: absolute;
        bottom: 0;
        width: 100%;
        transform: scaleX(0);
        transform-origin: left;

        @include viewport-480 {
          bottom: 0.35rem;
        }
      }
    }
  }
}
</style>
