import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Home from './Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/game', name: 'game', component: {} as any },
    { path: '/record', name: 'record', component: {} as any }
  ]
})

describe('Home View', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(async () => {
    setActivePinia(createPinia())

    wrapper = mount(Home, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true
        }
      }
    })

    await router.isReady()
  })

  it('应该渲染Home组件', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('应该包含主容器', () => {
    expect(wrapper.find('.home').exists()).toBe(true)
  })

  it('应该包含背景装饰', () => {
    expect(wrapper.find('.background-decoration').exists()).toBe(true)
  })

  it('应该包含游戏图标', () => {
    expect(wrapper.find('.game-icon').exists()).toBe(true)
  })

  it('应该包含标题区域', () => {
    expect(wrapper.find('.hero-section').exists()).toBe(true)
    expect(wrapper.find('.title').exists()).toBe(true)
  })

  it('应该包含操作按钮', () => {
    const buttons = wrapper.findAll('.action-button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('应该包含规则区域', () => {
    expect(wrapper.find('.rules-section').exists()).toBe(true)
  })

  it('应该包含规则卡片', () => {
    const ruleCards = wrapper.findAll('.rule-card')
    expect(ruleCards.length).toBeGreaterThan(0)
  })

  it('应该包含导航链接', () => {
    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThan(0)
  })
})