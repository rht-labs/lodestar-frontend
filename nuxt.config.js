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
    middleware: ['auth'],
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
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
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
   ** Environment variables available client-side
   */
  env: {
    backendURL: process.env.BACKEND_URL
  },
  /*
   ** Server configuration
   */
  server: {
    port: process.env.LISTEN_PORT || 8080, // default: 3000
    host: '0.0.0.0' // default: localhost
  },
  /*
   ** Authentication configuration
   */
  auth: {
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/callback',
      home: '/'
    },
    strategies: {
      keycloak: {
        _scheme: 'oauth2',
        authorization_endpoint: process.env.AUTHORIZATION_ENDPOINT,
        userinfo_endpoint: process.env.USERINFO_ENDPOINT,
        scope: ['openid', 'profile', 'email'],
        access_type: 'offline',
        access_token_endpoint: process.env.TOKEN_ENDPOINT,
        response_type: 'code',
        grant_type: 'authorization_code',
        token_type: 'Bearer',
        redirect_uri: process.env.BASE_URL + 'callback',
        client_id: process.env.CLIENT_ID,
        token_key: 'access_token',
        state: 'UNIQUE_AND_NON_GUESSABLE'
      }
    }
  }
}
