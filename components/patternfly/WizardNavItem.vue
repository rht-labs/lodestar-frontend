<template>
  <li class="pf-c-wizard__nav-item">
    <a
      class="pf-c-wizard__nav-link"
      :class="{ 'pf-m-current': isCurrent }"
      @click="$emit('navigate', item.key)"
    >
      <slot />
    </a>
  </li>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          key: undefined
        }
      }
    },
    isCurrent: {
      type: Boolean,
      default: false
    }
  }
}
</script>
