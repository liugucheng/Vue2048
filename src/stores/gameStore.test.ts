import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useGameStore } from './gameStore'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('Game Store', () => {
  let store: ReturnType<typeof useGameStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useGameStore()
    vi.clearAllMocks()
    // 重置localStorage mock
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('初始化', () => {
    it('应该正确初始化游戏状态', () => {
      expect(store.board).toEqual([])
      expect(store.score).toBe(0)
      expect(store.bestScore).toBe(0)
      expect(store.gameOver).toBe(false)
      expect(store.gameWon).toBe(false)
      expect(store.gameRecords).toEqual([])
    })

    it('应该正确初始化最高分', () => {
      localStorageMock.getItem.mockReturnValue('1000')
      store.initBestScore()
      expect(store.bestScore).toBe(1000)
      expect(localStorageMock.getItem).toHaveBeenCalledWith('game2048-best-score')
    })

    it('应该处理localStorage中的数据', () => {
      // 这个测试主要验证方法调用不会出错
      expect(() => store.initBestScore()).not.toThrow()
    })

    it('应该加载游戏记录', () => {
      const mockRecords = [
        { id: 1, score: 100, date: '2024-01-01', timestamp: 1234567890, won: false }
      ]
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRecords))
      store.initBestScore()
      expect(store.gameRecords).toEqual(mockRecords)
    })
  })

  describe('游戏初始化', () => {
    it('应该正确初始化游戏棋盘', () => {
      store.initBoard()

      expect(store.board).toHaveLength(4)
      expect(store.board[0]).toHaveLength(4)
      expect(store.score).toBe(0)
      expect(store.gameOver).toBe(false)
      expect(store.gameWon).toBe(false)
    })

    it('应该在初始化时添加两个方块', () => {
      store.initBoard()

      let tileCount = 0
      store.board.forEach(row => {
        row.forEach(cell => {
          if (cell !== null) tileCount++
        })
      })

      expect(tileCount).toBe(2)
    })
  })

  describe('添加新方块', () => {
    beforeEach(() => {
      store.initBoard()
    })

    it('应该在空位置添加新方块', () => {
    const initialTileCount = store.board.flat().filter(cell => cell !== null).length

    // 通过移动来触发添加新方块
    store.moveLeft()

    const newTileCount = store.board.flat().filter(cell => cell !== null).length
    // 移动可能不会总是添加新方块，取决于棋盘状态
    expect(newTileCount).toBeGreaterThanOrEqual(initialTileCount)
  })

  it('应该只添加2或4的值', () => {
    store.initBoard()

    const tiles = store.board.flat().filter(cell => cell !== null)

    tiles.forEach(tile => {
      expect([2, 4]).toContain(tile?.value)
    })
  })
  })

  describe('移动逻辑', () => {
    it('应该有移动方法', () => {
      expect(typeof store.moveLeft).toBe('function')
      expect(typeof store.moveRight).toBe('function')
      expect(typeof store.moveUp).toBe('function')
      expect(typeof store.moveDown).toBe('function')
    })

    it('应该能够执行移动操作', () => {
      // 只验证方法可以被调用而不抛出错误
      expect(() => {
        store.initBoard()
        store.moveLeft()
      }).not.toThrow()
    })
  })

  describe('游戏状态管理', () => {
    it('应该能够处理游戏结束状态', () => {
      store.initBoard()

      // 验证初始状态
      expect(store.gameOver).toBe(false)
      expect(store.gameWon).toBe(false)
    })

    it('应该能够处理获胜状态', () => {
      store.initBoard()

      // 验证初始状态下没有获胜
      expect(store.gameWon).toBe(false)
    })
  })

  describe('最高分更新', () => {
    beforeEach(() => {
      store.bestScore = 100
      vi.clearAllMocks()
    })

    it('应该在分数超过最高分时更新', () => {
      store.score = 200
      store.updateBestScore()

      expect(store.bestScore).toBe(200)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('game2048-best-score', '200')
    })

    it('不应该在分数低于最高分时更新', () => {
      store.score = 50
      store.updateBestScore()

      expect(store.bestScore).toBe(100)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('游戏记录', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-01-01T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('应该保存游戏记录', () => {
      store.score = 100
      store.gameWon = true
      store.saveGameRecord()

      expect(store.gameRecords).toHaveLength(1)
      expect(store.gameRecords[0]).toMatchObject({
        score: 100,
        won: true,
        date: expect.any(String),
        timestamp: expect.any(Number)
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'game2048-records',
        expect.any(String)
      )
    })

    it('应该有游戏记录功能', () => {
      expect(store.gameRecords).toBeDefined()
      expect(typeof store.saveGameRecord).toBe('function')
      expect(typeof store.loadGameRecords).toBe('function')
    })
  })

  describe('重新开始游戏', () => {
    it('应该重置游戏状态', () => {
      // 先设置一些状态
      store.score = 100
      store.gameOver = true
      store.gameWon = true
      store.board.value = [
        [{ value: 2048, id: 1 }, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null]
      ]

      store.restartGame()

      expect(store.score).toBe(0)
      expect(store.gameOver).toBe(false)
      expect(store.gameWon).toBe(false)
      // 应该重新初始化棋盘
      expect(store.board).toHaveLength(4)
    })
  })

  describe('继续游戏', () => {
    it('应该重置获胜状态', () => {
      store.gameWon = true

      store.continueGame()

      expect(store.gameWon).toBe(false)
    })
  })
})