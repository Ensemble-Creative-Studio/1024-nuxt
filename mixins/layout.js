import ResizeManager from 'utils/ResizeManager'

export default {
    data () {
        return {
            layout: 'desktopLarge',
            layoutIndex: 5,
            breakpoints: {
                mobile: parseInt(this.$styles['mobile-max-width']),
                mobileLandscape: parseInt(this.$styles['mobile-landscape-max-width']),
                tablet: parseInt(this.$styles['tablet-max-width']),
                desktopSmall: parseInt(this.$styles['desktop-small-max-width']),
                desktopMedium: parseInt(this.$styles['desktop-medium-max-width']),
                desktopLarge: Infinity
            }
        }
    },

    mounted () {
        ResizeManager.on(this._onLayoutChange, true)
    },

    beforeDestroy () {
        ResizeManager.off(this._onLayoutChange)
    },

    watch: {
        layout () {
            if (typeof this.onLayoutChange === 'function') {
                this.onLayoutChange(this.layout)
            }
        }
    },

    methods: {
        _onLayoutChange (width, height) {
            this.layout = Object.keys(this.breakpoints).find(key => width < this.breakpoints[key])
            this.layoutIndex = Object.keys(this.breakpoints).indexOf(this.layout)
        },

        // onLayoutChange (layout) {
        // }

        breakpoint (layout) {
            const layoutIndex = Object.keys(this.breakpoints).indexOf(layout)
            return this.layoutIndex <= layoutIndex
        }
    }
}
