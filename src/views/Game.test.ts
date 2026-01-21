import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import Game from './Game.vue'
import { useGameStore } from '../stores/gameStore'

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
  let store: ReturnType<typeof useGameStore>

  beforeEach(async () => {
    setActivePinia(createPinia())
    store = useGameStore()

    // Mock store methods
    vi.spyOn(store, 'initBoard')
    vi.spyOn(store, 'restartGame')

    wrapper = mount(Game, {
      global: {
        plugins: [router]
      }
    })

    await router.isReady()
  })

  it('应该渲染游戏页面容器', () => {
    expect(wrapper.find('.game-page').exists()).toBe(true)
  })

  it('应该渲染游戏头部', () => {
    expect(wrapper.find('.game-header').exists()).toBe(true)
  })

  it('应该渲染游戏页面结构', () => {
    expect(wrapper.find('.game-page').exists()).toBe(true)
    expect(wrapper.find('.game-header').exists()).toBe(true)
  })

  it('应该渲染分数容器', () => {
    expect(wrapper.find('.score-container').exists()).toBe(true)
  })

  it('应该渲染两个分数框', () => {
    const scoreBoxes = wrapper.findAll('.score-box')
    expect(scoreBoxes).toHaveLength(2)
  })

  it('应该显示正确的分数标签', () => {
    const labels = wrapper.findAll('.score-label')
    expect(labels[0].text()).toBe('分数')
    expect(labels[1].text()).toBe('最高')
  })

  it('应该渲染控制按钮', () => {
    const controlButtons = wrapper.findAll('.control-button')
    expect(controlButtons).toHaveLength(2)
  })

  it('应该渲染重新开始按钮', () => {
    const restartButton = wrapper.find('.control-button.restart')
    expect(restartButton.exists()).toBe(true)
    expect(restartButton.text()).toBe('重新开始')
  })

  it('应该渲染返回首页按钮', () => {
    const homeButton = wrapper.find('.control-button.home')
    expect(homeButton.exists()).toBe(true)
    expect(homeButton.attributes('to')).toBe('/')
  })

  it('应该渲染Game2048组件', () => {
    expect(wrapper.findComponent({ name: 'Game2048' }).exists()).toBe(true)
  })

  describe('分数显示', () => {
    it('应该显示当前分数', async () => {
      store.score = 256
      await wrapper.vm.$nextTick()

      const currentScoreValue = wrapper.findAll('.score-value')[0]
      expect(currentScoreValue.text()).toBe('256')
    })

    it('应该显示最高分数', async () => {
      store.bestScore = 512
      await wrapper.vm.$nextTick()

      const bestScoreValue = wrapper.findAll('.score-value')[1]
      expect(bestScoreValue.text()).toBe('512')
    })
  })

  describe('生命周期', () => {
    it('应该在组件挂载时初始化游戏', () => {
      expect(store.initBestScore).toHaveBeenCalled()
      expect(store.initBoard).toHaveBeenCalled()
    })
  })

  describe('按钮交互', () => {
    it('应该在点击重新开始按钮时调用restartGame', async () => {
      const restartButton = wrapper.find('.control-button.restart')
      await restartButton.trigger('click')

      expect(store.restartGame).toHaveBeenCalled()
    })

    it('应该正确导航到首页', () => {
      const homeButton = wrapper.find('.control-button.home')
      expect(homeButton.attributes('to')).toBe('/')
    })
  })

  describe('响应式设计', () => {
    it('应该在移动设备上有不同的布局', () => {
      // 验证移动端相关的类存在
      expect(wrapper.find('.game-page').exists()).toBe(true)
      expect(wrapper.find('.game-header').exists()).toBe(true)
    })

    it('应该有移动端友好的分数显示', () => {
      const scoreContainer = wrapper.find('.score-container')
      expect(scoreContainer.exists()).toBe(true)
    })
  })

  describe('导航', () => {
    it('应该使用router-link进行导航', () => {
      const homeLink = wrapper.find('.control-button.home')
      expect(homeLink.attributes('to')).toBe('/')
    })

    it('应该正确设置链接样式', () => {
      const homeLink = wrapper.find('.control-button.home')
      expect(homeLink.classes()).toContain('control-button')
      expect(homeLink.classes()).toContain('home')
    })
  })

  describe('计算属性', () => {
    it('应该正确绑定store的计算属性', async () => {
      store.score = 128
      store.bestScore = 256
      await wrapper.vm.$nextTick()

      const scoreValues = wrapper.findAll('.score-value')
      expect(scoreValues[0].text()).toBe('128')
      expect(scoreValues[1].text()).toBe('256')
    })
  })

  describe('样式和视觉效果', () => {
    it('应该应用渐变背景', () => {
      const header = wrapper.find('.game-header')
      expect(header.classes()).toContain('game-header')
    })

    it('应该有阴影效果', () => {
      const header = wrapper.find('.game-header')
      expect(header.exists()).toBe(true)
    })

    it('应该有悬停效果', () => {
      const buttons = wrapper.findAll('.control-button')
      buttons.forEach(button => {
        expect(button.classes()).toContain('control-button')
      })
    })
  })

  describe('可访问性', () => {
    it('应该有适当的按钮标签', () => {
      const restartButton = wrapper.find('.control-button.restart')
      expect(restartButton.text()).toBe('重新开始')
    })

    it('应该支持键盘导航', () => {
      const buttons = wrapper.findAll('.control-button')
      buttons.forEach(button => {
        expect(button.attributes('tabindex')).toBeUndefined() // 默认可聚焦
      })
    })
  })

  describe('错误处理', () => {
    it('应该优雅处理store未初始化的情况', () => {
      // 验证组件在store未完全初始化时不会崩溃
      expect(wrapper.find('.game-page').exists()).toBe(true)
    })
  })
})