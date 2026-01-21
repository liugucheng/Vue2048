import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义游戏方块的接口类型
export interface Cell {
  value: number // 方块的值
  id: number // 方块的唯一标识符
  merged?: boolean // 是否是合并后的方块（可选）
}

// 定义游戏记录的接口类型
export interface GameRecord {
  id: number // 记录ID
  score: number // 游戏分数
  date: string // 游戏时间
  timestamp: number // 时间戳
  duration?: number // 游戏持续时间（可选）
  won: boolean // 是否获胜
}

export const useGameStore = defineStore('game', () => {
  // 游戏状态
  const board = ref<(Cell | null)[][]>([]) // 游戏棋盘，4x4网格
  const score = ref(0) // 当前分数
  const bestScore = ref(0) // 历史最高分
  const gameOver = ref(false) // 游戏是否结束
  const gameWon = ref(false) // 是否达到2048获胜
  const gameRecords = ref<GameRecord[]>([]) // 游戏记录
  let nextId = 0 // 用于生成方块唯一ID的计数器
  let gameStartTime = 0 // 游戏开始时间

  // 计算属性
  const isGameOver = computed(() => gameOver.value)
  const isGameWon = computed(() => gameWon.value)
  const currentScore = computed(() => score.value)
  const highestScore = computed(() => bestScore.value)

  // 初始化游戏棋盘
  const initBoard = () => {
    // 创建4x4的空棋盘
    board.value = Array(4)
      .fill(null)
      .map(() => Array(4).fill(null))
    // 重置分数为0
    score.value = 0
    // 重置游戏状态
    gameOver.value = false
    gameWon.value = false
    // 记录游戏开始时间
    gameStartTime = Date.now()
    // 添加两个初始方块
    addNewTile()
    addNewTile()
  }

  // 在棋盘上随机位置添加新方块
  const addNewTile = () => {
    // 收集所有空单元格的位置
    const emptyCells: { row: number; col: number }[] = []

    // 遍历棋盘，找到所有空单元格
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!board.value[i][j]) {
          emptyCells.push({ row: i, col: j })
        }
      }
    }

    // 如果有空单元格，随机选择一个位置添加新方块
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length)
      const { row, col } = emptyCells[randomIndex]

      // 90%的概率生成2，10%的概率生成4
      const value = Math.random() < 0.9 ? 2 : 4

      // 在选定的位置创建新方块
      board.value[row][col] = {
        value,
        id: nextId++
      }
    }
  }

  // 检查是否可以移动（用于判断游戏是否结束）
  const canMove = (): boolean => {
    // 检查是否有空单元格
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!board.value[i][j]) {
          return true
        }
      }
    }

    // 检查相邻单元格是否可以合并
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = board.value[i][j]
        if (!current) continue

        // 检查右侧相邻单元格
        if (j < 3) {
          const right = board.value[i][j + 1]
          if (right && right.value === current.value) {
            return true
          }
        }

        // 检查下侧相邻单元格
        if (i < 3) {
          const down = board.value[i + 1][j]
          if (down && down.value === current.value) {
            return true
          }
        }
      }
    }

    return false
  }

  // 更新最高分
  const updateBestScore = () => {
    if (score.value > bestScore.value) {
      bestScore.value = score.value
      // 保存到localStorage
      localStorage.setItem('game2048-best-score', bestScore.value.toString())
    }
  }

  // 保存游戏记录
  const saveGameRecord = () => {
    const record: GameRecord = {
      id: Date.now(),
      score: score.value,
      date: new Date().toLocaleString(),
      timestamp: Date.now(),
      duration: gameStartTime > 0 ? Math.floor((Date.now() - gameStartTime) / 1000) : undefined,
      won: gameWon.value
    }

    // 添加到记录列表
    gameRecords.value.unshift(record)

    // 限制记录数量，最多保存100条
    if (gameRecords.value.length > 100) {
      gameRecords.value = gameRecords.value.slice(0, 100)
    }

    // 保存到localStorage
    localStorage.setItem('game2048-records', JSON.stringify(gameRecords.value))
  }

  // 加载游戏记录
  const loadGameRecords = () => {
    const saved = localStorage.getItem('game2048-records')
    if (saved) {
      try {
        gameRecords.value = JSON.parse(saved)
      } catch (error) {
        console.error('Failed to load game records:', error)
        gameRecords.value = []
      }
    }
  }

  // 检查游戏是否获胜
  const checkWin = () => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board.value[i][j] && board.value[i][j]!.value === 2048) {
          gameWon.value = true
          return
        }
      }
    }
  }

  // 移动方块（左移）
  const moveLeft = () => {
    let moved = false
    let points = 0

    for (let i = 0; i < 4; i++) {
      // 过滤掉空单元格
      const row: (Cell | null)[] = board.value[i].filter(cell => cell !== null)

      // 合并相同值的方块
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] && row[j + 1] && row[j]!.value === row[j + 1]!.value && !row[j]!.merged && !row[j + 1]!.merged) {
          row[j]!.value *= 2
          points += row[j]!.value
          row[j]!.merged = true
          row.splice(j + 1, 1)
        }
      }

      // 重新填充行
      while (row.length < 4) {
        row.push(null)
      }

      // 检查这一行是否有变化
      if (!board.value[i].every((cell, index) => cell === row[index])) {
        moved = true
      }

      board.value[i] = row
    }

    if (moved) {
      score.value += points
      addNewTile()
      checkWin()
      updateBestScore()

      // 重置合并标记
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board.value[i][j]) {
            board.value[i][j]!.merged = false
          }
        }
      }

      // 检查游戏是否结束
      if (!canMove()) {
        gameOver.value = true
        saveGameRecord()
      }
    }
  }

  // 移动方块（右移）
  const moveRight = () => {
    let moved = false
    let points = 0

    for (let i = 0; i < 4; i++) {
      // 过滤掉空单元格
      const row: (Cell | null)[] = board.value[i].filter(cell => cell !== null)

      // 合并相同值的方块
      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] && row[j - 1] && row[j]!.value === row[j - 1]!.value && !row[j]!.merged && !row[j - 1]!.merged) {
          row[j]!.value *= 2
          points += row[j]!.value
          row[j]!.merged = true
          row.splice(j - 1, 1)
          j-- // 调整索引
        }
      }

      // 在左侧填充空单元格
      while (row.length < 4) {
        row.unshift(null)
      }

      // 检查这一行是否有变化
      if (!board.value[i].every((cell, index) => cell === row[index])) {
        moved = true
      }

      board.value[i] = row
    }

    if (moved) {
      score.value += points
      addNewTile()
      checkWin()
      updateBestScore()

      // 重置合并标记
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board.value[i][j]) {
            board.value[i][j]!.merged = false
          }
        }
      }

      // 检查游戏是否结束
      if (!canMove()) {
        gameOver.value = true
        saveGameRecord()
      }
    }
  }

  // 移动方块（上移）
  const moveUp = () => {
    let moved = false
    let points = 0

    for (let j = 0; j < 4; j++) {
      // 收集这一列的所有非空方块
      const col: (Cell | null)[] = []
      for (let i = 0; i < 4; i++) {
        col.push(board.value[i][j])
      }

      // 过滤掉空单元格
      const filteredCol: (Cell | null)[] = col.filter(cell => cell !== null)

      // 合并相同值的方块
      for (let i = 0; i < filteredCol.length - 1; i++) {
        if (filteredCol[i] && filteredCol[i + 1] && filteredCol[i]!.value === filteredCol[i + 1]!.value && !filteredCol[i]!.merged && !filteredCol[i + 1]!.merged) {
          filteredCol[i]!.value *= 2
          points += filteredCol[i]!.value
          filteredCol[i]!.merged = true
          filteredCol.splice(i + 1, 1)
        }
      }

      // 重新填充列
      while (filteredCol.length < 4) {
        filteredCol.push(null)
      }

      // 检查这一列是否有变化
      for (let i = 0; i < 4; i++) {
        if (board.value[i][j] !== filteredCol[i]) {
          moved = true
          break
        }
      }

      // 更新棋盘
      for (let i = 0; i < 4; i++) {
        board.value[i][j] = filteredCol[i]
      }
    }

    if (moved) {
      score.value += points
      addNewTile()
      checkWin()
      updateBestScore()

      // 重置合并标记
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board.value[i][j]) {
            board.value[i][j]!.merged = false
          }
        }
      }

      // 检查游戏是否结束
      if (!canMove()) {
        gameOver.value = true
        saveGameRecord()
      }
    }
  }

  // 移动方块（下移）
  const moveDown = () => {
    let moved = false
    let points = 0

    for (let j = 0; j < 4; j++) {
      // 收集这一列的所有非空方块
      const col: (Cell | null)[] = []
      for (let i = 0; i < 4; i++) {
        col.push(board.value[i][j])
      }

      // 过滤掉空单元格
      const filteredCol: (Cell | null)[] = col.filter(cell => cell !== null)

      // 合并相同值的方块
      for (let i = filteredCol.length - 1; i > 0; i--) {
        if (filteredCol[i] && filteredCol[i - 1] && filteredCol[i]!.value === filteredCol[i - 1]!.value && !filteredCol[i]!.merged && !filteredCol[i - 1]!.merged) {
          filteredCol[i]!.value *= 2
          points += filteredCol[i]!.value
          filteredCol[i]!.merged = true
          filteredCol.splice(i - 1, 1)
          i-- // 调整索引
        }
      }

      // 在顶部填充空单元格
      while (filteredCol.length < 4) {
        filteredCol.unshift(null)
      }

      // 检查这一列是否有变化
      for (let i = 0; i < 4; i++) {
        if (board.value[i][j] !== filteredCol[i]) {
          moved = true
          break
        }
      }

      // 更新棋盘
      for (let i = 0; i < 4; i++) {
        board.value[i][j] = filteredCol[i]
      }
    }

    if (moved) {
      score.value += points
      addNewTile()
      checkWin()
      updateBestScore()

      // 重置合并标记
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (board.value[i][j]) {
            board.value[i][j]!.merged = false
          }
        }
      }

      // 检查游戏是否结束
      if (!canMove()) {
        gameOver.value = true
        saveGameRecord()
      }
    }
  }

  // 重新开始游戏
  const restartGame = () => {
    initBoard()
  }

  // 继续游戏（当获胜时）
  const continueGame = () => {
    gameWon.value = false
  }

  // 初始化最高分和游戏记录（从localStorage加载）
  const initBestScore = () => {
    const saved = localStorage.getItem('game2048-best-score')
    if (saved) {
      bestScore.value = parseInt(saved, 10)
    }
    loadGameRecords()
  }

  return {
    // 状态
    board,
    score,
    bestScore,
    gameOver,
    gameWon,
    gameRecords,

    // 计算属性
    isGameOver,
    isGameWon,
    currentScore,
    highestScore,

    // 方法
    initBoard,
    moveLeft,
    moveRight,
    moveUp,
    moveDown,
    restartGame,
    continueGame,
    initBestScore,
    saveGameRecord,
    loadGameRecords,
    updateBestScore
  }
})