<script setup>
	import { wait } from '@/utils/wait'

	import gsap from 'gsap'

	const router = useRouter()

	const props = defineProps({
		baseline: {
			type: String,
			required: true,
		},
		projects: {
			type: Array,
			required: true,
		}
	})

	// Animations
	const $ctx = ref()
	const $tl = ref()
	const $mobileFeaturedProjects = ref()

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
		}, $mobileFeaturedProjects.value)
	})

	const splitBaseline = computed(() => {
		return props.baseline.split(' ')
	})

	// TODO! - Create a var that holds the first project + the rest of the projects
	// not reactive

	onBeforeUnmount(() => {
		$ctx.value.revert()
	})
</script>

<template>
	<div
		ref="$mobileFeaturedProjects"
		class="MobileFeaturedProjects"
	>
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
			v-for="project in projects"
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
		</NuxtLink>
	</div>
</template>

<style lang="scss">
	.MobileFeaturedProjects {
		padding: 0 1rem;

		.baseline {
			height: 100%;
			background-color: $black;

			.GridContainer {
				align-items: center;
				height: inherit;
			}

			.title {
				grid-column: 1 / span 10;
				font-size: $mobile-h4;

				&__chunk {
					opacity: 0;

					&:first-child {
						margin-left: 0;
					}
				}
			}
		}

		.MobileFeaturedProject {
			position: relative;
			height: 100%;
			background-color: $black;

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
				height: 100%;

				img,
				video {
					height: 100%;
					object-fit: cover;
				}
			}

			&__title {
				position: absolute;
				bottom: 0;
				padding: 1rem;
				font-size: $mobile-h2;
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
</style>
