<script setup>
	const query = groq`*[_type == "cookies"][0]`
	const { data: cookies } = await useSanityQuery(query)
</script>

<template>
	<div class="cookies">
		<Head>
			<Title>1024 | Cookies</Title>
			<Meta
				name="description"
				content="Cookies page description"
			/>
		</Head>
		<section
			class="content"
			v-if="cookies.content"
		>
			<SanityContent :blocks="cookies.content" />
		</section>
	</div>
</template>

<style lang="scss">
	.cookies {
		.content {
			line-height: 1.6;
			margin: auto;
			max-width: 100%;
			padding-bottom: 15rem;
			padding-top: 15rem;
			width: 55%;

			p,
			ul,
			h3 {
				grid-column: 4 / span 6;
			}

			h3:not(:first-child) {
				margin-top: 4rem;
			}

			h3 {
				display: block;
				font-size: $mobile-h4;
				margin-bottom: -2rem;
			}

			p,
			ul,
			ol {
				margin-top: 2rem;
			}

			ol,
			ul {
				margin-left: 2rem;

				li {
					&::before {
						content: "•";
						margin-right: 1rem;
					}
				}
			}
		}
	}
</style>
