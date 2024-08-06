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
		cursor: pointer;
		text-decoration: underline;
		text-decoration-thickness: from-font;
		text-underline-offset: 0.5rem;

		@include viewport-480 {
			background-color: $black;
			border-top: 0.1rem solid $medium-grey;
			bottom: 0;
			color: $medium-grey;
			height: 4rem;
			left: 0;
			line-height: 1;
			padding: 1rem;
			position: fixed;
			text-align: left;
			width: 100%;
		}
	}
</style>
