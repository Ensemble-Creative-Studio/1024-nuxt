<script setup>
import screenfull from 'screenfull'

import useWindowResize from '~~/utils/useWindowResize'
import useKeyboard from '~~/utils/useKeyboard'
import { is } from 'immutable'

const { isTouch, isSafari, isAndroid, isIos, isSamsung } = useDevice()
const {
  windowWidth,
  windowHeight,
  subscribeWindowResize,
  unsubscribeWindowResize,
  mdBreakpoint,
} = useWindowResize()
const { subscribeKeydown, unsubscribeKeydown, spaceKey, mKey, fKey } =
  useKeyboard()
const {
  subscribeMouseup,
  unsubscribeMouseup,
  subscribeMousemove,
  unsubscribeMousemove,
} = useMouse()
const {
  subscribeTouchend,
  unsubscribeTouchend,
  subscribeTouchmove,
  unsubscribeTouchmove,
} = useTouch()

const props = defineProps({
  vimeoUrl: String,
  vimeoId: String,
})

const $video = ref(null)
const $timeline = ref(null)

const isLoaded = ref(false)
const hasPlayedOnce = ref(false)
const hidePlayerTimeout = ref(null)
const videoCurrentTime = ref(0)
const videoFormatedCurrentTime = ref(formatTime(videoCurrentTime.value))
const videoDuration = ref(null)
const videoFormatedDuration = ref(formatTime(videoDuration.value))

const isPlaying = ref(false)
const isMuted = ref(false)
const isFullscreen = ref(false)
const isTimelineActive = ref(false)
const isPlayerHidden = ref(false)

const timelineLeft = ref(0)
const timelineWidth = ref(0)
const isUserDownOnTimeline = ref(false)

let raf = null

onMounted(() => {
  console.log('mounting')
  setVideoData()
})

function onLoadedMetada() {
  console.log('metadata loaded')
  setVideoData()
}

function setVideoData() {
  videoDuration.value = $video.value.duration
  videoFormatedDuration.value = formatTime(videoDuration.value)

  $video.value.addEventListener('timeupdate', onVideoTimeUpdate)
  $video.value.addEventListener('ended', onVideoEnded)
}

// function togglePlay() {
//   // play the video if it's paused and vice versa
//   if (!isPlaying.value) {
//     onPlayBtnClick()
//   } else {
//     onPauseBtnClick()
//   }
// }

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
  if (isPlaying.value === true || isPlaying.value === false || isUserDownOnTimeline.value === true) {
    videoCurrentTime.value = $video.value.currentTime
    raf = window.requestAnimationFrame(onUpdate)
  }
}

function onTouchend() {
  if (isUserDownOnTimeline.value === true) {
    isUserDownOnTimeline.value = false
  }
}

function onMousemove(event) {
  resetHidePlayerTimeout()

  if (isUserDownOnTimeline.value === true) {
    if (isTimelineActive.value === true) {
      seekOnTimeline(event.clientX)
    }
  }
}

function onTouchmove(event) {
  resetHidePlayerTimeout()

  if (isUserDownOnTimeline.value === true) {
    seekOnTimeline(event.touches[0].clientX)
  }
}

function onVisualClick() {
  // playerStore.setPlayingState(!isPlaying.value)
}

function onToggleMuteBtnClick() {
  // playerStore.setMutedState(!isMuted.value)
  resetHidePlayerTimeout()
}

function onFullscreenBtnClick() {
  // const $fullscreenNode =
  //   isIos || isAndroid || isSamsung ? $video.value : $main.value

  // screenfull.request($fullscreenNode)
  resetHidePlayerTimeout()
}

function onMinimizeBtnClick() {
  screenfull.exit()
  resetHidePlayerTimeout()
}

function onScreenfullChange() {
  // playerStore.setFullscreenState(screenfull.isFullscreen)
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
  console.log('user clicked on timeline')

  const timelineLeft = $timeline.value.getBoundingClientRect().left
  const timelineWidth = $timeline.value.getBoundingClientRect().width
  const userXRelativeToTimeline = userX - timelineLeft

  const seekTime =
    (userXRelativeToTimeline / timelineWidth) * videoDuration.value

  $video.value.currentTime = seekTime

  resetHidePlayerTimeout()
}

function onTimelineMouseDown() {
  isUserDownOnTimeline.value = true
  console.log('user down on timeline')
}

function onTimelineMouseUp() {
  isUserDownOnTimeline.value = false
  console.log('user up on timeline')
}

function setupHidePlayerTimeout() {
  // playerStore.setPlayerHiddenState(false)

  if (hidePlayerTimeout.value) {
    clearTimeout(hidePlayerTimeout.value)
  }

  hidePlayerTimeout.value = setTimeout(() => {
    // playerStore.setPlayerHiddenState(true)
  }, 2000)
}

function resetHidePlayerTimeout() {
  // playerStore.setPlayerHiddenState(false)

  if (isPlaying.value === true && hidePlayerTimeout.value) {
    clearTimeout(hidePlayerTimeout.value)

    hidePlayerTimeout.value = setTimeout(() => {
      // playerStore.setPlayerHiddenState(true)
    }, 2000)
  }
}

function cancelHidePlayerTimeout() {
  // playerStore.setPlayerHiddenState(false)

  if (hidePlayerTimeout.value) {
    clearTimeout(hidePlayerTimeout.value)
  }
}

function onVideoEnded() {
  isPlaying.value = false
}
</script>

<template>
  <div class="VideoPlayer" @click="togglePlay">
    <video
      :src="props.vimeoUrl"
      class="video"
      ref="$video"
      crossorigin="anonymous"
      playsinline
      webkit-playsinline
      @click="togglePlay"
      @loadedmetadata="onLoadedMetada"
      @ended="onVideoEnded"
    ></video>
    <div class="controls">
      <div class="controls__play-pause">
        <button
          class="controls__play"
          @click="onPlayBtnClick"
          type="button"
          v-show="!isPlaying"
        >
          Play
        </button>
        <button
          class="controls__pause"
          @click="onPauseBtnClick"
          type="button"
          v-show="isPlaying"
        >
          Pause
        </button>
      </div>
      <div class="controls__time">
        <div class="controls__current-time">
          {{ videoFormatedCurrentTime }}
        </div>
        <div class="controls__total-time">{{ videoFormatedDuration }}</div>
      </div>
      <div class="controls__mute">
        <button @click="onToggleMuteBtnClick" type="button">Mute</button>
      </div>
      <div class="controls__download">
        <button @click="onDownload" type="button">Download</button>
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
            transform: `translate3d(-${
              100 - (videoCurrentTime / videoDuration) * 100
            }%, 0, 0)`,
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.VideoPlayer {
  position: relative;
  aspect-ratio: 130/73.2;

  .controls {
    position: absolute;
    bottom: 0;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    font-size: 1.2rem;
    padding: 0 1.2rem 1.2rem 1.2rem;

    button {
      text-transform: uppercase;
    }

    &__time {
      display: flex;
      margin-left: 1.2rem;
    }

    &__total-time {
      margin-left: 1.2rem;
    }

    &__mute {
      margin-left: 1.2rem;
    }

    &__download {
      margin-left: 1.2rem;
    }

    &__timeline {
      overflow: hidden;
      position: absolute;
      bottom: -1rem;
      left: 0;
      width: 100%;
      height: 2rem;
      display: flex;
      align-items: center;
      cursor: pointer;

      &-background {
        height: 0.1rem;
        background-color: #737373;
        opacity: 0.8;
        width: 100%;
      }

      &-current {
        height: 0.2rem;
        background-color: $white;
        position: absolute;
        width: 100%;
        transform: scaleX(0);
        transform-origin: left;
      }
    }
  }
}
</style>
