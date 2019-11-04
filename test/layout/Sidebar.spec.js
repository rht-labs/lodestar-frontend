import Sidebar from '@/components/layout/Sidebar.vue'
import { shallowMount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue()

localVue.component('nuxt-link', {
  props:   ['to'],
  template: '<a href="#"><slot>NuxtLink</slot></a>',
})

describe('Sidebar', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(Sidebar, {
      stubs: ['nuxt-link'],
      localVue
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test("renders properly", () => {
    const wrapper = shallowMount(Sidebar, {
      stubs: ['nuxt-link'],
      localVue
    })
    expect(wrapper.html()).toMatchSnapshot();
  });
})
