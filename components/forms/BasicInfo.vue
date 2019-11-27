<template>
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
        v-model="customer"
        @change="$emit('update:customer', customer)"
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
        v-model="location"
        @change="$emit('update:location', location)"
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
            @change="$emit('update:dates', dates)"
          />
        </client-only>
      </template>
      <p class="pf-c-form__helper-text" aria-live="polite">
        When the residency will be held
      </p>
    </div>
  </form>
</template>

<script>
export default {
  props: ['customer', 'location', 'dates']
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
