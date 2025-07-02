<script setup>
	import gsap from 'gsap'
	import ScrollTrigger from 'gsap/ScrollTrigger'
	import { wait } from '@/utils/wait'

	const props = defineProps({
		projects: [ Object ],
		categories: [ Object ],
		order: String,
		displayMode: String,
	})

	// Animations
	const $tl = ref()
	const $ctx = ref()
	const $projectsList = ref()

	const showProjects = () => {
		$ctx.value = gsap.context((self) => {
			const projects = self.selector('.ProjectsList .item')

			$tl.value = gsap.to(projects, {
				delay: 0.5,
				duration: 1,
				autoAlpha: 1,
				ease: 'power3.out',
				stagger: 0.1,
			})
		}, $projectsList.value)
	}

	const updateProjects = () => {
		window.scrollTo(0, 0)

		const projects = $projectsList.value.querySelectorAll('.ProjectsList .item')
		projects.forEach((project) => {
			project.style.opacity = '1'
		})
	}

	const hideProjects = () => {
		$ctx.value = gsap.context((self) => {
			const projects = self.selector('.ProjectsList .item')

			$tl.value = gsap.to(projects, {
				duration: 0.5,
				autoAlpha: 0,
				ease: 'power3.out',
				stagger: 0.1,
			})
		}, $projectsList.value)
	}

	const addVideoHoverListeners = () => {
		const items = $projectsList.value.querySelectorAll('.item')

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
		if (window.innerWidth <= 768) { // Ajustez cette valeur selon votre définition de mobile
			const items = $projectsList.value.querySelectorAll('.item');

			const observer = new IntersectionObserver((entries) => {
				entries.forEach(entry => {
					const item = entry.target;
					const video = item.querySelector('video');

					if (entry.isIntersecting) {
						if (video) {
							video.play();
							video.style.visibility = 'visible';
							video.style.opacity = '1';
						}
					} else {
						if (video) {
							video.pause();
							video.currentTime = 0;
							video.style.visibility = 'hidden';
							video.style.opacity = '0';
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
			trigger.kill() // Remove the trigger and animation
		})
		$ctx.value.revert()
	})

	watch(() => props.projects, async () => {
		await wait(0)
		updateProjects()
	})
</script>

<template>
	<ul v-if="projects.length > 0" ref="$projectsList" class="ProjectsList">
		<li v-for="item in projects" :key="item._id" class="item">
			<NuxtLink
				:key="item._id"
				class="item__link"
				:to="{ name: 'projects-slug', params: { slug: item.slug.current } }"
			>
				<div class="item__container">
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
					<div class="item__meta">
						<h3
							v-if="item.title"
							class="item__title"
						>
							{{ item.title }}
						</h3>
						<ul
							v-if="item.categories"
							class="item__categories item__categories--mobile"
						>
							<li
								v-for="category in item.categories"
								:key="category._id"
								class="item__category"
							>
								{{ category.title }}
							</li>
						</ul>
					</div>
					<div
						v-if="item.releaseDate"
						class="item__date"
					>
						{{ item.releaseDate.slice(0, 4) }}
					</div>
					<ul
						v-if="item.categories"
						class="item__categories"
					>
						<li
							v-for="category in item.categories"
							:key="category._id"
							class="item__category"
						>
							{{ category.title }}
						</li>
					</ul>
				</div>
			</NuxtLink>
		</li>
	</ul>
	<div
		v-else
		class="ProjectsList--empty"
	>
		No project matching your filters
	</div>
</template>

<style lang="scss">
	.ProjectsList {
		grid-column: 1 / -1;
		padding-bottom: 5rem;

		&--empty {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100vh;
		}

		.item {
			font-size: $desktop-list;
			border-top: 0.1rem solid $dark-grey;
			transition: background-color 0.2s ease-in-out;

			// height: 16rem;

			.projects & {
				opacity: 0;
			}

			@include viewport-768 {
				height: auto;
				padding: 2rem 0;
				font-size: $tablet-list;
			}

			@include viewport-480 {
				font-size: $mobile-list;
			}

			&:hover {
				background-color: $dark-dark-grey;
			}

			&__link {
				height: 100%;
			}

			&__container {
				@include grid(12, 1fr, 1, 0);

				position: relative;
				align-items: center;
				height: 100%;
				padding: 1rem 2rem;

				@include viewport-480 {
					padding: 0 1rem;
				}
			}

			&__date {
				grid-column: auto / span 2;
				color: $medium-grey;

				@include viewport-480 {
					grid-column: 11 / span 2;
				}
			}

			&__meta {
				grid-column: 3 / span 2;

				@include viewport-768 {
					grid-column: 3 / span 6;
				}

				@include viewport-480 {
					grid-column: 6 / span 5;
				}
			}

			&__categories {
				grid-column: auto / span 6;
				color: $medium-grey;

				// REWORK
				@include viewport-768 {
					display: none;
					flex-direction: column;
					grid-row: 2;
					grid-column: 3 / span 6;
				}

				&--mobile {
					display: none;

					@include viewport-768 {
						display: block;
					}
				}
			}

			&__category {
				display: inline-block;

				&:not(:last-child) {
					&::after {
						content: ",\00a0";
					}
				}
			}

			&__thumbnail {
				position: relative;
				grid-column: auto / span 2;
				margin-left: 0;
				pointer-events: none;

				@include viewport-480 {
					grid-column: auto / span 4;
				}

				img {
					width: 50%;
					aspect-ratio: 1 / 1;
					object-fit: cover;
					transition: 0.25s ease-in-out;

					@include viewport-480 {
						width: 100%;
					}
				}

				video {
					position: absolute;
					top: 0;
					left: 0;
					width: 50%;
					aspect-ratio: 1 / 1;
					visibility: hidden;
					object-fit: cover;
					opacity: 0;
					transition: 0.25s ease-in-out;

					@include viewport-480 {
						width: 100%;
					}
				}
			}


			&:hover video {
				visibility: visible;
				opacity: 1;
			}
		}
	}
</style>
