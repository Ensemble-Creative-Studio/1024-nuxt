import { ref, onMounted } from 'vue'

let instance = null

export default function usKeyboard() {
  if (typeof window === 'undefined') {
    return {}
  }

  if (instance) {
    return instance
  }

  const keydownSubscribers = ref([])
  const keyupSubscribers = ref([])

  const spaceKey = ref(32)
  const topKey = ref(38)
  const rightKey = ref(39)
  const bottomKey = ref(40)
  const leftKey = ref(37)
  const fKey = ref(70)
  const mKey = ref(77)

  function handleKeydown(event) {
    keydownSubscribers.value.forEach(fn => fn(event))
  }

  function handleKeyup(event) {
    keyupSubscribers.value.forEach(fn => fn(event))
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('keyup', handleKeyup)
  })

  function subscribeKeydown(fn) {
    keydownSubscribers.value.push(fn)
  }

  function unsubscribeKeydown(fn) {
    keydownSubscribers.value = keydownSubscribers.value.filter(f => f !== fn)
  }

  function subscribeKeyup(fn) {
    keyupSubscribers.value.push(fn)
  }

  function unsubscribeKeyup(fn) {
    keydupubscribers.value = keyupSubscribers.value.filter(f => f !== fn)
  }

  instance = {
    subscribeKeydown,
    unsubscribeKeydown,
    subscribeKeyup,
    unsubscribeKeyup,

    spaceKey,
    topKey,
    rightKey,
    bottomKey,
    leftKey,
    fKey,
    mKey
  }

  return instance
}