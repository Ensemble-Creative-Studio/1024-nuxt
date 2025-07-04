<script setup>
	import gsap from 'gsap'
	import { PortableText } from '@portabletext/vue';
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
	import { ref, onMounted, onUnmounted, computed } from 'vue'
	import { wait } from '@/utils/wait'

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

	const GET_SINGLE_EXPERTISE = groq`*[_type == "expertises"
	&& slug.current == "${ route.params.slug }"][0]
	{
		...,
		projects[] -> {
			...,
			"thumbnailVideoUrl": thumbnailVideoUrl,
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
				"posterImageUrl": posterImage
			}
		},
	}
	`

	const { data: expertise } = await useSanityQuery(GET_SINGLE_EXPERTISE)

	if (Object.keys(expertise.value).length === 0) {
		router.push('/404')
		throw createError({ statusCode: 404, statusMessage: 'Expertise not found' })
	}

	const $galleryMedia = ref([])
	const $anchors = ref()

	const $expertisePage = ref()
	const $description = ref()
	const $gallery = ref()
	const $relatedProjects = ref()

	let trigger

	const $heroTitle = ref(null)
	const $fixedTitle = ref(null)
	const isTitleVisible = ref(true)
	const hasScrolledPastHero = ref(false)
	const currentExpertise = useState('currentExpertise', () => ({}))

	function scrollToSection(section) {
		let offset

		if (section.classList.contains('expertise-content')) {
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
		window.addEventListener('resize', handleResize)

		const itemTextElements = document.querySelectorAll('.expertise-item__text')
		itemTextElements.forEach((element) => {
			const linksInItemText = element.querySelectorAll('a')
			linksInItemText.forEach((link) => {
				link.setAttribute('target', '_blank')
			})
		})

		const contentDescriptionElements = document.querySelectorAll('.expertise-content__description')
		contentDescriptionElements.forEach((element) => {
			const linksInContentDescription = element.querySelectorAll('a')
			linksInContentDescription.forEach((link) => {
				link.setAttribute('target', '_blank')
			})
		})

		const observer = new IntersectionObserver(
			([entry]) => {
				isTitleVisible.value = entry.isIntersecting
				if (!isTitleVisible.value && hasScrolledPastHero.value) {
					gsap.to($fixedTitle.value, { opacity: 1, duration: 0.3 })
				} else {
					gsap.to($fixedTitle.value, { opacity: 0, duration: 0.3 })
				}
			},
			{ threshold: 0 }
		)

		window.addEventListener('scroll', () => {
			hasScrolledPastHero.value = window.scrollY > window.innerHeight * 0.5
		})

		if ($heroTitle.value) {
			observer.observe($heroTitle.value)
		}

		currentExpertise.value = expertise.value

		// Ajout de la gestion des vidéos au survol pour les projets liés
		addVideoHoverListeners()
		addVideoMobileAnimation()
	})

	const handleResize = () => {
		if (trigger !== null) {
			trigger.refresh()
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
			hasScrolledPastHero.value = window.scrollY > window.innerHeight * 0.5
		})

		// Nettoyage des écouteurs d'événements pour les vidéos
		const items = document.querySelectorAll('.expertise-project-item')
		items.forEach((item) => {
			item.removeEventListener('mouseenter', () => {})
			item.removeEventListener('mouseleave', () => {})
		})
	})

	const addVideoHoverListeners = () => {
		const items = document.querySelectorAll('.expertise-project-item')

		items.forEach((item) => {
			const video = item.querySelector('video')

			item.addEventListener('mouseenter', () => {
				if (video) {
					video.play()
				}
			})

			item.addEventListener('mouseleave', async () => {
				if (video) {
					video.pause()
					await wait(200)
					video.currentTime = 0
				}
			})
		})
	}

	const addVideoMobileAnimation = () => {
		if (window.innerWidth <= 768) {
			const items = document.querySelectorAll('.expertise-project-item')

			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					const item = entry.target
					const video = item.querySelector('video')

					if (entry.isIntersecting) {
						if (video) {
							video.play()
							video.style.visibility = 'visible'
							video.style.opacity = '1'
						}
					} else {
						if (video) {
							video.pause()
							video.currentTime = 0
							video.style.visibility = 'hidden'
							video.style.opacity = '0'
						}
					}
				})
			}, {
				root: null,
				rootMargin: '-13% 0px -45% 0px',
				threshold: 0.5
			})

			items.forEach(item => {
				observer.observe(item)
			})
		}
	}

</script>

<template>
	<div
		ref="$expertisePage"
		class="expertise-page"
	>
		<Head>
			<Title>{{ expertise.title }}</Title>
			<Meta
				name="description"
				content="Expertise description"
			/>
		</Head>
		<h1
			ref="$fixedTitle"
			class="fixed-title"
			:class="{ 'is-visible': !isTitleVisible && hasScrolledPastHero }"
		>
			{{ expertise.title }}
		</h1>
		<div class="expertise-main">
			<section class="expertise-content">
				<GridContainer>
					<h1 ref="$heroTitle" class="expertise-content__title">
						{{ expertise.title }}
					</h1>
					<div
						v-if="expertise.text"
						ref="$description"
						class="expertise-content__description"
					>
						<SanityContent :blocks="expertise.text" />
					</div>
				</GridContainer>
			</section>
			<section
				v-if="expertise?.gallery"
				ref="$gallery"
				class="expertise-gallery"
			>
				<GridContainer>
					<ul
						v-if="expertise?.gallery"
						class="expertise-gallery__wrapper"
					>
						<li
							v-for="(item, index) in expertise?.gallery"
							:key="index"
							:class="[
								item._type === 'galleryMedia'
									? 'expertise-item--media'
									: item._type === 'galleryVideo'
										? 'expertise-item--video'
										: 'expertise-item--text',
								'expertise-item',
							]"
						>
							<ul
								v-if="item._type === 'galleryMedia'"
								class="expertise-item__inner"
							>
								<li
									v-for="image in item.images"
									:key="image._key"
									ref="$galleryMedia"
									:class="{
										vertical:
											image.assetRef.metadata.dimensions.aspectRatio < 1,
									}"
								>
									<div class="expertise-item__image">
										<SanityImage
											auto="format"
											:asset-id="image.asset._ref"
										/>
									</div>
								</li>
							</ul>
							<div
								v-if="item._type === 'galleryText'"
								class="expertise-item__text"
							>
								<SanityContent :blocks="item.text" />
							</div>
							<div
								v-if="item._type === 'galleryVideo'"
								class="expertise-item__video"
							>
								<VideoPlayer
									:poster="item.posterImageUrl"
									:vimeo-url="item.url"
									:download-url="item.publicUrl"
									:public-url="item.publicUrl"
								/>
							</div>
						</li>
					</ul>
				</GridContainer>
			</section>
			<section
				v-if="expertise.projects"
				ref="$relatedProjects"
				class="expertise-related-projects"
			>
				<GridContainer>
					<h2 class="expertise-related-projects__title">
						Related projects
					</h2>
					<div class="expertise-projects-grid">
						<div
							v-for="project in expertise.projects"
							:key="project._id"
							class="expertise-project-item"
						>
							<NuxtLink
								:to="{ name: 'projects-slug', params: { slug: project.slug.current } }"
								class="expertise-project-link"
							>
								<div class="expertise-project-thumbnail">
									<SanityImage
										v-if="project.thumbnailImage || project.mainImage"
										:asset-id="
											project.thumbnailImage
												? project.thumbnailImage.asset._ref
												: project.mainImage.asset._ref
										"
										auto="format"
									/>
									<video
										v-if="project.thumbnailVideoUrl"
										:src="project.thumbnailVideoUrl"
										muted
										loop
										playsinline
										webkit-playsinline
										preload="none"
										autobuffer="true"
									/>
								</div>
								<h3 class="expertise-project-title">
									{{ project.title }}
								</h3>
							</NuxtLink>
						</div>
					</div>
				</GridContainer>
			</section>
			<BottomAnchors ref="$anchors">
				<ul class="BottomAnchors__list">
					<li class="BottomAnchors__item">
						<button @click="scrollToSection($description)">
							Top
						</button>
					</li>
					<li
						v-if="expertise.text"
						class="BottomAnchors__item"
					>
						<button @click="scrollToSection($description)">
							Description
						</button>
					</li>
					<li class="BottomAnchors__item">
						<button
							v-if="expertise.gallery"
							@click="scrollToSection($gallery)"
						>
							Gallery
						</button>
					</li>
					<li
						v-if="expertise.projects"
						class="BottomAnchors__item"
					>
						<button @click="scrollToSection($relatedProjects)">
							Projets
						</button>
					</li>
				</ul>
			</BottomAnchors>
		</div>
	</div>
</template>

<style lang="scss">
	.expertise-page {
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
			height: 50vh;
			background-color: transparent;

			&__background {
				position: fixed;
				top: 0;
				left: 0;
				z-index: -1;
				width: 100%;
				height: 50vh;
				background: linear-gradient(135deg, $black 0%, #1a1a1a 100%);
			}
		}

		.expertise-main {
			position: relative;
			z-index: 10;
			background-color: $black;
		}

		.expertise-item__inner {
			display: grid;
			grid-template-columns: 1fr;
			gap: 6rem;

			@include viewport-480 {
				gap: 2rem;
			}

			&:has(li.vertical) {
				grid-template-columns: repeat(2, 1fr);
			}

			li {
				width: 100%;

				&.vertical {
					img {
						height: 100%;
						object-fit: cover;
					}
				}

				@include viewport-480 {
					&.vertical {
						&:first-child {
							padding-right: 1rem;
						}
						&:nth-child(2) {
							padding-left: 1rem;
						}
					}
				}
			}
		}

		.expertise-content {
			&__title {
				grid-column: 3 / span 5;
				margin-top: 12rem;
				font-size: 34px;

				@include viewport-480 {
					grid-column: 1 / -1;
					margin-top: 1rem;
					font-size: 26px;
				}
			}

			&__description {
				grid-column: 3 / span 8;
				margin-top: 6rem;
				font-size: 22px;

				@include viewport-1200 {
					grid-column: 3 / span 8;
				}

				@include viewport-480 {
					grid-column: 1 / -1;
					margin-top: 4rem !important;
					font-size: 16px;
				}

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

		.expertise-gallery {
			margin-top: 6rem;



			&__wrapper {
				grid-column: 1 / -1;
				margin-top: 6rem;
				margin-bottom: 6rem;
				@include grid(12, 1fr, 1, 0);

				@include viewport-480 {
					margin-top: 0;
				}

				.expertise-item {
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
						margin-top: 6rem;

						@include viewport-480 {
							margin-top: 3rem;
						}
					}
				}
			}
		}

		.expertise-related-projects {
			margin-top: 6rem;
			padding-bottom: 9rem;

			@include viewport-480 {
				margin-bottom: 6rem;
			}

			&__title {
				grid-column: 1 / -1;
				font-size: 34px !important;

				@include viewport-480 {
					font-size: 26px !important;
				}
			}
		}

		.expertise-projects-grid {
			grid-column: 1 / -1;
			margin-top: 6rem;
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 4rem;
			padding: 0 1rem;

			@include viewport-1200 {
				grid-template-columns: repeat(3, 1fr);
				gap: 3rem;
			}

			@include viewport-768 {
				grid-template-columns: repeat(2, 1fr);
				gap: 2rem;
			}

			@include viewport-480 {
				grid-template-columns: 1fr;
				gap: 2rem;
			}
		}

		.expertise-project-item {
			display: flex;
			flex-direction: column;
		}

		.expertise-project-link {
			display: flex;
			flex-direction: column;
			text-decoration: none;
		}

		.expertise-project-thumbnail {
			width: 100%;
			aspect-ratio: 1;
			overflow: hidden;
			background-color: #1a1a1a;
			position: relative;

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			video {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				visibility: hidden;
				object-fit: cover;
				opacity: 0;
				transition: 0.25s ease-in-out;
			}
		}

		.expertise-project-item:hover .expertise-project-thumbnail video {
			visibility: visible;
			opacity: 1;
		}

		.expertise-project-title {
			margin-top: 1rem;
			font-size: 20px;
			color: #727272;
			font-weight: normal;
			line-height: 1.4;

			@include viewport-480 {
				font-size: 16px;
			}
		}
	}
</style>
