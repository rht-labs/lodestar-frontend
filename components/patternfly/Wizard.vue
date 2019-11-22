<template>
  <section class="pf-c-page__main-wizard">
    <div class="pf-c-wizard pf-m-in-page fill-wizard">
      <button
        aria-label="Wizard Header Toggle"
        class="pf-c-wizard__toggle"
        aria-expanded="false"
      >
        <ol class="pf-c-wizard__toggle-list">
          <li class="pf-c-wizard__toggle-list-item">
            <span class="pf-c-wizard__toggle-num">2</span>Point of Contact
            <!-- <i
              class="fas fa-angle-right pf-c-wizard__toggle-separator"
              aria-hidden="true"
            >
            </i> -->
          </li>
          <!-- <li class="pf-c-wizard__toggle-list-item">Substep B</li> -->
        </ol>
        <i
          class="fas fa-caret-down pf-c-wizard__toggle-icon"
          aria-hidden="true"
        >
        </i>
      </button>
      <div class="pf-c-wizard__outer-wrap">
        <div class="pf-c-wizard__inner-wrap">
          <nav class="pf-c-wizard__nav" aria-label="Steps">
            <ol class="pf-c-wizard__nav-list">
              <WizardNavItem
                v-for="item in navigation"
                :key="item.key"
                :is-current="item.key === $data.currentState"
                :item="item"
                @navigate="navigate"
              >
                {{ item.displayName }}
              </WizardNavItem>
            </ol>
          </nav>
          <div class="pf-c-wizard__main">
            <div class="pf-c-wizard__main-body">
              <slot :name="`${$data.currentState}`" />
            </div>
          </div>
        </div>
        <footer class="pf-c-wizard__footer">
          <button
            class="pf-c-button pf-m-primary"
            type="submit"
            :disabled="currentState === navigation[navigation.length - 1].key"
            @click="next"
          >
            Next
          </button>
          <button
            class="pf-c-button pf-m-secondary"
            type="button"
            :disabled="currentState === navigation[0].key"
            @click="prev"
          >
            Back
          </button>
          <button class="pf-c-button pf-m-link" type="button">Cancel</button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script>
import WizardNavItem from '~/components/patternfly/WizardNavItem.vue'

export default {
  components: {
    WizardNavItem
  },
  props: ['navigation', 'initialState'],
  data() {
    return {
      currentState: this.initialState
    }
  },
  methods: {
    navigate(state) {
      this.currentState = state
    },
    next() {
      for (let i = 0; i < this.navigation.length; i++) {
        const item = this.navigation[i]
        if (item.key === this.currentState && i < this.navigation.length - 1) {
          this.currentState = this.navigation[i + 1].key
          i = this.navigation.length
        }
      }
    },
    prev() {
      for (let i = 0; i < this.navigation.length; i++) {
        const item = this.navigation[i]
        if (item.key === this.currentState && i > 0) {
          this.currentState = this.navigation[i - 1].key
          i = this.navigation.length
        }
      }
    }
  }
}
</script>

<style>
.fill-wizard {
  min-height: calc(100vh - 76px - 112px);
  /*                ^ 100% window height
                            ^ header height
                                    ^ title height
  */
}
</style>
