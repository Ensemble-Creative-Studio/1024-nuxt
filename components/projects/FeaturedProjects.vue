<script setup>
	import gsap from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
	import { useRouter } from 'vue-router'

	const isMobile = shallowRef(false)
	const router = useRouter()

	function onResize() {
		if (matchMedia('(hover: none)').matches) {
			isMobile.value = true
		} else {
			isMobile.value = false
		}
	}

	const props = defineProps({
		showreel: {
			type: String,
			required: true,
		},
		showreelLink: {
			type: String,
			default: '',
		},
		baseline: {
			type: String,
			required: true,
		},
		projects: {
			type: Array,
			required: true,
		},
		expertises: {
			type: Array,
			required: true,
		}
	})

	const handleScroll = () => {
		let scrollTop = window.scrollY

		if (scrollTop < window.innerHeight) {
			$hero.value.style.opacity = 1 - (scrollTop / window.innerHeight) * 5
		}
	}

	const splitBaseline = computed(() => {
		return props.baseline.split(' ')
	})

	const $featuredProjects = ref()
	const $ctx = ref(null)
	const $baseline = ref(null)

	const tl = gsap.timeline()
	const allProjectFooter = ref(null)

	onMounted(() => {
		if (matchMedia('(hover: none)').matches) {
			isMobile.value = true
		}

		window.addEventListener('resize', onResize)

		$ctx.value = gsap.context(async (self) => {
			const panels = self.selector('.FeaturedProject')
			const panelTitles = self.selector('.FeaturedProject__title')

			ScrollTrigger.create({
				trigger: $baseline.value,
				start: 'top bottom',
				end: 'bottom top',
				onEnter: () => {
					if (!isMobile.value) {
						const chunks = self.selector('.title__chunk')
						tl.to(chunks, {
							duration: 2.5,
							autoAlpha: 1,
							ease: 'power2.out',
							stagger: 0.03,
						})
					}
				},
			})

			panels.forEach((panel, i) => {
				const title = panel.querySelector('.FeaturedProject__title');

				ScrollTrigger.create({
					trigger: panel,
					start: 'top top',
					end: 'bottom top',
					pin: true,
					pinSpacing: false,
					id: `pin-${i}`,
					onUpdate: (self) => {
						if (self.progress > 0.5) {
							panel.classList.add('off');
						} else {
							panel.classList.remove('off');
						}

						// Title stick to the bottom of the image and go up when scrolling
						if (title) {
							const moveDistance = panel.offsetHeight;
							gsap.set(title, {
								y: -moveDistance * self.progress,
								ease: 'none',
							});

						}
					},
				});
			})
		}, $featuredProjects.value)

		if (allProjectFooter.value) {
			ScrollTrigger.create({
				trigger: allProjectFooter.value,
				start: 'top 80%',
				onEnter: () => {
					const backgroundBlack = document.querySelector('.backgroundBlack')
					if (backgroundBlack) {
						gsap.to(backgroundBlack, {
							opacity: 1,
							duration: .7
						})
					}

					gsap.to('.FeaturedProject.footer', {
						duration: 1.5,
						opacity: 1,
						onComplete: () => {
							gsap.delayedCall(1, () => {
								router.push('/projects')
							})
						}
					})
				},
				onLeaveBack: () => {
					const backgroundBlack = document.querySelector('.backgroundBlack')
					if (backgroundBlack) {
						gsap.to(backgroundBlack, {
							opacity: 0,
							duration: .7
						})
					}
				},
			})
		}
	})

	onBeforeUnmount(() => {
		ScrollTrigger.getAll().forEach((trigger) => {
				trigger.kill()
		})

		$ctx.value.revert()
		window.removeEventListener('scroll', handleScroll)
		window.removeEventListener('resize', onResize)
	})

	const handleVideoClick = () => {
		if (props.showreelLink) {
			window.location.href = props.showreelLink
		} else {
			router.push({ name: 'projects' })
		}
	}

	const navigateToProject = (slug) => {
		router.push({ path: `/projects/${slug.current}` })
	}
</script>

<template>
	<div ref="$featuredProjects" class="FeaturedProjects">
		<div
			class="FeaturedProject showreel"
			@click="handleVideoClick"
		>
			<video
				:src="showreel"
				autoplay
				muted
				loop
				playsinline
				webkit-playsinline
				class="FeaturedProject__thumbnail"
			/>
		</div>
		<div
			v-if="!isMobile"
			ref="$baseline"
			class="FeaturedProject hero"
		>
			<GridContainer>
				<h1 class="title">
					<span
						v-for="(word, index) in splitBaseline"
						:key="index"
						class="title__chunk"
					>
						{{ word }}{{ index !== splitBaseline.length - 1 ? ' ' : '' }}
					</span>
				</h1>
			</GridContainer>
		</div>

		<!-- Project Grid -->
		<div class="grid-section projects-grid">
			<GridContainer>
				<h2 class="grid-title">Projets</h2>
				<div class="grid-container">
					<div
						v-for="project in projects"
						:key="project._id"
						class="grid-item"
						@click="navigateToProject(project.slug)"
					>
						<SanityImage
							:asset-id="project.mainImage.asset._ref"
							auto="format"
							:q="75"
							class="grid-image"
						/>
						<h3 class="grid-item-title">{{ project.title }}</h3>
					</div>
				</div>
			</GridContainer>
		</div>

		<!-- Expertises Grid -->
		<div v-if="expertises && expertises.length > 0" class="grid-section expertise-grid">
			<GridContainer>
				<h2 class="grid-title">Expertises</h2>
				<div class="grid-container">
					<div v-for="expertise in expertises" :key="expertise._key" class="grid-item">
						<SanityImage
							:asset-id="expertise.image.asset._ref"
							auto="format"
							:q="75"
							class="grid-image"
						/>
						<h3 class="grid-item-title">{{ expertise.caption }}</h3>
					</div>
				</div>
			</GridContainer>
		</div>

		<div ref="allProjectFooter" class="FeaturedProject footer">
			<div class="backgroundBlack" />
			<a href="/projects" class="FeaturedProject__title">
				<div class="FeaturedProject__footer">
					All Projects
				</div>
			</a>
		</div>
	</div>
</template>

<style lang="scss">
	.FeaturedProject.footer {
		position: relative;
		top: 0;
		z-index: 3;
		height: 30vh !important;
		background-color: black;
	}

	.FeaturedProject.footer a {
		display: flex;
		align-items: center;
		height: 100%;
		padding-left: 10rem;
		font-size: 4rem;

		@include viewport-480 {
			font-size: 3rem;
		}
	}

	.backgroundBlack {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: -1;
		height: 10rem;
		background-color: black;
		opacity: 0;
	}

	.FeaturedProjects {
		.FeaturedProject {
			position: relative;
			height: 100vh;
			transition: filter 0.5s ease-in-out;
			cursor: pointer;

			@include viewport-480 {
				margin-top: 0;
			}

			&__footer {
				position: sticky;
				bottom: 0;
				left: 0;
				display: flex;
				width: 100%;
				padding: 1.5rem 2rem;
				margin-top: 30px;

				@include viewport-480 {
					bottom: 1rem;
					left: 1rem;
					font-size: $mobile-h2;
				}
			}

			&__title {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				padding: 1rem;
				color: white;
				transition: none;
				transform: none;
			}

			&__thumbnail {

				img,
				video {
					height: 100%;
					object-fit: cover;
				}
			}
		}

		.hero {
			inset: 0;
			z-index: auto;
			box-sizing: border-box;
			display: block;
			float: none;
			height: 120vh;
			padding: 0;
			margin: 0;
			overflow: visible;
			background-color: $black;

			@include viewport-480 {
				display: none;
			}

			.title {
				position: sticky;
				bottom: 50%;
				grid-column: 2 / span 8;
				max-width: 110rem;
				margin-top: 14rem;
				font-size: $desktop-h4;

				@include viewport-1200 {
					grid-column: 1 / -1;
				}

				@include viewport-1024 {
					font-size: $mobile-h2;
				}

				@include viewport-480 {
					display: none;
				}

				&__chunk {
					opacity: 0;

					&:first-child {
						margin-left: 0;
					}
				}
			}
		}

		.grid-section {
			padding: 6rem 0;
			position: relative;
			width: 100%;

			.grid-title {
				grid-column: 1 / -1;
				margin-bottom: 2rem;
				font-size: $desktop-h2;
				color: white;

				@include viewport-480 {
					font-size: $mobile-h2;
				}
			}

			.grid-container {
				display: grid;
				grid-template-columns: repeat(4, 1fr);
				gap: 2rem;
				grid-column: 1 / -1;

				@include viewport-1024 {
					grid-template-columns: repeat(2, 1fr);
				}

				@include viewport-480 {
					grid-template-columns: 1fr;
				}
			}

			.grid-item {
				position: relative;
				cursor: pointer;

				.grid-image {
					width: 100%;
					height: auto;
					aspect-ratio: 4/3;
					object-fit: cover;
					margin-bottom: 1rem;
				}

				.grid-item-title {
					font-size: $desktop-h4;
					margin-top: 1rem;
					color: white;

					@include viewport-480 {
						font-size: $mobile-h4;
					}
				}
			}
		}

		.projects-grid {
			background-color: $black;
			min-height: 100vh;
			position: sticky;
			top: 0;
			z-index: 1;
		}

		.expertise-grid {
			background-color: $black;
			min-height: 100vh;
			position: sticky;
			top: 0;
			z-index: 2;
		}
	}
</style>
