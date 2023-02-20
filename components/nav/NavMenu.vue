<script setup>
const props = defineProps({
  isNavActive: Boolean,
})
</script>

<template>
  <nav class="NavMenu NavMenu--active" v-if="isNavActive">
    <div class="NavMenu__main">
      <ul class="nav">
        <li class="nav__item">
          <NuxtLink class="main__link" to="/projects">Projects</NuxtLink>
        </li>
        <li class="nav__item">
          <NuxtLink class="main__link" to="/about">About</NuxtLink>
        </li>
        <li class="nav__item">
          <NuxtLink class="main__link" to="/blog">Blog</NuxtLink>
        </li>
      </ul>
    </div>
    <div class="NavMenu__secondary">
      <ul class="address">
        <li class="address__item">1024 Architecture</li>
        <li class="address__item">27 passage Courtois</li>
        <li class="address__item">75011 Paris – France</li>
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
          <a href="/">IG</a>
        </li>
        <li class="social-media__item">
          <a href="/">FB</a>
        </li>
        <li class="social-media__item">
          <a href="/">VM</a>
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
  transition: transform 0.6s cubic-bezier(0.6, 0.04, 0.98, 0.335);
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
      margin-top: 3rem;
      justify-content: center;

      &__item {
        &:not(:first-child) {
          margin-left: 1rem;
        }
      }
    }
  }
}
</style>
