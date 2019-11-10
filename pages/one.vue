<template>
  <main
    id="main-content-page-default-nav"
    role="main"
    class="pf-c-page__main"
    tabindex="-1"
  >
    <section class="pf-c-page__main-section">
      <div class="container">
        <div>
          <h1>
            Hello! The counter is currently set to
            {{ this.$store.state.counter }}
          </h1>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  components: {}
}
</script>
