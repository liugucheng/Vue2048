import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Game from './Game.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: {} as any },
    { path: '/game', name: 'game', component: Game },
    { path: '/record', name: 'record', component: {} as any }
  ]
})

describe('Game View', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(async () => {
    setActivePinia(createPinia())

    wrapper = mount(Game, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: true
        }
      }
    })

    await router.isReady()
  })

  it('应该渲染Game组件', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('应该包含游戏页面容器', () => {
    expect(wrapper.find('.game-page').exists()).toBe(true)
  })

  it('应该包含游戏头部', () => {
    expect(wrapper.find('.game-header').exists()).toBe(true)
  })

  it('应该包含分数容器', () => {
    expect(wrapper.find('.score-container').exists()).toBe(true)
  })

  it('应该包含分数显示', () => {
    const scoreBoxes = wrapper.findAll('.score-box')
    expect(scoreBoxes.length).toBe(2)
  })

  it('应该包含控制按钮', () => {
    const controlButtons = wrapper.findAll('.control-button')
    expect(controlButtons.length).toBeGreaterThan(0)
  })

  it('应该包含Game2048组件', () => {
    expect(wrapper.findComponent({ name: 'Game2048' }).exists()).toBe(true)
  })

  it('应该包含导航链接', () => {
    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThan(0)
  })
})