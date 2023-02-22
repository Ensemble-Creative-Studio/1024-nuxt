import RafManager from 'utils/RafManager'

export default {
    mounted () {
        if (process.client && typeof this.update === 'function') {
            RafManager.on(this.update)
        }
    },

    beforeDestroy () {
        if (typeof this.update === 'function') {
            RafManager.off(this.update)
        }
    },

    methods: {
        // update (delta, time) {
        // }
    }
}
