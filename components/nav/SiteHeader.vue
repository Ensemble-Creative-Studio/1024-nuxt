<script setup>
	import { computed, watch } from 'vue'

	const isNavActive = useState('isNavActive')

	function toggleNav() {
		isNavActive.value = !isNavActive.value
	}
</script>

<template>
	<header class="SiteHeader">
		<SiteLogo />
		<div
			:class="[isNavActive && 'menu-icon--active', 'menu-icon']"
			@click="toggleNav()"
		>
			<input
				class="menu-icon__checkbox"
				type="checkbox"
			>
			<div class="burger">
				<span class="burger__bar burger__bar--top" />
				<span class="burger__bar burger__bar--right" />
				<span class="burger__bar burger__bar--bottom" />
				<span class="burger__bar burger__bar--left" />
			</div>
		</div>
	</header>
</template>

<style lang="scss">
	.SiteHeader {
		align-items: center;
		background-color: black;
		display: flex;
		height: 6rem;
		justify-content: space-between;
		left: 0;
		padding: 2rem;
		position: fixed;
		top: 0;
		width: 100%;
		z-index: 40;

		@include viewport-480 {
			height: 4rem;
			padding: 1rem;
		}

		.SiteLogo {
			svg {
				width: 9rem;
			}
		}

		.project-title {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			font-size: 2rem;
			color: $white;
		}
	}

	.menu-icon {
		cursor: pointer;
		height: 20px;
		position: relative;
		width: 29px;

		.menu-icon__checkbox {
			display: block;
			height: 100%;
			opacity: 0;
			pointer-events: none;
			position: relative;
			position: absolute;
			-webkit-touch-callout: none;
			width: 100%;
			z-index: 2;
		}

		.burger {
			height: 20px;
			inset: 0;
			margin: auto;
			pointer-events: none;
			position: absolute;
			width: 20px;

			&__bar {
				background-color: $white;
				display: block;
				height: 2.4px;
				position: absolute;
				transition: all 0.5s cubic-bezier(0.1, 0.82, 0.76, 0.965);
				width: 100%;

				&--top {
					top: 0;
					transform: translateY(8.5px);
				}

				&--right {
					right: -50%;
					top: 50%;
					transform: translateY(-50%) translateX(-10px) rotate(90deg);
				}

				&--bottom {
					bottom: 0;
					transform: translateY(-8.5px);
				}

				&--left {
					left: -50%;
					top: 50%;
					transform: translateY(-50%) translateX(10px) rotate(90deg);
				}
			}
		}

		&--active {
			.burger {
				&__bar {
					&--top {
						transform: translateY(0);
					}

					&--right {
						right: -45%;
						transform: translateY(-50%) rotate(90deg);
					}

					&--bottom {
						transform: translateY(0);
					}

					&--left {
						left: -45%;
						transform: translateY(-50%) rotate(90deg);
					}
				}
			}
		}
	}

	.fade-enter-active, .fade-leave-active {
		transition: opacity 0.3s ease;
	}
	.fade-enter-from, .fade-leave-to {
		opacity: 0;
	}
</style>
