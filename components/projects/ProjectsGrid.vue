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

			const observer = new IntersectionObserver((entries) => {
				// Grouper les éléments visibles par viewport
				const visibleItems = entries
					.filter(entry => entry.isIntersecting)
					.map(entry => {
						observer.unobserve(entry.target)
						return entry.target
					})

				if (visibleItems.length > 0) {
					// Créer une nouvelle timeline pour ce groupe d'éléments
					const tl = gsap.timeline()

					// Calculer la position verticale relative de chaque élément dans le viewport
					const sortedItems = visibleItems.sort((a, b) => {
						return a.getBoundingClientRect().top - b.getBoundingClientRect().top
					})

					// Animer les éléments dans l'ordre de leur position
					sortedItems.forEach((item, index) => {
						tl.to(item, {
							y: 0,
							duration: 0.8, // Durée réduite pour une animation plus rapide
							autoAlpha: 1,
							ease: 'power3.out',
						}, index * 0.05) // Délai réduit entre les éléments
					})
				}
			}, {
				threshold: 0.1,
				rootMargin: '0px 0px -10% 0px'
			})

			// État initial
			projects.forEach((project) => {
				gsap.set(project, {
					y: 30,
					autoAlpha: 0
				})
				observer.observe(project)
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

	// Animer les deux dernières vidéos car elles n'iront jamais dans l'IntersectionObserver car trop basse
	const animateLastTwoVideos = () => {
		if (window.innerWidth <= 768) {
			const items = Array.from($projectsGrid.value.querySelectorAll('.item'));
			const lastTwoItems = items.slice(-2);

			lastTwoItems.forEach((item, index) => {
				item.setAttribute('data-id', `item-${index + 1}`);
			});

			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					const img = entry.target.querySelector('img');
					if (entry.isIntersecting) {
						const itemId = entry.target.getAttribute('data-id');
						if (img) {
							setTimeout(() => {
								img.style.filter = 'grayscale(0)';
							}, 300); // Délai de 0.3 secondes
						}
					} else {
						if (img) {
							img.style.filter = 'grayscale(100%)';
						}
					}
				});
			}, {
				root: null,
				threshold: 0.5
			});

			lastTwoItems.forEach(item => {
				observer.observe(item);
			});
		}
	};

	onMounted(() => {
		showProjects()
		addVideoHoverListeners()
		addVideoMobileAnimation()
		animateLastTwoVideos()
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
		grid-template-columns: repeat(4, 1fr);
		gap: 5rem 4rem;
		padding: 0 2.5rem;
		overflow: hidden;

		@include viewport-480 {
			padding: 0 1rem;
			grid-template-columns: repeat(2, 1fr);
			gap: 3rem 2rem;
		}

		.item {
			opacity: 0;
			transform: translateY(3rem);
			will-change: transform, opacity;

			@include viewport-768 {
				grid-column: auto / span 1;
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
			grid-template-columns: repeat(4, 1fr);

			@include viewport-480 {
				grid-template-columns: repeat(2, 1fr);
			}

			.item {
				@include viewport-768 {
					grid-column: auto / span 1;
				}
			}
		}

		&--six-items {
			grid-template-columns: repeat(4, 1fr);

			@include viewport-480 {
				grid-template-columns: repeat(2, 1fr);
			}

			.item {
				@include viewport-768 {
					grid-column: auto / span 1;
				}
			}
		}

		&--four-items {
			grid-template-columns: repeat(4, 1fr);

			@include viewport-480 {
				grid-template-columns: repeat(2, 1fr);
			}

			.item {
				@include viewport-768 {
					grid-column: auto / span 1;
				}
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
