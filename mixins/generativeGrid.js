import { randomInt, randomFloat, randomBoolean } from 'utils/math'
import MouseManager from 'utils/MouseManager'

import resizeMixin from 'mixins/resize'
import rafMixin from 'mixins/raf'
import animationMixin from 'mixins/animation'
import layoutMixin from 'mixins/layout'

export default {
    mixins: [resizeMixin, rafMixin, animationMixin, layoutMixin],

    props: {
        'type': { type: String, required: true },
        'items': { type: Array, required: true },
        'active': { type: Boolean, default: true },
        'mouseAnimated': { type: Boolean, default: true },
        'inAnimation': { type: String, default: 'scale' }
    },

    data () {
        return {
            isInit: false,
            isAnimated: true,
            els: [],
            height: 0,
            inactiveTime: 0,
            iddleStart: 2000,
            transform: {
                mouse: {
                    target: {
                        x: 0,
                        y: 0
                    }
                }
            },
            gridLayout: 'desktop',
            grid: {
                columnNumber: 12,
                gutterSize: 0,
                columnSize: 0 
            },
            sizes:  {
                desktop: {
                    s: {
                        id: 's',
                        column: 4,
                        weight: 2
                    },
                    m: {
                        id: 'm',
                        column: 5,
                        weight: 9
                    },
                    l: {
                        id: 'l',
                        column: 6,
                        weight: 4
                    }
                },
                mobile: {
                    s: {
                        id: 's',
                        column: 7,
                        weight: 2
                    },
                    m: {
                        id: 'm',
                        column: 8,
                        weight: 9
                    },
                    l: {
                        id: 'l',
                        column: 9,
                        weight: 4
                    }
                }
            },
            sizesPool: {
                desktop: [],
                mobile: []
            }
        }
    },
    
    watch: {
        gridLayout () {
            this.checkLayout()
        }
    },

    mounted () {
        this.grid.columnSize = (window.innerWidth - (this.grid.gutterSize * 2)) / this.grid.columnNumber

        this.initElements()
        this.checkLayout()
    },

    created () {
    },

    beforeDestroy () {
        this.unbind()
    },

    methods: {
        animateIn (animated = true) {
            this.animateInTl = gsap.timeline()

            const $inViewItems = []
            const $outViewItems = []

            for (let i = 0, j = this.$refs.items.length; i < j; i++) {
                const $item = this.$refs.items[i]
                if ($item.$refs.thumbnail.scrollState.inView === true) {
                    $inViewItems.push($item)
                } else {
                    $outViewItems.push($item)
                }
            }

            if (animated === true) {
                this.addRefsToTl($inViewItems, 'animateIn', { timeline: this.animateInTl, delay: 0, stagger: 0.15 }, 0)
                this.addRefsToTl($outViewItems, 'animateIn', { timeline: this.animateInTl, delay: 0 }, 0)
            } else {
                for (let i = 0, j = this.$refs.items.length; i < j; i++) {
                    const $item = this.$refs.items[i]

                    // console.log($item, 'ITEM')
                    
                    $item.animateIn(false)
                }
            }
        },

        animateOut () {
            this.animateOutTl = gsap.timeline()

            const $inViewItems = []
            const $outViewItems = []

            for (let i = 0, j = this.$refs.items.length; i < j; i++) {
                const $item = this.$refs.items[i]
                if ($item.$refs.thumbnail.scrollState.inView === true) {
                    $inViewItems.push($item)
                } else {
                    $outViewItems.push($item)
                }
            }

            this.addRefsToTl($inViewItems, 'animateOut', { timeline: this.animateOutTl, delay: 0, stagger: 0.07 }, 0)
            this.addRefsToTl($outViewItems, 'animateOut', { timeline: this.animateOutTl, delay: 0 }, 0)
        },

        initElements () {        
            // config
            for (const el in this.sizes.desktop) {
                const size = this.sizes.desktop[el]

                for (let i = 0, j = size.weight; i < j; i++) {
                    this.sizesPool.desktop.push(size.id)
                }
            }  

            for (const el in this.sizes.mobile) {
                const size = this.sizes.mobile[el]

                for (let i = 0, j = size.weight; i < j; i++) {
                    this.sizesPool.mobile.push(size.id)
                }
            } 

            for (let i = 0, j = this.items.length; i < j; i++) {
                const previousEl = this.els.length > 0 ? this.els[this.els.length - 1] : null
                const penultimateEl = this.els.length > 1 ? this.els[this.els.length - 2] : null

                const el = {}
                el.$el = this.$refs.items[i].$el
                el.el = this.$refs.items[i]

                el.thumbnail = el.el.$refs.thumbnail
                el.$thumbnail = el.el.$refs.thumbnail.$el

                el.transform = { 
                    x: 0,
                    y: 0,
                    ease: this.getEase(previousEl, penultimateEl)
                }

                if (previousEl !== null) {
                    el.autoPlay = previousEl.autoPlay === false ? true : randomBoolean(0.2)
                } else {
                    el.autoPlay = true
                }
                
                el.data = this.items[i]
                el.layout = this.getElementLayout(el, previousEl, penultimateEl)

                this.els.push(el)
            }

            this.isInit = true
        },

        checkLayout () {
            if (this.gridLayout === 'desktop') {
                this.bind()
            } else {
                this.unbind()
            }
        },

        bind () {
            if (this.mouseAnimated === true) {
                MouseManager.on('move', this.onMouseMove)
            }
            this.isAnimated = true
        },

        unbind () {
            if (this.mouseAnimated === true) {
                MouseManager.off('move', this.onMouseMove)
            }
            
            this.isAnimated = false

            for (let i = 0, j = this.els.length; i < j; i++) {
                const el = this.els[i]
                el.$thumbnail.style.transform = ''
            }
        },

        onMouseMove (event) {
            if (this.isAnimated === true && this.active === true) {
                const centerX = this.window.width / 2
                const centerY = this.window.height / 2

                this.transform.mouse.target.x = ((MouseManager.mouse.x - centerX) / centerX) * 200 * -1
                this.transform.mouse.target.y = ((MouseManager.mouse.y -centerY) / centerY) * 200 * -1
            }
        },

        update (delta, time) {
            // this.inactiveTime += delta
            
            if (this.isAnimated === true && this.active === true) {
                for (let i = 0, j = this.els.length; i < j; i++) {
                    const el = this.els[i]

                    const iddleX = this.mouseAnimated === true ? Math.cos(time) * 500 : 0
                    const iddleY = this.mouseAnimated === true ? Math.sin(time) * 300 : 0

                    el.transform.x += ((this.transform.mouse.target.x + (iddleX * el.transform.ease) - el.transform.x) * el.transform.ease)
                    el.transform.y += ((this.transform.mouse.target.y + (iddleY * el.transform.ease) - el.transform.y) * el.transform.ease)

                    if (el.thumbnail.scrollState.inView === true || el.thumbnail.scrollState.almostInView === true) {
                        el.$thumbnail.style.transform = `translate3d(${ el.transform.x.toFixed(2) }px, ${ el.transform.y.toFixed(2) }px, 0)`
                    }
                }
            }
        },

        getElementLayout (el, previousEl, penultimateEl) {
        },

        getSizeFromSizePool (max = 0, layout = 'desktop') {
            const size = this.sizesPool[layout][randomInt(0, this.sizesPool[layout].length - 1)]

            if (max > 0 && this.sizes[layout][size].column > max) {
                return this.getSizeFromSizePool(max, layout)
            } else {
                return this.sizes[layout][size].column
            }
        },

        getEase (previousEl, penultimateEl) {
            const ease = randomFloat(0.05, 0.1, 3)

            if (penultimateEl !== null) {
                if (Math.abs(penultimateEl.transform.ease - ease) < 0.02) {
                    return this.getEase(previousEl, penultimateEl)
                }
            } else if (previousEl !== null) {
                if (Math.abs(previousEl.transform.ease - ease) < 0.02) {
                    return this.getEase(previousEl, penultimateEl)
                }
            }

            return ease
        }
    }
}
