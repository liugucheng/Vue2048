<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Cell {
  value: number
  id: number
  merged?: boolean
}

const board = ref<(Cell | null)[][]>([])
const score = ref(0)
const bestScore = ref(0)
const gameOver = ref(false)
const gameWon = ref(false)
let nextId = 0

const initBoard = () => {
  board.value = Array(4).fill(null).map(() => Array(4).fill(null))
  score.value = 0
  gameOver.value = false
  gameWon.value = false
  addNewTile()
  addNewTile()
}

const addNewTile = () => {
  const emptyCells: { row: number; col: number }[] = []

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!board.value[i][j]) {
        emptyCells.push({ row: i, col: j })
      }
    }
  }

  if (emptyCells.length > 0) {
    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    board.value[row][col] = {
      value: Math.random() < 0.9 ? 2 : 4,
      id: nextId++
    }
  }
}

const move = (direction: 'up' | 'down' | 'left' | 'right') => {
  if (gameOver.value || gameWon.value) return

  let moved = false
  const newBoard: (Cell | null)[][] = Array(4).fill(null).map(() => Array(4).fill(null))

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board.value[i][j]) {
        board.value[i][j]!.merged = false
      }
    }
  }

  if (direction === 'left') {
    for (let i = 0; i < 4; i++) {
      let pos = 0
      for (let j = 0; j < 4; j++) {
        if (board.value[i][j]) {
          const cell = board.value[i][j]!
          if (pos > 0 && newBoard[i][pos - 1] &&
              newBoard[i][pos - 1]!.value === cell.value &&
              !newBoard[i][pos - 1]!.merged) {
            newBoard[i][pos - 1]!.value *= 2
            newBoard[i][pos - 1]!.merged = true
            score.value += newBoard[i][pos - 1]!.value

            if (newBoard[i][pos - 1]!.value === 2048) {
              gameWon.value = true
            }
            moved = true
          } else {
            newBoard[i][pos] = { ...cell }
            if (pos !== j) moved = true
            pos++
          }
        }
      }
    }
  } else if (direction === 'right') {
    for (let i = 0; i < 4; i++) {
      let pos = 3
      for (let j = 3; j >= 0; j--) {
        if (board.value[i][j]) {
          const cell = board.value[i][j]!
          if (pos < 3 && newBoard[i][pos + 1] &&
              newBoard[i][pos + 1]!.value === cell.value &&
              !newBoard[i][pos + 1]!.merged) {
            newBoard[i][pos + 1]!.value *= 2
            newBoard[i][pos + 1]!.merged = true
            score.value += newBoard[i][pos + 1]!.value

            if (newBoard[i][pos + 1]!.value === 2048) {
              gameWon.value = true
            }
            moved = true
          } else {
            newBoard[i][pos] = { ...cell }
            if (pos !== j) moved = true
            pos--
          }
        }
      }
    }
  } else if (direction === 'up') {
    for (let j = 0; j < 4; j++) {
      let pos = 0
      for (let i = 0; i < 4; i++) {
        if (board.value[i][j]) {
          const cell = board.value[i][j]!
          if (pos > 0 && newBoard[pos - 1][j] &&
              newBoard[pos - 1][j]!.value === cell.value &&
              !newBoard[pos - 1][j]!.merged) {
            newBoard[pos - 1][j]!.value *= 2
            newBoard[pos - 1][j]!.merged = true
            score.value += newBoard[pos - 1][j]!.value

            if (newBoard[pos - 1][j]!.value === 2048) {
              gameWon.value = true
            }
            moved = true
          } else {
            newBoard[pos][j] = { ...cell }
            if (pos !== i) moved = true
            pos++
          }
        }
      }
    }
  } else if (direction === 'down') {
    for (let j = 0; j < 4; j++) {
      let pos = 3
      for (let i = 3; i >= 0; i--) {
        if (board.value[i][j]) {
          const cell = board.value[i][j]!
          if (pos < 3 && newBoard[pos + 1][j] &&
              newBoard[pos + 1][j]!.value === cell.value &&
              !newBoard[pos + 1][j]!.merged) {
            newBoard[pos + 1][j]!.value *= 2
            newBoard[pos + 1][j]!.merged = true
            score.value += newBoard[pos + 1][j]!.value

            if (newBoard[pos + 1][j]!.value === 2048) {
              gameWon.value = true
            }
            moved = true
          } else {
            newBoard[pos][j] = { ...cell }
            if (pos !== i) moved = true
            pos--
          }
        }
      }
    }
  }

  if (moved) {
    board.value = newBoard
    addNewTile()
    checkGameOver()

    if (score.value > bestScore.value) {
      bestScore.value = score.value
      localStorage.setItem('bestScore2048', bestScore.value.toString())
    }
  }
}

const checkGameOver = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!board.value[i][j]) return

      if (j < 3 && board.value[i][j]!.value === board.value[i][j + 1]?.value) return
      if (i < 3 && board.value[i][j]!.value === board.value[i + 1][j]?.value) return
    }
  }

  gameOver.value = true
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault()
  }

  switch (e.key) {
    case 'ArrowUp':
      move('up')
      break
    case 'ArrowDown':
      move('down')
      break
    case 'ArrowLeft':
      move('left')
      break
    case 'ArrowRight':
      move('right')
      break
  }
}

const restart = () => {
  initBoard()
}

onMounted(() => {
  const saved = localStorage.getItem('bestScore2048')
  if (saved) {
    bestScore.value = parseInt(saved)
  }
  initBoard()
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

const getCellColor = (value: number) => {
  const colors: { [key: number]: string } = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  }
  return colors[value] || '#3c3a32'
}

const getTextColor = (value: number) => {
  return value <= 4 ? '#776e65' : '#f9f6f2'
}
</script>

<template>
  <div class="game-container">
    <div class="header">
      <h1 class="title">2048</h1>
      <div class="scores">
        <div class="score-box">
          <div class="label">分数</div>
          <div class="value">{{ score }}</div>
        </div>
        <div class="score-box">
          <div class="label">最高</div>
          <div class="value">{{ bestScore }}</div>
        </div>
      </div>
    </div>

    <div class="info">
      <p>使用方向键移动方块，合并相同数字达到 <strong>2048</strong>！</p>
      <button @click="restart" class="restart-btn">新游戏</button>
    </div>

    <div class="board">
      <div
        v-for="(row, i) in board"
        :key="i"
        class="row"
      >
        <div
          v-for="(cell, j) in row"
          :key="j"
          class="cell"
          :class="{ 'has-value': cell }"
          :style="{
            backgroundColor: cell ? getCellColor(cell.value) : '#cdc1b4',
            color: cell ? getTextColor(cell.value) : 'transparent'
          }"
        >
          {{ cell?.value || '' }}
        </div>
      </div>
    </div>

    <div v-if="gameOver" class="overlay">
      <div class="message">
        <h2>游戏结束！</h2>
        <p>最终分数：{{ score }}</p>
        <button @click="restart" class="restart-btn">再来一局</button>
      </div>
    </div>

    <div v-if="gameWon && !gameOver" class="overlay">
      <div class="message">
        <h2>恭喜你赢了！</h2>
        <p>你达到了 2048！</p>
        <button @click="gameWon = false" class="continue-btn">继续游戏</button>
        <button @click="restart" class="restart-btn">新游戏</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title {
  font-size: 80px;
  font-weight: bold;
  color: #776e65;
  margin: 0;
}

.scores {
  display: flex;
  gap: 10px;
}

.score-box {
  background: #bbada0;
  padding: 10px 20px;
  border-radius: 3px;
  text-align: center;
  min-width: 80px;
}

.label {
  color: #eee4da;
  font-size: 13px;
  text-transform: uppercase;
  font-weight: bold;
}

.value {
  color: white;
  font-size: 25px;
  font-weight: bold;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #776e65;
}

.info p {
  margin: 0;
  flex: 1;
}

.restart-btn, .continue-btn {
  background: #8f7a66;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.restart-btn:hover, .continue-btn:hover {
  background: #9f8a76;
}

.continue-btn {
  background: #edcf72;
  color: #776e65;
  margin-right: 10px;
}

.continue-btn:hover {
  background: #edd472;
}

.board {
  background: #bbada0;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
}

.row {
  display: flex;
  gap: 15px;
}

.cell {
  width: 100px;
  height: 100px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 35px;
  font-weight: bold;
  transition: all 0.15s ease-in-out;
}

.cell.has-value {
  animation: appear 0.2s;
}

@keyframes appear {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(238, 228, 218, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.message {
  background: white;
  padding: 40px;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.message h2 {
  color: #776e65;
  margin: 0 0 10px 0;
  font-size: 40px;
}

.message p {
  color: #776e65;
  margin: 0 0 20px 0;
  font-size: 18px;
}

@media (max-width: 600px) {
  .title {
    font-size: 50px;
  }

  .cell {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .info {
    flex-direction: column;
    gap: 10px;
  }

  .info p {
    text-align: center;
  }
}
</style>
