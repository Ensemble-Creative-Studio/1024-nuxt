<script setup>
	import gsap from "gsap"
	import { ScrollTrigger } from "gsap/ScrollTrigger"
	import { Swiper, SwiperSlide } from "swiper/vue"
	import "swiper/css"

	const { isMobile } = useDevice()

	const query = groq`*[_type == "about"][0]`
	const sanity = useSanity()
	const { data } = await useAsyncData("about", () => sanity.fetch(query))
	const about = data.value

	const $hero = ref()
	const $anchors = ref()

	const $aboutPage = ref()
	const $ctx = ref()
	const tl = gsap.timeline()
	const trigger = ref()

	const $introduction = about.introduction
	const splitIntroduction = computed(() => {
		return $introduction.split(" ")
	})

	const $description = ref()
	const $festivals = ref()
	const $exhibitions = ref()
	const $awards = ref()

	function scrollToSection(section) {
		const offset = isMobile ? 50 : 50

		gsap.to(window, {
			scrollTo: {
				y: section.offsetTop - offset,
				autoKill: false,
			},
			duration: 1.5,
			ease: "power3.out",
		})
	}

	onMounted(() => {
		$ctx.value = gsap.context((self) => {
			const chunks = self.selector(".title__chunk")
			const slides = self.selector(".swiper-slide")

			for (let i = chunks.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[ chunks[i], chunks[j] ] = [ chunks[j], chunks[i] ]
			}

			tl.to(chunks, {
				duration: 2.5,
				autoAlpha: 1,
				ease: "power2.out",
				stagger: 0.03,
			}).to(slides, {
				y: 0,
				delay: -1,
				duration: 1,
				autoAlpha: 1,
				ease: "power3.out",
				stagger: 0.25,
			})

			setTimeout(() => {
				let mm = gsap.matchMedia()

				mm.add("(min-width: 481px)", () => {
					trigger.value = ScrollTrigger.create({
						start: "50%",
						trigger: $hero.value,
						onEnter: () => {
							gsap.to($anchors.value.$el, {
								y: 0,
								duration: 0.5,
							})
						},
						onLeaveBack: () => {
							gsap.to($anchors.value.$el, {
								y: 50,
								duration: 0.5,
							})
						},
					})
				})
			}, 1000)
		}, $aboutPage.value)

		window.addEventListener("resize", handleResize)
		setTimeout(() => {
			const itemTextElements = document.querySelectorAll(".item__text")

			// Loop through each .item__text element
			itemTextElements.forEach((element) => {
				// Get all <a> elements within the current .item__text element
				const linksInItemText = element.querySelectorAll("a")

				// Loop through each <a> element within the .item__text element
				linksInItemText.forEach((link) => {
					// Add target="_blank" attribute to the <a> element
					link.setAttribute("target", "_blank")
				})
			})

			// Get all elements with class .content__description
			const contentDescriptionElements = document.querySelectorAll(".content__description")

			// Loop through each .content__description element
			contentDescriptionElements.forEach((element) => {
				// Get all <a> elements within the current .content__description element
				const linksInContentDescription = element.querySelectorAll("a")

				// Loop through each <a> element within the .content__description element
				linksInContentDescription.forEach((link) => {
					// Add target="_blank" attribute to the <a> element
					link.setAttribute("target", "_blank")
				})
			})
		}, 1000)
	})

	const handleResize = () => {
		if (trigger.value !== null) {
			trigger.value.refresh()
		}
	}

	onBeforeUnmount(() => {
		gsap.to($anchors.value.$el, {
			y: 50,
			duration: 0.5,
		})

		ScrollTrigger.getAll().forEach((trigger) => {
			trigger.kill()
		})

		removeEventListener("resize", handleResize)
	})
</script>

<template>
	<div class="about"
		ref="$aboutPage">
		<Head>
			<Title>1024 | About</Title>
			<Meta name="description"
				content="About page description" />
		</Head>
		<section class="hero"
			ref="$hero">
			<GridContainer>
				<h1 class="title">
					<span class="title__chunk"
						v-for="(word, index) in splitIntroduction"
						:key="index">
						{{ word }}{{ index !== splitIntroduction.length - 1 ? ' ' : '' }}
					</span>
				</h1>
			</GridContainer>
		</section>
		<section class="slider">
			<swiper
				:space-between="10"
				:grab-cursor="true"
				:free-mode="true"
				:slides-per-view="1.1"
				:breakpoints="{
					480: {
						slidesPerView: 2.5,
					},
				}"
			>
				<swiper-slide
					v-for="item in about.gallery.medias"
					:key="item._id"
					class="slider__item"
				>
					<SanityImage :asset-id="item.asset._ref"
						auto="format"
						:q="75"
						:key="item._id" />
				</swiper-slide>
			</swiper>
		</section>
		<section class="description"
			ref="$description">
			<GridContainer>
				<p>{{ about.description }}</p>
			</GridContainer>
		</section>
		<section class="in-between">
			<GridContainer>
				<ul class="in-between__content">
					<li
						class="in-between__text"
						:key="item._id"
						v-for="item in about.inBetweenText"
					>
						{{ item.text }}
					</li>
				</ul>
			</GridContainer>
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
				<li
					class="item"
					:key="item._id"
					v-for="item in about.teamMembers">
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
		<section class="exhibitions"
			ref="$exhibitions">
			<GridContainer>
				<h2 class="exhibitions__title">Exhibitions and festivals</h2>
				<div
					class="content__description"

				>
					<SanityContent :blocks="about.exFest" />
				</div>
			</GridContainer>
			<ul class="exhibitions__list">
				<li
					class="item"
					:key="item._id"
					v-for="item in about.exhibitions"
				>
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


		<BottomAnchors ref="$anchors">
			<ul class="BottomAnchors__list">
				<li class="BottomAnchors__item">
					<button @click="scrollToSection($description)">About</button>
				</li>
				<li class="BottomAnchors__item">
					<button
						@click="scrollToSection($exhibitions)">Exhibitions and festivals
					</button>
				</li>

			</ul>
		</BottomAnchors>
	</div>
</template>

<style lang="scss" scoped>
  .exhibitions p  {
  display: none !important;
}
.about {
  padding-top: 26rem;

  @include viewport-480 {
    padding-top: 15rem;
  }

  .hero {
    .title {
      grid-column: 2 / span 5;
      font-size: $desktop-h4;
      // font-weight: $extra-light;
      max-width: 70rem;

      &__chunk {
        opacity: 0;
      }

      @include viewport-1024 {
        grid-column: 2 / span 10;
      }

      @include viewport-480 {
        grid-column: 1 / -1;
        font-size: $mobile-h4;
      }
    }
  }

  .slider {
    margin-top: 12rem;

    @include viewport-480 {
      margin-top: 6rem;
    }

    .swiper {
      padding: 0 2rem;

      &-slide {
        opacity: 0;
        transform: translateY(5rem);
      }
    }
  }

  .description {
    margin-top: 12rem;

    @include viewport-480 {
      margin-top: 6rem;
    }

    p {
      grid-column: 2 / span 5;

      @include viewport-1024 {
        grid-column: 2 / span 8;
      }

      @include viewport-480 {
        grid-column: 2 / -1;
        font-size: $mobile-text-read;
      }
    }
  }

  .in-between {
    margin-top: 12rem;

    &__content {
      grid-column: 2 / span 5;
      max-width: 70rem;

      @include viewport-1024 {
        grid-column: 2 / span 8;
      }

      @include viewport-480 {
        grid-column: 2 / -1;
        font-size: $mobile-text-read;
      }
    }

    &__text {
      display: block;
    }

    @include viewport-480 {
      margin-top: 6rem;
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
      text-decoration: none;
      display: inline-block;
      text-decoration: none;
      text-decoration: none;
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
  .history {
    margin-top: 12rem;

    @include viewport-480 {
      margin-top: 6rem;
    }

    p {
      grid-column: 2 / span 5;
      max-width: 70rem;

      @include viewport-1024 {
        grid-column: 2 / span 8;
      }

      @include viewport-480 {
        grid-column: 2 / -1;
        font-size: $mobile-text-read;
      }
    }
  }

  .team {
    margin-top: 12rem;
    // font-weight: $extra-light;

    @include viewport-480 {
      margin-top: 6rem;
    }

    &__wrapper {
      @include grid(12, 1fr, 1, 2);
      padding: 0 2rem;

      @include viewport-480 {
        row-gap: 6rem;
        padding: 0 1rem;
      }

      .item {
        grid-column: auto / span 4;

        @include viewport-480 {
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
    font-size: $desktop-h4;
    // font-weight: $extra-light;

    @include viewport-480 {
      margin-top: 6rem;
      grid-column: 1 / -1;
      font-size: $mobile-h4;
    }

    p {
      grid-column: 2 / span 5;
      max-width: 70rem;

      @include viewport-1024 {
        grid-column: 2 / span 10;
      }

      @include viewport-480 {
        grid-column: 1 / -1;
        font-size: $mobile-h4;
      }
    }
  }

  .exhibitions,
  .awards,
  .festivals {
    margin-top: 12rem;
    padding-bottom:10rem;
    // font-weight: $extra-light;

    @include viewport-480 {
      margin-top: 6rem;
      font-weight: $light;
    }

    &__title {
      grid-column: 2 / -1;
      font-size: $desktop-h4;
      // font-weight: $extra-light;

      @include viewport-480 {
        grid-column: 1 / -1;
        font-size: $mobile-h4;
      }
    }

    &__list {
      margin-top: 6rem;

      @include viewport-480 {
        margin-top: 2rem;
      }

      .item {
        border-top: 0.1rem solid $dark-grey;
        font-size: $desktop-list;

        @include viewport-480 {
          font-size: $mobile-list;
          border-top: none;
        }

        &__container {
          @include grid(12, 1fr, 1, 0);
          padding: 1.5rem 2rem;
          align-items: center;
          position: relative;

          @include viewport-480 {
            padding: 0.75rem 1rem;
          }
        }

        &__date {
          grid-column: 2 / span 1;
          color: $medium-grey;
          // padding: 3rem 0;

          @include viewport-480 {
            grid-column: 1 / span 2;
            padding: 0;
          }
        }

        &__title {
          grid-column: 3 / span 4;
          // padding: 3rem 0;

          @include viewport-480 {
            grid-column: 3 / -1;
            padding: 0;
          }
        }

        &__localization {
          grid-column: 7 / -1;
          color: $medium-grey;
          // padding: 3rem 0;

          @include viewport-480 {
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

    @include viewport-480 {
      padding-bottom: 6.5rem;
    }
  }
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - var(--gap)));
  }
}
</style>
