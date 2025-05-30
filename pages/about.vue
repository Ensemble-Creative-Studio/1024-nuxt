<script setup>
	import gsap from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
	import { Swiper, SwiperSlide } from 'swiper/vue'
	import 'swiper/css'

	const query = groq`*[_type == "about"][0]`
	const { data: about } = await useSanityQuery(query)

	const isMobile = shallowRef(false)

	onMounted(() => {
		if (matchMedia('(hover: none)').matches) {
			isMobile.value = true
		}

		window.addEventListener('resize', onResize)
	})

	function onResize() {
		if (matchMedia('(hover: none)').matches) {
			isMobile.value = true
		} else {
			isMobile.value = false
		}
	}

	onBeforeUnmount(() => {
		window.removeEventListener('resize', onResize)
	})

	const $hero = ref()
	const $anchors = ref()

	const $aboutPage = ref()
	const $ctx = ref()
	const tl = gsap.timeline()
	const trigger = ref()

	const $introduction = about.value.introduction
	const splitIntroduction = computed(() => {
		return $introduction.split(' ')
	})

	const $description = ref()
	const $exhibitions = ref()

	function scrollToSection(section) {
		const offset = isMobile.value ? 50 : 50

		gsap.to(window, {
			scrollTo: {
				y: section.offsetTop - offset,
				autoKill: false,
			},
			duration: 1.5,
			ease: 'power3.out',
		})
	}

	onMounted(() => {
		$ctx.value = gsap.context((self) => {
			const chunks = self.selector('.title__chunk')
			const slides = self.selector('.swiper-slide')

			for (let i = chunks.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1))
				;[ chunks[ i ], chunks[ j ] ] = [ chunks[ j ], chunks[ i ] ]
			}

			tl.to(chunks, {
				duration: 2.5,
				autoAlpha: 1,
				ease: 'power2.out',
				stagger: 0.03,
			}).to(slides, {
				y: 0,
				delay: -1,
				duration: 1,
				autoAlpha: 1,
				ease: 'power3.out',
				stagger: 0.25,
			})

			let mm = gsap.matchMedia()

			mm.add('(min-width: 481px)', () => {
				trigger.value = ScrollTrigger.create({
					start: '50%',
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
		}, $aboutPage.value)

		window.addEventListener('resize', handleResize)

		const itemTextElements = document.querySelectorAll('.item__text')
		itemTextElements.forEach((element) => {
			const linksInItemText = element.querySelectorAll('a')
			linksInItemText.forEach((link) => {
				link.setAttribute('target', '_blank')
			})
		})

		const contentDescriptionElements = document.querySelectorAll('.content__description')
		contentDescriptionElements.forEach((element) => {
			const linksInContentDescription = element.querySelectorAll('a')
			linksInContentDescription.forEach((link) => {
				link.setAttribute('target', '_blank')
			})
		})
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

		window.removeEventListener('resize', handleResize)
		$ctx.value.revert()
	})
</script>

<template>
	<div
		ref="$aboutPage"
		class="about"
	>
		<Head>
			<Title>1024 | About</Title>
			<Meta
				name="description"
				content="About page description"
			/>
		</Head>

		<section
			ref="$hero"
			class="hero"
		>
			<GridContainer>
				<h1 class="title">
					<span
						v-for="(word, index) in splitIntroduction"
						:key="index"
						class="title__chunk"
					>
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
					<SanityImage
						:key="item._id"
						:asset-id="item.asset._ref"
						auto="format"
						:q="75"
					/>
				</swiper-slide>
			</swiper>
		</section>

		<section
			ref="$description"
			class="description"
		>
			<GridContainer>
				<p>{{ about.description }}</p>
			</GridContainer>
		</section>

		<section class="in-between">
			<GridContainer>
				<ul class="in-between__content">
					<li
						v-for="item in about.inBetweenText"
						:key="item._id"
						class="in-between__text"
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
					v-for="item in about.teamMembers"
					:key="item._id"
					class="item"
				>
					<div class="item__image">
						<SanityImage
							class="item__thumbnail"
							:asset-id="item.photo.asset._ref"
							auto="format"
							:q="75"
						/>
					</div>
					<div class="item__meta">
						<h3 class="item__name">
							{{ item.name }}
						</h3>
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

		<section
			ref="$exhibitions"
			class="exhibitions"
		>
			<GridContainer>
				<h2 class="exhibitions__title">
					Exhibitions and festivals
				</h2>
				<div class="content__description">
					<SanityContent :blocks="about.exFest" />
				</div>
			</GridContainer>
			<ul class="exhibitions__list">
				<li
					v-for="item in about.exhibitions"
					:key="item._id"
					class="item"
				>
					<div class="item__container">
						<div class="item__date">
							{{ item.date?.slice(0, 4) }}
						</div>
						<h3 class="item__title">
							{{ item.title }}
						</h3>
						<p class="item__localization">
							{{ item.localization }}
						</p>
					</div>
				</li>
			</ul>
		</section>

		<section class="editorial-content">
			<GridContainer>
				<div class="editorial-sections">
					<div
						v-if="about.editorialContent?.festivals?.length"
						class="editorial-section festivals"
					>
						<h2 class="section-title">Festivals</h2>
						<div class="content-grid">
							<div
								v-for="festival in about.editorialContent.festivals"
								:key="festival.name"
								class="content-item"
							>
								<div class="content-text">
									<h3 class="item-name">
										<a
											v-if="festival.url"
											:href="festival.url"
											target="_blank"
											rel="noopener noreferrer"
										>
											{{ festival.name }}
										</a>
										<template v-else>{{ festival.name }}</template>
									</h3>
									<p class="item-place">{{ festival.place }}</p>
								</div>
							</div>
						</div>
					</div>

					<div
						v-if="about.editorialContent?.museums?.length"
						class="editorial-section museums"
					>
						<h2 class="section-title">Musées</h2>
						<div class="content-grid">
							<div
								v-for="museum in about.editorialContent.museums"
								:key="museum.name"
								class="content-item"
							>
								<div class="content-text">
									<h3 class="item-name">
										<a
											v-if="museum.url"
											:href="museum.url"
											target="_blank"
											rel="noopener noreferrer"
										>
											{{ museum.name }}
										</a>
										<template v-else>{{ museum.name }}</template>
									</h3>
									<p class="item-place">{{ museum.place }}</p>
								</div>
							</div>
						</div>
					</div>

					<div
						v-if="about.editorialContent?.publications?.length"
						class="editorial-section publications"
					>
						<h2 class="section-title">Publications</h2>
						<div class="content-grid">
							<div
								v-for="publication in about.editorialContent.publications"
								:key="publication.name"
								class="content-item"
							>
								<div class="content-text">
									<h3 class="item-name">
										<a
											v-if="publication.url"
											:href="publication.url"
											target="_blank"
											rel="noopener noreferrer"
										>
											{{ publication.name }}
										</a>
										<template v-else>{{ publication.name }}</template>
									</h3>
									<p class="item-place">{{ publication.place }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</GridContainer>
		</section>

		<BottomAnchors ref="$anchors">
			<ul class="BottomAnchors__list">
				<li class="BottomAnchors__item">
					<button @click="scrollToSection($description)">
						About
					</button>
				</li>
				<li class="BottomAnchors__item">
					<button
						@click="scrollToSection($exhibitions)"
					>
						Exhibitions and festivals
					</button>
				</li>
			</ul>
		</BottomAnchors>
		<GridContainer>
			<div class="FeaturedProject__footer">
				<a href="/projects" >
					All Projects
				</a>
			</div>
		</GridContainer>
	</div>
</template>

<style lang="scss" scoped>
	.exhibitions p {
		display: none !important;
	}

	.FeaturedProject__footer {
		grid-column: 2 / -1;
		font-size: 4rem;
		margin-bottom: 200px;
	}

	.about {
		padding-top: 26rem;

		@include viewport-480 {
			padding-top: 15rem;
		}

		.hero {
			.title {
				grid-column: 2 / span 5;

				// font-weight: $extra-light;
				max-width: 70rem;
				font-size: $desktop-h4;

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
			margin-top: 6rem;

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
			margin-top: 6rem;

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
			margin-top: 6rem;

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

				// font-weight: $extra-light;
				margin-top: 6rem;
				font-size: $desktop-h4;

				@include viewport-1200 {
					grid-column: 2 / span 8;
				}

				@include viewport-768 {
					grid-column: 1 / -1;
				}

				@include viewport-480 {
					margin-top: 4rem;
					font-size: $mobile-h4; // $mobile-h2 on Figma
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
				display: inline-block;
				margin-left: 1rem;
				text-decoration: none;
				text-decoration-thickness: from-font;
				text-underline-offset: 0.5rem;
			}

			&__description {
				margin-top: 6rem;

				a {
					display: inline-block;
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
			margin-top: 6rem;

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
			margin-top: 6rem;

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

				@include viewport-1200 {
					grid-template-columns: 1fr;
					padding: 80px;
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
			margin-top: 6rem;
			font-size: $desktop-h4;

			// font-weight: $extra-light;

			@include viewport-480 {
				grid-column: 1 / -1;
				margin-top: 6rem;
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
			padding-bottom: 4rem;

			// font-weight: $extra-light;

			@include viewport-480 {
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
					font-size: $desktop-list;
					border-top: 0.1rem solid $dark-grey;

					@include viewport-480 {
						font-size: $mobile-list;
						border-top: none;
					}

					&__container {
						@include grid(12, 1fr, 1, 0);

						position: relative;
						align-items: center;
						padding: 1.5rem 2rem;

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
							grid-row: 2;
							grid-column: 3 / -1;
							padding: 0;
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

	.editorial-content {
		margin-top: 6rem;
		padding-bottom: 4rem;

		.editorial-sections {
			grid-column: 2 / -1;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 2rem;

			@include viewport-1024 {
				grid-template-columns: 1fr;
				gap: 4rem;
			}
		}

		.editorial-section {
			@include viewport-1024 {
				margin-bottom: 0;
			}
		}

		.section-title {
			font-size: $desktop-h4;
			margin-bottom: 3rem;

			@include viewport-480 {
				font-size: $mobile-h4;
				margin-bottom: 2rem;
			}
		}

		.content-grid {
			display: grid;
			grid-template-columns: 1fr;
			gap: 1rem;
		}

		.content-item {
			.content-text {
				display: block;
			}

			.item-name {
				font-size: 2rem;
				margin-bottom: 0.5rem;
				color: $white;

				a {
					color: inherit;
					text-decoration: underline;
					text-decoration-thickness: from-font;
					text-underline-offset: 0.5rem;
					transition: opacity 0.3s ease;

					&:hover {
						opacity: 0.7;
					}
				}

				@include viewport-480 {
					font-size: 1.6rem;
				}
			}

			.item-place {
				font-size: 1.8rem;
				color: $medium-grey;

				@include viewport-480 {
					font-size: 1.3rem;
				}
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
