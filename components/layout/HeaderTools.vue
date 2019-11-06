<template>
  <div class="pf-c-page__header-tools">
    <div class="pf-c-page__header-tools-group pf-m-icons">
      <button class="pf-c-button pf-m-plain" type="button" aria-label="Alerts">
        <i class="fas fa-bell" aria-hidden="true"></i>
      </button>
      <button
        class="pf-c-button pf-m-plain"
        type="button"
        aria-label="Settings"
      >
        <i class="fas fa-cog" aria-hidden="true"></i>
      </button>
    </div>
    <div class="pf-c-page__header-tools-group">
      <div class="pf-c-dropdown">
        <button
          id="page-default-nav-dropdown"
          class="pf-c-dropdown__toggle pf-m-mobile pf-m-plain"
          aria-expanded="false"
          aria-label="Actions"
        >
          <i class="fas fa-ellipsis-v" aria-hidden="true"></i>
        </button>
        <ul
          class="pf-c-dropdown__menu pf-m-align-right"
          aria-labelledby="page-default-nav-dropdown"
          hidden
        >
          <li>
            <a class="pf-c-dropdown__menu-item" href="#">Link</a>
          </li>
          <li>
            <button class="pf-c-dropdown__menu-item">Action</button>
          </li>
          <li>
            <a
              class="pf-c-dropdown__menu-item pf-m-disabled"
              aria-disabled="true"
              tabindex="-1"
              href="#"
            >
              Disabled link
            </a>
          </li>
          <li>
            <button class="pf-c-dropdown__menu-item" disabled>
              Disabled action
            </button>
          </li>
          <li class="pf-c-divider" role="separator"></li>
          <li>
            <a class="pf-c-dropdown__menu-item" href="#">Separated link</a>
          </li>
        </ul>
      </div>
      <div class="pf-m-user">
        <div class="pf-c-dropdown">
          <button
            id="page-default-nav-example-dropdown-button"
            ref="userButton"
            class="pf-c-dropdown__toggle pf-m-plain"
            aria-expanded="false"
            @click="toggleDropdown"
          >
            <span class="pf-c-dropdown__toggle-text">{{ name }}</span>
            <i
              class="fas fa-caret-down pf-c-dropdown__toggle-icon"
              aria-hidden="true"
            ></i>
          </button>
          <div
            v-if="showDropdown"
            v-closable="{
              exclude: ['userButton'],
              handler: 'onUnfocus'
            }"
            class="pf-c-dropdown__menu"
          >
            <ul>
              <li @click="logout">
                <p class="pf-c-dropdown__menu-item">Log Out</p>
              </li>
              <!--
              <li>
                <button class="pf-c-dropdown__menu-item">Action</button>
              </li>
              <li>
                <a
                  class="pf-c-dropdown__menu-item pf-m-disabled"
                  aria-disabled="true"
                  tabindex="-1"
                  href="#"
                >
                  Disabled link
                </a>
              </li>
              <li>
                <button class="pf-c-dropdown__menu-item" disabled>
                  Disabled action
                </button>
              </li>
              <li class="pf-c-divider" role="separator"></li>
              <li>
                <a class="pf-c-dropdown__menu-item" href="#">Separated link</a>
              </li>
              -->
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      showDropdown: false
    }
  },
  computed: {
    name() {
      return this.$store.state.auth.user.name
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    onUnfocus() {
      this.showDropdown = false
    },
    logout() {
      this.$auth.logout()
      this.$router.push({
        path: '/login'
      })
    }
  }
}
</script>
