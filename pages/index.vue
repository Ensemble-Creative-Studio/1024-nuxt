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
			showreelLink,
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

	// Ajout du script Mailchimp
	useHead({
		title: '1024',
		meta: [
			{
				name: 'description',
				content: '1024 architecture website'
			}
		],
		script: [
			{
				id: 'mcjs',
				innerHTML: '!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/3fbcfd2ac029e8760f49a9909/534c5d07f3cb2c8c967ba77ed.js");'
			}
		]
	})
</script>

<template>
	<div class="index">
		<FeaturedProjects
			v-if="!isMobile"
			:baseline="home.baseline"
			:showreel="home.showreel"
			:showreel-link="home.showreelLink"
			:projects="home.featuredProjects"
			:expertises="home.expertises1024"
		/>
		<MobileFeaturedProjects
			v-else
			:baseline="home.baseline"
			:showreel="home.showreel"
			:showreel-link="home.showreelLink"
			:showreel-mobile="home.showreelMobile"
			:projects="home.featuredProjects"
			:expertises="home.expertises1024"
		/>
	</div>
</template>
