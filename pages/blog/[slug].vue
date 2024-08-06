<script setup>
	const route = useRoute()
	const router = useRouter()

	const GET_SINGLE_ARTICLE = groq`*[_type == "blog" && slug.current == "${route.params.slug}"][0]
  {
    ...,
    relatedProjects[] -> {
      title,
      slug,
      releaseDate,
      mainImage,
      mainVideo,
      categories[] -> {
        title,
        slug
      }
    }
  }
`

	const { data: article } = await useSanityQuery(GET_SINGLE_ARTICLE)
	if (Object.keys(article.value).length === 0) {
		router.push("/404")
		throw createError({ statusCode: 404, statusMessage: "Article not found" })
	}

	const { isMobile } = useDevice()
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
					<div class="infos__meta">
						<h1 class="infos__title">{{ article.title }}</h1>
						<p class="infos__excerpt">{{ article.excerpt }}</p>
					</div>
				</section>
				<section class="content">
					<VideoPlayer
						v-if="article.mainVideo"
						:vimeoUrl="article.mainVideoUrl"
						:downloadUrl="article.mainVideoDownloadUrl"
					/>
					<div
						class="content__gallery"
						v-if="article?.gallery?.medias"
					>
						<SanityImage
							class="image"
							v-for="media in article?.gallery?.medias"
							:key="media._key"
							:asset-id="media.asset._ref"
							auto="format"
							:q="75"
						/>
					</div>
				</section>
			</GridContainer>
		</div>
	</div>
</template>

<style lang="scss">
	.article-page {
		.main {
			margin-top: 12rem;
			position: relative;

			.GridContainer {
				@include viewport-1200 {
					display: block;
				}
			}

			.infos {
				align-items: flex-start;
				display: flex;
				flex-direction: column;
				grid-column: 1 / span 3;
				height: calc(100vh - 12rem);
				justify-content: space-between;
				padding-bottom: 2rem;
				position: sticky;
				top: 12rem;

				@include viewport-1200 {
					height: auto;
					position: relative;
					top: 0;
				}

				@include viewport-480 {
					grid-column: 1 / -1;
					height: auto;
					margin-bottom: 6rem;
					padding-bottom: 0;
					position: relative;
					top: 0;
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
					max-width: 70rem;

					@include viewport-480 {
						@include grid(12, 1fr, 1, 0);
					}
				}

				&__title {
					text-decoration: underline;
					text-decoration-thickness: from-font;
					text-underline-offset: 0.5rem;

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
			}

			.content {
				grid-column: 4 / -1;
				margin-bottom: 12rem;

				@include viewport-480 {
					grid-column: 1 / -1;
				}

				.VideoPlayer {
					margin-bottom: 6rem;
				}

				&__gallery {
					.image {
						&:first-child {
							@include viewport-480 {
								margin-top: 6rem;
							}
						}

						&:not(:first-child) {
							margin-top: 6rem;
						}
					}
				}
			}
		}
	}
</style>
