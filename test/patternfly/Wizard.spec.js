import { mount } from '@vue/test-utils'
import Wizard from '@/components/patternfly/Wizard.vue'

const testProps = {
  navigation: [
    {
      key: 'first-form',
      displayName: 'First Form'
    },
    {
      key: 'second-form',
      displayName: 'Second Form'
    }
  ]
}

describe('Wizard', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(Wizard, {
      propsData: testProps
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = mount(Wizard, {
      propsData: testProps
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
