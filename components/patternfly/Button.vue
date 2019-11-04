<template>
  <button class="pf-c-button pf-m-primary">
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
  }
}
</script>
