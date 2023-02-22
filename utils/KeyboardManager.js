import { capitalize } from '../utils/string'

class KeyboardManager {
    constructor () {
        this.keys = {
            'ESC': 27, 'SPACE': 32,
            'LEFT': 37, 'TOP': 38, 'RIGHT': 39, 'BOTTOM': 40,
                        'UP':  38,              'DOWN':   40,
            'ZERO': 48, 'ONE': 49, 'TWO': 50, 'THREE': 51, 'FOUR': 52, 'FIVE': 53, 'SIX': 54, 'SEVEN': 55, 'HEIGHT': 56, 'NINE': 57,
            '0':    48, '1':   49, '2':   50, '3':     51, '4':    52, '5':    53, '6':   54, '7':     55, '8':      56, '9':    57,
            'A': 65, 'B': 66, 'C': 67, 'D': 68, 'E': 69, 'F': 70, 'G': 71, 'H': 72, 'I': 73, 'J': 74, 'K': 75, 'L': 76, 'M': 77, 'N': 78, 'O': 79, 'P': 80, 'Q': 81, 'R': 82, 'S': 83, 'T': 84, 'U': 85, 'V': 86, 'W': 87, 'X': 88, 'Y': 89, 'Z': 90
        }

        this.callbacks = {
            keydown: [],
            keyup: []
        }

        this._onKeydown = this._onKeydown.bind(this)
        this._onKeyup = this._onKeyup.bind(this)
    }

    warn (...messages) {
        console.warn('[KeyboardManager]', ...messages)
    }

    on (eventType, callback) {
        if (typeof window !== 'undefined') {
            if (typeof callback === 'function') {
                if (this.callbacks.hasOwnProperty(eventType)) {
                    if (this.callbacks[eventType].length === 0) {
                        window.addEventListener(eventType, this['_on' + capitalize(eventType)])
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

            if (this.callbacks[eventType].length === 0) {
                window.removeEventListener(eventType, this['_on' + capitalize(eventType)])
            }
        }
    }

    _onKeydown (event) {
        for (let callback of this.callbacks['keydown']) {
            callback.call(callback, event)
        }
    }

    _onKeyup (event) {
        for (let callback of this.callbacks['keyup']) {
            callback.call(callback, event)
        }
    }
}

export default new KeyboardManager()
