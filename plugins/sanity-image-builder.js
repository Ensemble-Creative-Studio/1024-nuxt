import imageUrlBuilder from '@sanity/image-url'
import sanityClient from '@sanity/client'

export default defineNuxtPlugin((nuxtApp) => {
  const client = sanityClient({
    projectId: 'fdic53fd', // replace with your project ID
    dataset: 'production',     // replace with your dataset
    useCdn: true,               // `false` if you want to ensure fresh data
  });

  const builder = imageUrlBuilder(client);

  function urlFor(source) {
    return builder.image(source).url();
  }

  nuxtApp.provide('urlFor', urlFor);
});
