<script setup>
// Fetch data
const sanity = useSanity()

const GET_PROJECTS = groq`*[_type == "projects"] | order(_createdAt desc)
  {
    ...,
    categories[] -> {
      title,
      slug
    },
    "categoriesTitles": categories[]->title, // Refactor this later not to use a join
    "videoUrl": video.asset->url,
  }
`
let projects = await useAsyncData('projects', () => sanity.fetch(GET_PROJECTS))
projects = projects.data._rawValue

const GET_CATEGORIES = groq`*[_type == "categories"]
  {
    title,
    "projectsInside": *[_type == "projects" && references(^._id)]
  }
`
let categories = await useAsyncData('categories', () =>
  sanity.fetch(GET_CATEGORIES)
)
categories = categories.data._rawValue

// Order
const $order = ref(null)
const $name = ref(null)
const $date = ref(null)
const currentOrder = ref('date')

const projectTitles = ref([])
const projectDates = ref([])

function orderByDate() {
  currentOrder.value = 'date'
}

function orderByName() {
  currentOrder.value = 'name'
}

function testDate(a, b) {
  if (a.releaseDate.slice(0, 4) < b.releaseDate.slice(0, 4)) {
    return -1
  }
  if (a.releaseDate.slice(0, 4) > b.releaseDate.slice(0, 4)) {
    return 1
  }
  return 0
}

function testName(a, b) {
  if (a.title < b.title) {
    return -1
  }
  if (a.title > b.title) {
    return 1
  }
  return 0
}

// console.log(projectTitles._rawValue)
// console.log(projectDates._rawValue)

const orderedProjects = computed(() => {
  // Return projects ordered by name
  if (currentOrder.value === 'name') {
    console.log('Filter by name')
    return projects.sort(testName)
  }

  // Else, return projects ordered by date
  if (currentOrder.value === 'date') {
    console.log('Filter by date')
    return projects.sort(testDate)
  }
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
    function isTagged(element) {
      return tags.value.includes(element)
    }
    return projects.filter((project) => project.categoriesTitles.some(isTagged))
  }
})

// Display mode
const displayMode = ref('grid')
const gridModeCols = ref(4)
const $projectsGrid = ref(null)

function setGridMode(value) {
  displayMode.value = 'grid'
  gridModeCols.value = value

  const cl = $projectsGrid.value.$el.classList
  cl.toggle('ProjectsGrid--three-items')

  const items = document.querySelectorAll('.ProjectsGrid .item') // Maybe use refs instead?
  items.forEach((item) => {
    item.classList.toggle('animated') // Useless for now
  })
}

function setListMode() {
  displayMode.value = 'list'
  gridModeCols.value = 4

  const cl = $projectsGrid.value.$el.classList
  if (cl.contains('ProjectsGrid--three-items')) {
    cl.remove('ProjectsGrid--three-items')
  }
}

// Final computed
// ...
</script>

<template>
  <div class="projects">
    <Head>
      <Title>1024 | Work</Title>
      <Meta name="description" content="1024 architecture website" />
    </Head>
    <ProjectsList
      v-if="displayMode === 'list'"
      :projects="filteredProjects"
      :categories="categories"
    />
    <ProjectsGrid
      v-show="displayMode === 'grid'"
      :projects="filteredProjects"
      :categories="categories"
      ref="$projectsGrid"
    />
    <div class="container">
      <ul class="order" ref="$order">
        <li>
          <button ref="$date" @click="orderByDate()">Date</button>
        </li>
        <li>
          <button ref="$name" @click="orderByName()">Name</button>
        </li>
      </ul>
      <ul class="filters">
        <li class="filters__all">
          <button
            @click="toggleAll()"
            :class="[all === true ? 'toggled' : '', 'all']"
          >
            <span class="all__label">All&nbsp;</span>
            <span class="all__length">{{ projects.length }}</span>
          </button>
        </li>
        <li class="filters__category" v-for="category in categories">
          <button class="category" @click="toggle($event)" ref="$filters">
            <span class="category__label">{{ category.title }}&nbsp;</span>
            <span class="category__length">
              {{ category.projectsInside.length }}
            </span>
          </button>
        </li>
      </ul>
      <ul class="display-mode">
        <li
          :class="[
            displayMode === 'grid' ? 'display-mode__grid--active' : '',
            'display-mode__grid',
          ]"
          @click="setGridMode(4)"
        >
          Grid
        </li>
        <li class="display-mode__four-grid" @click="setGridMode(4)">
          <FourItemsGridIcon
            :color="
              displayMode === 'grid' && gridModeCols === 4
                ? '#ffffff'
                : '#727272'
            "
          />
        </li>
        <li class="display-mode__three-grid" @click="setGridMode(3)">
          <ThreeItemsGridIcon
            :color="
              displayMode === 'grid' && gridModeCols === 3
                ? '#ffffff'
                : '#727272'
            "
          />
        </li>
        <li
          :class="[
            displayMode === 'list' ? 'display-mode__list--active' : '',
            'display-mode__list',
          ]"
          @click="setListMode()"
        >
          List
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.projects {
  height: calc(100% - 5rem);

  .ProjectsGrid {
    margin-top: 30rem;
    padding-bottom: 7rem;
  }
  .ProjectsList {
    margin-top: 30rem;
    padding-bottom: 5rem;
  }

  .container {
    height: 5rem;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    bottom: 0;
    z-index: 10;
    background-color: $black;
    font-size: 1.8rem;
    color: $medium-grey;
    width: 100%;
    border-top: 0.1rem solid $dark-grey;
  }

  .order {
    display: flex;
    align-items: center;

    & > li {
      button {
        cursor: pointer;
      }

      &:not(:first-child) {
        margin-left: 2rem;
      }
    }
  }

  .filters {
    display: flex;
    align-items: center;

    .all,
    .category {
      cursor: pointer;
      transition: color 0.3s ease-in-out;
      margin-left: 2rem;

      .all__label,
      .category__label {
        transition: border-bottom 0.3s ease-in-out;
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
      }
    }
  }

  .display-mode {
    display: flex;
    align-items: center;

    & > li {
      cursor: pointer;

      &:not(:first-child) {
        margin-left: 2rem;
      }
    }

    &__four-grid,
    &__three-grid {
      line-height: 0;
    }

    &__list,
    &__grid {
      cursor: pointer;
      border-bottom: 0.1rem solid $black;
      transition: border-bottom 0.3s ease-in-out;

      &--active {
        color: $white;
        border-bottom: 0.1rem solid $white;
      }
    }
  }
}
</style>
