<template>
  <header role="banner" class="pf-c-page__header">
    <div class="pf-c-page__header-brand">
      <div class="pf-c-page__header-brand-toggle">
        <button
          id="page-default-nav-example-nav-toggle"
          class="pf-c-button pf-m-plain"
          type="button"
          @click="$emit('toggle-sidebar')"
        >
          <i class="fas fa-bars" aria-hidden="true"></i>
        </button>
      </div>
      <a class="pf-c-page__header-brand-link">
        <img
          class="pf-c-brand"
          src="~assets/logo-with-labs.png"
          alt="PatternFly logo"
        />
      </a>
    </div>
    <HeaderTools />
  </header>
</template>

<script>
import HeaderTools from '~/components/layout/HeaderTools.vue'

export default {
  components: {
    HeaderTools
  }
}
</script>
