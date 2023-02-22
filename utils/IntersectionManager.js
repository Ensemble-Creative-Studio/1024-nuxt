class IntersectionManager {
    constructor () {
        this.listeners = []
        this.observers = []

        this._onIntersect = this._onIntersect.bind(this)
    }

    warn (...messages) {
        console.warn('[IntersectionManager]', ...messages)
    }

    createObserver ({ root = null, rootMargin = '0px', threshold = 0 }) {
        if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
            const options = { root, rootMargin, threshold }
            const observer = new IntersectionObserver(this._onIntersect, options)
            observer.options = options
            this.observers.push(observer)
            return observer
        }

        return null
    }

    once ({ target, onEnter, root, rootMargin, threshold }) {
        return this.on({ target, onEnter, once: true, root, rootMargin, threshold })
    }

    on ({ target, onEnter = null, onExit = null, once = false, root = null, rootMargin = '0px', threshold = 0 }) {
        if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
            let observer = this.observers.find(_observer => _observer.options.root === root && _observer.options.rootMargin == rootMargin && _observer.options.threshold == threshold)
            if (typeof observer === 'undefined') {
                observer = this.createObserver({ root, rootMargin, threshold })
            }
            observer.observe(target)

            const listener = { observer, target, onEnter, onExit, once }
            this.listeners.push(listener)

            return listener
        } else {
            this.warn('IntersectionObserver not supported.')
        }

        return null
    }

    off (listener, disconnect = false) {
        if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
            const index = this.listeners.indexOf(listener)
            if (index > -1) {
                listener.observer.unobserve(listener.target)
                if (disconnect === true) {
                    this.disconnect(listener.observer)
                }
                this.listeners.splice(index, 1)
            }
            listener = null
        }
    }

    disconnect (observer) {
        const index = this.observers.indexOf(observer)
        if (index > -1) {
            this.observers.splice(index, 1)
        }

        if (typeof observer.disconnect === 'function') {
            observer.disconnect()
        }
        observer = null
    }

    _onIntersect (entries, observer) {
        entries.forEach(entry => {
            const entryListeners = this.listeners.filter(listener => listener.observer === observer && listener.target === entry.target)

            for (let listener of entryListeners) {
                const { onEnter, onExit, once } = listener

                if (entry.isIntersecting) {
                    if (typeof onEnter === 'function') {
                        onEnter.call(onEnter, entry)
                        if (once === true) {
                            this.off(listener)
                        }
                    }
                } else {
                    if (typeof onExit === 'function') {
                        onExit.call(onExit, entry)
                    }
                }
            }
        })
    }
}

export default new IntersectionManager()
