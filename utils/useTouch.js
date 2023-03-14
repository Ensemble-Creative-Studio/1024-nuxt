import { ref, onMounted } from 'vue'

let instance = null

export default function useTouch() {
  if (typeof window === 'undefined') {
    return {}
  }

  if (instance) {
    return instance
  }

  const touchX = ref(0)
  const touchY = ref(0)

  const touchstartSubscribers = ref([])
  const touchendSubscribers = ref([])
  const touchmoveSubscribers = ref([])

  function handleTouchstart(event) {
    touchstartSubscribers.value.forEach(fn => fn(event))
  }

  function handleTouchend(event) {
    touchendSubscribers.value.forEach(fn => fn(event))
  }

  function handleTouchmove(event) {
    touchX.value = event.clientX
    touchY.value = event.clientY

    touchmoveSubscribers.value.forEach(fn => fn(event))
  }

  onMounted(() => {
    window.addEventListener('touchstart', handleTouchstart)
    window.addEventListener('touchend', handleTouchend)
    window.addEventListener('touchmove', handleTouchmove)
  })

  function subscribeTouchstart(fn) {
    touchstartSubscribers.value.push(fn)
  }

  function unsubscribeTouchstart(fn) {
    touchstartSubscribers.value = touchstartSubscribers.value.filter(f => f !== fn)
  }

  function subscribeTouchend(fn) {
    touchendSubscribers.value.push(fn)
  }

  function unsubscribeTouchend(fn) {
    touchendSubscribers.value = touchendSubscribers.value.filter(f => f !== fn)
  }

  function subscribeTouchmove(fn) {
    touchmoveSubscribers.value.push(fn)
  }

  function unsubscribeTouchmove(fn) {
    touchmoveSubscribers.value = touchmoveSubscribers.value.filter(f => f !== fn)
  }

  instance = {
    subscribeTouchstart,
    unsubscribeTouchstart,
    subscribeTouchend,
    unsubscribeTouchend,
    subscribeTouchmove,
    unsubscribeTouchmove,

    touchX,
    touchY
  }

  return instance
}