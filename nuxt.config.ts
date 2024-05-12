// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/styles/vello.css'],
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', "@nuxt/ui"],
  colorMode: {
    preference: 'light',
  }
})