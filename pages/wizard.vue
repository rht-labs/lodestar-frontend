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
    <Wizard :navigation="navItems" initial-state="basic-information">
      <template slot="basic-information">
        <BasicInfo v-bind.sync="basic"></BasicInfo>
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
import BasicInfo from '~/components/forms/BasicInfo.vue'

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
    Wizard,
    BasicInfo
  },
  data: () => {
    return {
      navItems,
      basic: {
        dates: '',
        customer: '',
        location: ''
      }
    }
  }
}
</script>
