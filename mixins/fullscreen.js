import screenfull from 'screenfull'

export default {
    props: {
        'onFullscreenChange': Function
    },

    data () {
        return {
            isFullscreen: false
        }
    },

    mounted () {
        this.$fullscreenTarget.addEventListener('fullscreenchange', this._onFullscreenChange)

        if (screenfull.isEnabled) {
            screenfull.on('change', this._onFullscreenChange)
        }
    },

    beforeDestroy () {
        this.$fullscreenTarget.removeEventListener('fullscreenchange', this._onFullscreenChange)

        if (screenfull.isEnabled) {
            screenfull.off('change', this._onFullscreenChange)
            if (this.isFullscreen === true) {
                this.exitFullscreen()
            }
        }
    },

    computed: {
        $fullscreenTarget () {
            return this.$el
        }
    },

    watch: {
        isFullscreen () {
            if (typeof this.onFullscreenChange === 'function') {
                this.onFullscreenChange(this.isFullscreen)
            }
        }
    },

    methods: {
        _onFullscreenChange (event) {
            const documentFullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement
            this.isFullscreen = (documentFullscreenElement === this.$fullscreenTarget) || (this.$fullscreenTarget.webkitDisplayingFullscreen === true)
        },

        // onFullscreenChange () {
        // },

        requestFullscreen () {
            if (this.$fullscreenTarget.webkitSupportsFullscreen === true) {
                this.$fullscreenTarget.webkitEnterFullScreen()
                this._onFullscreenChange()
            } else if (typeof this.$fullscreenTarget.webkitSetPresentationMode === 'function') {
                this.$fullscreenTarget.webkitSetPresentationMode('fullscreen')
                this._onFullscreenChange()
            } else if (screenfull.isEnabled) {
                screenfull.request(this.$fullscreenTarget)
            }
        },

        exitFullscreen () {
            if (this.$fullscreenTarget.webkitSupportsFullscreen === true) {
                this.$fullscreenTarget.webkitExitFullscreen()
                this._onFullscreenChange()
            } else if (typeof this.$fullscreenTarget.webkitSetPresentationMode === 'function') {
                this.$fullscreenTarget.webkitSetPresentationMode('inline')
                this._onFullscreenChange()
            } else if (screenfull.isEnabled) {
                screenfull.exit(this.$fullscreenTarget)
            }
        },

        toggleFullscreen (toggle) {
            if (this.isFullscreen === true && toggle !== true) {
                this.exitFullscreen()
            } else if (this.isFullscreen === false && toggle !== false) {
                this.requestFullscreen()
            }
        }
    }
}
