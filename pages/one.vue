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
            <br /><br />
            <Button @click="increment">
              Increment counter in store
            </Button>
            <br /><br />
            <Button @click="decrement">
              Decrement counter in store
            </Button>
          </h1>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Button from '~/components/patternfly/Button.vue'

export default {
  components: {
    Button
  },
  methods: {
    increment() {
      this.$store.commit('increment')
    },
    decrement() {
      this.$store.commit('decrement')
    }
  }
}
</script>
