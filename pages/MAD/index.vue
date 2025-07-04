<script setup>
	import gsap from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
	import { ref, onMounted, onUnmounted, computed } from 'vue'

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

	const route = useRoute()
	const router = useRouter()

	const GET_SINGLE_PROJECT = groq`*[_type == "MAD"][0]
	{
	...,
	"mainVideoUrlMobile": mainVideoUrlMobile,
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
	`

	const { data: project } = await useSanityQuery(GET_SINGLE_PROJECT, {
		params: { slug: route.params.slug },
	})
	if (Object.keys(project.value).length === 0) {
		router.push('/404')
		throw createError({ statusCode: 404, statusMessage: 'Project not found' })
	}

	const $hero = ref()
	const $galleryMedia = ref([])
	const $anchors = ref()

	const $projectPage = ref()
	const trigger = ref()

	const $description = ref()
	const $gallery = ref()
	const $credits = ref()
	const hasScrolledPastHero = ref(false)
	const isTitleVisible = ref(true)
	const $heroTitle = ref()

	const currentVideo = ref('')

	const videoSource = computed(() => {
		return currentVideo.value
	})

	const updateVideoSource = () => {
		const video = document.querySelector('.hero__video')
		if (video) {
			if (window.innerWidth <= 768) {
				currentVideo.value = project.value.mainVideoUrlMobile || project.value.mainVideoUrl
			} else {
				currentVideo.value = project.value.mainVideoUrl || project.value.mainVideoUrlMobile
			}
		}
	}

	function scrollToSection(section) {
		let offset

		if (section.classList.contains('hero')) {
			offset = isMobile.value ? 0 : 0
		} else {
			offset = isMobile.value ? window.innerHeight - 100 : window.innerHeight - 100
		}

		gsap.to(window, {
			scrollTo: {
				y: section.offsetTop + offset,
				autoKill: false,
			},
			duration: 1.5,
			ease: 'power3.out',
		})
	}

	onMounted(() => {
		// Initialize video source
		if (window.innerWidth <= 768) {
			currentVideo.value = project.value.mainVideoUrlMobile || project.value.mainVideoUrl
		} else {
			currentVideo.value = project.value.mainVideoUrl || project.value.mainVideoUrlMobile
		}

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

		const observer = new IntersectionObserver(
			([entry]) => {
				isTitleVisible.value = entry.isIntersecting

				if (!entry.isIntersecting && hasScrolledPastHero.value) {
					gsap.to($fixedTitle.value, {
						opacity: 1,
						duration: 0.3,
						delay: 0.1
					})
				} else {
					gsap.to($fixedTitle.value, {
						opacity: 0,
						duration: 0.3,
						delay: 0.1
					})
				}
			},
			{
				threshold: 0,
				rootMargin: "-10% 0px"
			}
		)

		window.addEventListener('scroll', () => {
			hasScrolledPastHero.value = window.scrollY > window.innerHeight
		})

		if ($heroTitle.value) {
			observer.observe($heroTitle.value)
		}

		const itemTextElements = document.querySelectorAll('.item__text')

		// Loop through each .item__text element
		itemTextElements.forEach((element) => {
			// Get all <a> elements within the current .item__text element
			const linksInItemText = element.querySelectorAll('a')

			// Loop through each <a> element within the .item__text element
			linksInItemText.forEach((link) => {
				// Add target="_blank" attribute to the <a> element
				link.setAttribute('target', '_blank')
			})
		})

		// Get all elements with class .content__description
		const contentDescriptionElements = document.querySelectorAll('.content__description')

		// Loop through each .content__description element
		contentDescriptionElements.forEach((element) => {
			// Get all <a> elements within the current .content__description element
			const linksInContentDescription = element.querySelectorAll('a')

			// Loop through each <a> element within the .content__description element
			linksInContentDescription.forEach((link) => {
				// Add target="_blank" attribute to the <a> element
				link.setAttribute('target', '_blank')
			})
		})

		window.addEventListener('resize', handleResize)
		window.addEventListener('resize', updateVideoSource)
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
		window.removeEventListener('scroll', () => {
			hasScrolledPastHero.value = window.scrollY > window.innerHeight
		})
		window.removeEventListener('resize', updateVideoSource)
	})
</script>

<template>
	<div
		ref="$projectPage"
		class="project-page"
	>
		<Head>
			<Title>{{ project.title }}</Title>
			<Meta
				name="description"
				content="Project description"
			/>
		</Head>
		<h1
			ref="$fixedTitle"
			class="fixed-title"
			:class="{ 'is-visible': !isTitleVisible && hasScrolledPastHero }"
		>
			{{ project.title }}
		</h1>
		<section
			ref="$hero"
			class="hero"
		>
			<video
				v-if="project.mainVideoUrl || project.mainVideoUrlMobile"
				class="hero__video"
				:src="videoSource"
				autoplay
				muted
				loop
				playsinline
				webkit-playsinline
			/>
			<SanityImage
				v-else
				class="hero__banner"
				:asset-id="project.mainImage.asset._ref"
				auto="format"
				:q="75"
			/>
		</section>
		<div class="main">
			<section class="content">
				<GridContainer>
					<h1 ref="$heroTitle" class="content__title">
						{{ project.title }}
					</h1>
					<div class="content__claim">
						{{ project.claim }}
					</div>
					<div class="content__details">
						<span class="content__date">{{
							project.releaseDate.slice(0, 4)
						}}</span>
						<span class="content__type">{{ project.field }}</span>
					</div>
					<div
						v-if="project.description"
						ref="$description"
						class="content__description"
					>
						<SanityContent :blocks="project.description" />
					</div>
				</GridContainer>
			</section>
			<section
				v-if="project?.gallery"
				ref="$gallery"
				class="gallery"
			>
				<GridContainer>
					<div class="gallery__title-container">
						<h2 class="gallery__title">
							{{ project.galleryName }}
						</h2>
					</div>
					<ul
						v-if="project?.gallery"
						class="gallery__wrapper"
					>
						<li
							v-for="(item, index) in project?.gallery"
							:key="index"
							:class="[
								item._type === 'galleryMedia'
									? 'item--media'
									: item._type === 'galleryVideo'
										? 'item--video'
										: 'item--text',
								'item',
							]"
						>
							<ul
								v-if="item._type === 'galleryMedia'"
								class="item__inner"
							>
								<li
									v-for="image in item.images"
									:key="image.asset._ref"
									ref="$galleryMedia"
									:class="{
										vertical:
											image.assetRef.metadata.dimensions.aspectRatio < 1,
									}"
								>
									<div class="item__image">
										<SanityImage
											:asset-id="image.asset._ref"
											auto="format"
										/>
									</div>
								</li>
							</ul>

							<div
								v-if="item._type === 'galleryText'"
								class="item__text"
							>
								<SanityContent :blocks="item.text" />
							</div>
							<div
								v-if="item._type === 'galleryVideo'"
								class="item__video"
							>
								<VideoPlayer
									:poster="item.posterImageUrl"

									:vimeo-url="item.url"
									:download-url="item.downloadUrl"
									:quality="isMobile ? 'sd' : 'hd'"
									:public-url="item.publicUrl"
								/>
							</div>
						</li>
					</ul>
				</GridContainer>
			</section>
			<section
				ref="$credits"
				class="credits"
			>
				<GridContainer>
					<header
						class="credits__header"
						:class="[!project.credits && 'credits__header--is-empty']"
					>
						<div>{{ project.title }}</div>
						<span>1024 architecture</span>
					</header>
					<ul
						v-if="project.credits"
						class="credits__wrapper"
					>
						<li
							v-for="item in project?.credits?.list"
							:key="item._key"
							class="item"
						>
							>
							<h3 class="item__label">
								{{ item.role }}
							</h3>
							<p class="item__text">
								{{ item.text }}
							</p>
						</li>
					</ul>
				</GridContainer>
			</section>
			<section
				v-if="project.relatedProjects"
				class="related-projects"
			>
				<GridContainer>
					<h2 class="related-projects__title">
						Related projects
					</h2>
				</GridContainer>
				<ProjectsList
					:projects="project.relatedProjects ? project.relatedProjects : []"
				/>
			</section>
			<BottomAnchors ref="$anchors">
				<ul class="BottomAnchors__list">
					<li class="BottomAnchors__item">
						<button @click="scrollToSection($hero)">
							Top
						</button>
					</li>
					<li
						v-if="project.description"
						class="BottomAnchors__item"
					>
						<button @click="scrollToSection($description)">
							Description
						</button>
					</li>
					<li class="BottomAnchors__item">
						<button
							v-if="project.gallery"
							@click="scrollToSection($gallery)"
						>
							Gallery
						</button>
					</li>
					<li
						v-if="project.credits"
						class="BottomAnchors__item"
					>
						<button @click="scrollToSection($credits)">
							Credits
						</button>
					</li>
				</ul>
			</BottomAnchors>
		</div>
	</div>
</template>

<style lang="scss">
	.project-page {
		position: relative;

		.fixed-title {
			position: fixed;
			top: 2rem;
			left: 50%;
			transform: translateX(-50%);
			font-size: 2rem;
			color: $white;
			z-index: 100;
			opacity: 0;
			pointer-events: none;

			&.is-visible {
				opacity: 1;
			}

			@include viewport-480 {
					top: 5px;
				}
		}

		.hero {
			position: relative;
			height: 100vh;
			background-color: transparent;

			&__banner,
			&__video {
				position: fixed;
				top: 0;
				left: 0;
				z-index: -1;
				width: 100%;
				height: 100%;
				height: 100vh;
				object-fit: cover;
			}

			&__title {
				// font-weight: $extra-light;
				position: absolute;
				bottom: 1.5rem;
				left: 2rem;
				font-size: $desktop-h4;

				@include viewport-480 {
					bottom: 6rem;
					left: 1rem;
					font-size: $mobile-h2;
				}
			}
		}

		.main {
			position: relative;
			z-index: 10;
			background-color: $black;
		}

		.item__inner {
			display: flex;
			justify-content: center;
			row-gap: 20px;
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

		// .item__inner li.vertical {
		// 	margin-top: 12rem;
		// 	@include viewport-480 {
		// 		padding: 1rem;
		// 	}
		// }

		.content {
			&__title {
				grid-column: 1 / span 5;
				margin-top: 2rem;
				font-size: $desktop-h4;

				@include viewport-480 {
					grid-column: 1 / -1;
					margin-top: 1rem;
					font-size: $mobile-h2;
				}
			}
			&__claim {
				grid-column: 2 / span 5;
				margin-top: 6rem;
				font-size: 3rem;

				@include viewport-1200 {
					grid-column: 2 / span 8;
				}

				@include viewport-768 {
					grid-column: 1 / -1;
				}

				@include viewport-480 {
					grid-column: 1 / -1;
					margin-top: 4rem;
					font-size: $mobile-h4;
				}
			}

			&__details {
				grid-column: 1 / -1;
				margin-top: 6rem;

				@include viewport-768 {
					grid-column: 2 / span 10;
				}

				@include viewport-480 {
					grid-column: 1 / -1;
					margin-top: 4rem;
				}
			}

			&__description {
				grid-column: 2 / span 5;
				margin-top: 6rem;

				@include viewport-1200 {
					grid-column: 2 / span 8;
				}

				@include viewport-480 {
					grid-column: 1 / -1;
					margin-top: 4rem !important;
					font-size: 16px;
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

		.gallery {
			margin-top: 12rem;

			&__title-container {
				display: flex;
				grid-column: 1 / -1;
				align-items: flex-start;
			}

			&__title {
				// font-weight: $extra-light;
				grid-column: 1 / -1;
				font-size: $desktop-h4;

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
				margin-top: 6rem;
				@include grid(12, 1fr, 1, 0);

				@include viewport-480 {
						margin-top: 0;
					}

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
							text-decoration-thickness: from-font;
							text-underline-offset: 0.5rem;
						}

						@include viewport-480 {
							grid-column: 2 / -1;
							font-size: $mobile-text-read;
						}
					}

					&:not(:first-child) {
						margin-top: 12rem;

						@include viewport-480 {
							margin-top: 3rem;
						}
					}

					// &__inner {
					// 	li {
					// 			margin-top: 6rem;

					// 			@include viewport-768 {
					// 				margin-top: 9rem;
					// 			}

					// 			@include viewport-480 {
					// 				margin-top: 6rem;
					// 			}
					// 	}
					// }
				}
			}
		}

		.credits {
			padding-bottom: 9rem;
			margin-top: 9rem;

			@include viewport-480 {
				padding-bottom: 0;
				margin-top: 6rem;
				font-size: 16px;
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
				margin-top: 6rem;
				@include grid(9, 1fr, 1, 3);

				@include viewport-768 {
					@include grid(10, 1fr, 1, 3);

					grid-column: 2 / span 10;
				}

				@include viewport-480 {
					grid-column: 1 / -1;
					padding-left: 2rem;
				}

				.item {
					grid-column: auto / span 3;
					@include grid(3, 1fr, 1, 0);

					@include viewport-768 {
						grid-column: auto / span 5;
					}

					@include viewport-480 {
						grid-column: 1 / -1;
						font-size: 16px;

						&:not(:first-child) {
							margin-top: 3rem;
						}
					}

					&__label {
						grid-column: 1 / span 2;
						color: $medium-grey;

						@include viewport-480 {
							grid-column: 1 / -1;
							padding-left: 2rem;
						}
					}

					&__text {
						grid-column: 1 / span 2;

						@include viewport-480 {
							grid-column: 1 / -1;
							padding-left: 2rem;
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
