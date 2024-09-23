<template>
	<button
		class="GoBackButton"
		@click="goBack()"
	>
		Back
	</button>
</template>

<script setup>
	const router = useRouter()

	function goBack() {
		router.go(-1)
	}
</script>

<style lang="scss">
	.GoBackButton {
		text-decoration: underline;
		text-decoration-thickness: from-font;
		text-underline-offset: 0.5rem;
		cursor: pointer;

		@include viewport-480 {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 4rem;
			padding: 1rem;
			line-height: 1;
			color: $medium-grey;
			text-align: left;
			background-color: $black;
			border-top: 0.1rem solid $medium-grey;
		}
	}
</style>
