<script setup>
// const query = groq`*[_type == "film"]`
// const sanity = useSanity()
// const { data } = await useAsyncData('film', () => sanity.fetch(query))
// const films = data._rawValue
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
          “1024 designs architectural and digital works, in which sound and
          light scores are orchestrated within the space, and controlled by
          custom computer code.”
        </h1>
      </GridContainer>
    </section>
    <section class="slider">
      <!-- Swiper -->
    </section>
    <section class="description">
      <GridContainer>
        <p>
          1024 architecture is a creative studio founded in 2007 by Pier
          Schneider and François Wunschel. Breaking away from the notion of
          limits between disciplines, the studio focuses on spatial practices,
          digital technology, and visual effects to create unique artworks,
          installations, and performances. 1024 sees architecture and inhabited
          spaces as evolutive structures. The duo devises new and original
          experiences, accompanied by their associates and developers.
          Installations, stage design, visual arts, performances, and lighting
          structures are all ways of awakening our sensations, touching our
          bodies and memories. From one-day projects to perennial installations,
          1024 designs unique artworks that interact with their environment.
        </p>
      </GridContainer>
    </section>
    <section class="marquee">
      <span>
        1024 = 210 1024 equals 2 to the power of 10. 1024 is a recurrent number
        in computer science. 1024 is a screen resolution. 1024 bytes = 1
        Kilobyte. 1024 is a creative studio.
      </span>
    </section>
    <section class="history">
      <GridContainer>
        <p>
          1024 architecture is a creative studio founded in 2007 by Pier
          Schneider and François Wunschel. Breaking away from the notion of
          limits between disciplines, the studio focuses on spatial practices,
          digital technology, and visual effects to create unique artworks,
          installations, and performances. 1024 sees architecture and inhabited
          spaces as evolutive structures. The duo devises new and original
          experiences, accompanied by their associates and developers.
          Installations, stage design, visual arts, performances, and lighting
          structures are all ways of awakening our sensations, touching our
          bodies and memories. From one-day projects to perennial installations,
          1024 designs unique artworks that interact with their environment.
        </p>
      </GridContainer>
    </section>
    <section class="team">
      <ul class="team__wrapper">
        <li class="item">
          <div class="item__image">
            <img src="" alt="" />
          </div>
          <div class="item__meta">
            <h3 class="item__name">Pier Schneider</h3>
            <div class="item__roles">
              <p>1024 Co-Founder</p>
              <p>Architect and Artist</p>
            </div>
          </div>
        </li>
      </ul>
    </section>
    <section class="conclusion">
      <GridContainer>
        <p>
          1024’s immersive installations combine art and architecture, physical
          constructions and digital tools, giving rise to evolving temporary or
          perennial experiences.
        </p>
      </GridContainer>
    </section>
    <section class="exhibitions">
      <GridContainer>
        <h2 class="exhibitions__title">Exhibitions</h2>
      </GridContainer>
      <ul class="exhibitions__list">
        <li class="item">
          <div class="item__container">
            <div class="item__date">2020</div>
            <h3 class="item__title">London Design Museum</h3>
            <p class="item__localization">
              Itinérance de l’exposition Electro, UK
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
        <li class="item">
          <div class="item__container">
            <div class="item__date">2020</div>
            <h3 class="item__title">London Design Museum</h3>
            <p class="item__localization">
              Itinérance de l’exposition Electro, UK
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
        <li class="item">
          <div class="item__container">
            <div class="item__date">2020</div>
            <h3 class="item__title">London Design Museum</h3>
            <p class="item__localization">
              Itinérance de l’exposition Electro, UK
            </p>
          </div>
        </li>
      </ul>
    </section>
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
          border: 0.1rem solid $white;
        }

        &__meta {
          margin-top: 1rem;
        }

        &__name {
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
}
</style>
