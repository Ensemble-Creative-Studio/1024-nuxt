<script setup>
	import gsap from "gsap"
	import { ScrollTrigger } from "gsap/ScrollTrigger"
	import { ScrollToPlugin } from "gsap/ScrollToPlugin"

	gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
</script>

<template>
	<div class="App">
		<NuxtLayout>
			<NuxtPage
				:transition="{
					name: 'page',
					mode: 'out-in',
				}"
			/>
		</NuxtLayout>
	</div>
</template>

<style lang="scss">
	.App {
		height: 100%;
		left: 0;
		position: relative;
		top: 0;
		width: 100%;
	}

	.page-enter-active,
	.page-leave-active {
		transition: 0.4s ease-in-out;
	}

	.page-enter-from,
	.page-leave-to {
		opacity: 0;
	}

	.v-enter-active,
	.v-leave-active {
		transition: opacity 0.5s ease-in-out;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
	}
</style>
