module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: "Open Management Portal",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Configure the link router
   */
  router: { 
    linkExactActiveClass: 'pf-m-current'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    { src: '@patternfly/patternfly/patternfly.scss', lang: 'scss' }
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/directives.js'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  },
  /*
   ** Server configuration
   */
  server: {
    port: 8080, // default: 3000
    host: '0.0.0.0' // default: localhost
  }
}
