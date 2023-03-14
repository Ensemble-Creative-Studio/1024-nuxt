<script setup>
const props = defineProps({
  vimeoId: {
    type: String,
  },
})

const videoPlayer = ref(null)

const playVideo = () => {
  const video = videoPlayer.value

  if (video) {
    video.play()
  }
}

const videoUrls = computed(() => {
  const baseUrl = `/api/${props.vimeoId}`

  return {
    sd: `${baseUrl}?quality=360p`,
    hd: `${baseUrl}?quality=1080p`,
  }
})

onMounted(() => {
  const video = videoPlayer.value

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  if (isMobile) {
    video.src = videoUrls.value.sd
  } else {
    video.src = videoUrls.value.hd
  }

  video.addEventListener('click', playVideo)
})
</script>

<template>
  <div>
    <video ref="videoPlayer" controls></video>
  </div>
</template>
