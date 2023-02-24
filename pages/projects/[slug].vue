<script setup>
const sanity = useSanity()
const route = useRoute()

const GET_SINGLE_PROJECT = groq`*[_type == "projects" && slug.current == "${route.params.slug}"][0]
  {
    ...,
    relatedProjects[] -> {
      title,
      slug,
      releaseDate,
      mainImage,
      mainVideo,
      categories[] -> {
        title,
        slug
      }
    }
  }
`
const { data } = await useAsyncData(`projects/${route.params.slug}`, () =>
  sanity.fetch(GET_SINGLE_PROJECT)
)
const project = data._rawValue

const $galleryMedia = ref([])
</script>

<template>
  <div class="project-page">
    <Head>
      <Title>{{ project.title }}</Title>
      <Meta name="description" content="Project description" />
    </Head>
    <section class="hero">
      <SanityImage
        class="hero__thumbnail"
        v-if="!project.mainVideo"
        :asset-id="project.mainImage.asset._ref"
        auto="format"
        :q="75"
      />
      <video class="hero__video" v-if="project.mainVideo" src=""></video>
      <h1 class="hero__title">{{ project.title }}</h1>
    </section>
    <main class="main">
      <section class="content">
        <GridContainer>
          <div class="content__claim">
            {{ project.claim }}
          </div>
          <div class="content__details">
            <span class="content__date">{{
              project.releaseDate.slice(0, 4)
            }}</span>
            <span class="content__type">{{ project.field }}</span>
          </div>
          <div class="content__description">
            <SanityContent
              :blocks="project.description"
              :serializers="serializers"
            />
          </div>
        </GridContainer>
      </section>
      <section class="gallery">
        <GridContainer>
          <div class="gallery__title-container">
            <h2 class="gallery__title">Gallery</h2>
            <span class="gallery__counter">{{ $galleryMedia.length }}</span>
          </div>
          <ul class="gallery__wrapper">
            <li
              :class="[
                item._type === 'galleryMedia' ? 'item--media' : 'item--text',
                'item',
              ]"
              v-if="project?.gallery"
              v-for="(item, index) in project?.gallery"
              :key="index"
            >
              <ul class="item__inner" v-if="item._type === 'galleryMedia'">
                <li v-for="image in item.images" ref="$galleryMedia">
                  <div class="item__image">
                    <SanityImage :asset-id="image.asset._ref" auto="format" />
                  </div>
                </li>
              </ul>
              <p class="item__text" v-if="item._type === 'galleryText'">
                {{ item.text }}
              </p>
              <div class="item__video"></div>
            </li>
          </ul>
        </GridContainer>
      </section>
      <section class="credits">
        <GridContainer>
          <header class="credits__header">
            <div>{{ project.title }}</div>
            <span>1024 architecture</span>
          </header>
          <ul class="credits__wrapper">
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
        <ProjectsList :projects="project.relatedProjects" />
      </section>
      <BottomAnchors>
        <ul class="BottomAnchors__list">
          <li class="BottomAnchors__item">
            <button ref="$top">Top</button>
          </li>
          <li class="BottomAnchors__item">
            <button ref="$description">Description</button>
          </li>
          <li class="BottomAnchors__item">
            <button ref="$gallery">Gallery</button>
          </li>
          <li class="BottomAnchors__item">
            <button ref="$credits">Credits</button>
          </li>
        </ul>
      </BottomAnchors>
    </main>
  </div>
</template>

<style lang="scss">
.project-page {
  position: relative;

  .hero {
    height: 100vh;
    position: relative;
    background-color: transparent;

    &__thumbnail,
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
      font-size: $main-text-size;
      font-weight: $extra-light;
      position: fixed;
      bottom: 1.5rem;
      left: 2rem;

      @include viewport-375 {
        font-size: $mobile-main-text-size;
        left: 1rem;
        bottom: 6rem;
      }
    }
  }

  .main {
    background-color: $black;
    padding-bottom: 5rem;
    z-index: 10;
    position: relative;
  }

  .content {
    &__claim {
      grid-column: 2 / span 5;
      font-size: $main-text-size;
      font-weight: $extra-light;
      margin-top: 6rem;

      @include viewport-375 {
        font-size: $mobile-main-text-size;
        grid-column: 1 / -1;
      }
    }

    &__description {
      grid-column: 2 / span 5;

      @include viewport-375 {
        grid-column: 2 / -1;
        font-size: $mobile-paragraph-text-size;
      }
    }

    &__details {
      grid-column: 1 / -1;
      margin-top: 6rem;
    }

    &__type {
      margin-left: 1rem;
      text-decoration: underline;
    }

    &__description {
      margin-top: 6rem;

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
      font-size: $main-text-size;
      font-weight: $extra-light;
      grid-column: 1 / -1;

      @include viewport-375 {
        font-size: $mobile-main-text-size;
      }
    }

    &__counter {
      margin-left: 1rem;
      font-size: 2.6rem;
      color: $medium-grey;

      @include viewport-375 {
        transform: scale(0.7);
        transform-origin: top left;
      }
    }

    &__wrapper {
      grid-column: 1 / -1;
      @include grid(12, 1fr, 1, 0);
      margin-top: 6rem;

      .item {
        &--media {
          grid-column: 3 / span 8;

          @include viewport-375 {
            grid-column: 1 / -1;
          }
        }

        &--text {
          grid-column: 2 / span 6;

          @include viewport-375 {
            font-size: $mobile-paragraph-text-size;
            grid-column: 2 / -1;
          }
        }

        &:not(:first-child) {
          margin-top: 12rem;
        }

        &__inner {
          li {
            &:not(:first-child) {
              margin-top: 12rem;
            }
          }
        }
      }
    }
  }

  .credits {
    margin-top: 9rem;
    padding-bottom: 9rem;

    @include viewport-375 {
      font-size: $mobile-secondary-text-size;
    }

    &__header {
      grid-column: 2 / -1;

      @include viewport-375 {
        grid-column: 1 / -1;
      }
    }

    &__wrapper {
      grid-column: 3 / span 9;
      @include grid(9, 1fr, 1, 3);
      margin-top: 6rem;

      @include viewport-375 {
        grid-column: 2 / span 10;
        @include grid(12, 1fr, 1, 0);
      }

      .item {
        grid-column: auto / span 3;
        @include grid(3, 1fr, 1, 0);

        @include viewport-375 {
          grid-column: 1 / -1;

          &:not(:first-child) {
            margin-top: 3rem;
          }
        }

        &__label {
          color: $medium-grey;
          grid-column: 1 / span 2;

          @include viewport-375 {
            grid-column: 1 / -1;
          }
        }

        &__text {
          grid-column: 1 / span 2;

          @include viewport-375 {
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
      font-size: $main-text-size;
      font-weight: $extra-light;

      @include viewport-375 {
        font-size: $mobile-main-text-size;
      }
    }

    .ProjectsList {
      margin-top: 6rem;
    }
  }
}
</style>
