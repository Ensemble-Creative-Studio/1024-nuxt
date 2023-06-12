<script setup>
const query = groq`*[_type == "legal"][0]`
const sanity = useSanity()
const { data } = await useAsyncData('legal', () => sanity.fetch(query))
const legal = data.value
</script>

<template>
  <div class="legal">
    <Head>
      <Title>1024 | Legal</Title>
      <Meta name="description" content="Legal page description" />
    </Head>
    <section class="content" v-if="legal.content">
      <SanityContent :blocks="legal.content" />
    </section>
  </div>
</template>

<style lang="scss">
.legal {
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
