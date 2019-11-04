import { mount } from '@vue/test-utils'
import Header from '@/components/layout/Header.vue'

describe('Header', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Header)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test("renders properly", () => {
    const wrapper = mount(Header)
    expect(wrapper.html()).toMatchSnapshot();
  });
})
