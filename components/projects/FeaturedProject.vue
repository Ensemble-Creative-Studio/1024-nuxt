<script setup>
	const props = defineProps({
		project: [ Object ],
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
				v-if="project.mainVideoUrl"
				:src="project.mainVideoUrl"
				autoplay
				muted
				loop
				playsinline
				webkit-playsinline
			></video>
			<SanityImage
				v-else
				:asset-id="project.mainImage.asset._ref"
				auto="format"
				:q="75"
			/>
		</div>
		<footer class="FeaturedProject__footer">
			<h2 class="FeaturedProject__title">{{ project.title }}</h2>
		</footer>
	</NuxtLink>
</template>
