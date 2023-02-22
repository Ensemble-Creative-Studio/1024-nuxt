<script setup>
const props = defineProps({
  isNavActive: Boolean,
  navMenu: Object,
})

const isNavActive = useState('isNavActive')

function closeMenu() {
  isNavActive.value = false
}
</script>

<template>
  <nav :class="[isNavActive ? 'NavMenu--active' : '', 'NavMenu']">
    <div class="NavMenu__main">
      <ul class="nav">
        <li class="nav__item">
          <NuxtLink class="main__link" to="/projects" @click="closeMenu()">
            Projects
          </NuxtLink>
        </li>
        <li class="nav__item">
          <NuxtLink class="main__link" to="/about" @click="closeMenu()">
            About
          </NuxtLink>
        </li>
        <li class="nav__item">
          <NuxtLink class="main__link" to="/blog" @click="closeMenu()">
            Blog
          </NuxtLink>
        </li>
      </ul>
    </div>
    <div class="NavMenu__secondary">
      <ul class="address">
        <li class="address__item">{{ navMenu.address.label }}</li>
        <li class="address__item">{{ navMenu.address.streetNo }}</li>
        <li class="address__item">{{ navMenu.address.city }}</li>
      </ul>
      <ul class="annex">
        <li class="annex__item">
          <NuxtLink class="annex__link" to="/">Press</NuxtLink>
        </li>
        <li class="annex__item">
          <NuxtLink class="annex__link" to="/">Jobs / Internships</NuxtLink>
        </li>
        <li class="annex__item">
          <NuxtLink class="annex__link" to="/">Requests</NuxtLink>
        </li>
      </ul>
      <ul class="social-media">
        <li class="social-media__item">
          <a :href="navMenu.instagram" target="blank">
            <img src="@/assets/img/instagram-icon.svg" alt="" />
          </a>
        </li>
        <li class="social-media__item">
          <a :href="navMenu.facebook" target="blank">
            <img src="@/assets/img/facebook-icon.svg" alt="" />
          </a>
        </li>
        <li class="social-media__item">
          <a :href="navMenu.vimeo" target="blank">
            <img src="@/assets/img/vimeo-icon.svg" alt="" />
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style lang="scss">
.NavMenu {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  background-color: $black;
  padding: 9rem 1rem 5rem 1rem;
  z-index: 20;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform: translateX(100%);
  transition: 0.6s ease-in-out;
  transition-property: opacity transform;
  visibility: hidden;

  &--active {
    transform: translateX(0%);
    visibility: visible;
  }

  &__main {
    margin: 0 20rem;
    font-size: $main-text-size;
  }

  &__secondary {
    margin: 0 20rem;

    .address {
      margin-left: 3rem;

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
      }
    }

    .social-media {
      display: flex;
      align-items: center;
      margin-top: 3rem;
      justify-content: center;

      &__item {
        &:not(:first-child) {
          margin-left: 1rem;
        }

        img {
          width: 1.5rem;
          height: 1.5rem;
        }
      }
    }
  }
}
</style>
