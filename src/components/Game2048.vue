<script setup lang="ts">
// 导入Vue的响应式API和生命周期钩子
import { onMounted, onUnmounted } from "vue";
import { useGameStore } from "../stores/gameStore";

// 使用游戏store
const gameStore = useGameStore();

// 触摸事件相关变量
let touchStartX = 0; // 触摸开始时的X坐标
let touchStartY = 0; // 触摸开始时的Y坐标
let touchEndX = 0; // 触摸结束时的X坐标
let touchEndY = 0; // 触摸结束时的Y坐标

// 处理键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  // 阻止方向键的默认行为（如页面滚动）
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(e.key)) {
    e.preventDefault();
  }

  // 根据按键调用对应的移动方法
  switch (e.key) {
    case "ArrowUp":
    case "w":
      gameStore.moveUp();
      break;
    case "ArrowDown":
    case "s":
      gameStore.moveDown();
      break;
    case "ArrowLeft":
    case "a":
      gameStore.moveLeft();
      break;
    case "ArrowRight":
    case "d":
      gameStore.moveRight();
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
  if (gameStore.isGameOver || gameStore.isGameWon) return;

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
        gameStore.moveRight();
      } else {
        gameStore.moveLeft();
      }
    } else {
      // 垂直滑动
      if (deltaY > 0) {
        gameStore.moveDown();
      } else {
        gameStore.moveUp();
      }
    }
  }
};

// 重新开始游戏
const restart = () => {
  gameStore.restartGame();
};

// 继续游戏（当获胜时）
const continueGame = () => {
  gameStore.continueGame();
};

// 组件挂载时执行
onMounted(() => {
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
    <!-- 游戏信息区域 -->
    <div class="info">
      <!-- 游戏说明 -->
      <p>使用方向键或WASD移动方块，合并相同数字达到 <strong>2048</strong>！</p>
      <!-- 重新开始按钮 -->
      <button @click="restart" class="restart-btn">新游戏</button>
    </div>

    <!-- 游戏棋盘 -->
    <div class="board">
      <!-- 遍历棋盘的每一行 -->
      <div v-for="(row, i) in gameStore.board" :key="i" class="row">
        <!-- 遍历行中的每个单元格 -->
        <div v-for="(cell, j) in row" :key="j" class="cell" :class="{ 'has-value': cell }" :style="{
          backgroundColor: cell ? getCellColor(cell.value) : '#cdc1b4',
          color: cell ? getTextColor(cell.value) : 'transparent',
        }">
          <!-- 显示方块值，空方块显示为空 -->
          {{ cell?.value || "" }}
        </div>
      </div>
    </div>

    <!-- 游戏结束遮罩层 -->
    <div v-if="gameStore.isGameOver" class="overlay">
      <div class="message">
        <h2>游戏结束！</h2>
        <p>最终分数：{{ gameStore.currentScore }}</p>
        <button @click="restart" class="restart-btn">再来一局</button>
      </div>
    </div>

    <!-- 游戏获胜遮罩层 -->
    <div v-if="gameStore.isGameWon && !gameStore.isGameOver" class="overlay">
      <div class="message">
        <h2>恭喜你赢了！</h2>
        <p>你达到了 2048！</p>
        <button @click="continueGame" class="continue-btn">继续游戏</button>
        <button @click="restart" class="restart-btn">新游戏</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: var(--space-lg);
  font-family: var(--font-family);
}

/* 游戏说明区域 */
.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
  color: var(--text-secondary);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 246, 242, 0.8) 100%);
  padding: var(--space-md);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.info p {
  margin: 0;
  flex: 1;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.restart-btn,
.continue-btn {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: var(--text-light);
  border: 2px solid transparent;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.restart-btn::before,
.continue-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.restart-btn:hover::before,
.continue-btn:hover::before {
  left: 100%;
}

.restart-btn:hover,
.continue-btn:hover {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-dark) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.continue-btn {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
  color: var(--color-primary);
  margin-right: var(--space-md);
  border: 2px solid var(--color-accent);
}

.continue-btn:hover {
  background: linear-gradient(135deg, var(--color-accent-light) 0%, var(--color-accent) 100%);
  color: var(--text-light);
}

/* 游戏棋盘 */
.board {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  position: relative;
  box-shadow: var(--shadow-lg);
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.row {
  display: flex;
  gap: var(--space-md);
}

.cell {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 35px;
  font-weight: var(--font-weight-bold);
  transition: all var(--transition-normal);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.cell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.cell.has-value {
  animation: appear 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.3);
}

@keyframes appear {
  0% {
    transform: scale(0) rotate(180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(90deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

/* 遮罩层 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(238, 228, 218, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.message {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 246, 242, 0.95) 100%);
  padding: var(--space-2xl);
  border-radius: var(--radius-xl);
  text-align: center;
  box-shadow: var(--shadow-xl);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  max-width: 400px;
  width: 90%;
  animation: slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes slideIn {
  from {
    transform: translateY(-50px) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.message h2 {
  color: var(--color-primary);
  margin: 0 0 var(--space-md) 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
}

.message p {
  color: var(--text-secondary);
  margin: 0 0 var(--space-xl) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
}

/* 响应式设计 */
@media (max-width: 600px) {
  .game-container {
    padding: var(--space-md);
  }

  .cell {
    width: calc((100vw - 120px) / 4);
    height: calc((100vw - 120px) / 4);
    font-size: clamp(20px, 8vw, 28px);
    min-width: 60px;
    min-height: 60px;
  }

  .board {
    padding: var(--space-md);
    gap: var(--space-sm);
  }

  .row {
    gap: var(--space-sm);
  }

  .info {
    flex-direction: column;
    gap: var(--space-md);
    text-align: center;
  }

  .info p {
    font-size: var(--font-size-sm);
  }

  .restart-btn,
  .continue-btn {
    padding: var(--space-md) var(--space-xl);
    font-size: var(--font-size-base);
    width: 100%;
    max-width: 200px;
  }

  .continue-btn {
    margin-right: 0;
    margin-bottom: var(--space-md);
  }

  .message {
    padding: var(--space-xl) var(--space-lg);
  }

  .message h2 {
    font-size: var(--font-size-2xl);
  }

  .message p {
    font-size: var(--font-size-base);
  }
}

@media (max-width: 400px) {
  .game-container {
    padding: var(--space-sm);
  }

  .cell {
    width: calc((100vw - 80px) / 4);
    height: calc((100vw - 80px) / 4);
    font-size: clamp(16px, 7vw, 24px);
    min-width: 50px;
    min-height: 50px;
  }

  .board {
    padding: var(--space-sm);
    gap: var(--space-xs);
  }

  .row {
    gap: var(--space-xs);
  }
}
</style>