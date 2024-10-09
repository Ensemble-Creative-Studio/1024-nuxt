<script setup>
	import gsap from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
	import { ref, onMounted, onUnmounted } from 'vue'

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

	const GET_SINGLE_PROJECT = groq`*[_type == "projects"
	&& slug.current == "${ route.params.slug }"][0]
	{
		...,
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
			"posterImageUrl": posterImage
		}
		},
	}
	`

	const { data: project } = await useSanityQuery(GET_SINGLE_PROJECT)

	if (Object.keys(project.value).length === 0) {
		router.push('/404')
		throw createError({ statusCode: 404, statusMessage: 'Project not found' })
	}

	const $hero = ref()
	const $galleryMedia = ref([])
	const $anchors = ref()

	const $projectPage = ref()
	const $description = ref()
	const $gallery = ref()
	const $credits = ref()

	let trigger

	const $heroTitle = ref(null)
	const $fixedTitle = ref(null)
	const isTitleVisible = ref(true)
	const currentProject = useState('currentProject', () => ({}))

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
		let mm = gsap.matchMedia()

		mm.add('(min-width: 481px)', () => {
			trigger = ScrollTrigger.create({
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

		const observer = new IntersectionObserver(
			([entry]) => {
				isTitleVisible.value = entry.isIntersecting
				if (!isTitleVisible.value) {
					gsap.to($fixedTitle.value, { opacity: 1, duration: 0.3 })
				} else {
					gsap.to($fixedTitle.value, { opacity: 0, duration: 0.3 })
				}
			},
			{ threshold: 0 }
		)

		if ($heroTitle.value) {
			observer.observe($heroTitle.value)
		}

		currentProject.value = project.value
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
		<h1 ref="$fixedTitle" class="fixed-title">
			{{ project.title }}
		</h1>
		<section
			ref="$hero"
			class="hero"
		>
			<video
				v-if="project.mainVideoUrl"
				class="hero__video"
				:src="project.mainVideoUrl"
				autoplay
				muted
				loop
				playsinline
			/>
			<SanityImage
				v-else
				class="hero__banner"
				:asset-id="project.mainImage.asset._ref"
				auto="format"
				:q="75"
			/>
			<h1 ref="$heroTitle" class="hero__title">
				{{ project.title }}
			</h1>
		</section>
		<div class="main">
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
							Gallery
						</h2>
						<span class="gallery__counter">{{
							$galleryMedia ? $galleryMedia.length : ""
						}}</span>
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
									:key="image._key"
									ref="$galleryMedia"
									:class="{
										vertical:
											image.assetRef.metadata.dimensions.aspectRatio < 1,
									}"
								>
									<div class="item__image">
										<SanityImage
											auto="format"
											:asset-id="image.asset._ref"
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
								/>
							</div>
						</li>
					</ul>
				</GridContainer>
			</section>
			<section
				v-if="project.credits"
				ref="$credits"
				class="credits"
			>
				<GridContainer>
					<header class="credits__header">
						<p>Credits: </p>
					</header>
					<div class="credits__content">
						<SanityContent :blocks="project.credits" />
					</div>
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
			flex-flow: row wrap;
			justify-content: center;
		}

		.item__inner li.vertical {
			display: flex;
			flex: 0 0 50%;
			padding: 2rem;
			@include viewport-480 {
				padding: 1rem;
			}
		}

		.item__inner li.vertical:nth-child(1) {
			margin-top: 12rem;
			@include viewport-480 {
				padding: 1rem;
			}
		}

		.content {
			&__claim {
				grid-column: 2 / span 5;
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
					font-size: $mobile-h4;
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

		.gallery {
			margin-top: 12rem;

			&__title-container {
				display: flex;
				grid-column: 1 / -1;
				align-items: flex-start;
			}

			&__title {
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
				margin-bottom: 6rem;
				@include grid(12, 1fr, 1, 0);

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
							margin-top: 6rem;
						}
					}

					&__inner {
						li {
							&:not(:first-child) {
								margin-top: 12rem;

								@include viewport-768 {
									margin-top: 9rem;
								}

								@include viewport-480 {
									margin-top: 6rem;
								}
							}
						}
					}
				}
			}
		}

		.credits {
			margin-bottom: 9rem;
			margin-top: 4rem;

			@include viewport-480 {
				margin-bottom: 6rem;
				margin-top: 6rem;
				font-size: $mobile-text-read;
			}

			&__header {
				grid-column: 2/span 6;
				font-weight: bold;
				font-size: 2rem;

				&--is-empty {
					padding-bottom: 6rem;

					@include viewport-480 {
						padding-bottom: 12rem;
					}
				}

				@include viewport-480 {
					grid-column: 2 / -1;
				}
			}

			&__content {
				grid-column: 2/span 6;
				// margin-top: 2rem;

				@include viewport-480 {
					grid-column: 2 / -1;
					font-size: $mobile-text-read;
				}

				p, h4 {
					margin-bottom: 1rem;
				}

				a {
					display: inline;
					text-decoration: underline;
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
					grid-column: 2 / span 10;
					@include grid(12, 1fr, 1, 0);
				}

				.item {
					grid-column: auto / span 3;
					@include grid(3, 1fr, 1, 0);

					@include viewport-768 {
						grid-column: auto / span 5;
					}

					@include viewport-480 {
						grid-column: 2 / -1;

						&:not(:first-child) {
							margin-top: 3rem;
						}
					}

					&__label {
						grid-column: 1 / span 2;
						color: $medium-grey;

						@include viewport-480 {
							grid-column: 2 / -1;
						}
					}

					&__text {
						grid-column: 1 / span 2;

						@include viewport-480 {
							grid-column: 2 / -1;
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
