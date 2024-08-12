<script setup>
	import gsap from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'

	const isMobile = shallowRef(false)

	function onResize() {
		if (matchMedia('(hover: none)').matches) {
			isMobile.value = true
		} else {
			isMobile.value = false
		}
	}

	const props = defineProps({
		firstProject: [ Object ],
		projects: [ Object ],
		baseline: [ String ],
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

			panels.forEach((panel, i) => {
				ScrollTrigger.create({
					trigger: panel,
					pin: true,
					pinSpacing: false,
					id: `pin-${ i }`,
					onUpdate: (self) => {
						if (self.progress > 0.5) {
							panel.classList.add('off')
						} else {
							panel.classList.remove('off')
						}
					},
				})

				ScrollTrigger.create({
					trigger: panel,
					top: '100% 100%',
					id: `title-${ i }`,
					onEnter: () => {
						if (panelTitles[ i ]) panelTitles[ i ].classList.add('FeaturedProject__title--active')
					},
				})

				ScrollTrigger.create({
					trigger: $baseline.value,
					top: '100% 200%',
					onEnter: () => {
						if (!isMobile.value) {
							const chunks = self.selector('.title__chunk')
							for (let i = chunks.length - 1; i > 0; i--) {
								const j = Math.floor(Math.random() * (i + 1))
								;[ chunks[ i ], chunks[ j ] ] = [ chunks[ j ], chunks[ i ] ]
							}
							tl.to(chunks, {
								duration: 2.5,
								autoAlpha: 1,
								ease: 'power2.out',
								stagger: 0.03,
							})
						}
					},
				})
			})
		}, $featuredProjects.value)

		if (allProjectFooter.value) {
			ScrollTrigger.create({
				trigger: allProjectFooter.value,
				start: 'top bottom',
				end: 'bottom top',
				onEnter: () => {
					const backgroundBlack = document.querySelector('.backgroundBlack')
					if (backgroundBlack) {
						gsap.to(backgroundBlack, { opacity: 1, duration: 0.1 })
					}
					if (window.scrollY + window.innerHeight
						>= allProjectFooter.value.offsetTop + allProjectFooter.value.offsetHeight) {
						window.location.href = '/projects'
					}
				},
				onLeaveBack: () => {
					const backgroundBlack = document.querySelector('.backgroundBlack')
					if (backgroundBlack) {
						gsap.to(backgroundBlack, { opacity: 0, duration: 0.1 })
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
</script>

<template>
	<div
		ref="$featuredProjects"
		class="FeaturedProjects"
	>
		<FeaturedProject :project="firstProject" />
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
		<FeaturedProject
			v-for="project in projects"
			:key="project._id"
			:project="project"
		/>
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
		z-index: 1;
		height: 40vh !important;
		background-color: black;
	}

	.FeaturedProject.footer a {
		display: flex;
		align-items: center;
		height: 100%;
		padding-left: 10rem;
	}

	.backgroundBlack {
		position: fixed; /* Added this */
		right: 0;
		bottom: 0; /* Adjust this value to control how much it overflows */
		left: 0;
		z-index: -1; /* Put it behind other content */
		height: 10rem;
		background-color: black;
		opacity: 0;
	}

	.FeaturedProjects {
		.FeaturedProject {
			position: relative;
			height: 120vh;
			transition: filter 0.5s ease-in-out;

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

				@include viewport-480 {
					bottom: 1rem;
					left: 1rem;
					font-size: $mobile-h2;
				}
			}

			&__title {
				font-size: $desktop-h4;
				opacity: 0;
				transition: 1s cubic-bezier(0.16, 1, 0.3, 1);
				transition-property: opacity, transform;
				transform: translateY(10rem);

				&--active {
					opacity: 1;
					transform: translateY(0);
				}
			}

			&__thumbnail {
				height: 100%;

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
				margin-top: 28rem;
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
	}
</style>
