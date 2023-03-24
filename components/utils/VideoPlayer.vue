<script setup>
import screenfull from 'screenfull'

const { isTouch, isSafari, isAndroid, isIos, isSamsung } = useDevice()

const props = defineProps({
  vimeoUrl: String,
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
const isTimelineActive = ref(false)

const isUserDownOnTimeline = ref(false)

let raf = null

function setVideoData() {
  videoDuration.value = $video.value.duration
  videoFormatedDuration.value = formatTime(videoDuration.value)
}

watch($video, () => {
  setVideoData()
})

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

function onTouchend() {
  if (isUserDownOnTimeline.value === true) {
    isUserDownOnTimeline.value = false
  }
}

function onMousemove(event) {
  if (isUserDownOnTimeline.value === true) {
    if (isTimelineActive.value === true) {
      seekOnTimeline(event.clientX)
    }
  }
}

function onTouchmove(event) {
  if (isUserDownOnTimeline.value === true) {
    seekOnTimeline(event.touches[0].clientX)
  }
}

function onVisualClick() {
  isPlaying.value = !isPlaying.value

  if (isPlaying.value === true) {
    onPlayBtnClick()
  } else {
    onPauseBtnClick()
  }
}

function onDownload() {
  console.log('Download')
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

function onTimelineMouseDown() {
  isUserDownOnTimeline.value = true
}

function onTimelineMouseUp() {
  isUserDownOnTimeline.value = false
}

function onVideoEnded() {
  isPlaying.value = false
}
</script>

<template>
  <div class="VideoPlayer" ref="$main">
    <video
      :src="props.vimeoUrl"
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
      <div class="controls__play-pause">
        <button class="controls__play" @click="onPlayBtnClick" type="button" v-show="!isPlaying">
          Play
        </button>
        <button class="controls__pause" @click="onPauseBtnClick" type="button" v-show="isPlaying">
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
        <button @click="onToggleMuteBtnClick" type="button" v-show="!isMuted">Mute</button>
        <button @click="onToggleMuteBtnClick" type="button" v-show="isMuted">Unmute</button>
      </div>
      <div class="controls__download">
        <button @click="onDownload" type="button">Download</button>
      </div>
      <div class="controls__fullscreen">
        <button @click="onFullscreenBtnClick" type="button" v-show="!isFullscreen">
          Fullscreen
        </button>
        <button @click="onMinimizeBtnClick" type="button" v-show="isFullscreen">Minimize</button>
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
      cursor: pointer;
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

    &__fullscreen {
      margin-left: 1.2rem;
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

      &-background {
        position: absolute;
        bottom: 0;
        height: 0.1rem;
        background-color: #737373;
        opacity: 0.8;
        width: 100%;
      }

      &-current {
        height: 0.2rem;
        background-color: $white;
        position: absolute;
        bottom: 0;
        width: 100%;
        transform: scaleX(0);
        transform-origin: left;
      }
    }
  }
}
</style>
