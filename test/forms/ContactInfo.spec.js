import { mount } from '@vue/test-utils'
import ContactInfo from '@/components/forms/ContactInfo.vue'
import 'isomorphic-fetch'

const testProps = {
  engagementLead: {
    name: '',
    phone: ''
  },
  techLead: {
    name: '',
    phone: ''
  },
  customer: {
    name: '',
    phone: ''
  }
}

describe('ContactInfo', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(ContactInfo, {
      propsData: testProps
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = mount(ContactInfo, {
      propsData: testProps
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
