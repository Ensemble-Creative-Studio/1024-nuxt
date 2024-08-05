<script setup>
	const isNavActive = useState("isNavActive", () => false)

	function closeMenu() {
		isNavActive.value = false
	}

	const route = useRoute()

	const query = groq`*[_type == "navMenu"][0]`
	const sanity = useSanity()
	const { data } = await useAsyncData("navMenu", () => sanity.fetch(query))
	const navMenu = data._rawValue

	watch(
		route,
		() => {
			isNavActive.value = false
		},
		{ deep: true, immediate: true }
	)
</script>

<template>
	<div class="layout">
		<SiteHeader />
		<NavMenu :isNavActive="isNavActive"
			:navMenu="navMenu" />
		<main class="content-wrapper">
			<slot />
		</main>
	</div>
</template>

<style lang="scss">
.layout {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
