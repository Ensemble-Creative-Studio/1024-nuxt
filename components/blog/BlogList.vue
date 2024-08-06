<script setup>
	import { Swiper, SwiperSlide } from "swiper/vue"
	import "swiper/css"

	const props = defineProps({
		blog: [ Object ],
		page: [ Number ],
	})

	const { isMobile } = useDevice()
</script>

<template>
	<ul class="BlogList">
		<li class="item"
			v-for="item in blog"
			:key="item._id"
		>
			<div class="item__container">
				<VideoPlayer
					v-if="item.mainVideoUrl"
					:vimeoUrl="item.mainVideoUrl"
					:downloadUrl="item.mainVideoDownloadUrl"
				/>
				<swiper
					:slides-per-view="1.1"
					:space-between="0"
					:grab-cursor="true"
					:breakpoints="{
						480: {
							slidesPerView: 1,
							spaceBetween: 10,
							freeMode: false,
						},
					}"
					v-else-if="item.gallery?.medias?.length > 1"
				>
					<swiper-slide
						v-for="media in item.gallery.medias"
						:key="media._id"
					>
						<SanityImage :asset-id="media.asset._ref"
							auto="format"
							:q="75"
							:key="media._id" />
					</swiper-slide>
				</swiper>
				<SanityImage
					v-else-if="item.mainImage"
					:asset-id="item.mainImage.asset._ref"
					auto="format"
					:q="75"
				/>
				<NuxtLink
					class="item__link"
					:to="{ name: 'blog-slug', params: { slug: item.slug.current } }"
					:key="item._id"
				>
					<div class="item__meta">
						<h3 class="item__title">{{ item.title }}</h3>
						<p class="item__excerpt">
							{{ item.excerpt }}
						</p>
					</div>
				</NuxtLink>
			</div>
		</li>
	</ul>
</template>

<style lang="scss">
	.BlogList {
		@include grid(12, 1fr, 1, 0);

		overflow: hidden;
		padding: 0 2rem;
		padding-top: 12rem;

		@include viewport-480 {
			padding: 0 1rem;
			padding-top: 15rem;
		}

		.item {
			grid-column: 3 / span 8;

			@include viewport-480 {
				grid-column: 1 / -1;
			}

			&:not(:first-child) {
				margin-top: 12rem;
			}

			&__container {
				.swiper {
					aspect-ratio: 110 / 62;
					overflow: visible;

					&-wrapper {
						height: 100%;
					}

					&-slide {
						height: 100%;

						img {
							height: 100%;
						}
					}
				}
			}

			&__meta {
				align-items: flex-start;
				display: flex;
				justify-content: space-between;
				margin-top: 2rem;

				@include viewport-480 {
					@include grid(12, 1fr, 1, 0);
				}
			}

			&__title {
				flex: 1;
				text-decoration: underline;
				text-decoration-thickness: from-font;
				text-underline-offset: 0.5rem;

				@include viewport-480 {
					grid-column: 1 / -1;
				}
			}

			&__excerpt {
				flex: 1;
				margin-left: 1rem;

				@include viewport-480 {
					grid-column: 2 / span 10;
					margin-left: 0;
					margin-top: 2rem;
				}
			}
		}
	}
</style>
