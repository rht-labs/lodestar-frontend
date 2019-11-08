import { createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex';
import Header from '@/components/layout/Header.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
var mockStore
var wrapper

describe('Header', () => {
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
    wrapper = shallowMount(Header, { store: mockStore, localVue });
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test("renders properly", () => {
    wrapper = shallowMount(Header, { store: mockStore, localVue });
    expect(wrapper.html()).toMatchSnapshot();
  });
})
