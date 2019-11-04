import { mount } from '@vue/test-utils'
import HeaderTools from '@/components/layout/HeaderTools.vue'

describe('HeaderTools', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(HeaderTools)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test("renders properly", () => {
    const wrapper = mount(HeaderTools)
    expect(wrapper.html()).toMatchSnapshot();
  });
})
