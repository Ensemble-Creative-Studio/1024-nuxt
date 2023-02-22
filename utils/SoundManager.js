import sono from 'sono'

import Preloader from '../lib/Preloader/Preloader'

class SoundManager {
    constructor () {
        // sono.playInBackground = true

        this.sounds = {}
        this.effects = {}
    }

    warn (...messages) {
        console.warn('[SoundManager]', ...messages)
    }

    init () {
        for (let item of Preloader.items) {
            if (item.type === 'sound') {
                this.sounds[item.id] = item.sound
            }
        }
    }

    onUserGesture () {
        sono.context.resume()
    }

    get (id) {
        return this.sounds[id]
    }
}

export default new SoundManager()
