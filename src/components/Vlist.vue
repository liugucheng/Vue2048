<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { GameRecord } from "../stores/gameStore";

interface Props {
  items: GameRecord[]
  itemHeight?: number
  containerHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 60,
  containerHeight: 500
});

// 虚拟列表相关状态
const containerRef = ref<HTMLElement | null>(null);
const visibleRange = ref({ start: 0, end: 10 });
const bufferSize = 5; // 缓冲区大小

// 可见的行数据
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value;
  return props.items.slice(start, end + bufferSize);
});

// 容器总高度
const totalHeight = computed(() => props.items.length * props.itemHeight);

// 偏移量
const offsetY = computed(() => visibleRange.value.start * props.itemHeight);

// 滚动处理
function handleScroll() {
  if (!containerRef.value) return;

  const scrollTop = containerRef.value.scrollTop;
  const start = Math.floor(scrollTop / props.itemHeight);
  const end = Math.min(
    start + Math.ceil(props.containerHeight / props.itemHeight) + bufferSize,
    props.items.length
  );

  visibleRange.value = { start, end };
}

// 格式化时间
function formatDuration(seconds: number | undefined): string {
  if (!seconds) return '--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 生命周期
onMounted(() => {
  handleScroll();
  containerRef.value?.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  containerRef.value?.removeEventListener('scroll', handleScroll);
});
</script>
<template>
  <div class="virtual-list-container">
    <div class="info">
      <p>总共 {{ items.length }} 条游戏记录，显示范围: {{ visibleRange.start + 1 }} - {{ Math.min(visibleRange.end, items.length) }}</p>
    </div>

    <div class="records-table">
      <!-- 固定表头 -->
      <div class="table-header">
        <div class="record-row header">
          <div class="record-cell score">分数</div>
          <div class="record-cell date">时间</div>
          <div class="record-cell duration">用时</div>
          <div class="record-cell result">结果</div>
        </div>
      </div>

      <!-- 可滚动容器 -->
      <div
        ref="containerRef"
        class="table-body"
        :style="{ height: containerHeight + 'px' }"
        @scroll="handleScroll"
      >
        <!-- 虚拟内容区域 -->
        <div
          class="virtual-content"
          :style="{ height: totalHeight + 'px' }"
        >
          <!-- 可见行 -->
          <div
            class="visible-rows"
            :style="{ transform: `translateY(${offsetY}px)` }"
          >
            <div
              v-for="record in visibleItems"
              :key="record.id"
              class="record-row"
              :style="{ height: itemHeight + 'px' }"
            >
              <div class="record-cell score">{{ record.score }}</div>
              <div class="record-cell date">{{ record.date }}</div>
              <div class="record-cell duration">{{ formatDuration(record.duration) }}</div>
              <div class="record-cell result">
                <span :class="record.won ? 'win' : 'lose'">
                  {{ record.won ? '获胜' : '失败' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.virtual-list-container {
  width: 100%;
  font-family: var(--font-family);
}

.info {
  margin-bottom: var(--space-md);
  padding: var(--space-md);
  background: linear-gradient(135deg, var(--bg-secondary) 0%, rgba(255, 255, 255, 0.8) 100%);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-weight: var(--font-weight-medium);
}

.records-table {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 246, 242, 0.95) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: var(--shadow-sm);
}

.table-header {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary-light);
}

.record-row {
  display: flex;
  border-bottom: 1px solid var(--color-secondary-light);
  transition: all var(--transition-fast);
}

.record-row.header {
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  color: var(--color-primary);
  position: sticky;
  top: 0;
  z-index: 10;
}

.record-row:last-child {
  border-bottom: none;
}

.record-cell {
  padding: var(--space-md) var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 1px solid var(--color-secondary-light);
  transition: all var(--transition-fast);
}

.record-row.header .record-cell {
  border-right: 1px solid rgba(170, 154, 138, 0.3);
  padding: var(--space-lg) var(--space-xl);
}

.record-cell:last-child {
  border-right: none;
}

.record-cell.score {
  flex: 1;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}

.record-cell.date {
  flex: 3;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.record-cell.duration {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.record-cell.result {
  flex: 1;
}

.record-cell.result .win {
  color: var(--color-success);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  border: 2px solid rgba(76, 175, 80, 0.2);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.record-cell.result .lose {
  color: var(--color-error);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  border: 2px solid rgba(244, 67, 54, 0.2);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.record-cell.result .win:hover {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(76, 175, 80, 0.1) 100%);
  transform: scale(1.05);
}

.record-cell.result .lose:hover {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.2) 0%, rgba(244, 67, 54, 0.1) 100%);
  transform: scale(1.05);
}

.table-body {
  overflow-y: auto;
  position: relative;
  max-height: 500px;
}

.virtual-content {
  position: relative;
}

.visible-rows {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.record-row:hover {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(249, 246, 242, 0.8) 100%);
  transform: translateX(4px);
  box-shadow: var(--shadow-sm);
}

.record-row.header:hover {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  transform: none;
  box-shadow: none;
}

/* 滚动条样式 */
.table-body::-webkit-scrollbar {
  width: 8px;
}

.table-body::-webkit-scrollbar-track {
  background: rgba(187, 173, 160, 0.1);
  border-radius: var(--radius-md);
}

.table-body::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  border-radius: var(--radius-md);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .record-cell {
    padding: var(--space-sm) var(--space-md);
    font-size: var(--font-size-sm);
  }

  .record-row.header .record-cell {
    padding: var(--space-md) var(--space-lg);
  }

  .record-cell.score {
    flex: 1.2;
    font-size: var(--font-size-base);
  }

  .record-cell.date {
    flex: 1.8;
    font-size: var(--font-size-xs);
  }

  .record-cell.duration {
    flex: 1.2;
    font-size: var(--font-size-xs);
  }

  .record-cell.result {
    flex: 1.2;
  }
}

@media (max-width: 480px) {
  .record-cell {
    padding: var(--space-xs) var(--space-sm);
  }

  .record-row.header .record-cell {
    padding: var(--space-sm) var(--space-md);
  }

  .record-cell.score {
    flex: 1.5;
  }

  .record-cell.date {
    flex: 2;
  }

  .record-cell.duration {
    flex: 1.5;
  }

  .record-cell.result {
    flex: 1.5;
  }

  .record-cell.result .win,
  .record-cell.result .lose {
    padding: 2px 6px;
    font-size: var(--font-size-xs);
  }
}
</style>
