<template>
  <div class="game-page">
    <Game2048 />
    <div class="game-header">
     
      <div class="score-container">
        <div class="score-box">
          <div class="score-label">分数</div>
          <div class="score-value">{{ gameStore.currentScore }}</div>
        </div>
        <div class="score-box">
          <div class="score-label">最高分</div>
          <div class="score-value">{{ gameStore.highestScore }}</div>
        </div>
      </div>
      <div class="game-controls">
        <button @click="gameStore.restartGame()" class="control-button restart">
          重新开始
        </button>
        <router-link to="/" class="control-button home">
          返回首页
        </router-link>
        <router-link to="/record" class="control-button record">
          查看战绩
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import Game2048 from '../components/Game2048.vue'

const gameStore = useGameStore()

// 组件挂载时初始化游戏
onMounted(() => {
  gameStore.initBestScore()
  gameStore.initBoard()
})
</script>

<style scoped>
.game-page {
  max-width: 600px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-xl);
}

.game-header {
  text-align: center;
  margin-bottom: var(--space-xl);
  padding: var(--space-xl);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 246, 242, 0.95) 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 100%;
  max-width: 500px;
}

.game-header h1 {
  color: var(--color-primary);
  font-size: clamp(var(--font-size-2xl), 4vw, var(--font-size-3xl));
  margin-bottom: var(--space-lg);
  font-weight: var(--font-weight-bold);
}

.score-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
  width: 100%;
}

.score-box {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all var(--transition-normal);
}

.score-box:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.score-label {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  text-transform: uppercase;
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.5px;
  margin-bottom: var(--space-xs);
}

.score-value {
  font-size: var(--font-size-2xl);
  color: var(--text-light);
  font-weight: var(--font-weight-bold);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.game-controls {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  width: 100%;
}

.control-button {
  padding: var(--space-md) var(--space-lg);
  border: 2px solid transparent;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  transition: all var(--transition-normal);
  flex: 1;
  max-width: 160px;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.control-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.control-button:hover::before {
  left: 100%;
}

.restart {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: var(--text-light);
}

.restart:hover {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-dark) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.home {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.home:hover {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
  color: var(--text-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* 游戏区域容器 */
.game-page > div:last-child {
  width: 100%;
  max-width: 500px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .game-page {
    padding: var(--space-lg) var(--space-md);
  }

  .game-header {
    padding: var(--space-lg);
  }

  .score-container {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .game-controls {
    flex-direction: column;
    gap: var(--space-sm);
  }

  .control-button {
    max-width: none;
  }
}
</style>