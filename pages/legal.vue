<script setup>
	const query = groq`*[_type == "legal"][0]`
	const { data: legal } = await useSanityQuery(query)
</script>

<template>
	<div class="legal">
		<Head>
			<Title>1024 | Legal</Title>
			<Meta
				name="description"
				content="Legal page description"
			/>
		</Head>
		<section class="content"
			v-if="legal.content">
			<SanityContent :blocks="legal.content" />
		</section>
	</div>
</template>

<style lang="scss">
	.legal {
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
