<script setup>
const sanity = useSanity()
const route = useRoute()

const GET_SINGLE_ARTICLE = groq`*[_type == "blog" && slug.current == "${route.params.slug}"][0]
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

const { data } = await useAsyncData(`blog/${route.params.slug}`, () =>
  sanity.fetch(GET_SINGLE_ARTICLE)
)
const article = data._rawValue

const serializers = {
  marks: {
    internalLink: 'a',
  },
}

const { isMobile } = useDevice()
</script>

<template>
  <div class="article-page">
    <Head>
      <Title>{{ article.title }}</Title>
      <Meta name="description" content="Project description" />
    </Head>
    <main class="main">
      <GridContainer>
        <section class="infos">
          <GoBackButton />
          <div class="infos__meta">
            <h1 class="infos__title">{{ article.title }}</h1>
            <p class="infos__excerpt">{{ article.excerpt }}</p>
          </div>
        </section>
        <section class="content">
          <VideoPlayer
            class="video"
            v-if="article.mainVideo"
            :vimeoId="article.mainVideoUrl"
            :quality="isMobile ? 'sd' : 'hd'"
          />
          <div class="content__gallery" v-if="article?.gallery?.medias">
            <SanityImage
              class="image"
              v-for="media in article?.gallery?.medias"
              :asset-id="media.asset._ref"
              auto="format"
              :q="75"
            />
          </div>
        </section>
      </GridContainer>
    </main>
  </div>
</template>

<style lang="scss">
.article-page {
  .main {
    position: relative;
    margin-top: 12rem;

    .infos {
      grid-column: 1 / span 3;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      height: calc(100vh - 12rem);
      position: sticky;
      padding-bottom: 2rem;
      top: 12rem;

      @include viewport-375 {
        grid-column: 1 / -1;
        position: relative;
        top: 0;
        height: auto;
        padding-bottom: 0;
      }

      &__meta {
        @include viewport-375 {
          @include grid(12, 1fr, 1, 0);
        }
      }

      &__title {
        text-decoration: underline;
        text-decoration-thickness: from-font;
        text-underline-offset: 0.5rem;

        @include viewport-375 {
          grid-column: 1 / -1;
        }
      }

      &__excerpt {
        margin-top: 1rem;

        @include viewport-375 {
          margin-top: 2rem;
          grid-column: 2 / span 10;
        }
      }
    }

    .content {
      grid-column: 4 / -1;

      @include viewport-375 {
        grid-column: 1 / -1;
      }

      &__gallery {
        .image {
          &:first-child {
            @include viewport-375 {
              margin-top: 6rem;
            }
          } 

          &:not(:first-child) {
            margin-top: 12rem;

            @include viewport-375 {
              margin-top: 6rem;
            }
          }
        }
      }
    }
  }
}
</style>
