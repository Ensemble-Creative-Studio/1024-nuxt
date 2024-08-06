<template>
	<div class="GridContainer">
		<slot />
	</div>
</template>

<style lang="scss">
	.GridContainer {
		@include grid(12, 1fr, 1, 0);

		padding: 0 2rem;
		width: 100%;

		@include viewport-480 {
			padding: 0 1rem;
		}
	}
</style>
