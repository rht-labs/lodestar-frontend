<template>
  <form novalidate class="pf-c-form">
    <div class="pf-c-form__group">
      <label class="pf-c-form__label" for="customer-name">
        <span class="pf-c-title title-block">Engagement Lead</span>
        <br />
        <span class="pf-c-form__label-text">Name</span>
        <span class="pf-c-form__label-required" aria-hidden="true">
          &#42;
        </span>
      </label>
      <br />
      <input
        v-model="engagementLead.name"
        class="pf-c-form-control"
        required
        type="text"
        @change="$emit('update:engagementLead.name', engagementLead.name)"
      />
      <label class="pf-c-form__label subtitle-spacer" for="customer-name">
        <span class="pf-c-form__label-text">Phone</span>
        <span class="pf-c-form__label-required" aria-hidden="true">
          &#42;
        </span>
      </label>
      <input
        v-model="engagementLead.phone"
        class="pf-c-form-control"
        required
        type="text"
        @change="$emit('update:engagementLead.phone', engagementLead.phone)"
      />
    </div>
    <div class="pf-c-form__group">
      <label class="pf-c-form__label" for="customer-name">
        <span class="pf-c-title title-spacer title-block">Tech Lead</span>
        <br />
        <span class="pf-c-form__label-text">Name</span>
        <span class="pf-c-form__label-required" aria-hidden="true">
          &#42;
        </span>
      </label>
      <input
        v-model="techLead.name"
        class="pf-c-form-control"
        required
        type="text"
        @change="$emit('update:techLead.name', techLead.name)"
      />
      <label class="pf-c-form__label subtitle-spacer" for="customer-name">
        <span class="pf-c-form__label-text">Phone</span>
        <span class="pf-c-form__label-required" aria-hidden="true">
          &#42;
        </span>
      </label>
      <input
        v-model="techLead.phone"
        class="pf-c-form-control"
        required
        type="text"
        @change="$emit('update:techLead.phone', techLead.phone)"
      />
    </div>
    <div class="pf-c-form__group">
      <label class="pf-c-form__label" for="customer-name">
        <span class="pf-c-title title-spacer title-block">
          Customer Contact
        </span>
        <br />
        <span class="pf-c-form__label-text">Name</span>
        <span class="pf-c-form__label-required" aria-hidden="true">
          &#42;
        </span>
      </label>
      <input
        v-model="customer.name"
        class="pf-c-form-control"
        required
        type="text"
        @change="$emit('update:customer.name', customer.name)"
      />
      <label class="pf-c-form__label subtitle-spacer" for="customer-name">
        <span class="pf-c-form__label-text">Phone</span>
        <span class="pf-c-form__label-required" aria-hidden="true">
          &#42;
        </span>
      </label>
      <input
        v-model="customer.phone"
        class="pf-c-form-control"
        required
        type="text"
        @change="$emit('update:customer.phone', customer.phone)"
      />
    </div>
  </form>
</template>

<script>
export default {
  components: {},
  props: {
    engagementLead: {
      type: Object,
      default: () => {
        return {
          name: '',
          phone: ''
        }
      }
    },
    techLead: {
      type: Object,
      default: () => {
        return {
          name: '',
          phone: ''
        }
      }
    },
    customer: {
      type: Object,
      default: () => {
        return {
          name: '',
          phone: ''
        }
      }
    }
  }
}
</script>

<style>
.title-spacer {
  margin-top: 10px;
}
.title-block {
  display: block;
}
.subtitle-spacer {
  margin-top: 15px;
}
</style>
