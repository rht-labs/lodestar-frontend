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
      <vue-tel-input
        v-model="engagementLead.phone"
        input-classes="pf-c-form-control"
        placeholder=""
        wrapper-classes="phone-border"
        @change="$emit('update:engagementLead.phone', engagementLead.phone)"
      ></vue-tel-input>
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
      <vue-tel-input
        v-model="techLead.phone"
        input-classes="pf-c-form-control"
        placeholder=""
        wrapper-classes="phone-border"
        @change="$emit('update:techLead.phone', techLead.phone)"
      ></vue-tel-input>
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
      <vue-tel-input
        v-model="customer.phone"
        input-classes="pf-c-form-control"
        placeholder=""
        wrapper-classes="phone-border"
        @change="$emit('update:customer.phone', customer.phone)"
      ></vue-tel-input>
    </div>
  </form>
</template>

<script>
import { VueTelInput } from 'vue-tel-input'

export default {
  components: {
    VueTelInput
  },
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
.phone-border {
  border: 1px solid rgb(237, 237, 237) !important;
  border-bottom: 1px solid rgb(138, 141, 144) !important;
}
.phone-border:hover {
  box-shadow: none !important;
  border-bottom: 1px solid rgb(0, 102, 204) !important;
}
.phone-border:focus-within {
  box-shadow: none !important;
  border-bottom: 2px solid rgb(0, 102, 204) !important;
}
.phone-border:active {
  box-shadow: none !important;
  border-bottom: 2px solid rgb(0, 102, 204) !important;
}
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
