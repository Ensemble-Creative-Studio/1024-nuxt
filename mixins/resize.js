import ResizeManager from 'utils/ResizeManager'

export default {
    data () {
        return {
            window: {
                width: ResizeManager.window.width,
                height: ResizeManager.window.height
            }
        }
    },

    mounted () {
        ResizeManager.on(this._onResize, true)
    },

    beforeDestroy () {
        ResizeManager.off(this._onResize)
    },

    methods: {
        _onResize (width, height) {
            this.window.width = width
            this.window.height = height

            if (typeof this.onResize === 'function') {
                this.$nextTick(() => {
                    if (this._isDestroyed === false) {
                        this.onResize(this.window.width, this.window.height)
                    }
                })
            }
        },

        // onResize (width, height) {
        // }
    }
}
