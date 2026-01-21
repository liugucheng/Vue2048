import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Record from './Record.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: {} as any },
    { path: '/game', name: 'game', component: {} as any },
    { path: '/record', name: 'record', component: Record }
  ]
})

describe('Record View', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(async () => {
    setActivePinia(createPinia())

    wrapper = mount(Record, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true
        }
      }
    })

    await router.isReady()
  })

  it('应该渲染Record组件', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('应该包含记录页面容器', () => {
    expect(wrapper.find('.record-page').exists()).toBe(true)
  })

  it('应该包含页面头部', () => {
    expect(wrapper.find('.record-header').exists()).toBe(true)
  })

  it('应该包含统计区域', () => {
    expect(wrapper.find('.record-stats').exists()).toBe(true)
  })

  it('应该包含统计卡片', () => {
    const statItems = wrapper.findAll('.stat-item')
    expect(statItems.length).toBeGreaterThan(0)
  })

  it('应该包含Vlist组件', () => {
    expect(wrapper.findComponent({ name: 'Vlist' }).exists()).toBe(true)
  })

  it('应该包含导航链接', () => {
    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThan(0)
  })
})