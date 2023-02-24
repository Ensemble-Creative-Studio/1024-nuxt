<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'

const query = groq`*[_type == "about"][0]`

const sanity = useSanity()
const { data } = await useAsyncData('about', () => sanity.fetch(query))
const about = data._rawValue

// const onSwiper = (swiper) => {
//   console.log(swiper)
// }
// const onSlideChange = () => {
//   console.log('slide change')
// }

const { isMobile } = useDevice();
</script>

<template>
  <div class="about">
    <Head>
      <Title>1024 | About</Title>
      <Meta name="description" content="About page description" />
    </Head>
    <section class="hero">
      <GridContainer>
        <h1 class="title">
          {{ about.introduction }}
        </h1>
      </GridContainer>
    </section>
    <section class="slider">
      <Swiper :slides-per-view="isMobile ? 1.1 : 2.5" :space-between="10" :grab-cursor="true">
        <SwiperSlide v-for="item in about.gallery.medias">
          <SanityImage
            :asset-id="item.asset._ref"
            auto="format"
            :q="75"
            :key="item._id"
          />
        </SwiperSlide>
      </Swiper>
    </section>
    <section class="description">
      <GridContainer>
        <p>{{ about.description }}</p>
      </GridContainer>
    </section>
    <section class="marquee">
      <span>{{ about.marqueeText }}</span>
    </section>
    <section class="history">
      <GridContainer>
        <p>
          {{ about.history }}
        </p>
      </GridContainer>
    </section>
    <section class="team">
      <ul class="team__wrapper">
        <li class="item" v-for="item in about.teamMembers">
          <div class="item__image">
            <SanityImage
              class="item__thumbnail"
              :asset-id="item.photo.asset._ref"
              auto="format"
              :q="75"
            />
          </div>
          <div class="item__meta">
            <h3 class="item__name">{{ item.name }}</h3>
            <div class="item__roles">
              <p>{{ item.roles }}</p>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <section class="conclusion">
      <GridContainer>
        <p>
          {{ about.conclusion }}
        </p>
      </GridContainer>
    </section>
    <section class="exhibitions">
      <GridContainer>
        <h2 class="exhibitions__title">Exhibitions</h2>
      </GridContainer>
      <ul class="exhibitions__list">
        <li class="item" v-for="item in about.exhibitions">
          <div class="item__container">
            <div class="item__date">{{ item.date?.slice(0, 4) }}</div>
            <h3 class="item__title">{{ item.title }}</h3>
            <p class="item__localization">
              {{ item.localization }}
            </p>
          </div>
        </li>
      </ul>
    </section>
    <section class="awards">
      <GridContainer>
        <h2 class="awards__title">Awards</h2>
      </GridContainer>
      <ul class="awards__list">
        <li class="item" v-for="item in about.awards">
          <div class="item__container">
            <div class="item__date">{{ item.date?.slice(0, 4) }}</div>
            <h3 class="item__title">{{ item.title }}</h3>
            <p class="item__localization">
              {{ item.localization }}
            </p>
          </div>
        </li>
      </ul>
    </section>
    <section class="festivals">
      <GridContainer>
        <h2 class="festivals__title">Festivals</h2>
      </GridContainer>
      <ul class="festivals__list">
        <li class="item" v-for="item in about.festivals">
          <div class="item__container">
            <div class="item__date">{{ item.date?.slice(0, 4) }}</div>
            <h3 class="item__title">{{ item.title }}</h3>
            <p class="item__localization">
              {{ item.localization }}
            </p>
          </div>
        </li>
      </ul>
    </section>
    <BottomAnchors>
      <ul class="BottomAnchors__list" ref="$anchors">
        <li class="BottomAnchors__item">
          <button ref="$about">About</button>
        </li>
        <li class="BottomAnchors__item">
          <button ref="$awards">Awards</button>
        </li>
        <li class="BottomAnchors__item">
          <button ref="$exhibitions">Exhibitions</button>
        </li>
        <li class="BottomAnchors__item">
          <button ref="$festivals">Festivals</button>
        </li>
      </ul>
    </BottomAnchors>
  </div>
</template>

<style lang="scss" scoped>
.about {
  height: 100vh;
  padding-top: 26rem;

  @include viewport-375 {
    padding-top: 15rem;
  }

  .hero {
    .title {
      grid-column: 2 / span 5;
      font-size: $secondary-text-size;
      font-weight: $extra-light;

      @include viewport-375 {
        grid-column: 1 / -1;
        font-size: $mobile-secondary-text-size;
      }
    }
  }

  .slider {
    margin-top: 12rem;

    @include viewport-375 {
      margin-top: 6rem;
    }

    .swiper {
      padding: 0 2rem;
    }
  }

  .description {
    margin-top: 12rem;

    @include viewport-375 {
      margin-top: 6rem;
    }

    p {
      grid-column: 2 / span 5;

      @include viewport-375 {
        grid-column: 2 / -1;
        font-size: $mobile-paragraph-text-size;
      }
    }
  }

  .marquee {
    margin-top: 12rem;
    font-size: 12rem;
    font-weight: $extra-light;

    @include viewport-375 {
      font-size: 4.6rem;
      margin-top: 6rem;
    }

    span {
      white-space: nowrap;
    }
  }

  .marquee {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
  }

  .marquee span {
    display: inline-block;
    animation: marquee 60s linear infinite;
  }

  @keyframes marquee {
    0% {
      transform: translate3d(100%, 0, 0);
    }
    100% {
      transform: translate3d(-100%, 0, 0);
    }
  }

  .history {
    margin-top: 12rem;

    @include viewport-375 {
      margin-top: 6rem;
    }

    p {
      grid-column: 2 / span 5;

      @include viewport-375 {
        grid-column: 2 / -1;
        font-size: $mobile-paragraph-text-size;
      }
    }
  }

  .team {
    margin-top: 12rem;
    font-weight: $extra-light;

    @include viewport-375 {
      margin-top: 6rem;
    }

    &__wrapper {
      @include grid(12, 1fr, 1, 2);
      padding: 0 2rem;

      @include viewport-375 {
        row-gap: 6rem;
      }

      .item {
        grid-column: auto / span 4;

        @include viewport-375 {
          grid-column: 1 / -1;
        }

        &__image {
          aspect-ratio: 1 / 1;
        }

        &__meta {
          margin-top: 1rem;
        }

        &__roles {
          color: $medium-grey;
        }
      }
    }
  }

  .conclusion {
    margin-top: 12rem;
    font-size: $secondary-text-size;
    font-weight: $extra-light;

    @include viewport-375 {
      margin-top: 6rem;
    }

    p {
      grid-column: 2 / span 5;

      @include viewport-375 {
        grid-column: 1 / -1;
        font-size: $mobile-secondary-text-size;
      }
    }
  }

  .exhibitions,
  .awards,
  .festivals {
    margin-top: 12rem;
    font-weight: $extra-light;

    @include viewport-375 {
      margin-top: 6rem;
      font-weight: $light;
    }

    &__title {
      grid-column: 2 / -1;
      font-size: $secondary-text-size;
      font-weight: $extra-light;

      @include viewport-375 {
        grid-column: 1 / -1;
        font-size: $mobile-secondary-text-size;
      }
    }

    &__list {
      margin-top: 6rem;

      @include viewport-375 {
        margin-top: 2rem;
      }

      .item {
        border-top: 0.1rem solid $dark-grey;
        font-size: $list-text-size;

        @include viewport-375 {
          font-size: $mobile-list-text-size;
          border-top: none;
        }

        &:not(:first-child) {
          margin-top: 1.5rem
        }

        &__container {
          @include grid(12, 1fr, 1, 0);
          padding: 0 2rem;
          align-items: center;
          position: relative;

          @include viewport-375 {
            padding: 0 1rem;
          }
        }

        &__date {
          grid-column: 2 / span 1;
          color: $medium-grey;
          padding: 3rem 0;

          @include viewport-375 {
            grid-column: 1 / span 2;
            padding: 0;
          }
        }

        &__title {
          grid-column: 3 / span 4;
          padding: 3rem 0;

          @include viewport-375 {
            grid-column: 3 / -1;
            padding: 0;
          }
        }

        &__localization {
          grid-column: 7 / -1;
          color: $medium-grey;
          padding: 3rem 0;

          @include viewport-375 {
            padding: 0;
            grid-row: 2;
            grid-column: 3 / -1;
          }
        }
      }
    }
  }

  .festivals {
    padding-bottom: 5rem;

    @include viewport-375 {
      padding-bottom: 6.5rem;
    }
  }
}
</style>
