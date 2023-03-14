import { ref, onMounted } from 'vue'

let instance = null

export default function useWindowResize() {
  if (typeof window === 'undefined') {
    return {}
  }

  if (instance) {
    return instance
  }

  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)
  const windowRatio = ref(windowWidth.value / windowHeight.value)

  const subscribers = ref([])

  const xsBreakpoint = ref(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--xs-breakpoint')))
  const smBreakpoint = ref(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sm-breakpoint')))
  const mdBreakpoint = ref(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--md-breakpoint')))
  const lgBreakpoint = ref(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--lg-breakpoint')))
  const xlBreakpoint = ref(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--xl-breakpoint')))
  const xxlBreakpoint = ref(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--xxl-breakpoint')))


  function handleResize() {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight

    windowRatio.value = windowWidth.value / windowHeight.value

    subscribers.value.forEach(fn => fn())
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
  })

  function subscribeWindowResize(fn) {
    subscribers.value.push(fn)
    fn()
  }

  function unsubscribeWindowResize(fn) {
    subscribers.value = subscribers.value.filter(f => f !== fn)
  }

  instance = {
    windowWidth,
    windowHeight,
    windowRatio,
    xsBreakpoint,
    smBreakpoint,
    mdBreakpoint,
    lgBreakpoint,
    xlBreakpoint,
    xxlBreakpoint,
    subscribeWindowResize,
    unsubscribeWindowResize
  }

  return instance
}