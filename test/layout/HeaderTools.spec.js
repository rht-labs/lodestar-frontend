import { createLocalVue, shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import HeaderTools from '@/components/layout/HeaderTools.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
var mockStore
var wrapper

describe('HeaderTools', () => {
  beforeEach(() => {
    mockStore = new Vuex.Store({
      modules: {
        auth: {
          namespaced: false,
          state: { user: { name: "name" }}
        }
      }
    });
  });

  test('is a Vue instance', () => {
    wrapper = shallowMount(HeaderTools, { store: mockStore, localVue });
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test("renders properly", () => {
    wrapper = shallowMount(HeaderTools, { store: mockStore, localVue });
    expect(wrapper.html()).toMatchSnapshot();
  });
})
