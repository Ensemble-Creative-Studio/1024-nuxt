<script setup>
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const { isMobile } = useDevice();

const sanity = useSanity();
const route = useRoute();
const router = useRouter();

const GET_SINGLE_PROJECT = groq`*[_type == "MAD"][0]
  {
    ...,
    relatedProjects[] -> {
      ...,
      categories[] -> {
        title,
        slug
      }
    },
    gallery[] {
      ...,
      images[] {
        ...,
        "assetRef": asset->{
          metadata,
          "url": url
        }
      },
    _type == "galleryVideo" => {
        "posterImageUrl": posterImage.asset->url
      }
    },
  }
`;


const { data } = await useAsyncData(`projects/${route.params.slug}`, () =>
  sanity.fetch(GET_SINGLE_PROJECT)
);
if (Object.keys(data.value).length === 0) {
  router.push("/404");
  throw createError({ statusCode: 404, statusMessage: "Project not found" });
}

const project = data.value;

const $hero = ref();
const $galleryMedia = ref([]);
const $anchors = ref();

const $projectPage = ref();
const trigger = ref();

const $description = ref();
const $gallery = ref();
const $credits = ref();

function scrollToSection(section) {
  let offset;

  if (section.classList.contains("hero")) {
    offset = isMobile ? 0 : 0;
  } else {
    offset = isMobile ? window.innerHeight - 100 : window.innerHeight - 100;
  }

  gsap.to(window, {
    scrollTo: {
      y: section.offsetTop + offset,
      autoKill: false,
    },
    duration: 1.5,
    ease: "power3.out",
  });
}

onMounted(() => {
  setTimeout(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 481px)", () => {
      trigger.value = ScrollTrigger.create({
        start: "50%",
        trigger: $hero.value,
        onEnter: () => {
          gsap.to($anchors.value.$el, {
            y: 0,
            duration: 0.5,
          });
        },
        onLeaveBack: () => {
          gsap.to($anchors.value.$el, {
            y: 50,
            duration: 0.5,
          });
        },
      });
    });
  }, 1000);

  window.addEventListener("resize", handleResize);
});

const handleResize = () => {
  if (trigger.value !== null) {
    trigger.value.refresh();
  }
};

onBeforeUnmount(() => {
  gsap.to($anchors.value.$el, {
    y: 50,
    duration: 0.5,
  });

  ScrollTrigger.getAll().forEach((trigger) => {
    trigger.kill();
  });

  removeEventListener("resize", handleResize);
});
</script>

<template>
  <div class="project-page" ref="$projectPage">
    <Head>
      <Title>{{ project.title }}</Title>
      <Meta name="description" content="Project description" />
    </Head>
    <section class="hero" ref="$hero">
      <video
        class="hero__video"
        v-if="project.mainVideoUrl"
        :src="project.mainVideoUrl"
        autoplay
        muted
        loop
        playsinline
        webkit-playsinline
      ></video>
      <SanityImage
        v-else
        class="hero__banner"
        :asset-id="project.mainImage.asset._ref"
        auto="format"
        :q="75"
      />
      <h1 class="hero__title">{{ project.title }}</h1>
    </section>
    <div class="main">
      <section class="content">
        <GridContainer>
          <div class="content__claim">
            {{ project.claim }}
          </div>
          <div class="content__details">
           
            <span class="content__type">{{ project.field }}</span>
          </div>
          <div
            class="content__description"
            ref="$description"
            v-if="project.description"
          >
            <SanityContent :blocks="project.description" />
          </div>
        </GridContainer>
      </section>
      <section class="gallery" ref="$gallery" v-if="project?.gallery">
        <GridContainer>
          <div class="gallery__title-container">
            <h2 class="gallery__title">Gallery</h2>
            <span class="gallery__counter">{{
              $galleryMedia ? $galleryMedia.length : ""
            }}</span>
          </div>
          <ul class="gallery__wrapper">
            <li
              :class="[
                item._type === 'galleryMedia'
                  ? 'item--media'
                  : item._type === 'galleryVideo'
                  ? 'item--video'
                  : 'item--text',
                'item',
              ]"
              v-if="project?.gallery"
              v-for="(item, index) in project?.gallery"
              :key="index"
            >
              <ul class="item__inner" v-if="item._type === 'galleryMedia'">
                <li
                  v-for="image in item.images"
                  ref="$galleryMedia"
                  :class="{
                    vertical:
                      image.assetRef.metadata.dimensions.aspectRatio < 1,
                  }"
                >
                  <div class="item__image">
                    <SanityImage :asset-id="image.asset._ref" auto="format" />
                  </div>
                </li>
              </ul>

              <div class="item__text" v-if="item._type === 'galleryText'">
                <SanityContent :blocks="item.text" />
              </div>
              <div class="item__video" v-if="item._type === 'galleryVideo'">
                <VideoPlayer
          :poster="item.posterImageUrl"

                  :vimeoUrl="item.url"
                  :downloadUrl="item.downloadUrl"
                  :quality="isMobile ? 'sd' : 'hd'"
                />
              </div>
            </li>
          </ul>
        </GridContainer>
      </section>
      <section class="credits" ref="$credits">
        <GridContainer>
          <header
            class="credits__header"
            :class="[!project.credits && 'credits__header--is-empty']"
          >
            <div>{{ project.title }}</div>
            <span>1024 architecture</span>
          </header>
          <ul class="credits__wrapper" v-if="project.credits">
            <li class="item" v-for="item in project?.credits?.list">
              <h3 class="item__label">{{ item.role }}</h3>
              <p class="item__text">
                {{ item.text }}
              </p>
            </li>
          </ul>
        </GridContainer>
      </section>
      <section class="related-projects" v-if="project.relatedProjects">
        <GridContainer>
          <h2 class="related-projects__title">Related projects</h2>
        </GridContainer>
        <ProjectsList
          :projects="project.relatedProjects ? project.relatedProjects : []"
        />
      </section>
      <BottomAnchors ref="$anchors">
        <ul class="BottomAnchors__list">
          <li class="BottomAnchors__item">
            <button @click="scrollToSection($hero)">Top</button>
          </li>
          <li class="BottomAnchors__item" v-if="project.description">
            <button @click="scrollToSection($description)">Description</button>
          </li>
          <li class="BottomAnchors__item">
            <button @click="scrollToSection($gallery)" v-if="project.gallery">
              Gallery
            </button>
          </li>
          <li class="BottomAnchors__item" v-if="project.credits">
            <button @click="scrollToSection($credits)">Credits</button>
          </li>
        </ul>
      </BottomAnchors>
    </div>
  </div>
</template>

<style lang="scss">
.project-page {
  position: relative;

  .hero {
    height: 100vh;
    position: relative;
    background-color: transparent;

    &__banner,
    &__video {
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      z-index: -1;
      object-fit: cover;
    }

    &__title {
      font-size: $desktop-h4;
      // font-weight: $extra-light;
      position: fixed;
      bottom: 1.5rem;
      left: 2rem;

      @include viewport-480 {
        font-size: $mobile-h2;
        left: 1rem;
        bottom: 6rem;
      }
    }
  }

  .main {
    background-color: $black;
    z-index: 10;
    position: relative;
  }
  .item__inner {
    display: flex;
    flex-direction: row; /* default flex-direction but making it explicit */
    flex-wrap: wrap; /* allows items to wrap to the next line */
    justify-content: center;
  }

  .item__inner li {
  }

  .item__inner li.vertical {
    display: flex;
    flex: 0 0 50%; /* flex-grow | flex-shrink | flex-basis */
    padding: 2rem;
    @include viewport-480 {
      padding: 1rem;
    }
  }
  .item__inner li.vertical:nth-child(1) {
margin-top:12rem;
    @include viewport-480 {
      padding: 1rem;
    }
  }

  .content {
    &__claim {
      grid-column: 2 / span 5;
      font-size: $desktop-h4;
      // font-weight: $extra-light;
      margin-top: 6rem;

      @include viewport-1200 {
        grid-column: 2 / span 8;
      }

      @include viewport-768 {
        grid-column: 1 / -1;
      }

      @include viewport-480 {
        font-size: $mobile-h4; // $mobile-h2 on Figma
        margin-top: 4rem;
      }
    }

    &__details {
      grid-column: 1 / -1;
      margin-top: 6rem;

      @include viewport-768 {
        grid-column: 2 / span 10;
      }
    }

    &__description {
      grid-column: 2 / span 5;

      @include viewport-1200 {
        grid-column: 2 / span 8;
      }

      @include viewport-480 {
        grid-column: 2 / -1;
        font-size: $mobile-text-read;
      }
    }

    &__type {
      margin-left: 1rem;
      text-decoration: underline;
      display: inline-block;
      text-decoration: underline;
      text-decoration: underline;
      text-decoration-thickness: from-font;
      text-underline-offset: 0.5rem;
    }

    &__description {
      margin-top: 6rem;

      a {
        display: inline-block;
        text-decoration: underline;
        text-decoration: underline;
        text-decoration-thickness: from-font;
        text-underline-offset: 0.5rem;
      }

      p {
        &:not(:first-child) {
          margin-top: 4rem;
        }
      }
    }
  }

  .gallery {
    margin-top: 12rem;

    &__title-container {
      grid-column: 1 / -1;
      display: flex;
      align-items: flex-start;
    }

    &__title {
      font-size: $desktop-h4;
      // font-weight: $extra-light;
      grid-column: 1 / -1;

      @include viewport-480 {
        font-size: $mobile-h4;
      }
    }

    &__counter {
      margin-left: 1rem;
      font-size: 2.6rem;
      color: $medium-grey;

      @include viewport-480 {
        transform: scale(0.7);
        transform-origin: top left;
      }
    }

    &__wrapper {
      grid-column: 1 / -1;
      @include grid(12, 1fr, 1, 0);
      margin-top: 6rem;

      .item {
        &--media,
        &--video {
          grid-column: 3 / span 8;

          @include viewport-768 {
            grid-column: 2 / span 10;
          }

          @include viewport-480 {
            grid-column: 1 / -1;
          }
        }

        &--text {
          grid-column: 2 / span 6;

          a {
            display: inline-block;
            text-decoration: underline;
            text-decoration: underline;
            text-decoration-thickness: from-font;
            text-underline-offset: 0.5rem;
          }

          @include viewport-480 {
            font-size: $mobile-text-read;
            grid-column: 2 / -1;
          }
        }

        &:not(:first-child) {
          margin-top: 12rem;

          @include viewport-480 {
            margin-top: 6rem;
          }
        }

        &__inner {
          li {
            &:not(:first-child) {
              margin-top: 12rem;

              @include viewport-768 {
                margin-top: 9rem;
              }

              @include viewport-480 {
                margin-top: 6rem;
              }
            }
          }
        }
      }
    }
  }

  .credits {
    margin-top: 9rem;
    padding-bottom: 9rem;

    @include viewport-480 {
      font-size: $mobile-text-read;
      margin-top: 6rem;
      padding-bottom: 0;
    }

    &__header {
      grid-column: 2 / -1;

      &--is-empty {
        padding-bottom: 6rem;

        @include viewport-480 {
          padding-bottom: 12rem;
        }
      }

      @include viewport-480 {
        grid-column: 1 / -1;
      }
    }

    &__wrapper {
      grid-column: 3 / span 9;
      @include grid(9, 1fr, 1, 3);
      margin-top: 6rem;

      @include viewport-768 {
        @include grid(10, 1fr, 1, 3);
        grid-column: 2 / span 10;
      }

      @include viewport-480 {
        grid-column: 2 / span 10;
        @include grid(12, 1fr, 1, 0);
      }

      .item {
        grid-column: auto / span 3;
        @include grid(3, 1fr, 1, 0);

        @include viewport-768 {
          grid-column: auto / span 5;
        }

        @include viewport-480 {
          grid-column: 1 / -1;

          &:not(:first-child) {
            margin-top: 3rem;
          }
        }

        &__label {
          color: $medium-grey;
          grid-column: 1 / span 2;

          @include viewport-480 {
            grid-column: 1 / -1;
          }
        }

        &__text {
          grid-column: 1 / span 2;

          @include viewport-480 {
            grid-column: 1 / -1;
          }
        }
      }
    }
  }

  .related-projects {
    margin-top: 6rem;

    &__title {
      grid-column: 1 / -1;
      font-size: $desktop-h4;
      // font-weight: $extra-light;

      @include viewport-480 {
        font-size: $mobile-h2;
      }
    }

    .ProjectsList {
      margin-top: 6rem;
    }
  }
}
</style>
