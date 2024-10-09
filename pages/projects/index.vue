<script setup>
	const $projects = ref(null)

	const GET_PROJECTS = groq`*[_type == "projects"
	&& (hideProject == false
	|| !defined(hideProject))] | order(orderRank)
	{
		...,
		categories[] -> {
			title,
			slug
		},
		"categoriesTitles": categories[]->title,
		"videoUrl": video.asset->url,
	}
`

	let projects = await useSanityQuery(GET_PROJECTS)
	projects = projects.data.value.filter((project) => {
		return project.releaseDate && project.categories
	})

	const GET_CATEGORIES = groq`*[_type == "categories"]
	{
		title,
		"projectsInside": *[_type == "projects" && references(^._id)]
	}
`
	let categories = await useSanityQuery(GET_CATEGORIES)
	categories = categories.data.value
	categories.forEach((category) => {
		category.projectsInside = category.projectsInside.filter((project) => {
			return project.releaseDate && project.categories
		})
	})

	// Filters
	const tags = ref([])
	const all = ref(true)
	const $filters = ref(null)

	function toggleAll() {
		tags.value = []
		all.value = true

		// Remove filters styles
		$filters.value.map((element) => {
			element.classList.remove('toggled')
		})
	}

	function toggle(event) {
		// Get the clicked tag
		const element = event.target
		const text = element.firstChild.textContent.trim()

		// Add or remove it in the tags array
		if (!tags.value.includes(text)) {
			element.classList.add('toggled')
			tags.value.push(text)
		} else {
			tags.value.splice(tags.value.indexOf(text), 1)
			element.classList.remove('toggled')
		}

		// Set 'all' to true if there is no tags left in the array
		all.value = tags.value.length === 0 ? true : false
	}

	const filteredProjects = computed(() => {
		if (all.value === true) {
			return projects
		} else {
			return projects.filter((project) =>
				project.categoriesTitles?.some(isTagged)
			)
		}
	})

	function isTagged(element) {
		return tags.value.includes(element)
	}

	// Display mode
	const displayMode = ref('grid')
	const gridModeCols = ref(8) // Update default to 8 columns
	const $projectsGrid = ref(null)
	const $projectsList = ref(null)

	function setGridMode(value) {
		window.scrollTo(0, 0)
		displayMode.value = 'grid'
		gridModeCols.value = value
	}

	function setListMode() {
		window.scrollTo(0, 0)
		displayMode.value = 'list'
		gridModeCols.value = 4
	}

	const showMobileFilters = ref(false)

	function toggleFilters() {
		showMobileFilters.value = !showMobileFilters.value
	}

	// Sorting
	const order = ref('selection') // Setting default to 'selection'

	function setOrder(value) {
		// Directly set the order based on the button clicked
		switch (value) {
		case 'date':
			order.value = 'byDate'
			break
		case 'name':
			order.value = 'byName'
			break
		case 'selection':
			order.value = 'selection'
			break
		default:
			order.value = 'selection'
			break
		}
	}

	const finalProjects = computed(() => {
		let sortedProjects = [ ...filteredProjects.value ] // Create a copy to avoid mutating the original array

		switch (order.value) {
		case 'byName':
			sortedProjects.sort((a, b) => a.title.localeCompare(b.title))
			break
		case 'byDate':
			sortedProjects.sort(
				(a, b) => parseInt(b.releaseDate) - parseInt(a.releaseDate)
			)
			break
		case 'selection':
			// Reapply the default sorting logic, assuming it's based on orderRank
			sortedProjects.sort((a, b) => a.orderRank - b.orderRank)
			break
		default:
			// Handle any other unexpected case (if needed)
			break
		}

		return sortedProjects
	})
</script>

<template>
	<div
		ref="$projects"
		class="projects"
	>
		<Head>
			<Title>1024 | Work</Title>
			<Meta
				name="description"
				content="1024 architecture website"
			/>
		</Head>
		<ProjectsList
			v-if="displayMode === 'list'"
			ref="$projectsList"
			:projects="finalProjects"
			:categories="categories"
			:display-mode="displayMode"
			:order="order"
		/>
		<ProjectsGrid
			v-if="displayMode === 'grid'"
			ref="$projectsGrid"
			:projects="finalProjects"
			:categories="categories"
			:display-mode="displayMode"
			:grid-mode-cols="gridModeCols"
			:order="order"
		/>
		<div class="mobile-bar">
			<button
				class="mobile-bar__filters"
				@click="toggleFilters()"
			>
				{{ showMobileFilters ? "Close" : "Filter" }}
			</button>
			<div class="mobile-bar__display-mode">
				<button
					:class="[
						displayMode === 'grid' && 'mobile-bar__grid--active',
						'mobile-bar__grid',
					]"
					@touchstart="setGridMode(4)"
				>
					Grid
				</button>
				<button
					:class="[
						displayMode === 'list' && 'mobile-bar__list--active',
						'mobile-bar__list',
					]"
					@touchstart="setListMode()"
				>
					List
				</button>
			</div>
		</div>
		<div :class="[showMobileFilters && 'container--active', 'container']">
			<GridContainer>
				<ul class="display-mode">
					<li
						:class="[
							displayMode === 'grid'
								&& gridModeCols === 8
								&& 'display-mode__three-grid--active',
							'display-mode__three-grid',
						]"
						@click="setGridMode(8)"
					>
						<SixItemsGridIcon
							:color="
								displayMode === 'grid'
									&& gridModeCols === 6
									? '#ffffff'
									: '#727272'
							"
						/>
					</li>
					<li
						:class="[
							displayMode === 'list' && 'display-mode__list--active',
							'display-mode__list',
						]"
						@click="setListMode()"
					>
						<LineIcon
							:color="
								displayMode === 'list'
									? '#ffffff'
									: '#727272'
							"
						/>
					</li>
				</ul>
				<ul
					ref="$order"
					class="order"
				>
					<li
						:class="[order === 'byName' && 'order-name--active', 'order-name']"
					>
						<button @click="setOrder('name')">
							Name
						</button>
					</li>
					<li
						:class="[order === 'byDate' && 'order-date--active', 'order-date']"
					>
						<button @click="setOrder('date')">
							Date
						</button>
					</li>
					<li
						:class="[
							order === 'selection' && 'order-selection--active',
							'order-selection',
						]"
					>
						<button @click="setOrder('selection')">
							Selection
						</button>
					</li>
				</ul>

				<ul class="filters">
					<li class="filters__all">
						<button
							:class="[all && 'toggled', 'all']"
							@click="toggleAll()"
						>
							<span class="all__label">All&nbsp;</span>
							<span class="all__length">{{ projects.length }}</span>
						</button>
					</li>
					<li
						v-for="(category, i) in categories"
						:key="i"
						class="filters__category"
					>
						<button
							v-if="category.projectsInside.length > 0"
							ref="$filters"
							class="category"
							@click="toggle($event)"
						>
							<span class="category__label">{{ category.title }}&nbsp;</span>
							<span class="category__length">
								{{ category.projectsInside.length }}
							</span>
						</button>
					</li>
				</ul>
			</GridContainer>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.display-mode__list svg {
		stroke: #727272;
	}

	.display-mode__list--active.display-mode__list svg {
		stroke: white;
	}

	.display-mode__eight-grid svg {
		stroke: #727272;
	}

	.display-mode__eight-grid--active.display-mode__eight-grid svg {
		stroke: white;
	}

	.projects {
		height: calc(100% - 5rem);
		min-height: 100vh;

		.ProjectsGrid {
			padding-bottom: 7rem;
			padding-top: 15rem;

			@include viewport-480 {
				padding-top: 15rem;
			}
		}

		.ProjectsList {
			padding-bottom: 5rem;
			padding-top: 15rem;

			@include viewport-480 {
				padding-top: 15rem;
			}
		}

		.container {
			background-color: $black;
			border-top: 0.1rem solid $dark-grey;
			bottom: 0;
			color: $medium-grey;
			display: flex;
			font-size: 1.8rem;
			height: 5rem;
			justify-content: space-between;
			padding: 1rem 0;
			position: fixed;
			width: 100%;
			z-index: 10;

			@include viewport-1024 {
				align-items: flex-start;
				background-color: $black;
				height: auto;
				justify-content: flex-start;
				padding: 3rem 1rem;
				transform: translateY(calc(100% - 41px));
				transition: 0.6s cubic-bezier(0.1, 0.82, 0.76, 0.965);
				transition-property: opacity transform;

				&--active {
					transform: translateY(-4rem);
				}
			}

			@include viewport-480 {
				font-size: 1.6rem;
			}
		}

		.mobile-bar {
			align-items: center;
			background-color: $black;
			bottom: 0;
			display: flex;
			display: none;
			height: 4rem;
			justify-content: space-between;
			padding: 1rem;
			position: fixed;
			width: 100%;
			z-index: 20;

			&__filters {
				color: $medium-grey;
			}

			&__display-mode {
				button {
					padding: 2rem 0 2rem 2rem;
				}
			}

			@include viewport-1024 {
				display: flex;
			}

			&__grid,
			&__list {
				color: $medium-grey;
				padding: 1rem; // Augmente la zone de clic
				min-width: 44px; // Taille minimale recommandée pour les éléments interactifs sur mobile
				min-height: 44px;

				&--active {
					color: $white;
					text-decoration: underline;
					text-decoration-thickness: from-font;
					text-underline-offset: 0.5rem;
				}
			}
		}

		.order {
			align-items: center;
			display: flex;
			grid-column: auto / span 4;

			@include viewport-1024 {
				display: block;
				flex: 1;
				order: 2;
			}

			&-name,
			&-date,
			&-selection {
				flex: 0.25;
				transition: 0.3s ease-in-out;
				transition-property: text-decoration, color;

				&--active {
					color: $white;

					button {
						text-decoration: underline;
						text-decoration-thickness: from-font;
						text-underline-offset: 0.5rem;
					}
				}
			}

			& > li {
				button {
					cursor: pointer;
				}

				&:not(:first-child) {
					margin-left: 1rem;

					@include viewport-1024 {
						margin-left: 0;

						// margin-top: 2rem;
					}
				}
			}

			> li {
				&:not(:first-child) {
					@include viewport-1024 {
						margin: 2rem 0;
					}
				}
			}
		}

		.filters {
			align-items: center;
			display: flex;
			grid-column: auto / span 6;

			@include viewport-1024 {
				display: block;
				flex: 1;
			}

			> li {
				&:not(:first-child) {
					@include viewport-1024 {
						margin: 2rem 0;
					}
				}
			}

			.all,
			.category {
				cursor: pointer;
				margin-right: 2rem;

				@include viewport-1024 {
					margin-left: 0;
				}

				.all__label,
				.category__label {
					transition: 0.3s ease-in-out;
					transition-property: text-decoration, color;
				}

				&.toggled {
					color: $white;

					.all__label,
					.category__label {
						text-decoration: underline;
						text-decoration-thickness: from-font;
						text-underline-offset: 0.5rem;
					}
				}

				span {
					pointer-events: none;
				}

				&__length {
					color: $dark-grey;
					margin-left: 0.6rem;
				}
			}
		}

		.display-mode {
			align-items: center;
			display: flex;
			grid-column: auto / span 2;

			@include viewport-1024 {
				display: none;
			}

			& > li {
				cursor: pointer;

				&:not(:first-child) {
					margin-left: 2rem;
				}
			}

			&__four-grid,
			&__three-grid {
				line-height: 0;

				&--active {
					pointer-events: none;
				}
			}

			&__list,
			&__grid {
				border-bottom: 0.1rem solid $black;
				cursor: pointer;
				transition: border-bottom 0.3s ease-in-out;

				&--active {
					color: $white;
					pointer-events: none;
				}
			}
		}
	}
</style>
