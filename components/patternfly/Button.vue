<template>
  <button class="pf-c-button pf-m-primary" @click="click">
    <slot />
  </button>
</template>

<script>
export default {
  props: {},
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>
