import CONSTANTS from '../config/constants'

function requestAnimationFramePolyfill (callback) {
    return setInterval(callback, 1000 / 60)
}

function cancelAnimationFramePolyfill (requestID) {
    clearInterval(requestID)
}

class RafManager {
    constructor () {
        this.callbacks = []

        this.date = Date.now()
        this.time = 0
        this.framesCount = 0
        this.delta = 0
        this.accumulatedDelta = 0
        this.deltaAverage = 0
        this.fpsAverage = 60

        this.isRunning = false
        this.raf = null

        this._update = this._update.bind(this)

        if (typeof window !== 'undefined') {
            window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFramePolyfill
            window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || cancelAnimationFramePolyfill

            if (CONSTANTS.DEBUG) {
                this.addStats()
            }
        }
    }

    warn (...messages) {
        console.warn('[RafManager]', ...messages)
    }

    addStats () {
        const Stats = require('stats.js')
        this.stats = new Stats()
        this.stats.dom.classList.add('stats')
        document.body.appendChild(this.stats.dom)
    }

    removeStats () {
        document.body.removeChild(this.stats.dom)
    }

    start () {
        this.isRunning = true
        this.raf = requestAnimationFrame(this._update)
    }

    stop () {
        this.isRunning = false
        cancelAnimationFrame(this.raf)
    }

    on (callback) {
        if (typeof window !== 'undefined') {
            if (typeof callback === 'function') {
                if (this.callbacks.length === 0) {
                    this.start()
                }
                const index = this.callbacks.indexOf(callback)
                if (index === -1) {
                    this.callbacks.push(callback)
                } else {
                    this.warn('on()', 'Callback already added', callback)
                }
            } else {
                this.warn('on()', 'This isn\'t a function', callback)
            }
        }
    }

    off (callback) {
        if (typeof window !== 'undefined') {
            const index = this.callbacks.indexOf(callback)
            if (index > -1) {
                this.callbacks.splice(index, 1)
            }
            if (this.callbacks.length === 0) {
                this.stop()
            }
        }
    }

    _update () {
        if (this.stats) {
            this.stats.begin()
        }

        this.delta = Date.now() - this.date
        this.time += this.delta / 1000
        this.date = Date.now()

        this.accumulatedDelta += this.delta / 1000
        this.framesCount += 1
        this.deltaAverage = this.accumulatedDelta / this.framesCount
        this.fpsAverage = 1 / this.deltaAverage

        for (let callback of this.callbacks) {
            callback.call(callback, this.delta, this.time)
        }

        this.raf = requestAnimationFrame(this._update)

        if (this.stats) {
            this.stats.end()
        }
    }    
}

export default new RafManager()
