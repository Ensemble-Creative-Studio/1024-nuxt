<template>
	<div class="BottomAnchors">
		<slot />
	</div>
</template>

<style lang="scss">
	.BottomAnchors {
		align-items: center;
		background-color: $black;
		border-top: 0.1rem solid $dark-grey;
		bottom: 0;
		color: $medium-grey;
		display: flex;
		font-size: $desktop-filters-main;
		height: 5rem;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		position: fixed;
		transform: translateY(5rem);
		width: 100%;
		z-index: 10;

		@include viewport-480 {
			font-size: $mobile-filters-main;
			justify-content: center;
			transform: translateY(0) !important;
		}

		.BottomAnchors__list {
			align-items: center;
			display: flex;

			.BottomAnchors__item {
				button {
					transition: color 0.3s ease-in-out;

					&:hover {
						color: $white;
						cursor: pointer;
					}
				}

				&:not(:first-child) {
					margin-left: 2rem;

					@include viewport-480 {
						margin-left: 1.5rem;
					}
				}
			}
		}
	}
</style>
