<template>
  <div class="container">
    <div>
      <h1>
        Hello! The counter is currently set to {{ this.$store.state.counter }}
        <br /><br />
        <Button text="Increment counter in store" @click="increment" />
        <br /><br />
        <Button text="Decrement counter in store" @click="decrement" />
      </h1>
    </div>
  </div>
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
