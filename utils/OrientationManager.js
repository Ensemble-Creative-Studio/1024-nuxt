import ResizeManager from './ResizeManager'
import { clamp, normalize } from './math'

class OrientationManager {
    constructor () {
        this.callbacks = []

        this.deviceOrientation = {
            x: 0,
            y: 0
        }

        this.sensibility = 8

        this._onDeviceOrientationChange = this._onDeviceOrientationChange.bind(this)
    }

    warn (...messages) {
        console.warn('[OrientationManager]', ...messages)
    }

    on (callback) {
        if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
            if (typeof callback === 'function') {
                if (this.callbacks.length === 0) {
                    window.addEventListener('deviceorientation', this._onDeviceOrientationChange)
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
        } else {
            this.warn('DeviceOrientationEvent not supported.')
        }
    }

    off (callback) {
        if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
            const index = this.callbacks.indexOf(callback)
            if (index > -1) {
                this.callbacks.splice(index, 1)
            }

            if (this.callbacks.length === 0) {
                window.removeEventListener('deviceorientation', this._onDeviceOrientationChange)
            }
        }
    }

    _onDeviceOrientationChange (event) {
        const orientation = ResizeManager.width > ResizeManager.height ? 'landscape' : 'portrait'

        if (orientation === 'landscape') {
            const sign = event.gamma > 0 ? -1 : 1

            this.deviceOrientation.x = clamp(normalize(event.beta, 0, 90 / this.sensibility), -1, 1) * sign
            this.deviceOrientation.y = clamp(normalize(event.gamma + 45 * sign, 0, 90 / this.sensibility), -1, 1) * sign
        } else {
            this.deviceOrientation.x = clamp(normalize(event.gamma, 0, 90 / this.sensibility), -1, 1)
            this.deviceOrientation.y = -clamp(normalize(event.beta - 45, 0, 90 / this.sensibility), -1, 1)
        }

        for (let callback of this.callbacks) {
            callback.call(callback, this.deviceOrientation)
        }
    }
}

export default new OrientationManager()
