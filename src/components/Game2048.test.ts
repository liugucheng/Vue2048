import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Game2048 from './Game2048.vue'
import { createPinia, setActivePinia } from 'pinia'

describe('Game2048 Component', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    setActivePinia(createPinia())
    wrapper = mount(Game2048)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('应该渲染组件', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('应该包含游戏容器', () => {
    expect(wrapper.find('.game-container').exists()).toBe(true)
  })

  it('应该包含游戏信息区域', () => {
    expect(wrapper.find('.info').exists()).toBe(true)
  })

  it('应该包含游戏棋盘', () => {
    expect(wrapper.find('.board').exists()).toBe(true)
  })

  it('应该渲染16个棋盘格子', () => {
    const cells = wrapper.findAll('.cell')
    expect(cells.length).toBe(16)
  })

  it('应该有重新开始按钮', () => {
    const restartButton = wrapper.find('.restart-btn')
    expect(restartButton.exists()).toBe(true)
  })

  it('应该能够处理重新开始游戏', async () => {
    const restartButton = wrapper.find('.restart-btn')
    await restartButton.trigger('click')
    // 验证按钮点击不会抛出错误
    expect(restartButton.exists()).toBe(true)
  })
})