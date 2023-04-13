<script setup>
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const isNavActive = useState('isNavActive')

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
const $index = ref()

const tl = gsap.timeline()

onMounted(() => {
  $ctx.value = gsap.context((self) => {
    const chunks = self.selector('.title__chunk')

    for (let i = chunks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[chunks[i], chunks[j]] = [chunks[j], chunks[i]]
    }

    tl.to(chunks, {
      delay: 0.5,
      duration: 1,
      autoAlpha: 1,
      ease: 'power2.out',
      stagger: 0.03,
    })
      .to(chunks, {
        duration: 0.05,
        autoAlpha: 0,
        ease: 'power3.out',
      })
      .to(chunks, {
        duration: 0.1,
        autoAlpha: 1,
        ease: 'power3.out',
      })
      .to(chunks, {
        duration: 0.1,
        autoAlpha: 0,
        ease: 'power3.out',
      })
      .to(chunks, {
        delay: 0.25,
        duration: 0.2,
        autoAlpha: 1,
        ease: 'power3.out',
      })

    const panels = self.selector('.FeaturedProject')
    const panelTitles = self.selector('.FeaturedProject__title')

    // REFACTOR
    setTimeout(() => {
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          pin: true,
          pinSpacing: false,
          id: `pin-${i}`,
          onUpdate: (self) => {
            if (self.progress > 0.5) {
              panel.classList.add('off')
            } else {
              panel.classList.remove('off')
            }
          },
        })

        ScrollTrigger.create({
          trigger: panel,
          top: '100% 100%',
          id: `title-${i}`,
          onEnter: () => {
            panelTitles[i].classList.add('FeaturedProject__title--active')
          },
          onLeave: () => {
            panelTitles[i].classList.remove('FeaturedProject__title--active')
          },
          onEnterBack: () => {
            panelTitles[i].classList.add('FeaturedProject__title--active')
          },
          onLeaveBack: () => {
            panelTitles[i].classList.remove('FeaturedProject__title--active')
          },
        })
      })
    }, 1000)
  }, $index.value)
})

const $title = home.baseline

const splitTitle = computed(() => {
  return $title.split(' ')
})

onBeforeUnmount(() => {
  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill()
  })

  $ctx.value.revert()
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
        class="FeaturedProject"
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
.index {
  .hero {
    height: 100vh;
    padding-top: 30rem;
    position: fixed;
    top: 0;
    left: 0;

    @include viewport-375 {
      height: auto;
      padding-top: 15rem;
    }

    .title {
      grid-column: 2 / span 8;
      font-size: $desktop-h2;
      font-weight: $extra-light;
      position: sticky;
      bottom: 50%;

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
    margin-top: calc(100vh);

    @include viewport-375 {
      margin-top: calc(100vh + 6rem); // TODO
    }

    .FeaturedProject {
      height: 120vh;
      position: relative;
      transition: filter 0.5s ease;

      &.off {
        filter: invert(1) grayscale(1);
      }

      @include viewport-375 {
        margin-top: 0;
      }

      &__footer {
        display: flex;
        position: sticky;
        padding: 2rem;
        width: 100%;
        left: 0;
        bottom: 0;

        @include viewport-375 {
          font-size: $mobile-h2;
          left: 1rem;
          bottom: 1rem;
        }
      }

      &__title {
        font-size: $desktop-h2;
        font-weight: $extra-light;
        opacity: 0;
        transform: translateY(10rem);
        transition: 1s cubic-bezier(0.16, 1, 0.3, 1);
        transition-property: opacity, transform;

        &--active {
          opacity: 1;
          transform: translateY(0);
        }
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
  }
}
</style>
