import debounce from 'lodash.debounce'

class ResizeManager {
    constructor () {
        this.callbacks = []

        this.window = {
            width: 1920,
            height: 1080,
            centerX: 960,
            centerY: 540,
            orientation: 'landscape'
        }

        this._onResize = debounce(this._onResize.bind(this), 100)

        if (typeof window !== 'undefined') {
            this._onResize()

            window.addEventListener('resize', this._onResize)
            window.addEventListener('orientationchange', this._onResize.bind(this))
        }
    }

    warn (...messages) {
        console.warn('[ResizeManager]', ...messages)
    }

    on (callback, call = false) {
        if (typeof callback === 'function') {
            const index = this.callbacks.indexOf(callback)
            if (index === -1) {
                this.callbacks.push(callback)
            } else {
                this.warn('on()', 'Callback already added', callback)
            }
            if (call === true) {
                callback.call(callback, window.innerWidth, window.innerHeight)
            }
        } else {
            this.warn('on()', 'This isn\'t a function', callback)
        }
    }

    off (callback) {
        const index = this.callbacks.indexOf(callback)
        if (index > -1) {
            this.callbacks.splice(index, 1)
        }
    }

    _onResize () {
        const width = window.innerWidth
        const height = window.innerHeight

        this.window.width = width
        this.window.height = height
        this.window.centerX = width / 2
        this.window.centerY = height / 2

        this.window.orientation = width >= height ? 'landscape' : 'portrait'

        this.resize()
    }

    resize () {
        for (let callback of this.callbacks) {
            callback.call(callback, this.window.width, this.window.height)
        }
    }

    get width () {
        return this.window.width
    }

    get height () {
        return this.window.height
    }

    get orientation () {
        return this.window.orientation
    }
}

export default new ResizeManager()
