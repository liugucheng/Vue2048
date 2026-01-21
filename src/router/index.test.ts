import { describe, it, expect } from 'vitest'
import router from './index'

describe('Router', () => {
  it('应该正确配置路由', () => {
    const routes = router.options.routes

    expect(routes).toHaveLength(3)

    // 首页路由
    expect(routes[0]).toMatchObject({
      path: '/',
      name: 'home'
    })

    // 游戏路由
    expect(routes[1]).toMatchObject({
      path: '/game',
      name: 'game'
    })

    // 记录路由
    expect(routes[2]).toMatchObject({
      path: '/record',
      name: 'record'
    })
  })

  it('应该使用HTML5 History模式', () => {
    expect(router.options.history).toBeDefined()
    expect(router.options.history).toHaveProperty('location')
    expect(router.options.history).toHaveProperty('state')
  })

  it('应该正确设置基础URL', () => {
    // 在测试环境中，BASE_URL 可能是 undefined 或 '/'
    expect(router.options.history.base).toBeDefined()
  })
})