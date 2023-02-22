import resizeMixin from 'mixins/resize'
import layoutMixin from 'mixins/layout'
import rafMixin from 'mixins/raf'
import animationMixin from 'mixins/animation'

export default {
    mixins: [resizeMixin, layoutMixin, rafMixin, animationMixin],

    data () {        
        return {
            meta: {
                title : process.env.TITLE,
                description: process.env.DESCRIPTION,
                robots: 'index, follow'
            },
            theme: ''
        }
    },

    head () {        
        return {
            title: this.meta.title,
            meta: [
                { hid: 'og:title',            property: 'og:title',        content: this.meta.title },
                { hid: 'twitter:title',       name: 'twitter:title',       content: this.meta.title },
                { hid: 'description',         name: 'description',         content: this.meta.description },
                { hid: 'og:description',      property: 'og:description',  content: this.meta.description },
                { hid: 'twitter:description', name: 'twitter:description', content: this.meta.description },

                { hid: 'robots', name: 'robots', content: this.meta.robots }
            ],

            bodyAttrs: {
                class: [`theme-${ this.theme }`]
            }
        }
    },

    created () {
    },

    mounted () {
        this.$page = this.$refs.page

        this.$store.commit('themes/update', { theme: this.theme })

        this.animateIn()
    },

    beforeDestroy () {
    },

    beforeRouteUpdate (to, from, next) {
        this.animateOut(next)
    },

    beforeRouteLeave (to, from, next) {
        this.animateOut(next)
    },

    watch: {
        theme () {
            this.$store.commit('themes/update', { theme: this.theme })

            const { backgroundColor, color } = this.$store.state.themes.colors[this.theme]

            gsap.to(this.$el, { 
                duration: 0.2,
                backgroundColor: this.$styles[backgroundColor],
                color: this.$styles[color],
                clearProps: 'backgroundColor,color',
                ease: 'power2'
            })
        }
    },

    methods: {
        initAnimateIn () {
            gsap.set(this.$el, { autoAlpha: 0 })
        },

        animateIn (done) {
            this.animateInTl = gsap.timeline()
            this.animateInTl.to(this.$el, { duration: 0.4, autoAlpha: 1, ease: 'sine' }, 0)
            this.animateInTl.add(done, 0.4)
        },

        animateOut (done) {
            this.animateOutTl = gsap.timeline()
            this.animateOutTl.to(this.$el, { duration: 0.3, autoAlpha: 0, ease: 'sine.inOut' }, 0)
            this.animateOutTl.add(done, 0.3)
        },

        // onResize (width, height) {},

        // onLayoutChange (layout) {},

        // update (delta, time) {}
    }
}