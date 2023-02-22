export default {
    data () {
        return {
            scrollState: {
                uid: null,
                inView: false,
                almostInView: false
            }
        }
    },

    mounted () {
        this.scrollState.uid = this._uid
        this.bind()
    },

    beforeDestroy () {
        this.unbind()
    },

    methods: {
        bind () {
            this.$nuxt.$on(`inView/${ this.scrollState.uid }`, this._onInView)
            this.$nuxt.$on(`outView/${ this.scrollState.uid }`, this._onOutView)
            this.$nuxt.$on(`almostInView/${ this.scrollState.uid }`, this._onAlmostInView)
        },

        unbind () {
            this.$nuxt.$off(`inView/${ this.scrollState.uid }`, this._onInView)
            this.$nuxt.$off(`outView/${ this.scrollState.uid }`, this._onOutView)
            this.$nuxt.$off(`almostInView/${ this.scrollState.uid }`, this._onAlmostInView)
        },

        _onInView () {
            this.scrollState.inView = true
            this.scrollState.almostInView = false

            if (typeof this.onInView === 'function') {
                this.onInView()
            }
        },

        _onOutView () {
            this.scrollState.inView = false
            this.scrollState.almostInView = false

            if (typeof this.onOutView === 'function') {
                this.onOutView()
            }
        },

        _onAlmostInView () {
            this.scrollState.almostInView = true

            if (typeof this.onAlmostInView === 'function') {
                this.onAlmostInView()
            }
        }
    }
}
