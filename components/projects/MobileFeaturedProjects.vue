<script setup>
	import gsap from 'gsap'
	import { ScrollTrigger } from 'gsap/ScrollTrigger'
	import { useRouter } from 'vue-router'
	import { onMounted, onBeforeUnmount, watch } from 'vue'

	gsap.registerPlugin(ScrollTrigger)

	const props = defineProps({
		firstProject: {
			type: Object,
			required: true,
		},
		baseline: {
			type: String,
			required: true,
		}

	})

	const router = useRouter()
	const $ctx = ref()
	const $mobileFeaturedProjects = ref()
	const tl = gsap.timeline()

	onMounted(() => {
		setupScrollTriggers()
		setupScrollRedirection()
	})

	onBeforeUnmount(() => {
		ScrollTrigger.getAll().forEach(trigger => trigger.kill())
	})

	const setupScrollTriggers = () => {
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

			const panel = self.selector('.MobileFeaturedProject')

			ScrollTrigger.create({
				trigger: panel,
				id: `panel-0`,
				onUpdate: (self) => {
					if (self.progress > 0.3) {
						panel.classList.add('visible')
					}

					if (self.progress > 0.8 || self.progress < 0.3) {
						panel.classList.remove('visible')
					}
				},
			})

		}, $mobileFeaturedProjects.value)
	}


	const setupScrollRedirection = () => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					router.push({ name: 'projects' })
				}
			})
		}, {
			root: null,
			threshold: 0.1
		})

		const bottomAnchor = $mobileFeaturedProjects.value.querySelector('.bottom-anchor')
		if (bottomAnchor) {
			observer.observe(bottomAnchor)
		} else {
			console.error('bottom-anchor not found')
		}
	}

	watch(() => props.firstProject, () => {
		ScrollTrigger.getAll().forEach(trigger => trigger.kill())
		setupScrollTriggers()
	})

	const splitBaseline = computed(() => {
		return props.baseline.split(' ')
	})

</script>

<template>
	<div ref="$mobileFeaturedProjects" class="MobileFeaturedProjects">
		<NuxtLink
			:to="{
				name: 'projects-slug',
				params: { slug: props.firstProject.slug.current },
			}"
			class="MobileFeaturedProject"
		>
			<div class="MobileFeaturedProject__overlay" />
			<div class="MobileFeaturedProject__thumbnail">
				<video
					v-if="props.firstProject.mainVideoUrl"
					:src="props.firstProject.mainVideoUrl"
					autoplay
					muted
					loop
					playsinline
					webkit-playsinline
				/>
				<SanityImage
					v-else
					:asset-id="props.firstProject.mainImage.asset._ref"
					auto="format"
					:q="75"
				/>
			</div>
			<h2 class="MobileFeaturedProject__title" v-html="props.firstProject.title" />
		</NuxtLink>
		<h1 class="title">
			<span
				v-for="(word, index) in splitBaseline"
				:key="index"
				class="title__chunk"
			>
				{{ word }}{{ index !== splitBaseline.length - 1 ? ' ' : '' }}
			</span>
		</h1>

		<div ref="$bottomAnchor" class="bottom-anchor"></div>
	</div>
</template>

<style lang="scss">
	.MobileFeaturedProjects {

		.GridContainer {
			align-items: center;
			height: inherit;
		}

		.title {
			grid-column: 1 / span 10;
			max-width: 22ch;
			padding-top: 1rem;
			font-size: $mobile-h4;
			margin-bottom: 12rem;
			margin-left: 1rem;

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
	}

	.bottom-anchor {
		margin-top: 180px;
		height: 10px;
		width: 100%;
	}

</style>
