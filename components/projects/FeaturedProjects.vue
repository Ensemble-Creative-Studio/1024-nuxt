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
		baseline: {
			type: String,
			required: true,
		},
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
				top: '100% 200%',
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

	const handleVideoClick = () => {
		router.push({ name: 'projects' })
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
				font-size: $desktop-h4;
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
