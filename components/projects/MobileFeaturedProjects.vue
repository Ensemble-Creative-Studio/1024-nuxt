<script setup>
	import gsap from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
	import { useRouter } from 'vue-router'
	import { onMounted, onBeforeUnmount, watch, computed } from 'vue'

	gsap.registerPlugin(ScrollTrigger)

	const props = defineProps({
		showreel: {
			type: String,
			required: true,
		},
		showreelMobile: {
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

	const router = useRouter()
	const $ctx = ref()
	const $mobileFeaturedProjects = ref()
	const tl = gsap.timeline()

	const currentVideo = ref(props.showreel)

	const videoSource = computed(() => {
		return currentVideo.value
	})

	const updateVideoSource = () => {
		if (window.innerWidth <= 768) {
			currentVideo.value = props.showreelMobile || props.showreel
		} else {
			currentVideo.value = props.showreel || props.showreelMobile
		}
	}

	onMounted(() => {
		setupScrollTriggers()
		setupScrollRedirection()
		updateVideoSource()
		window.addEventListener('resize', updateVideoSource)
	})

	onBeforeUnmount(() => {
		ScrollTrigger.getAll().forEach(trigger => trigger.kill())
		window.removeEventListener('resize', updateVideoSource)
	})

	const setupScrollTriggers = () => {
		$ctx.value = gsap.context((self) => {
			const chunks = self.selector('.title__chunk')
			const title = self.selector('.title')

			ScrollTrigger.create({
				trigger: title,
				start: 'top 80%',
				onEnter: () => {
					tl.to(chunks, {
						duration: 2.5,
						autoAlpha: 1,
						ease: 'power2.out',
						stagger: 0.03,
					})
				},
			})

		}, $mobileFeaturedProjects.value)
	}


	const setupScrollRedirection = () => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					gsap.to('.all-projects-wrapper', {
						opacity: 1,
						duration: 1,
						onComplete: () => {
							gsap.delayedCall(2, () => {
								gsap.to('.all-projects-wrapper', {
									opacity: 0,
									duration: 0.5,
									onComplete: () => {
										router.push({ name: 'projects' })
									}
								})
							})
						}
					})
				}
			})
		}, {
			root: null,
			threshold: 0.7
		})

		const bottomAnchor = $mobileFeaturedProjects.value.querySelector('.bottom-anchor')
		if (bottomAnchor) {
			observer.observe(bottomAnchor)
		} else {
			console.error('bottom-anchor not found')
		}
	}

	watch(() => props.showreel, () => {
		ScrollTrigger.getAll().forEach(trigger => trigger.kill())
		setupScrollTriggers()
	})

	const splitBaseline = computed(() => {
		return props.baseline.split(' ')
	})

	const handleVideoClick = () => {
		if (props.showreelLink) {
			window.location.href = props.showreelLink
		} else if (props.projects[0]) {
			router.push({
				name: 'projects-slug',
				params: { slug: props.projects[0].slug.current },
			})
		}
	}

	const navigateToProject = (slug) => {
		router.push({ path: `/project/${slug.current}` })
	}

</script>

<template>
	<div ref="$mobileFeaturedProjects" class="MobileFeaturedProjects">
		<div
			class="MobileFeaturedProject"
			@click="handleVideoClick"
		>
			<div class="MobileFeaturedProject__overlay" />
			<div class="MobileFeaturedProject__thumbnail">
				<video
					:src="videoSource"
					autoplay
					muted
					loop
					playsinline
					webkit-playsinline
				/>
			</div>
		</div>

		<div class="title-container">
			<h1 class="title">
				<span
					v-for="(word, index) in splitBaseline"
					:key="index"
					class="title__chunk"
				>
					{{ word }}{{ index !== splitBaseline.length - 1 ? ' ' : '' }}
				</span>
			</h1>
		</div>

		<!-- Project Grid -->
		<div class="grid-section projects-grid">
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
		</div>

		<!-- Expertises Grid -->
		<div v-if="expertises && expertises.length > 0" class="grid-section expertise-grid">
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
		</div>

		<div ref="allProjectFooter" class="FeaturedProject footer">
			<div class="backgroundBlack" />
			<a href="/projects" class="FeaturedProject__title">
				<div class="FeaturedProject__footer">
					All Projects
				</div>
			</a>
		</div>

		<!-- Élément déclencheur pour la navigation automatique -->
		<div class="bottom-anchor"></div>
	</div>
</template>

<style lang="scss">
	.MobileFeaturedProjects {

		.GridContainer {
			align-items: center;
			height: inherit;
		}

		.title-container {
			position: sticky;
			top: 0;
			background-color: black;
		}

		.title {
			grid-column: 1 / span 10;
			max-width: 22ch;
			padding-top: 1rem;
			font-size: $mobile-h4;
			margin-bottom: 6rem;
			margin-left: 1rem;
			position: sticky;
			top: 0;
			padding-top: 6rem;
			background-color: black;

			&__chunk {
				opacity: 0;

				&:first-child {
					margin-left: 0;
				}
			}
		}

		.MobileFeaturedProject {
			position: sticky;
			top: 0;
			height: 100dvh;
			margin-top: 4rem;
			margin-bottom: 4rem;
			background-color: $black;
			transition: filter 0.3s ease-in-out;

				.MobileFeaturedProject__title {
					opacity: 1;
					font-size: 18px;
				}


			&__overlay {
				position: absolute;
				top: 0;
				left: 0;
				z-index: 10;
				width: 100%;
				height: 100%;
				visibility: hidden;
				background-color: $black;
				opacity: 0;
				transition: ease-in-out 0.5s;
			}

			&__thumbnail {
				position: relative;
				width: 100%;
				height: 100dvh;
				padding-top: calc(4.4 / 3.6 * 100%);

				img,
				video {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}

			&__title {
				margin: 1rem;
				font-size: 18px;
				transition: opacity 0.3s ease-in-out;
			}
		}

		&__title {
			font-size: $mobile-h2;
			color: $medium-grey;
			white-space: nowrap;
			transition: color 0.5s ease-in-out;

			&:not(:last-child) {
				margin-right: 7rem;
			}

			&--active {
				color: $white;
			}

			&--all-projects {
				text-decoration: underline;
				text-decoration-thickness: from-font;
				text-underline-offset: 0.5rem;
			}
		}

		.all-projects-wrapper {
			margin-left: 1rem;
			margin-bottom: 2rem;
			opacity: 0;
		}

		.all-projects-title {
			font-size: $mobile-h4;
			color: $white;
			text-decoration: underline;
			text-decoration-thickness: from-font;
			text-underline-offset: 0.5rem;
		}

		.grid-section {
			padding: 4rem 1rem;
			background-color: $black;

			.grid-title {
				margin-bottom: 2rem;
				font-size: $mobile-h2;
				color: white;
			}

			.grid-container {
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				gap: 1rem;
			}

			.grid-item {
				position: relative;
				cursor: pointer;

				.grid-image {
					width: 100%;
					height: auto;
					aspect-ratio: 4/3;
					object-fit: cover;
					margin-bottom: 0.5rem;
				}

				.grid-item-title {
					font-size: $mobile-h4;
					color: white;
				}
			}
		}

		.projects-grid {
			background-color: $black;
			height: 100vh;
			position: sticky;
			top: 0;
		}

		.expertise-grid {
			background-color: $black;
			height: 100vh;
			position: sticky;
			top: 0;
		}
	}

	.bottom-anchor {
		margin-top: -10px;
		height: 10px;
		width: 100%;
	}

</style>
