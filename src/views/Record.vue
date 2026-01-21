<template>
  <div class="record-page">
    <div class="record-header">
      <h1>游戏记录</h1>
      <div class="record-controls">
        <router-link to="/" class="control-button home">
          返回首页
        </router-link>
        <router-link to="/game" class="control-button game">
          开始游戏
        </router-link>
      </div>
    </div>

    <div class="record-stats">
      <div class="stat-item">
        <div class="stat-label">总游戏次数</div>
        <div class="stat-value">{{ gameStore.gameRecords.length }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">最高分数</div>
        <div class="stat-value">{{ gameStore.highestScore }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">平均分数</div>
        <div class="stat-value">{{ averageScore }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">获胜次数</div>
        <div class="stat-value">{{ winCount }}</div>
      </div>
    </div>

    <div v-if="gameStore.gameRecords.length === 0" class="no-records">
      <p>暂无游戏记录，快去玩一把吧！</p>
    </div>

    <div v-else class="records-list">
      <Vlist :items="gameStore.gameRecords" :item-height="60" :container-height="500" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '../stores/gameStore'
import Vlist from '../components/Vlist.vue'

const gameStore = useGameStore()

// 计算平均分数
const averageScore = computed(() => {
  if (gameStore.gameRecords.length === 0) return 0
  const total = gameStore.gameRecords.reduce((sum, record) => sum + record.score, 0)
  return Math.round(total / gameStore.gameRecords.length)
})

// 计算获胜次数
const winCount = computed(() => {
  return gameStore.gameRecords.filter(record => record.won).length
})

// 组件挂载时确保数据已加载
onMounted(() => {
  gameStore.initBestScore()
})
</script>

<style scoped>
.record-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-xl) var(--space-lg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.record-header {
  text-align: center;
  padding: var(--space-2xl);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 246, 242, 0.95) 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.record-header h1 {
  color: var(--color-primary);
  font-size: clamp(var(--font-size-2xl), 4vw, var(--font-size-3xl));
  margin-bottom: var(--space-lg);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.record-controls {
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.control-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-xl);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  text-decoration: none;
  transition: all var(--transition-normal);
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

.game {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: var(--text-light);
}

.game:hover {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-dark) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.record-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.stat-item {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light));
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.stat-label {
  color: var(--text-light);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.5px;
  margin-bottom: var(--space-md);
  display: block;
}

.stat-value {
  color: var(--text-light);
  font-size: clamp(var(--font-size-xl), 3vw, var(--font-size-3xl));
  font-weight: var(--font-weight-bold);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1;
}

.no-records {
  text-align: center;
  padding: var(--space-2xl);
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 246, 242, 0.9) 100%);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.no-records::before {
  content: '📊';
  font-size: 3rem;
  display: block;
  margin-bottom: var(--space-md);
  opacity: 0.6;
}

.records-list {
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .record-page {
    padding: var(--space-lg) var(--space-md);
  }

  .record-header {
    padding: var(--space-xl);
  }

  .record-controls {
    flex-direction: column;
    align-items: center;
  }

  .control-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .record-stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--space-md);
  }

  .stat-item {
    padding: var(--space-lg);
  }

  .stat-value {
    font-size: var(--font-size-2xl);
  }
}

@media (max-width: 480px) {
  .record-stats {
    grid-template-columns: 1fr;
  }

  .stat-item {
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .stat-label {
    margin-bottom: 0;
    font-size: var(--font-size-sm);
  }

  .stat-value {
    font-size: var(--font-size-xl);
  }
}
</style>