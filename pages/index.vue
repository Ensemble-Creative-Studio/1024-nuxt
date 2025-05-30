<script setup>
	const isMobile = shallowRef(false)

	onMounted(() => {
		if (matchMedia('(hover: none)').matches) {
			isMobile.value = true
		}

		window.addEventListener('resize', onResize)
	})

	function onResize() {
		if (matchMedia('(hover: none)').matches) {
			isMobile.value = true
		} else {
			isMobile.value = false
		}
	}

	onBeforeUnmount(() => {
		window.removeEventListener('resize', onResize)
	})

	const query = groq`*[_type == "home"][0]
		{
			baseline,
			showreel,
			"showreelMobile": showreelMobile,
			expertises1024,
			featuredProjects[] -> {
				...,
				categories[] -> {
					title,
					slug
				}
			}
		}
	`
	const { data: home } = await useSanityQuery(query)
</script>

<template>
	<div class="index">
		<Head>
			<Title>1024</Title>
			<Meta
				name="description"
				content="1024 architecture website"
			/>
		</Head>
		<FeaturedProjects
			v-if="!isMobile"
			:baseline="home.baseline"
			:showreel="home.showreel"
			:projects="home.featuredProjects"
			:expertises="home.expertises1024"
		/>
		<MobileFeaturedProjects
			v-else
			:baseline="home.baseline"
			:showreel="home.showreel"
			:showreel-mobile="home.showreelMobile"
			:projects="home.featuredProjects"
			:expertises="home.expertises1024"
		/>
	</div>
</template>
