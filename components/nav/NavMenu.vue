<script setup>
	const props = defineProps({
		navMenu: Object,
	})

	const isNavActive = useState('isNavActive')

	function closeNav() {
		isNavActive.value = false
	}
</script>

<template>
	<nav :class="[isNavActive && 'NavMenu--active', 'NavMenu']">
		<div :class="[isNavActive && 'NavMenu__background--active', 'NavMenu__background']" />
		<div :class="[isNavActive && 'NavMenu__main--active', 'NavMenu__main']">
			<ul class="nav">
				<li class="nav__item">
					<NuxtLink
						class="main__link"
						to="/projects"
						@click="closeNav()"
					>
						Projects
					</NuxtLink>
				</li>
				<li class="nav__item">
					<NuxtLink
						class="main__link"
						to="/mad"
						@click="closeNav()"
					>
						MadMapper
					</NuxtLink>
				</li>
				<li class="nav__item">
					<NuxtLink
						class="main__link"
						to="/about"
						@click="closeNav()"
					>
						About
					</NuxtLink>
				</li>

				<li class="nav__item">
					<NuxtLink
						class="main__link"
						to="/news?page=1"
						@click="closeNav()"
					>
						News
					</NuxtLink>
				</li>
			</ul>
		</div>
		<div :class="[isNavActive && 'NavMenu__secondary--active', 'NavMenu__secondary']">
			<ul class="address">
				<li class="address__item">
					{{ navMenu.address.label }}
				</li>
				<li class="address__item">
					{{ navMenu.address.streetNo }}
				</li>
				<li class="address__item">
					{{ navMenu.address.city }}
				</li>
				<li class="address__item">
					{{ navMenu.phoneNumber }}
				</li>
			</ul>
			<ul class="annex">
				<li class="annex__item">
					<a
						class="annex__link"
						:href="'mailto:' + navMenu.externalLinks.requests"
					>
						Contact
					</a>
				</li>
				<li class="annex__item">
					<a
						class="annex__link"
						:href="'mailto:' + navMenu.externalLinks.press"
					>
						Press
					</a>
				</li>
				<li class="annex__item">
					<a
						class="annex__link"
						:href="'mailto:' + navMenu.externalLinks.jobs"
					>
						Jobs / Internships
					</a>
				</li>
				<li class="annex__item">
					<NuxtLink
						class="annex__link"
						to="/cookies"
						@click="closeNav()"
					>
						Cookies
					</NuxtLink>
				</li>
				<li class="annex__item">
					<NuxtLink
						class="annex__link"
						to="/legal"
						@click="closeNav()"
					>
						Legal Notice
					</NuxtLink>
				</li>
			</ul>
			<ul class="social-media">
				<li class="social-media__item">
					<a
						:href="navMenu.instagram"
						target="blank"
					>
						<img
							src="@/assets/img/vimeo-icon.svg"
							alt=""
						>
					</a>
				</li>
				<li class="social-media__item">
					<a
						:href="navMenu.vimeo"
						target="blank"
					>
						<img
							src="@/assets/img/facebook-icon.svg"
							alt=""
						>
					</a>
				</li>
				<li class="social-media__item">
					<a
						:href="navMenu.facebook"
						target="blank"
					>
						<img
							src="@/assets/img/instagram-icon.svg"
							alt=""
						>
					</a>
				</li>
			</ul>
		</div>
	</nav>
</template>

<style lang="scss">
	$cubic: cubic-bezier(0.16, 1, 0.3, 1);

	.NavMenu {
		background-color: $black;
		color: $white;
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: space-between;
		margin: 0 auto;
		overflow: hidden;
		padding: 9rem 2rem 5rem;
		position: fixed;
		right: 0;
		top: 0;
		transform: translate(100%, 0%);
		transition: transform 1.5s $cubic;
		width: 30rem;
		z-index: 30;

		&--active {
			transform: translate(0%, 0%);
		}

		&__background {
			background-color: $black;
			display: none;
			height: 100%;
			overflow: hidden;
			position: absolute;
			transform: translate(0%, -100%);
			transition: transform 1.5s $cubic;
			width: 100%;

			&--active {
				transform: translate(0%, 0%);
			}

			@include viewport-480 {
				display: block;
			}
		}

		@include viewport-768 {
			width: 40rem;
		}

		@include viewport-480 {
			background-color: transparent;
			padding: 0;
			pointer-events: none;
			transform: translate(0%, 0%);
			width: 100%;

			&--active {
				pointer-events: all;
			}

			&:not(&--active) {
				.NavMenu__main,
				.NavMenu__secondary {
					pointer-events: none;

					a, button {
						pointer-events: none;
					}
				}
			}
		}

		&__main {
			font-size: 3.6rem;
			transform: translate(100%, 0%);
			transition: transform 1.5s $cubic;

			&--active {
				transform: translate(0%, 0%);
			}

			@include viewport-480 {
				font-size: $mobile-h2;
				margin: 0;
				opacity: 0;
				padding: 9rem 1rem 0;
				transform: translate(0%, 0%);
				width: 100%;

				&--active {
					animation: 1s $cubic 0.3s 1 slideIn forwards;
				}
			}
		}

		&__secondary {
			transform: translate(100%, 0%);
			transition: transform 1.5s $cubic;

			&--active {
				transform: translateX(0%);
			}

			@include viewport-480 {
				margin: 0;
				opacity: 0;
				padding: 0 1rem 2rem;
				transform: translate(0%, 0%);
				width: 100%;

				&--active {
					animation: 1s $cubic 0.3s 1 slideIn forwards;
				}
			}

			.address {
				margin-left: 0;

				&__item {
					&:not(:first-child) {
						margin-top: 0.3rem;
					}
				}
			}

			.annex {
				margin-top: 3rem;

				&__item {
					&:not(:first-child) {
						margin-top: 0.3rem;
					}

					&:nth-child(4) {
						font-size: 1.2rem;
						margin-top: 2rem;
					}

					&:nth-child(5) {
						font-size: 1.2rem;
						margin-top: 0.3rem;
					}
				}
			}

			.social-media {
				align-items: center;
				display: flex;
				justify-content: flex-start;
				margin-top: 3rem;

				@include viewport-480 {
					align-items: flex-start;
					justify-content: flex-start;
					margin-left: 3rem;
				}

				&__item {
					&:not(:first-child) {
						margin-left: 1rem;
					}

					img {
						height: 2.5rem;
						width: 2.5rem;
					}
				}
			}
		}
	}

	.NavMenu__main,
	.NavMenu__secondary {
		@include viewport-480 {
			pointer-events: inherit;
		}
	}

	@keyframes slideIn {
		0% {
			opacity: 0;
			transform: translateY(-2rem);
		}

		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
