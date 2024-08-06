<script setup>
	import gsap from "gsap"
	import ScrollTrigger from "gsap/ScrollTrigger"
	import { wait } from "@/utils/wait"

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
			const projects = self.selector(".ProjectsList .item")

			$tl.value = gsap.to(projects, {
				delay: 0.5,
				duration: 1,
				autoAlpha: 1,
				ease: "power3.out",
				stagger: 0.1,
			})
		}, $projectsList.value)
	}

	const updateProjects = () => {
		window.scrollTo(0, 0)

		const projects = $projectsList.value.querySelectorAll(".ProjectsList .item")
		projects.forEach((project) => {
			project.style.opacity = "1"
		})
	}

	const hideProjects = () => {
		$ctx.value = gsap.context((self) => {
			const projects = self.selector(".ProjectsList .item")

			$tl.value = gsap.to(projects, {
				duration: 0.5,
				autoAlpha: 0,
				ease: "power3.out",
				stagger: 0.1,
			})
		}, $projectsList.value)
	}

	const addVideoHoverListeners = () => {
		const items = $projectsList.value.querySelectorAll(".item")

		items.forEach((item) => {
			const video = item.querySelector("video")

			item.addEventListener("mouseenter", () => {
				if (video) {
					video.play()
				}
			})

			item.addEventListener("mouseleave", async () => {
				if (video) {
					video.pause()
					await wait(200)
					video.currentTime = 0
				}
			})
		})
	}

	onMounted(() => {
		showProjects()
		addVideoHoverListeners()
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
	<ul class="ProjectsList"
		ref="$projectsList"
		v-if="projects.length > 0"
	>
		<template
			v-for="item in projects"
			:key="item._id"
		>
			<li class="item">
				<NuxtLink
					class="item__link"
					:to="{ name: 'projects-slug', params: { slug: item.slug.current } }"
					:key="item._id"
				>
					<div class="item__container">
						<div class="item__thumbnail">
							<SanityImage
								v-if="item.mainImage"
								:asset-id="item.mainImage.asset._ref"
								auto="format"
							/>
							<video
								v-if="item.thumbnailVideoUrl"
								:src="item.thumbnailVideoUrl"
								muted
								loop
								playsinline
								webkit-playsinline
							></video>
						</div>
						<div class="item__meta">
							<h3
								class="item__title"
								v-if="item.title"
							>
								{{ item.title }}
							</h3>
							<ul
								class="item__categories item__categories--mobile"
								v-if="item.categories"
							>
								<li
									class="item__category"
									v-for="category in item.categories"
									:key="category._id"
								>
									{{ category.title }}
								</li>
							</ul>
						</div>
						<div
							class="item__date"
							v-if="item.releaseDate"
						>
							{{ item.releaseDate.slice(0, 4) }}
						</div>
						<ul
							class="item__categories"
							v-if="item.categories"
						>
							<li
								class="item__category"
								v-for="category in item.categories"
								:key="category._id"
							>
								{{ category.title }}
							</li>
						</ul>
					</div>
				</NuxtLink>
			</li>
		</template>
	</ul>
	<div v-else
		class="ProjectsList--empty">No project matching your filters</div>
</template>

<style lang="scss">
	.ProjectsList {
		grid-column: 1 / -1;
		padding-bottom: 5rem;

		&--empty {
			align-items: center;
			display: flex;
			height: 100vh;
			justify-content: center;
		}

		.item {
			border-top: 0.1rem solid $dark-grey;
			font-size: $desktop-list;
			transition: background-color 0.2s ease-in-out;

			// height: 16rem;

			.projects & {
				opacity: 0;
			}

			@include viewport-768 {
				font-size: $tablet-list;
				height: auto;
				padding: 2rem 0;
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

				align-items: center;
				height: 100%;
				padding: 1rem 2rem;
				position: relative;

				@include viewport-480 {
					padding: 0 1rem;
				}
			}

			&__date {
				color: $medium-grey;
				grid-column: auto / span 2;

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
				color: $medium-grey;
				grid-column: auto / span 6;

				// REWORK
				@include viewport-768 {
					display: none;
					flex-direction: column;
					grid-column: 3 / span 6;
					grid-row: 2;
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
				grid-column: auto / span 2;
				margin-left: 0;
				pointer-events: none;
				position: relative;

				@include viewport-480 {
					grid-column: auto / span 4;
				}

				img {
					aspect-ratio: 1 / 1;
					filter: grayscale(100%);
					object-fit: cover;
					transition: 0.25s ease-in-out;
					width: 50%;

					@include viewport-480 {
						width: 100%;
					}
				}

				video {
					aspect-ratio: 1 / 1;
					left: 0;
					object-fit: cover;
					opacity: 0;
					position: absolute;
					top: 0;
					transition: 0.25s ease-in-out;
					visibility: hidden;
					width: 50%;

					@include viewport-480 {
						width: 100%;
					}
				}
			}

			&:hover img {
				filter: grayscale(0);
			}

			&:hover video {
				opacity: 1;
				visibility: visible;
			}
		}
	}
</style>
