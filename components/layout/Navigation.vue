<template>
  <nav
    id="page-default-nav-primary-nav"
    class="pf-c-nav pf-m-dark"
    aria-label="Global"
  >
    <ul class="pf-c-nav__list">
      <li class="pf-c-nav__item">
        <nuxt-link class="pf-c-nav__link" to="/">Home</nuxt-link>
        <nuxt-link class="pf-c-nav__link" to="/one">Test Vuex Store</nuxt-link>
        <nuxt-link class="pf-c-nav__link" to="/two">Test Backend</nuxt-link>
        <nuxt-link class="pf-c-nav__link" to="/wizard">Wizard</nuxt-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {}
</script>

<style scoped>
.pf-c-nav__link:focus {
  outline: none;
}
.pf-c-nav__link:active:focus {
  outline: none;
}
</style>
