<template>
  <div class="container">
    <div>
      <h1>
        <div
          v-if="authenticated"
          class="pf-c-alert pf-m-success"
          aria-label="Success alert"
        >
          <div class="pf-c-alert__icon">
            <i class="fas fa-check-circle" aria-hidden="true"></i>
          </div>
          <h4 class="pf-c-alert__title">
            <span class="pf-screen-reader">Success alert:</span>
            The backend has accepted your request on<br />a secure route and has
            identified you as {{ user }}!
          </h4>
        </div>
        <Button
          v-if="!authenticated"
          text="Attempt request to backend"
          @click="authenticate"
        />
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
  data: () => {
    return {
      authenticated: false,
      user: 'undefined'
    }
  },
  methods: {
    authenticate() {
      const self = this
      this.$axios
        .get(process.env.backendURL + 'project/secure', {
          headers: {
            Authorization: this.$auth.getToken('keycloak')
          }
        })
        .then(function(response) {
          self.authenticated = true
          self.user = response.data
        })
    }
  }
}
</script>
