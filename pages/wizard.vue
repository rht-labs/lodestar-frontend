<template>
  <main
    id="main-content-page-default-nav"
    role="main"
    class="pf-c-page__main"
    tabindex="-1"
  >
    <section class="pf-c-page__main-section pf-m-light">
      <div class="pf-c-content">
        <h1>Residency Wizard</h1>
        <p>Set up a new project to request resources</p>
      </div>
    </section>
    <Wizard :navigation="navItems" initialState="basic-information">
      <template slot="basic-information">
        <form novalidate class="pf-c-form">
          <div class="pf-c-form__group">
            <label class="pf-c-form__label" for="customer-name">
              <span class="pf-c-form__label-text">Customer</span>
              <span class="pf-c-form__label-required" aria-hidden="true">
                &#42;
              </span>
            </label>
            <input
              class="pf-c-form-control"
              required
              type="text"
              id="customer-name"
              name="customer-name"
              v-model="customer"
            />
            <p class="pf-c-form__helper-text" aria-live="polite">
              The customer name to use for this residency
            </p>
          </div>
          <div class="pf-c-form__group">
            <label class="pf-c-form__label" for="customer-location">
              <span class="pf-c-form__label-text">Location</span>
              <span class="pf-c-form__label-required" aria-hidden="true">
                &#42;
              </span>
            </label>
            <input
              class="pf-c-form-control"
              required
              type="email"
              id="customer-location"
              name="customer-location"
              v-model="location"
            />
            <p class="pf-c-form__helper-text" aria-live="polite">
              Where the residency will be held
            </p>
          </div>
          <div class="pf-c-form__group">
            <label class="pf-c-form__label" for="simple-form-number">
              <span class="pf-c-form__label-text">Dates</span>
            </label>
            <br />
            <template>
              <client-only>
                <date-picker
                  v-model="dates"
                  input-class="pf-c-form-control"
                  range
                />
              </client-only>
            </template>
            <p class="pf-c-form__helper-text" aria-live="polite">
              When the residency will be held
            </p>
          </div>
        </form>
      </template>
      <template slot="point-of-contact">
        point of contact stuff
      </template>
      <template slot="openshift-cluster">
        openshift stuff
      </template>
      <template slot="tools-and-services">
        tools and stuff
      </template>
      <template slot="users">
        users and stuff
      </template>
    </Wizard>
  </main>
</template>

<script>
import Wizard from '~/components/patternfly/Wizard.vue'

const navItems = [
  {
    key: 'basic-information',
    displayName: 'Basic Information'
  },
  {
    key: 'point-of-contact',
    displayName: 'Point of Contact'
  },
  {
    key: 'openshift-cluster',
    displayName: 'OpenShift Cluster'
  },
  {
    key: 'tools-and-services',
    displayName: 'Tools & Services'
  },
  {
    key: 'users',
    displayName: 'Users'
  }
]

export default {
  components: {
    Wizard
  },
  data: () => {
    return {
      navItems,
      dates: '',
      customer: '',
      location: ''
    }
  }
}
</script>

<style>
.pf-c-form-control {
  width: 100%;
}
.mx-datepicker {
  width: 100%;
}
.mx-input-wrapper {
  width: 100%;
}
td.cell {
  text-align: center;
}
</style>
