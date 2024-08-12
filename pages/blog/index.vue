<script setup>
	import gsap from 'gsap'
	import { wait } from '@/utils/wait'

	const router = useRouter()

	const currentPage = ref(1)
	provide('currentPage', currentPage)

	const $$base = ref()
	const $$pagination = ref()

	const ITEMS_PER_PAGE = 3
	provide('ITEMS_PER_PAGE', ITEMS_PER_PAGE)

	const GET_BLOG = groq`*[_type == "blog"]|order(_createdAt desc)
	{
		...,
		"videoUrl": video.asset->url,
	}
	`

	const tl = gsap.timeline()

	const { data: blog } = await useSanityQuery(GET_BLOG)

	const currentBlog = computed(() => {
		const start = (currentPage.value - 1) * ITEMS_PER_PAGE
		const end = start + ITEMS_PER_PAGE
		return blog.value.slice(start, end)
	})

	const totalPages = computed(() => {
		return Math.ceil(blog.value.length / ITEMS_PER_PAGE)
	})
	provide('totalPages', totalPages)

	watch(() => currentPage.value, async (data) => {
		tl.to($$pagination.value, { opacity: 0, duration: 0 })

		tl.to($$base.value,
			{
				opacity: 0,
				duration: 0.5,
				onComplete: async () => {
					goToPage(data)
					await wait(500)
					tl.to($$base.value, { opacity: 1, duration: 0.5 })
				}
			}
		)

		tl.to($$pagination.value, { opacity: 1, duration: 0.5 })
	})

	async function goToPage(page) {
		await router.push({ query: { page: page } })
		currentPage.value = page // TODO! - Fix the layout shift during transition (use a temp ref?)
		await wait(500)
		window.scrollTo(0, 0)
	}

	provide('goToPage', goToPage)
</script>

<template>
	<div ref="$$base" class="blog">
		<Head>
			<Title>1024 | Blog</Title>
			<Meta
				name="description"
				content="Contact page description"
			/>
		</Head>
		<BlogList :blog="currentBlog" />
		<BlogPagination />
	</div>
</template>

<style lang="scss" scoped>
	// ...
</style>
