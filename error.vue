<script setup>
const error = useError()
</script>

<template>
  <div class="Error">
    <SiteHeader />
    <h1 class="Error__title" v-if="error.statusCode >= 400">Error</h1>
    <h1 class="Error__title" v-else>Server Error</h1>
    <p class="Error__baseline" v-if="error.statusCode >= 400">
      The page has not been found ({{ error.statusCode }})
    </p>
    <p class="Error__baseline" v-else>The server has encountered an error ({{ error.statusCode }})</p>
    <a href="/" class="Error__backlink">Go back to home</a>
  </div>
</template>

<style lang="scss">
.Error {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &__title {
    font-size: 12rem;
    // font-weight: $extra-light;
    text-align: center;
  }

  &__backlink {
    margin-top: 6rem;
    text-decoration: underline;
    text-decoration-thickness: from-font;
    text-underline-offset: 0.5rem;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: $medium-grey;
    }
  }
}
</style>
