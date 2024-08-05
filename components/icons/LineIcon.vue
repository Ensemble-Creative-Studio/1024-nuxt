<script setup>
	const props = defineProps({
		color: String,
	})
</script>

<template>
	<svg style='position:relative; top:2px;'
		width="17"
		height="16"
		viewBox="0 0 17 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<line y1="0.5"
			x2="17"
			y2="0.5" />
		<line y1="5.5"
			x2="17"
			y2="5.5"/>
		<line y1="10.5"
			x2="17"
			y2="10.5" />
		<line y1="15.5"
			x2="17"
			y2="15.5" />
	</svg>
</template>
