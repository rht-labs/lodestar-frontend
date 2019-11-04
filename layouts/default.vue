<template>
  <div class="pf-c-page">
    <Header @toggle-sidebar="toggleSidebar" />
    <Sidebar v-if="showSidebar" />
    <main
      id="main-content-page-default-nav"
      role="main"
      class="pf-c-page__main"
      tabindex="-1"
    >
      <section class="pf-c-page__main-section">
        <nuxt />
      </section>
    </main>
  </div>
</template>

<script>
import Header from '~/components/layout/Header.vue'
import Sidebar from '~/components/layout/Sidebar.vue'

export default {
  components: {
    Header,
    Sidebar
  },
  data: () => {
    return {
      showSidebar: true
    }
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar
    }
  }
}
</script>
