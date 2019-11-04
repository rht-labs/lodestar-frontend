import Navigation from '@/components/layout/Navigation.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue()

localVue.component('nuxt-link', {
  props:   ['to'],
  template: '<a href="#"><slot>NuxtLink</slot></a>',
})

describe('Navigation', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(Navigation, {
      stubs: ['nuxt-link'],
      localVue
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  });

  test("renders properly", () => {
    const wrapper = shallowMount(Navigation, {
      stubs: ['nuxt-link'],
      localVue
    })
    expect(wrapper.html()).toMatchSnapshot();
  });
})
