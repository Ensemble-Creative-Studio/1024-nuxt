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
      <Swiper :slides-per-view="2.5" :space-between="10" :grab-cursor="true">
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

  .hero {
    .title {
      font-size: $secondary-text-size;
      font-weight: $extra-light;
      grid-column: 2 / span 5;
    }
  }

  .slider {
    margin-top: 12rem;

    .swiper {
      padding: 0 2rem;
    }
  }

  .description {
    margin-top: 12rem;

    p {
      grid-column: 2 / span 5;
    }
  }

  .marquee {
    margin-top: 12rem;
    font-size: 12rem;
    font-weight: $extra-light;

    span {
      white-space: nowrap;
    }
  }

  .history {
    margin-top: 12rem;

    p {
      grid-column: 2 / span 5;
    }
  }

  .team {
    margin-top: 12rem;
    font-weight: $extra-light;

    &__wrapper {
      @include grid(12, 1fr, 1, 2);
      padding: 0 2rem;

      .item {
        grid-column: auto / span 4;

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

    p {
      grid-column: 2 / span 5;
    }
  }

  .exhibitions,
  .awards,
  .festivals {
    margin-top: 12rem;
    font-weight: $extra-light;

    &__title {
      font-size: $secondary-text-size;
      grid-column: 2 / -1;
    }

    &__list {
      margin-top: 6rem;

      .item {
        border-top: 0.1rem solid $dark-grey;
        font-size: $list-text-size;

        &__container {
          @include grid(12, 1fr, 1, 0);
          padding: 0 2rem;
          align-items: center;
          position: relative;
        }

        &__date {
          grid-column: 2 / span 1;
          color: $medium-grey;
          padding: 3rem 0;
        }

        &__title {
          grid-column: 3 / span 4;
          padding: 3rem 0;
        }

        &__localization {
          grid-column: 7 / -1;
          color: $medium-grey;
          padding: 3rem 0;
        }
      }
    }
  }

  .festivals {
    padding-bottom: 5rem;
  }
}
</style>
