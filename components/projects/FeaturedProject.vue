<script setup>
	const props = defineProps({
		project: { type: Object },
	})

	const videoSource = computed(() => {
		if (window.innerWidth <= 768) {
			return props.project.mainVideoUrlMobile || props.project.mainVideoUrl
		}
		return props.project.mainVideoUrl || props.project.mainVideoUrlMobile
	})

	const updateVideoSource = () => {
		if (window.innerWidth <= 768) {
			const video = document.querySelector('.FeaturedProject__thumbnail video')
			if (video) {
				video.src = props.project.mainVideoUrlMobile || props.project.mainVideoUrl
			}
		} else {
			const video = document.querySelector('.FeaturedProject__thumbnail video')
			if (video) {
				video.src = props.project.mainVideoUrl || props.project.mainVideoUrlMobile
			}
		}
	}

	onMounted(() => {
		window.addEventListener('resize', updateVideoSource)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('resize', updateVideoSource)
	})
</script>

<template>
	<NuxtLink
		:key="project._id"
		class="FeaturedProject"
		:to="{
			name: 'projects-slug',
			params: { slug: project.slug.current },
		}"
	>
		<div class="FeaturedProject__thumbnail">
			<video
				v-if="project.mainVideoUrl || project.mainVideoUrlMobile"
				:src="videoSource"
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
		<footer class="FeaturedProject__footer">
			<h2 class="FeaturedProject__title">
				{{ project.title }}
			</h2>
		</footer>
	</NuxtLink>
</template>
