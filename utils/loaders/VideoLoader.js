class VideoLoader {
  constructor ({ crossOrigin = null, muted = true, playsinline = true, canplaythrough = false } = {}) {
    this.crossOrigin = crossOrigin
    this.muted = muted
    this.playsinline = playsinline

    this.canplayEvent = canplaythrough === true ? 'canplaythrough' : 'canplay'
    this.readyStateNeeded = canplaythrough ? 4 : 3

    this.listeners = []
  }

  load (url) {
    return new Promise(resolve => {
      const video = url instanceof Element ? url : document.createElement('video')

      video.crossOrigin = video.getAttribute('crossorigin') || this.crossOrigin
      video.muted = this.muted

      if (this.playsinline) {
        video.setAttribute('playsinline', '')
        video.setAttribute('webkit-playsinline', '')
      }

      const loadHandler = this._videoLoadHandler.bind(this, video)
      const unbindLoad = this._unbindVideoLoad.bind(this, video)

      video.addEventListener('loadeddata', loadHandler, false)
      video.addEventListener(this.canplayEvent, loadHandler, false)
      const loadInterval = setInterval(loadHandler, 1000)
      video.addEventListener('error', unbindLoad, false)

      this.listeners.push({ video, loadHandler, unbindLoad, loadInterval, resolve })

      if (typeof url === 'string') {
          video.src = url
      }

      video.load()
      loadHandler()
    })
  }

  _videoLoadHandler (video) {
    const listener = this.listeners.find(_listener => _listener.video === video)

    if (video.readyState >= this.readyStateNeeded) {
      if (typeof listener !== 'undefined') {
        listener.unbindLoad()
      }

      listener.resolve(video)
    }
  }

  _unbindVideoLoad (video) {
    const listener = this.listeners.find(_listener => _listener.video === video)

    if (typeof listener !== 'undefined') {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
          this.listeners.splice(index, 1)
      }

      video.removeEventListener('loadeddata', listener.loadHandler, false)
      video.removeEventListener(this.canplayEvent, listener.loadHandler, false)
      clearInterval(listener.loadInterval)
      video.removeEventListener('error', listener.loadHandler, false)
    }
  }

  stopLoad (video) {
    const listener = this.listeners.find(_listener => _listener.video === video)

    if (typeof listener !== 'undefined') {
      listener.unbindLoad()
    }

    video.src = ''
    video.removeAttribute('src')
    // video.load()
  }
}

export default VideoLoader
