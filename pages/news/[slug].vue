<script setup>
	import { PortableText } from '@portabletext/vue';

	const route = useRoute()
	const router = useRouter()

	const GET_SINGLE_ARTICLE = groq`*[_type == "blog" && slug.current == "${ route.params.slug }"][0]
  {
    ...,
    gallery[] {
      _key,
      _type,
      ...,
      text[] {
        ...,
        children[] {
          ...,
          marks,
          text
        }
      }
    },
    relatedPosts[] -> {
      title,
      slug,
      releaseDate,
      excerpt,
      mainImage
    },
    relatedProjects[] -> {
      title,
      slug,
      releaseDate,
      mainImage,
      mainVideo,
      mainVideoUrlMobile,
      categories[] -> {
        title,
        slug
      }
    }
  }
`

	const { data: article } = await useSanityQuery(GET_SINGLE_ARTICLE)

	if (Object.keys(article.value).length === 0) {
		router.push('/404')
		throw createError({ statusCode: 404, statusMessage: 'Article not found' })
	}

</script>

<template>
	<div class="article-page">
		<Head>
			<Title>{{ article.title }}</Title>
			<Meta
				name="description"
				content="Project description"
			/>
		</Head>
		<div class="main">
			<GridContainer>
				<section class="infos">
					<GoBackButton />
				</section>
				<section class="content">
					<div class="infos__meta">
						<div v-if="article.mainImage" class="content__main-image">
							<SanityImage
								:asset-id="article.mainImage.asset._ref"
								auto="format"
								:q="75"
							/>
						</div>
						<h1 class="infos__title">
							{{ article.title }}
						</h1>
						<div class="infos__content">
						<PortableText :value="article.content" />
						</div>
					</div>
					<VideoPlayer
						v-if="article.mainVideo"
						:vimeo-url="article.mainVideoUrl"
						:download-url="article.mainVideoDownloadUrl"
					/>
					<div
						v-if="article?.gallery"
						class="content__gallery"
					>
						<template v-for="item in article.gallery" :key="item._key">
							<!-- Images Gallery -->
							<div v-if="item._type === 'galleryMedia'" class="gallery-images">
								<SanityImage
									v-for="image in item.images"
									:key="image._key"
									class="image"
									:asset-id="image.asset._ref"
									auto="format"
									:q="75"
								/>
							</div>

							<!-- Text Gallery -->
							<div v-if="item._type === 'galleryText'" class="gallery-text">
								<div class="gallery-text__columns">
									<div class="gallery-text__column">
										<PortableText
											:value="item.textColumn1"
											:components="{
												marks: {
													strong: ({children}) => `<strong>${children}</strong>`,
													em: ({children}) => `<em>${children}</em>`
												}
											}"
										/>
									</div>
									<div class="gallery-text__column">
										<PortableText
											:value="item.textColumn2"
											:components="{
												marks: {
													strong: ({children}) => `<strong>${children}</strong>`,
													em: ({children}) => `<em>${children}</em>`
												}
											}"
										/>
									</div>
								</div>
							</div>

							<!-- Video Gallery -->
							<div v-if="item._type === 'galleryVideo'" class="gallery-video">
								<VideoPlayer
									:vimeo-url="item.url"
									:download-url="item.downloadUrl"
									:poster-image="item.posterImage"
									:public-url="item.publicUrl"
								/>
							</div>
						</template>
					</div>

					<!-- Related Posts Section -->
					<section
						v-if="article.relatedPosts && article.relatedPosts.length > 0"
						class="related-posts"
					>
						<GridContainer>
							<h2 class="related-posts__title">
								Related articles
							</h2>
						</GridContainer>
						<ul class="ArticlesList">
							<li v-for="post in article.relatedPosts" :key="post._id" class="item">
								<NuxtLink
									:key="post._id"
									class="item__link"
									:to="{ name: 'news-slug', params: { slug: post.slug.current } }"
								>
									<div class="item__container">
										<div class="item__thumbnail">
											<SanityImage
												v-if="post.mainImage"
												:asset-id="post.mainImage.asset._ref"
												auto="format"
											/>
											<video
												v-if="post.mainVideoUrl"
												:src="post.mainVideoUrl"
												muted
												loop
												playsinline
												webkit-playsinline
												preload="none"
												autobuffer="true"
											/>
										</div>
										<div class="item__meta">
											<h3
												v-if="post.title"
												class="item__title"
											>
												{{ post.title }}
											</h3>
										</div>
									</div>
								</NuxtLink>
							</li>
						</ul>
					</section>
				</section>
			</GridContainer>
		</div>
	</div>
</template>

<style lang="scss">
	.article-page {
		.main {
			position: relative;
			margin-top: 12rem;

			.portable-text-paragraph {
				margin-bottom: 1rem;

				.portable-text-link {
					color: inherit;
					text-decoration: underline;
					text-underline-offset: 0.2rem;
					text-decoration-thickness: 0.1rem;
					display: inline;

					&:hover {
						opacity: 0.8;
					}
				}
			}

			.GridContainer {
				@include viewport-1200 {
					display: block;
				}
			}

			.infos {
				position: sticky;
				top: 12rem;
				display: flex;
				flex-direction: column;
				grid-column: 1 / span 3;
				align-items: flex-start;
				justify-content: space-between;
				height: calc(100vh - 12rem);
				padding-bottom: 2rem;

				@include viewport-1200 {
					position: relative;
					top: 0;
					height: auto;
				}

				@include viewport-480 {
					position: relative;
					top: 0;
					grid-column: 1 / -1;
					height: auto;
					padding-bottom: 0;
					margin-bottom: 6rem;
				}

				.GoBackButton {
					@include viewport-1200 {
						margin-bottom: 6rem;
					}

					@include viewport-480 {
						margin-bottom: 0;
					}
				}

				&__meta {

					@include viewport-480 {
						@include grid(12, 1fr, 1, 0);
					}
				}

				&__title {
					margin-bottom: 2rem;

					@include viewport-480 {
						grid-column: 1 / -1;
					}
				}

				&__excerpt {
					margin-top: 1rem;

					@include viewport-480 {
						grid-column: 2 / span 10;
						margin-top: 2rem;
					}
				}

				&__content {
				grid-column: 2/span 6;
				// margin-top: 2rem;

				@include viewport-480 {
						grid-column: 1 / -1;
						font-size: 16px;
						margin-bottom: 2rem;
					}

					p, h4 {
						margin-bottom: 1rem;
					}

					a {
						display: inline;
						text-decoration: underline;
					}
				}
			}

			.content {
				grid-column: 4 / -1;
				margin-bottom: 12rem;

				@include viewport-480 {
					grid-column: 1 / -1;
				}

				&__main-image {
					width: 100%;
					margin-bottom: 4rem;

					img {
						width: 100%;
						height: auto;
						object-fit: cover;
					}

					@include viewport-480 {
					grid-column: 1 / -1;
				}
				}

				.VideoPlayer {
					margin-bottom: 6rem;
				}

				&__gallery {
					.gallery-images {
						.image {
							&:not(:first-child) {
								margin-top: 6rem;
							}
						}
					}

					.gallery-text {
						margin: 6rem 0;
						width: 100%;
						max-width: none;

						&__columns {
							display: flex;
							gap: 4rem;
							width: 100%;

							@include viewport-768 {
								flex-direction: column;
								gap: 2rem;
							}
						}

						&__column {
							width: calc(50% - 2rem);

							@include viewport-768 {
								width: 100%;
							}

							p {
								margin-bottom: 1rem;
							}
						}
					}

					.gallery-video {
						margin: 6rem 0;
					}
				}

				.related-posts {
					margin-top: 12rem;

					&__title {
						font-size: 40px;
						margin-bottom: 6rem;
						grid-column: 1 / span 8;

						@include viewport-480 {
							font-size: 26px;
							margin-bottom: 4rem;
						}
					}
				}

				.ArticlesList {
					grid-column: 1 / -1;
					padding-bottom: 5rem;

					.item {
						font-size: $desktop-list;
						border-top: 0.1rem solid $dark-grey;
						transition: background-color 0.2s ease-in-out;

						@include viewport-768 {
							height: auto;
							padding: 2rem 0;
							font-size: $tablet-list;
						}

						@include viewport-480 {
							font-size: $mobile-list;
						}

						&:hover {
							background-color: $dark-dark-grey;
						}

						&__link {
							height: 100%;
						}

						&__container {
							@include grid(12, 1fr, 1, 0);

							position: relative;
							align-items: center;
							height: 100%;
							padding: 1rem 2rem;

							@include viewport-480 {
								padding: 0 1rem;
							}
						}

						&__meta {
							grid-column: 3 / span 9;

							@include viewport-768 {
								grid-column: 3 / span 6;
							}

							@include viewport-480 {
								grid-column: 6 / span 5;
							}
						}

						&__thumbnail {
							position: relative;
							grid-column: auto / span 2;
							margin-left: 0;
							pointer-events: none;

							@include viewport-480 {
								grid-column: auto / span 4;
							}

							img {
								width: 100%;
								height: 10rem;
								object-fit: cover;

								@include viewport-480 {
									width: 100%;
									height: 8rem;
								}
							}

							video {
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 10rem;
								visibility: hidden;
								object-fit: cover;
								opacity: 0;
								transition: 0.25s ease-in-out;

								@include viewport-480 {
									width: 100%;
									height: 8rem;
								}
							}
						}


						&:hover video {
							visibility: visible;
							opacity: 1;
						}
					}
				}
			}
		}
	}
</style>
