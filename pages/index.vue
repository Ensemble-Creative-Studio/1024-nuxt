<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const query = groq`*[_type == "home"][0]
  {
    ...,
    featuredProjects[] -> {
      ...,
      categories[] -> {
        title,
        slug
      }
    }
  }
`
const sanity = useSanity()
const { data } = await useAsyncData('home', () => sanity.fetch(query))
const home = data.value

// Animations
const $ctx = ref()
const $tl = ref()
const $index = ref()

onMounted(() => {
  $ctx.value = gsap.context((self) => {
    const chunks = self.selector('.title__chunk')

    for (let i = chunks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[chunks[i], chunks[j]] = [chunks[j], chunks[i]]
    }

    $tl.value = gsap.to(chunks, {
      delay: 1,
      duration: 1,
      autoAlpha: 1,
      ease: 'power2.out',
      stagger: 0.07,
    })

    const panels = self.selector('.panel')

    panels.forEach((panel, i) => {
      let prevPanel

      ScrollTrigger.create({
        markers: true,
        trigger: panel,
        pin: true,
        pinSpacing: false,
        id: `pin-${i}`,
        onUpdate: (self) => {
          // Check if scrolling reaches 80% of the panel's height
          if (self.progress > 0.8) {
            panel.classList.add('off')
            console.log('adding the class')
          } else {
            panel.classList.remove('off')
            console.log('removing the class')
          }
        },
      })
    })
  }, $index.value)

  // const $featuredProjects = ref(null)
  // const wrapper = $featuredProjects.value.$el

  // ScrollTrigger.create({
  //   snap: 1 / items.length,
  // })
})

const $title = home.baseline

const splitTitle = computed(() => {
  return $title.split(' ')
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
})
</script>

<template>
  <div class="index" ref="$index">
    <Head>
      <Title>1024</Title>
      <Meta name="description" content="1024 architecture website" />
    </Head>
    <section class="hero">
      <GridContainer>
        <h1 class="title">
          <span class="title__chunk" v-for="(word, index) in splitTitle" :key="index">
            {{ word }}{{ index !== splitTitle.length - 1 ? ' ' : '' }}
          </span>
        </h1>
      </GridContainer>
    </section>
    <section class="test">
      <div :class="['panel', `panel-${i}`]" ref="$panel" v-for="(n, i) in 5">
        PANEL {{ i }}
        <footer class="footer">PROJECT TITLE OF PANEL {{ i }}</footer>
      </div>
    </section>
    <!-- <FeaturedProjects ref="$featuredProjects" :projects="home.featuredProjects" /> -->
  </div>
</template>

<style lang="scss" scoped>
.test {
  margin-top: -2rem;

  .panel {
    color: black;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 120vh;
    transition: background-color 0.5s ease;

    &.off {
      background-color: pink;
    }

    .footer {
      position: absolute;
      left: 0;
      bottom: 20vh;
      background-color: black;
      width: 100%;
      color: white;
      padding: 4rem 2rem;
    }

    &-0 {
      background-color: red;
    }

    &-1 {
      background-color: blue;
    }

    &-2 {
      background-color: green;
    }

    &-3 {
      background-color: yellow;
    }

    &-4 {
      background-color: orange;
    }
  }
}

.index {
  .hero {
    height: 100vh;
    padding-top: 30rem;

    @include viewport-375 {
      height: auto;
      padding-top: 15rem;
    }

    .title {
      grid-column: 2 / span 8;
      font-size: $desktop-h2;
      font-weight: $extra-light;

      &__chunk {
        opacity: 0;

        &:first-child {
          margin-left: 0;
        }
      }

      @include viewport-1200 {
        grid-column: 1 / -1;
      }

      @include viewport-992 {
        font-size: 4rem;
      }

      @include viewport-375 {
        grid-column: 1 / span 10;
        font-size: $mobile-h4;
      }
    }
  }

  .FeaturedProjects {
    @include viewport-375 {
      margin-top: 6rem;
    }
  }
}
</style>
