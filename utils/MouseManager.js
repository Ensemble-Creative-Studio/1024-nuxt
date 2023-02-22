import ResizeManager from './ResizeManager'

class MouseManager {
    constructor () {
        this.callbacks = {
            down: [],
            up: [],
            move: [],
            drag: []
        }

        this.mouse = {
            x: ResizeManager.window.width / 2,
            y: ResizeManager.window.height / 2,
            normX: 0.5,
            normY: 0.5,
            // Flip Y
            flipY: ResizeManager.window.height / 2,
            normFlipY: 0.5
        }

        this.drag = {
            startPosition: {
                x: null,
                y: null
            },
            endPosition: {
                x: null,
                y: null
            }
        }

        this.isTouch = false
        this.isDragging = false
        this.passive = this._detectPassiveMode()

        this._onInputDown = this._onInputDown.bind(this)
        this._onInputUp = this._onInputUp.bind(this)
        this._onInputMove = this._onInputMove.bind(this)

        if (typeof window !== 'undefined') {
            this.isTouch = !!('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch))

            if (this.isTouch) {
                window.addEventListener('touchstart', this._onInputDown, { passive: this.passive })
                window.addEventListener('touchend', this._onInputUp, { passive: this.passive })
                window.addEventListener('touchcancel', this._onInputUp, { passive: this.passive })
            } else {
                window.addEventListener('mousedown', this._onInputDown, { passive: false })
                window.addEventListener('mouseup', this._onInputUp, { passive: false })
            }
        }
    }

    warn (...messages) {
        console.warn('[MouseManager]', ...messages)
    }

    _addMoveEvents () {        
        if (this.isTouch) {
            window.addEventListener('touchmove', this._onInputMove, { passive: false })
        } else {
            window.addEventListener('mousemove', this._onInputMove, { passive: false })
        }
    }

    _removeMoveEvents () {
        if (this.isTouch) {
            window.removeEventListener('touchmove', this._onInputMove, { passive: false })
        } else {
            window.removeEventListener('mousemove', this._onInputMove, { passive: false })
        }
    }

    on (eventType, callback) {
        if (typeof window !== 'undefined') {
            if (typeof callback === 'function') {
                if (this.callbacks.hasOwnProperty(eventType)) {
                    if ((eventType === 'move' || eventType === 'drag') && this.callbacks['move'].length + this.callbacks['drag'].length === 0) {
                        this._addMoveEvents()
                    }
                    const index = this.callbacks[eventType].indexOf(callback)
                    if (index === -1) {
                        this.callbacks[eventType].push(callback)
                    } else {
                        this.warn('on()', 'Callback already added', callback)
                    }
                } else {
                    this.warn('on()', 'Event not supported', eventType)
                }
            } else {
                this.warn('on()', 'This isn\'t a function', callback)
            }
        }
    }

    off (eventType, callback) {
        if (typeof window !== 'undefined') {
            const index = this.callbacks[eventType].indexOf(callback)
            if (index > -1) {
                if (this.callbacks.hasOwnProperty(eventType)) {
                    this.callbacks[eventType].splice(index, 1)
                } else {
                    this.warn('off()', 'Event not supported', eventType)
                }
            }

            if ((eventType === 'move' || eventType === 'drag') && this.callbacks['move'].length + this.callbacks['drag'].length === 0) {
                this._removeMoveEvents()
            }
        }
    }

    _onInputDown (event) {
        this.isDragging = true

        this._setMousePosition(event)

        this.drag.startPosition.x = this.mouse.x
        this.drag.startPosition.y = this.mouse.y

        for (let callback of this.callbacks['down']) {
            callback.call(callback, event)
        }
    }

    _onInputUp (event) {
        if (this.isDragging === false) return

        this.isDragging = false

        for (let callback of this.callbacks['up']) {
            callback.call(callback, event)
        }
    }

    _onInputMove (event) {
        this._setMousePosition(event)

        this.drag.endPosition.x = this.mouse.x
        this.drag.endPosition.y = this.mouse.y

        for (let callback of this.callbacks['move']) {
            callback.call(callback, event)
        }

        if (this.isDragging === true) {
            for (let callback of this.callbacks['drag']) {
                callback.call(callback, event)
            }
        }
    }

    _setMousePosition (event) {
        const clientX = this.isTouch ? event.touches[0].clientX : event.clientX
        const clientY = this.isTouch ? event.touches[0].clientY : event.clientY

        this.mouse.x = clientX
        this.mouse.y = clientY
        this.mouse.normX = this.mouse.x / ResizeManager.window.width
        this.mouse.normY = this.mouse.y / ResizeManager.window.height
        // Flip Y
        this.mouse.flipY = ResizeManager.window.height - clientY
        this.mouse.normFlipY = 1 - this.mouse.normY
    }

    _detectPassiveMode () {
        let passive

        try {
			const options = Object.defineProperty({}, 'passive', {
                get: () => {
                    passive = true
                }
            })

            window.addEventListener('test', null, options)
            window.removeEventListener('test', null, options)
        } catch (error) {
            passive = false
        }

        return passive
    }
}

export default new MouseManager()
