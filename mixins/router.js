export default {
    created () {
        if (typeof this.onRouteChange === 'function') {
            this.onRouteChange(this.$route)
        }
    },

    mounted () {
        this.removeBeforeEach = this.$router.beforeEach(this.beforeRouteChange)

        if (typeof this.onRouteChange === 'function') {
            this.onRouteChange(this.$route)
        }
    },

    beforeDestroy () {
        this.removeBeforeEach()
    },

    methods: {
        beforeRouteChange (to, from, next) {
            if (typeof this.onRouteChange === 'function') {
                this.onRouteChange(to, from)
            }
            next()
        },

        // onRouteChange (route, previousRoute) {
        // }
    }
}
