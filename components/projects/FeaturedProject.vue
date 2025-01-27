<script setup>
	const props = defineProps({
		project: { type: Object },
	})

	const currentVideo = ref(props.project.mainVideoUrl)

	const videoSource = computed(() => {
		return currentVideo.value
	})

	const updateVideoSource = () => {
		if (window.innerWidth <= 768) {
			currentVideo.value = props.project.mainVideoUrlMobile || props.project.mainVideoUrl
		} else {
			currentVideo.value = props.project.mainVideoUrl || props.project.mainVideoUrlMobile
		}
	}

	onMounted(() => {
		updateVideoSource() // Set initial video source
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
