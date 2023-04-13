<script setup>
const props = defineProps({
  navMenu: Object,
})

const isNavActive = useState('isNavActive')

function closeMenu() {
  isNavActive.value = false
}

watch(isNavActive, (value) => {
  if (value) {
    //
  } else {
    //
  }
})
</script>

<template>
  <nav :class="[isNavActive && 'NavMenu--active', 'NavMenu']">
    <div :class="[isNavActive && 'NavMenu__main--active', 'NavMenu__main']">
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
    <div
      :class="[
        isNavActive && 'NavMenu__secondary--active',
        'NavMenu__secondary',
      ]"
    >
      <ul class="address">
        <li class="address__item">{{ navMenu.address.label }}</li>
        <li class="address__item">{{ navMenu.address.streetNo }}</li>
        <li class="address__item">{{ navMenu.address.city }}</li>
      </ul>
      <ul class="annex">
        <li class="annex__item">
          <a
            class="annex__link"
            :href="navMenu.externalLinks.press"
            target="blank"
            >Press
          </a>
        </li>
        <li class="annex__item">
          <a
            class="annex__link"
            :href="navMenu.externalLinks.jobs"
            target="blank"
            >Jobs / Internships
          </a>
        </li>
        <li class="annex__item">
          <a
            class="annex__link"
            :href="navMenu.externalLinks.requests"
            target="blank"
            >Requests
          </a>
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
$ease-out: cubic-bezier(0.16, 1, 0.3, 1);

.NavMenu {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 55rem;
  background-color: $black;
  padding: 9rem 2rem 5rem 2rem;
  z-index: 30;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transform: translate(100%, 0%);
  transition: transform 1.5s $ease-out;

  &--active {
    transform: translate(0%, 0%);
  }

  @include viewport-768 {
    width: 40rem;
  }

  @include viewport-375 {
    width: 100%;
    transform: translate(0%, -100%);
    padding: 9rem 1rem 2rem 1rem;

    &--active {
      transform: translate(0%, 0%);
    }
  }

  &__main {
    font-size: $desktop-h2;
    transform: translate(100%, 0%);
    transition: transform 1.5s $ease-out;

    &--active {
      transform: translate(0%, 0%);
    }

    @include viewport-375 {
      transform: translate(0%, 0%);
      margin: 0;
      width: 100%;
      font-size: $mobile-h2;
    }
  }

  &__secondary {
    transform: translate(100%, 0%);
    transition: transform 1.5s $ease-out;

    &--active {
      transform: translateX(0%);
    }

    @include viewport-375 {
      transform: translate(0%, 0%);
      margin: 0;
      width: 100%;
    }

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

      @include viewport-375 {
        align-items: flex-start;
        justify-content: flex-start;
        margin-left: 3rem;
      }

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
