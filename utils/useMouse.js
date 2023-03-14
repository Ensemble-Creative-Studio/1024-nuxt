import { ref, onMounted } from 'vue'

let instance = null

export default function useMouse() {
  if (typeof window === 'undefined') {
    return {}
  }

  if (instance) {
    return instance
  }

  const mouseX = ref(0)
  const mouseY = ref(0)

  const mousedownSubscribers = ref([])
  const mouseupSubscribers = ref([])
  const mousemoveSubscribers = ref([])

  function handleMousedown(event) {
    mousedownSubscribers.value.forEach(fn => fn(event))
  }

  function handleMouseup(event) {
    mouseupSubscribers.value.forEach(fn => fn(event))
  }

  function handleMousemove(event) {
    mouseX.value = event.clientX
    mouseY.value = event.clientY

    mousemoveSubscribers.value.forEach(fn => fn(event))
  }

  onMounted(() => {
    window.addEventListener('mousedown', handleMousedown)
    window.addEventListener('mouseup', handleMouseup)
    window.addEventListener('mousemove', handleMousemove)
  })

  function subscribeMousedown(fn) {
    mousedownSubscribers.value.push(fn)
  }

  function unsubscribeMousedown(fn) {
    mousedownSubscribers.value = mousedownSubscribers.value.filter(f => f !== fn)
  }

  function subscribeMouseup(fn) {
    mouseupSubscribers.value.push(fn)
  }

  function unsubscribeMouseup(fn) {
    mouseupSubscribers.value = mouseupSubscribers.value.filter(f => f !== fn)
  }

  function subscribeMousemove(fn) {
    mousemoveSubscribers.value.push(fn)
  }

  function unsubscribeMousemove(fn) {
    mousemoveSubscribers.value = mousemoveSubscribers.value.filter(f => f !== fn)
  }

  instance = {
    subscribeMousedown,
    unsubscribeMousedown,
    subscribeMouseup,
    unsubscribeMouseup,
    subscribeMousemove,
    unsubscribeMousemove,

    mouseX,
    mouseY
  }

  return instance
}