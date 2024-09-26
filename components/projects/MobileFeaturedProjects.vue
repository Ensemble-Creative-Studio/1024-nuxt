<script setup>
	import gsap from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
	import { useRouter } from 'vue-router'

	const props = defineProps({
		firstProject: {
			type: Object,
			required: true,
		},
		baseline: {
			type: String,
			required: true,
		},
		projects: {
			type: Array,
			required: true,
		}
	})

	const router = useRouter()
	const $ctx = ref()
	const $mobileFeaturedProjects = ref()
	const $bottomAnchor = ref()

	const tl = gsap.timeline()

	onMounted(() => {
		$ctx.value = gsap.context((self) => {
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

			const panels = self.selector('.MobileFeaturedProject')

			panels.forEach((panel, i) => {
				ScrollTrigger.create({
					trigger: panel,
					id: `panel-${ i }`,
					onUpdate: (self) => {
						if (self.progress > 0.3) {
							panel.classList.add('visible')
						}

						if (self.progress > 0.8 || self.progress < 0.3) {
							panel.classList.remove('visible')
						}
					},
				})
			})

			// Redirect to projects page when the bottom anchor is visible
			ScrollTrigger.create({
				trigger: $bottomAnchor.value,
				start: 'top bottom',
				onEnter: () => {
					router.push({ name: 'projects' })
				}
			})
		}, $mobileFeaturedProjects.value)
	})

	const splitBaseline = computed(() => {
		return props.baseline.split(' ')
	})

	const totalProjects = [ props.firstProject, ...props.projects ]

	onBeforeUnmount(() => {
		$ctx.value.revert()
		ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
	})
</script>

<template>
	<div ref="$mobileFeaturedProjects" class="MobileFeaturedProjects">
		<h1 class="title">
			<span
				v-for="(word, index) in splitBaseline"
				:key="index"
				class="title__chunk"
			>
				{{ word }}{{ index !== splitBaseline.length - 1 ? ' ' : '' }}
			</span>
		</h1>
		<NuxtLink
			v-for="project in totalProjects"
			:key="project._id"
			:to="{
				name: 'projects-slug',
				params: { slug: project.slug.current },
			}"
			class="MobileFeaturedProject"
		>
			<div class="MobileFeaturedProject__overlay" />
			<div class="MobileFeaturedProject__thumbnail">
				<video
					v-if="project.mainVideoUrl"
					:src="project.mainVideoUrl"
					autoplay
					muted
					loop
					playsinline
					webkit-playsinline
				/>
				<SanityImage
					v-else
					:asset-id="project.mainImage.asset._ref"
					auto="format"
					:q="75"
				/>
			</div>
			<h2 class="MobileFeaturedProject__title" v-html="project.title" />
		</NuxtLink>
		<!-- Detect the bottom of the page -->
		<div ref="$bottomAnchor" class="bottom-anchor"></div>
	</div>
</template>

<style lang="scss">
	.MobileFeaturedProjects {
		padding: 0 1rem;

		.GridContainer {
			align-items: center;
			height: inherit;
		}

		.title {
			grid-column: 1 / span 10;
			max-width: 22ch;
			padding-top: 6rem;
			font-size: $mobile-h4;

			&__chunk {
				opacity: 0;

				&:first-child {
					margin-left: 0;
				}
			}
		}

		.MobileFeaturedProject {
			position: relative;
			height: 100%;
			margin-top: 4rem;
			background-color: $black;
			filter: grayscale(100%);
			transition: filter 0.3s ease-in-out;

			&.visible {
				filter: none;

				.MobileFeaturedProject__title {
					opacity: 1;
					font-size: 18px;
				}
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
				height: 100%;
				height: 0;
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
				margin: 1rem 0;
				font-size: 18px;
				opacity: 0.35;
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
	}

	.bottom-anchor {
		height: 1px;
		width: 100%;
	}
</style>
