<script setup>
const query = groq`*[_type == "cookies"][0]`
const sanity = useSanity()
const { data } = await useAsyncData('cookies', () => sanity.fetch(query))
const cookies = data.value
</script>

<template>
  <div class="cookies">
    <Head>
      <Title>1024 | Cookies</Title>
      <Meta name="description" content="Cookies page description" />
    </Head>
    <section class="content" v-if="cookies.content">
      <SanityContent :blocks="cookies.content" />
    </section>
  </div>
</template>

<style lang="scss">
.cookies {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .content {
    width: 55%;
    max-width: 100%;
    margin: auto;
    padding-top: 15rem;
    line-height: 1.6;
    padding-bottom: 15rem;

    p,
    ul,
    h3 {
      grid-column: 4 / span 6;
    }

    h3:not(:first-child) {
      margin-top: 4rem;
    }

    h3 {
      font-size: $mobile-h4;
      margin-bottom: -2rem;
      display: block;
    }

    p,
    ul,
    ol {
      margin-top: 2rem;
    }

    ol, ul {
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
