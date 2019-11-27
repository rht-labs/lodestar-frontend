import { shallowMount, createLocalVue } from '@vue/test-utils'
import DatePicker from 'vue2-datepicker'
import BasicInfo from '@/components/forms/BasicInfo.vue'

const localVue = createLocalVue()
localVue.component('date-picker', DatePicker)

const testProps = {
  customer: 'me',
  location: 'somewhere',
  dates: [
    Date.parse('01 Jan 1970 00:00:00 GMT'),
    Date.parse('04 Dec 1995 00:12:00 GMT')
  ]
}

const TestDate = Date

beforeEach(() => {
  global.Date = class extends TestDate {
    constructor() {
      super()
      return new TestDate('01 Jan 1970 00:00:00 GMT')
    }
  }
})

afterEach(() => {
  global.Date = TestDate
})

describe('BasicInfo', () => {
  test('is a Vue instance', () => {
    const wrapper = shallowMount(BasicInfo, {
      propsData: testProps,
      localVue
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('renders properly', () => {
    const wrapper = shallowMount(BasicInfo, {
      propsData: testProps,
      localVue
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
