export default {
    mounted () {
        this.initAnimateIn()
    },

    methods: {
        initAnimateIn () {
        },

        animateIn () {
        },

        animateOut () {
        },

        addRefsToTl (refs, callbackName, { timeline = gsap.timeline(), delay = 0, stagger = 0 } = {}) {
            const $refs = typeof refs === 'string' ? this.$refs[refs] : refs

            if ($refs) {
                const length = $refs.length || 0

                if (length === 0) {
                    timeline.add($refs[callbackName], delay)
                } else {
                    if (stagger < 0) {
                        delay -= (length - 1) * stagger
                    }

                    for (let i = 0; i < length; i++) {
                        const $ref = $refs[i]
                        timeline.add($ref[callbackName], delay + i * stagger)
                    }
                }
            }
        }
    }
}
