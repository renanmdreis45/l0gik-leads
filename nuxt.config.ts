export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/forms.css'],
  runtimeConfig: {
    jwtSecret: 'your-secret-key-change-in-production',
    public: {
      gtmId: '',
      apiBase: '/api'
    }
  }
})
