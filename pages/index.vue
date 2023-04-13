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
      delay: Math.random() * (1.5 - 0.5) + 0.5,
      duration: Math.random() * (1.5 - 0.5) + 0.5,
      autoAlpha: 1,
      ease: 'power3.out',
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
          if (self.progress > 0.7) {
            panel.classList.add('off')
          } else {
            panel.classList.remove('off')
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
    <div class="FeaturedProjects">
      <NuxtLink
        v-for="(project, i) in home.featuredProjects"
        :key="project._id"
        :class="['panel', 'FeaturedProject', `panel-${i}`]"
        :to="{
          name: 'projects-slug',
          params: { slug: project.slug.current },
        }"
      >
        <div class="FeaturedProject__thumbnail">
          <video
            v-if="project.mainVideoUrl"
            :src="project.mainVideoUrl"
            autoplay
            muted
            loop
            playsinline
            webkit-playsinline
          ></video>
          <SanityImage
            class="FeaturedProject__thumbnail"
            v-else
            :asset-id="project.mainImage.asset._ref"
            auto="format"
            :q="75"
          />
        </div>
        <footer class="FeaturedProject__footer">
          <h2 class="FeaturedProject__title">{{ project.title }}</h2>
        </footer>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.FeaturedProjects {
  margin-top: -2rem;

  .FeaturedProject {
    height: 120vh;
    position: relative;

    @include viewport-375 {
      margin-top: 0;
    }

    &__footer {
      display: flex;
      position: absolute;
      padding: 2rem;
      width: 100%;
      left: 0;
      bottom: 20vh;

      @include viewport-375 {
        font-size: $mobile-h2;
        left: 1rem;
        bottom: 1rem;
      }
    }

    &__title {
      font-size: $desktop-h2;
      font-weight: $extra-light;
    }

    &__thumbnail {
      height: 100%;

      img,
      video {
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .panel {
    transition: filter 0.5s ease;
    background-color: $white;

    &.off {
      filter: invert(1) grayscale(1);
    }
  }
}

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
