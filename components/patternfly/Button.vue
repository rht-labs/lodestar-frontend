<template>
  <button class="pf-c-button pf-m-primary" @click="click">
    {{ text }}
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Button!'
    }
  },
  methods: {
    click() {
      this.$emit('click')
    }
  }
}
</script>
