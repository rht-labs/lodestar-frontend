import { mount } from '@vue/test-utils'
import Button from '@/components/patternfly/Button.vue'

describe('Button', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Button)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test("renders properly", () => {
    const wrapper = mount(Button)
    expect(wrapper.html()).toMatchSnapshot();
  });
})
