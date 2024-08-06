<script setup>
	const { isMobile } = useDevice()

	const query = groq`*[_type == "home"][0]
		{
			baseline,
			firstProject -> {
				...,
				categories[] -> {
				title,
				slug
				}
			},
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
			:firstProject="home.firstProject"
			:projects="home.featuredProjects"
		/>
		<MobileFeaturedProjects
			v-else
			:baseline="home.baseline"
			:firstProject="home.firstProject"
			:projects="home.featuredProjects"
		/>
	</div>
</template>
