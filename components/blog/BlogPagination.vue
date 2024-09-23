<script setup>
	const currentPage = inject('currentPage')
	const totalPages = inject('totalPages')
	const ITEMS_PER_PAGE = inject('ITEMS_PER_PAGE')
	const goToPage = inject('goToPage')

	const currentText = computed(() => {
		return currentPage.value < 10 ? `0${ currentPage.value }` : currentPage.value
	})

	const prevText = computed(() => {
		return currentPage.value - 1 < 10 ? `0${ currentPage.value - 1 }` : currentPage.value - 1
	})

	const nextText = computed(() => {
		return currentPage.value + 1 < 10 ? `0${ currentPage.value + 1 }` : currentPage.value + 1
	})

	const furtherText = computed(() => {
		return currentPage.value + 2 < 10 ? `0${ currentPage.value + 2 }` : currentPage.value + 2
	})

	const totalText = computed(() => {
		return totalPages.value < 10 ? `0${ totalPages.value }` : totalPages.value
	})

	const hasEnoughPages = computed(() => {
		return totalPages.value > ITEMS_PER_PAGE
	})

	const hasPrevPage = computed(() => {
		return currentPage.value > 1
	})

	const hasNextPage = computed(() => {
		return currentPage.value < totalPages.value
	})

	const hasFurtherPage = computed(() => {
		return currentPage.value + 1 < totalPages.value
	})
</script>

<template>
	<section ref="$pagination" class="pagination">
		<GridContainer>
			<div class="pagination__container">
				<template v-if="hasPrevPage">
					<button class="pagination__button pagination__button--previous" @click="goToPage(currentPage - 1)">
						Previous
					</button>
					<span class="pagination__separator">
						-
					</span>
				</template>
				<template v-if="hasNextPage">
					<button class="pagination__button pagination__button--next" @click="goToPage(currentPage + 1)">
						Next
					</button>
					<span class="pagination__separator">/</span>
				</template>
				<div class="pagination__pages">
					<button
						v-if="hasPrevPage"
						class="pagination__page"
						@click="goToPage(currentPage - 1)"
						v-html="prevText"
					/>
					<button class="pagination__page pagination__page--active" v-html="currentText" />
					<button
						v-if="hasNextPage"
						class="pagination__page"
						@click="goToPage(currentPage + 1)"
						v-html="nextText"
					/>
					<button
						v-if="hasFurtherPage"
						class="pagination__page"
						@click="goToPage(currentPage + 2)"
						v-html="furtherText"
					/>
					<template v-if="hasEnoughPages">
						<button class="pagination__page" v-html="'...'" />
						<button class="pagination__page" @click="goToPage(totalPages)" v-html="totalText" />
					</template>
				</div>
			</div>
		</GridContainer>
	</section>
</template>

<style lang="scss" scoped>
	.pagination {
		padding: 12rem 0;
		font-size: $desktop-list;

		@include viewport-480 {
			padding-bottom: 4rem;
			margin-top: 9rem;
			font-size: $mobile-list;
		}

		&__container {
			display: flex;
			grid-column: 3 / span 8;
			align-items: center;

			@include viewport-480 {
				display: block;
				grid-column: 1 / -1;
			}
		}

		&__separator {
			margin: 0 2rem;
		}

		&__button {
			text-decoration: underline;
			text-decoration-thickness: from-font;
			text-underline-offset: 0.5rem;
			cursor: pointer;
		}

		&__pages {
			display: flex;
			align-items: center;

			@include viewport-480 {
				margin-top: 2rem;
			}
		}

		&__page {
			color: $medium-grey;
			cursor: pointer;

			&:not(:first-child) {
				margin-left: 2rem;
			}

			&--active {
				color: $white;
			}
		}
	}
</style>
