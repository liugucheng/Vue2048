<script setup lang="ts">
// 导入Vue的响应式API和生命周期钩子
import { ref, onMounted, onUnmounted } from "vue";

// 定义游戏方块的接口类型
interface Cell {
  value: number; // 方块的值
  id: number; // 方块的唯一标识符
  merged?: boolean; // 是否是合并后的方块（可选）
}

// 游戏状态管理
const board = ref<(Cell | null)[][]>([]); // 游戏棋盘，4x4网格
const score = ref(0); // 当前分数
const bestScore = ref(0); // 历史最高分
const gameOver = ref(false); // 游戏是否结束
const gameWon = ref(false); // 是否达到2048获胜
let nextId = 0; // 用于生成方块唯一ID的计数器

// 触摸事件相关变量
let touchStartX = 0; // 触摸开始时的X坐标
let touchStartY = 0; // 触摸开始时的Y坐标
let touchEndX = 0; // 触摸结束时的X坐标
let touchEndY = 0; // 触摸结束时的Y坐标

// 初始化游戏棋盘
const initBoard = () => {
  // 创建4x4的空棋盘
  board.value = Array(4)
    .fill(null)
    .map(() => Array(4).fill(null));
  // 重置分数为0
  score.value = 0;
  // 重置游戏状态
  gameOver.value = false;
  gameWon.value = false;
  // 添加两个初始方块
  addNewTile();
  addNewTile();
};

// 在棋盘上随机位置添加新方块
const addNewTile = () => {
  // 收集所有空单元格的位置
  const emptyCells: { row: number; col: number }[] = [];

  // 遍历棋盘，找到所有空单元格
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!board.value[i][j]) {
        emptyCells.push({ row: i, col: j });
      }
    }
  }

  // 如果有空单元格，则随机选择一个位置添加新方块
  if (emptyCells.length > 0) {
    // 随机选择一个空单元格
    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // 在选中位置添加新方块，90%概率是2，10%概率是4
    board.value[row][col] = {
      value: Math.random() < 0.9 ? 2 : 4,
      id: nextId++, // 分配唯一ID并自增
    };
  }
};

// 处理方块移动逻辑
const move = (direction: "up" | "down" | "left" | "right") => {
  // 如果游戏结束或已获胜，则不处理移动
  if (gameOver.value || gameWon.value) return;

  // 标记是否有方块移动
  let moved = false;
  // 创建新棋盘用于计算移动后的状态
  const newBoard: (Cell | null)[][] = Array(4)
    .fill(null)
    .map(() => Array(4).fill(null));

  // 重置所有方块的merged状态
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board.value[i][j]) {
        board.value[i][j]!.merged = false;
      }
    }
  }

  // 处理向左移动
  if (direction === "left") {
    // 遍历每一行
    for (let i = 0; i < 4; i++) {
      // pos表示当前行中空位的位置
      let pos = 0;
      // 从左到右遍历每一列
      for (let j = 0; j < 4; j++) {
        // 如果当前位置有方块
        if (board.value[i][j]) {
          const cell = board.value[i][j]!;
          // 如果左边有方块且值相同且未合并过
          if (
            pos > 0 &&
            newBoard[i][pos - 1] &&
            newBoard[i][pos - 1]!.value === cell.value &&
            !newBoard[i][pos - 1]!.merged
          ) {
            // 合并方块
            newBoard[i][pos - 1]!.value *= 2;
            // 标记为已合并
            newBoard[i][pos - 1]!.merged = true;
            // 更新分数
            score.value += newBoard[i][pos - 1]!.value;

            // 如果合并后达到2048，标记获胜
            if (newBoard[i][pos - 1]!.value === 2048) {
              gameWon.value = true;
            }
            // 标记有方块移动
            moved = true;
          } else {
            // 方块不能合并，直接移动到目标位置
            newBoard[i][pos] = { ...cell };
            // 如果位置有变化，标记移动
            if (pos !== j) moved = true;
            // 移动空位指示器
            pos++;
          }
        }
      }
    }
  }
  // 处理向右移动
  else if (direction === "right") {
    // 遍历每一行
    for (let i = 0; i < 4; i++) {
      // pos表示当前行中空位的位置（从右开始）
      let pos = 3;
      // 从右到左遍历每一列
      for (let j = 3; j >= 0; j--) {
        // 如果当前位置有方块
        if (board.value[i][j]) {
          const cell = board.value[i][j]!;
          // 如果右边有方块且值相同且未合并过
          if (
            pos < 3 &&
            newBoard[i][pos + 1] &&
            newBoard[i][pos + 1]!.value === cell.value &&
            !newBoard[i][pos + 1]!.merged
          ) {
            // 合并方块
            newBoard[i][pos + 1]!.value *= 2;
            // 标记为已合并
            newBoard[i][pos + 1]!.merged = true;
            // 更新分数
            score.value += newBoard[i][pos + 1]!.value;

            // 如果合并后达到2048，标记获胜
            if (newBoard[i][pos + 1]!.value === 2048) {
              gameWon.value = true;
            }
            // 标记有方块移动
            moved = true;
          } else {
            // 方块不能合并，直接移动到目标位置
            newBoard[i][pos] = { ...cell };
            // 如果位置有变化，标记移动
            if (pos !== j) moved = true;
            // 移动空位指示器
            pos--;
          }
        }
      }
    }
  }
  // 处理向上移动
  else if (direction === "up") {
    // 遍历每一列
    for (let j = 0; j < 4; j++) {
      // pos表示当前列中空位的位置
      let pos = 0;
      // 从上到下遍历每一行
      for (let i = 0; i < 4; i++) {
        // 如果当前位置有方块
        if (board.value[i][j]) {
          const cell = board.value[i][j]!;
          // 如果上方有方块且值相同且未合并过
          if (
            pos > 0 &&
            newBoard[pos - 1][j] &&
            newBoard[pos - 1][j]!.value === cell.value &&
            !newBoard[pos - 1][j]!.merged
          ) {
            // 合并方块
            newBoard[pos - 1][j]!.value *= 2;
            // 标记为已合并
            newBoard[pos - 1][j]!.merged = true;
            // 更新分数
            score.value += newBoard[pos - 1][j]!.value;

            // 如果合并后达到2048，标记获胜
            if (newBoard[pos - 1][j]!.value === 2048) {
              gameWon.value = true;
            }
            // 标记有方块移动
            moved = true;
          } else {
            // 方块不能合并，直接移动到目标位置
            newBoard[pos][j] = { ...cell };
            // 如果位置有变化，标记移动
            if (pos !== i) moved = true;
            // 移动空位指示器
            pos++;
          }
        }
      }
    }
  }
  // 处理向下移动
  else if (direction === "down") {
    // 遍历每一列
    for (let j = 0; j < 4; j++) {
      // pos表示当前列中空位的位置（从下开始）
      let pos = 3;
      // 从下到上遍历每一行
      for (let i = 3; i >= 0; i--) {
        // 如果当前位置有方块
        if (board.value[i][j]) {
          const cell = board.value[i][j]!;
          // 如果下方有方块且值相同且未合并过
          if (
            pos < 3 &&
            newBoard[pos + 1][j] &&
            newBoard[pos + 1][j]!.value === cell.value &&
            !newBoard[pos + 1][j]!.merged
          ) {
            // 合并方块
            newBoard[pos + 1][j]!.value *= 2;
            // 标记为已合并
            newBoard[pos + 1][j]!.merged = true;
            // 更新分数
            score.value += newBoard[pos + 1][j]!.value;

            // 如果合并后达到2048，标记获胜
            if (newBoard[pos + 1][j]!.value === 2048) {
              gameWon.value = true;
            }
            // 标记有方块移动
            moved = true;
          } else {
            // 方块不能合并，直接移动到目标位置
            newBoard[pos][j] = { ...cell };
            // 如果位置有变化，标记移动
            if (pos !== i) moved = true;
            // 移动空位指示器
            pos--;
          }
        }
      }
    }
  }

  // 如果有方块移动
  if (moved) {
    // 更新棋盘
    board.value = newBoard;
    // 添加新方块
    addNewTile();
    // 检查游戏是否结束
    checkGameOver();

    // 如果当前分数超过历史最高分，更新最高分
    if (score.value > bestScore.value) {
      bestScore.value = score.value;
      // 保存最高分到本地存储
      localStorage.setItem("bestScore2048", bestScore.value.toString());
    }
  }
};

// 检查游戏是否结束
const checkGameOver = () => {
  // 遍历棋盘
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      // 如果有空格，游戏未结束
      if (!board.value[i][j]) return;

      // 如果相邻有相同值的方块，游戏未结束
      if (j < 3 && board.value[i][j]!.value === board.value[i][j + 1]?.value)
        return;
      if (i < 3 && board.value[i][j]!.value === board.value[i + 1][j]?.value)
        return;
    }
  }

  // 没有空格且没有可合并的方块，游戏结束
  gameOver.value = true;
};

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  // 阻止方向键的默认行为（如页面滚动）
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }

  // 根据按键调用对应的移动方法
  switch (e.key) {
    case "ArrowUp":
      move("up");
      break;
    case "ArrowDown":
      move("down");
      break;
    case "ArrowLeft":
      move("left");
      break;
    case "ArrowRight":
      move("right");
      break;
  }
};

// 处理触摸开始事件
const handleTouchStart = (e: TouchEvent) => {
  // 获取触摸点的初始坐标
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

// 处理触摸结束事件
const handleTouchEnd = (e: TouchEvent) => {
  // 获取触摸点的结束坐标
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  // 计算并执行滑动方向
  handleSwipe();
};

// 处理滑动手势
const handleSwipe = () => {
  // 如果游戏结束或已获胜，则不处理滑动
  if (gameOver.value || gameWon.value) return;

  // 计算水平和垂直方向的滑动距离
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // 滑动距离的绝对值
  const absDeltaX = Math.abs(deltaX);
  const absDeltaY = Math.abs(deltaY);

  // 设定滑动阈值（至少50像素）
  const minSwipeDistance = 50;

  // 判断滑动方向（优先处理水平方向滑动）
  if (absDeltaX >= minSwipeDistance || absDeltaY >= minSwipeDistance) {
    if (absDeltaX > absDeltaY) {
      // 水平滑动
      if (deltaX > 0) {
        move("right");
      } else {
        move("left");
      }
    } else {
      // 垂直滑动
      if (deltaY > 0) {
        move("down");
      } else {
        move("up");
      }
    }
  }
};

// 重新开始游戏
const restart = () => {
  initBoard();
};

// 组件挂载时执行
onMounted(() => {
  // 从本地存储获取历史最高分
  const saved = localStorage.getItem("bestScore2048");
  if (saved) {
    bestScore.value = parseInt(saved);
  }
  // 初始化棋盘
  initBoard();
  // 添加键盘事件监听
  window.addEventListener("keydown", handleKeyDown);
  // 添加触摸事件监听
  window.addEventListener("touchstart", handleTouchStart);
  window.addEventListener("touchend", handleTouchEnd);
});

// 组件卸载时执行
onUnmounted(() => {
  // 移除键盘事件监听
  window.removeEventListener("keydown", handleKeyDown);
  // 移除触摸事件监听
  window.removeEventListener("touchstart", handleTouchStart);
  window.removeEventListener("touchend", handleTouchEnd);
});

// 根据方块值获取背景颜色
const getCellColor = (value: number) => {
  // 定义不同值方块的颜色映射
  const colors: { [key: number]: string } = {
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };
  // 返回对应颜色，默认返回深色
  return colors[value] || "#3c3a32";
};

// 根据方块值获取文字颜色
const getTextColor = (value: number) => {
  // 值小于等于4时使用深色文字，否则使用浅色文字
  return value <= 4 ? "#776e65" : "#f9f6f2";
};
</script>

<template>
  <!-- 游戏容器 -->
  <div class="game-container">
    <!-- 游戏头部 -->
    <div class="header">
      <!-- 游戏标题 -->
      <h1 class="title">2048</h1>
      <!-- 分数显示区域 -->
      <div class="scores">
        <!-- 当前分数 -->
        <div class="score-box">
          <div class="label">分数</div>
          <div class="value">{{ score }}</div>
        </div>
        <!-- 历史最高分 -->
        <div class="score-box">
          <div class="label">最高</div>
          <div class="value">{{ bestScore }}</div>
        </div>
      </div>
    </div>

    <!-- 游戏信息区域 -->
    <div class="info">
      <!-- 游戏说明 -->
      <p>使用方向键移动方块，合并相同数字达到 <strong>2048</strong>！</p>
      <!-- 重新开始按钮 -->
      <button @click="restart" class="restart-btn">新游戏</button>
    </div>

    <!-- 游戏棋盘 -->
    <div class="board">
      <!-- 遍历棋盘的每一行 -->
      <div v-for="(row, i) in board" :key="i" class="row">
        <!-- 遍历行中的每个单元格 -->
        <div
          v-for="(cell, j) in row"
          :key="j"
          class="cell"
          :class="{ 'has-value': cell }"
          :style="{
            backgroundColor: cell ? getCellColor(cell.value) : '#cdc1b4',
            color: cell ? getTextColor(cell.value) : 'transparent',
          }"
        >
          <!-- 显示方块值，空方块显示为空 -->
          {{ cell?.value || "" }}
        </div>
      </div>
    </div>

    <!-- 游戏结束遮罩层 -->
    <div v-if="gameOver" class="overlay">
      <div class="message">
        <h2>游戏结束！</h2>
        <p>最终分数：{{ score }}</p>
        <button @click="restart" class="restart-btn">再来一局</button>
      </div>
    </div>

    <!-- 游戏获胜遮罩层 -->
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
  font-family: "Arial", sans-serif;
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

.restart-btn,
.continue-btn {
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

.restart-btn:hover,
.continue-btn:hover {
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
  .game-container {
    max-width: 100%;
    padding: 10px;
  }

  .title {
    font-size: 50px;
  }

  .cell {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }

  .board {
    padding: 10px;
    gap: 10px;
  }

  .row {
    gap: 10px;
  }

  .info {
    flex-direction: column;
    gap: 10px;
  }

  .info p {
    text-align: center;
    font-size: 16px;
  }

  .restart-btn,
  .continue-btn {
    padding: 12px 24px;
    font-size: 18px;
    width: 100%;
  }

  .continue-btn {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .message {
    padding: 30px 20px;
  }

  .message h2 {
    font-size: 30px;
  }

  .message p {
    font-size: 16px;
  }
}

@media (max-width: 400px) {
  .title {
    font-size: 40px;
  }

  .cell {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .board {
    padding: 8px;
    gap: 8px;
  }

  .row {
    gap: 8px;
  }

  .score-box {
    min-width: 70px;
    padding: 8px 16px;
  }

  .value {
    font-size: 20px;
  }
}
</style>
