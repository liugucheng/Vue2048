import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Vlist from './Vlist.vue'
import type { GameRecord } from '../stores/gameStore'

describe('Vlist Component', () => {
  const mockRecords: GameRecord[] = [
    {
      id: 1,
      score: 100,
      date: '2024-01-01 12:00:00',
      timestamp: Date.now(),
      duration: 120,
      won: false
    },
    {
      id: 2,
      score: 200,
      date: '2024-01-02 13:00:00',
      timestamp: Date.now() + 86400000,
      duration: 180,
      won: true
    }
  ]

  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(Vlist, {
      props: {
        items: mockRecords,
        itemHeight: 60,
        containerHeight: 200
      }
    })
  })

  it('应该渲染虚拟列表组件', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('应该包含虚拟列表容器', () => {
    expect(wrapper.find('.virtual-list-container').exists()).toBe(true)
  })

  it('应该渲染记录数量信息', () => {
    expect(wrapper.find('.info').exists()).toBe(true)
  })

  it('应该渲染表格结构', () => {
    expect(wrapper.find('.records-table').exists()).toBe(true)
  })

  it('应该渲染表头', () => {
    expect(wrapper.find('.table-header').exists()).toBe(true)
  })

  it('应该渲染数据行', () => {
    const dataRows = wrapper.findAll('.record-row').filter(row => !row.classes('header'))
    expect(dataRows.length).toBeGreaterThan(0)
  })

  it('应该正确处理空数据', () => {
    const emptyWrapper = mount(Vlist, {
      props: {
        items: [],
        itemHeight: 60,
        containerHeight: 200
      }
    })

    expect(emptyWrapper.exists()).toBe(true)
    expect(emptyWrapper.find('.info').exists()).toBe(true)
  })

  it('应该接受不同的props', () => {
    const customWrapper = mount(Vlist, {
      props: {
        items: mockRecords,
        itemHeight: 80,
        containerHeight: 300
      }
    })

    expect(customWrapper.exists()).toBe(true)
  })
})