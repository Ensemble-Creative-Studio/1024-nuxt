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
            <span class="content__type">Audio visual installation</span>
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
          <h2 class="gallery__title">Gallery</h2>
          <ul class="gallery__wrapper">
            <li
              class="item"
              v-if="project?.gallery?.medias"
              v-for="(item, index) in project?.gallery?.medias"
              :key="index"
            >
              <div class="item__image">
                <SanityImage :asset-id="item.asset._ref" auto="format" />
              </div>
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
      position: absolute;
      bottom: 1.5rem;
      left: 2rem;
    }
  }

  .main {
    background-color: $black;
    padding-bottom: 5rem;
  }

  .content {
    &__claim {
      font-size: $main-text-size;
      font-weight: $extra-light;
      margin-top: 6rem;
    }

    &__claim,
    &__description {
      grid-column: 2 / span 5;
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
        margin-top: 4rem;
      }
    }
  }

  .gallery {
    margin-top: 6rem;

    &__title {
      font-size: $main-text-size;
      grid-column: 1 / -1;
    }

    &__wrapper {
      grid-column: 1 / -1;
      @include grid(12, 1fr, 1, 0);
      margin-top: 6rem;

      .item {
        grid-column: 3 / span 8;

        &:not(:first-child) {
          margin-top: 12rem;
        }
      }
    }
  }

  .credits {
    margin-top: 9rem;
    padding-bottom: 9rem;

    &__header {
      grid-column: 2 / -1;
    }

    &__wrapper {
      grid-column: 3 / span 9;
      @include grid(9, 1fr, 1, 3);
      margin-top: 6rem;

      .item {
        grid-column: auto / span 3;
        @include grid(3, 1fr, 1, 0);

        &__label {
          color: $medium-grey;
          grid-column: 1 / span 2;
        }

        &__text {
          grid-column: 1 / span 2;
        }
      }
    }
  }

  .related-projects {
    margin-top: 6rem;

    &__title {
      grid-column: 1 / -1;
      font-size: $main-text-size;
    }

    .ProjectsList {
      margin-top: 6rem;
    }
  }
}
</style>
