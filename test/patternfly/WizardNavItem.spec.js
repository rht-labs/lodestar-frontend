import { mount } from '@vue/test-utils'
import WizardNavItem from '@/components/patternfly/WizardNavItem.vue'

const testProps = {
  isCurrent: true,
  item: {
    key: 'first-form'
  }
}

describe('WizardNavItem', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(WizardNavItem, {
      propsData: testProps
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = mount(WizardNavItem, {
      propsData: testProps
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
