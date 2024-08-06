<script setup>
	const isNavActive = useState("isNavActive")

	function closeNav() {
		isNavActive.value = false
	}
</script>

<template>
	<div class="NavOverlay"
		@mouseover="closeNav"></div>
</template>

<style lang="scss">
	.NavOverlay {
		background-color: $white;
		height: 100%;
		left: 0;
		mix-blend-mode: difference;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 20;
	}
</style>
