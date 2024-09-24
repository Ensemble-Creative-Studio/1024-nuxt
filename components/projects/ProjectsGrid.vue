<script setup>
	import gsap from 'gsap'
	import ScrollTrigger from 'gsap/ScrollTrigger'
	import { wait } from '@/utils/wait'

	const props = defineProps({
		projects: [ Object ],
		order: String,
		displayMode: String,
		gridModeCols: Number,
	})

	const $projectsGrid = ref()
	const $tl = ref()
	const $ctx = ref()

	// Define GSAP animations
	const showProjects = () => {
		$ctx.value = gsap.context((self) => {
			const projects = self.selector('.ProjectsGrid .item')

			$tl.value = gsap.to(projects, {
				y: 0,
				delay: 0.5,
				duration: 1.5,
				autoAlpha: 1,
				ease: 'power3.out',
				stagger: 0.1,
			})
		}, $projectsGrid.value)
	}

	const updateProjects = () => {
		window.scrollTo(0, 0)

		const projects = $projectsGrid.value.querySelectorAll('.ProjectsGrid .item')
		projects.forEach((project) => {
			project.style.opacity = '1'
			project.style.transform = 'translateY(0)'
		})
	}

	const hideProjects = () => {
		$ctx.value = gsap.context((self) => {
			const projects = self.selector('.ProjectsGrid .item')

			$tl.value = gsap.to(projects, {
				y: 30,
				autoAlpha: 0,
				ease: 'none',
			})
		}, $projectsGrid.value)
	}

	const addVideoHoverListeners = () => {
		const items = $projectsGrid.value.querySelectorAll('.item')

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
			const items = $projectsGrid.value.querySelectorAll('.item');

			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					const item = entry.target;
					const video = item.querySelector('video');
					const img = item.querySelector('img');

					if (entry.isIntersecting) {
						if (video) {
							video.play();
							video.style.visibility = 'visible';
							video.style.opacity = '1';
						}
						if (img) {
							img.style.filter = 'grayscale(0)';
						}
					} else {
						if (video) {
							video.pause();
							video.currentTime = 0;
							video.style.visibility = 'hidden';
							video.style.opacity = '0';
						}
						if (img) {
							img.style.filter = 'grayscale(100%)';
						}
					}
				});
			}, {
				root: null,
				rootMargin: '-13% 0px -45% 0px',
				threshold: 0.5
			});

			items.forEach(item => {
				observer.observe(item);
			});
		}
	};

	onMounted(() => {
		showProjects()
		addVideoHoverListeners()
		addVideoMobileAnimation()
	})

	onBeforeUnmount(() => {
		hideProjects()
		ScrollTrigger.getAll().forEach((trigger) => {
			trigger.kill()
		})
		$ctx.value.revert()
	})

	watch(() => props.projects, async () => {
		await wait(0)
		updateProjects()
	})
</script>

<template>
	<ul
		v-if="projects.length > 0"
		ref="$projectsGrid"
		:class="[
			gridModeCols === 8 ? 'ProjectsGrid--eight-items' : gridModeCols === 6 ? 'ProjectsGrid--six-items' : 'ProjectsGrid--four-items', // Add new class for 8 columns
			'ProjectsGrid',
		]"
	>
		<template
			v-for="item in projects"
			:key="item._id"
		>
			<li class="item">
				<NuxtLink
					:key="item._id"
					class="item__link"
					:to="{ name: 'projects-slug', params: { slug: item.slug.current } }"
				>
					<div class="item__thumbnail">
						<SanityImage
							v-if="item.thumbnailImage || item.mainImage"
							:asset-id="
								item.thumbnailImage
									? item.thumbnailImage.asset._ref
									: item.mainImage.asset._ref
							"
							auto="format"
						/>
						<video
							v-if="item.thumbnailVideoUrl"
							:src="item.thumbnailVideoUrl"
							muted
							loop
							crossorigin="anonymous"
							playsinline
							webkit-playsinline
							preload="none"
							autobuffer="true"
						/>
					</div>
					<h3 class="item__title">
						{{ item.title }}
					</h3>
				</NuxtLink>
			</li>
		</template>
	</ul>
	<div
		v-else
		class="ProjectsGrid--empty"
	>
		No project matching your filters
	</div>
</template>

<style lang="scss">
	.ProjectsGrid {
		display: grid;
		grid-template-columns: repeat(4, 1fr); // Default to 4 columns
		gap: 5rem 4rem;
		padding: 0 2.5rem;
		overflow: hidden;

		@include viewport-480 {
			padding: 0 1rem;
			grid-template-columns: repeat(2, 1fr); // 2 columns on mobile
		}

		@include viewport-768 {
			grid-template-columns: repeat(4, 1fr); // 4 columns on intermediate breakpoint
		}

		@media (max-width: 1285px) {
			grid-template-columns: repeat(6, 1fr); // 6 columns on intermediate breakpoint under 1285px
		}

		.item {
			opacity: 0;
			transform: translateY(3rem);

			@include viewport-768 {
				grid-column: auto / span 2;
			}

			&__thumbnail {
				position: relative;
				aspect-ratio: 1 / 1;
				pointer-events: none;

				img {
					width: 100%;
					height: 100%;
					aspect-ratio: 1 / 1;
					object-fit: cover;
					filter: grayscale(100%);
					transition: 0.25s ease-in-out;
				}

				video {
					position: absolute;
					top: 0;
					left: 0;
					height: 100%;
					visibility: hidden;
					object-fit: cover;
					opacity: 0;
					transition: 0.25s ease-in-out;
				}
			}

			&:hover img {
				filter: grayscale(0);
			}

			&:hover video {
				visibility: visible;
				opacity: 1;
			}

			&__title {
				margin-top: 1rem;
			}
		}

		&--eight-items {
			grid-template-columns: repeat(8, 1fr); // 8 columns on desktop

			@media (max-width: 1285px) {
				grid-template-columns: repeat(6, 1fr); // 6 columns between 1285px and 992px
			}

			@include viewport-992 {
				grid-template-columns: repeat(4, 1fr); // 4 columns on intermediate breakpoint
			}

			@include viewport-480 {
				grid-template-columns: repeat(2, 1fr); // 2 columns on mobile
			}
		}

		&--six-items {
			grid-template-columns: repeat(6, 1fr);

			@include viewport-992 {
				grid-template-columns: repeat(4, 1fr); // 4 columns on intermediate breakpoint
			}

			@include viewport-480 {
				grid-template-columns: repeat(2, 1fr); // 2 columns on mobile
			}
		}

		&--four-items {
			grid-template-columns: repeat(4, 1fr);

			@include viewport-480 {
				grid-template-columns: repeat(2, 1fr); // 2 columns on mobile
			}
		}

		&--empty {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100vh;
		}
	}
</style>
