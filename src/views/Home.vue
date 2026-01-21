<template>
  <div class="home">
    <!-- 背景装饰元素 -->
    <div class="background-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="floating-shape shape-5"></div>
      <div class="floating-shape shape-6"></div>
    </div>

    <!-- 主要内容 -->
    <div class="content">
      <!-- 游戏图标 -->
      <div class="game-icon">
        <div class="icon-grid">
          <div class="icon-cell" v-for="i in 16" :key="i" :class="{ 'active': i === 1 || i === 2 || i === 5 || i === 6 }"></div>
        </div>
        <div class="icon-glow"></div>
      </div>

      <!-- 标题区域 -->
      <div class="hero-section">
        <h1 class="title">
          <span class="title-main">2048</span>
          <span class="title-sub">游戏</span>
        </h1>
        <div class="title-decoration">
          <div class="decoration-line"></div>
          <div class="decoration-dot"></div>
          <div class="decoration-line"></div>
        </div>
        <p class="description">
          🧠 <strong>经典数字益智游戏</strong><br>
          通过合并相同数字来获得更高的分数！
        </p>
      </div>

      <!-- 操作按钮 -->
      <div class="actions">
        <router-link to="/game" class="action-button primary">
          <span class="button-icon">🎮</span>
          <span class="button-text">开始游戏</span>
          <div class="button-shine"></div>
        </router-link>
        <router-link to="/record" class="action-button secondary">
          <span class="button-icon">📊</span>
          <span class="button-text">查看战绩</span>
        </router-link>
      </div>

      <!-- 游戏规则 -->
      <div class="rules-section">
        <h2 class="rules-title">
          <span class="rules-icon">🎯</span>
          游戏规则
        </h2>
        <div class="rules-grid">
          <div class="rule-card" v-for="(rule, index) in rules" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="rule-icon">{{ rule.icon }}</div>
            <div class="rule-content">
              <h3 class="rule-title">{{ rule.title }}</h3>
              <p class="rule-description">{{ rule.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="bottom-decoration">
      <div class="scroll-indicator">
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
        <div class="scroll-text">向下滚动查看规则</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// console.log(import.meta.env)
// 游戏规则数据
const rules = ref([
  {
    icon: '🎮',
    title: '移动控制',
    description: '使用方向键或在触摸屏上滑动来移动方块'
  },
  {
    icon: '🔄',
    title: '数字合并',
    description: '相同数字的方块相撞时会合并成更大的数字'
  },
  {
    icon: '🎲',
    title: '随机生成',
    description: '每次移动后会在空位随机生成2或4的新方块'
  },
  {
    icon: '🏆',
    title: '获胜目标',
    description: '将数字合并到2048就算获胜！'
  },
  {
    icon: '⏰',
    title: '游戏结束',
    description: '当棋盘填满且无法移动时游戏结束'
  },
  {
    icon: '⭐',
    title: '挑战自己',
    description: '尝试获得更高的分数和更好的用时记录'
  }
])

// 动画相关
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl) var(--space-lg);
}

/* 背景装饰元素 */
.background-decoration {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(119, 110, 101, 0.1), rgba(143, 122, 102, 0.05));
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 20%;
  right: 15%;
  animation-delay: 1s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  bottom: 30%;
  left: 20%;
  animation-delay: 2s;
}

.shape-4 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  right: 10%;
  animation-delay: 3s;
}

.shape-5 {
  width: 40px;
  height: 40px;
  top: 60%;
  left: 70%;
  animation-delay: 4s;
}

.shape-6 {
  width: 70px;
  height: 70px;
  top: 70%;
  right: 25%;
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

/* 主要内容区域 */
.content {
  max-width: 1000px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2xl);
  z-index: 1;
}

/* 游戏图标 */
.game-icon {
  position: relative;
  margin-bottom: var(--space-lg);
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-light) 100%);
  border-radius: var(--radius-lg);
  padding: 8px;
  box-shadow: var(--shadow-lg);
  animation: iconPulse 2s ease-in-out infinite;
}

.icon-cell {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  transition: all var(--transition-normal);
}

.icon-cell.active {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  animation: cellGlow 1.5s ease-in-out infinite alternate;
}

.icon-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(237, 207, 114, 0.3) 0%, transparent 70%);
  border-radius: var(--radius-xl);
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes cellGlow {
  0% {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  100% {
    box-shadow: 0 4px 8px rgba(237, 207, 114, 0.6);
  }
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

/* 标题区域 */
.hero-section {
  text-align: center;
  padding: var(--space-2xl);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 246, 242, 0.95) 100%);
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  animation: heroSlideIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-light), var(--color-primary), var(--color-primary-light));
}

.title {
  margin-bottom: var(--space-lg);
  position: relative;
}

.title-main {
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 50%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  line-height: 0.9;
  display: block;
  animation: titleGlow 2s ease-in-out infinite alternate;
}

.title-sub {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin-top: var(--space-sm);
  display: block;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  margin: var(--space-lg) 0;
}

.decoration-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  border-radius: 1px;
}

.decoration-dot {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  border-radius: 50%;
  animation: dotPulse 1.5s ease-in-out infinite;
}

@keyframes titleGlow {
  0% {
    filter: brightness(1) drop-shadow(0 0 10px rgba(119, 110, 101, 0.3));
  }
  100% {
    filter: brightness(1.1) drop-shadow(0 0 20px rgba(237, 207, 114, 0.5));
  }
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

@keyframes heroSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.description {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;
  font-weight: var(--font-weight-medium);
}

.description strong {
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: var(--space-xl);
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg) var(--space-2xl);
  border-radius: var(--radius-xl);
  text-decoration: none;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-lg);
  border: 3px solid transparent;
  position: relative;
  overflow: hidden;
  min-width: 180px;
  justify-content: center;
  animation: buttonSlideUp 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s both;
}

.action-button.primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: var(--text-light);
}

.action-button.secondary {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 246, 242, 0.95) 100%);
  color: var(--color-primary);
  border-color: var(--color-primary);
  backdrop-filter: blur(10px);
}

.button-icon {
  font-size: var(--font-size-xl);
  animation: iconBounce 2s ease-in-out infinite;
}

.button-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.action-button:hover .button-shine {
  left: 100%;
}

.action-button:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.action-button.primary:hover {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary-dark) 100%);
}

.action-button.secondary:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: var(--text-light);
}

@keyframes buttonSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes iconBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

/* 游戏规则区域 */
.rules-section {
  width: 100%;
  max-width: 900px;
  margin-top: var(--space-xl);
  animation: rulesFadeIn 1s ease-out 0.6s both;
}

.rules-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  font-size: var(--font-size-2xl);
  color: var(--color-primary);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-xl);
  text-align: center;
}

.rules-icon {
  font-size: var(--font-size-3xl);
  animation: iconRotate 3s linear infinite;
}

@keyframes iconRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes rulesFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
}

.rule-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 246, 242, 0.95) 100%);
  padding: var(--space-xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all var(--transition-normal);
  animation: cardSlideIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
  position: relative;
  overflow: hidden;
}

.rule-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-primary));
  opacity: 0;
  transition: opacity var(--transition-normal);
}

.rule-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: var(--shadow-xl);
}

.rule-card:hover::before {
  opacity: 1;
}

.rule-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--space-md);
  text-align: center;
  display: block;
  animation: iconFloat 3s ease-in-out infinite;
}

.rule-content {
  text-align: center;
}

.rule-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin-bottom: var(--space-sm);
}

.rule-description {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: var(--font-size-base);
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes iconFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
}

/* 底部装饰 */
.bottom-decoration {
  position: absolute;
  bottom: var(--space-xl);
  left: 50%;
  transform: translateX(-50%);
  animation: fadeIn 1s ease-out 1s both;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  opacity: 0.7;
}

.scroll-mouse {
  width: 24px;
  height: 36px;
  border: 2px solid var(--text-secondary);
  border-radius: 12px;
  position: relative;
  animation: scrollBounce 2s ease-in-out infinite;
}

.scroll-wheel {
  width: 4px;
  height: 8px;
  background: var(--text-secondary);
  border-radius: 2px;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  animation: scrollWheel 2s ease-in-out infinite;
}

@keyframes scrollBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(6px);
  }
}

@keyframes scrollWheel {
  0%, 100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  50% {
    opacity: 0.5;
    transform: translateX(-50%) translateY(4px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .rules-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .home {
    padding: var(--space-lg);
  }

  .content {
    gap: var(--space-xl);
  }

  .hero-section {
    padding: var(--space-xl);
  }

  .title-main {
    font-size: clamp(3rem, 15vw, 6rem);
  }

  .title-sub {
    font-size: clamp(1.2rem, 5vw, 2rem);
  }

  .actions {
    flex-direction: column;
    gap: var(--space-lg);
  }

  .action-button {
    width: 100%;
    max-width: 300px;
    padding: var(--space-lg) var(--space-xl);
  }

  .rules-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .rule-card {
    padding: var(--space-lg);
  }

  .bottom-decoration {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: var(--space-lg);
  }

  .description {
    font-size: var(--font-size-base);
  }

  .rules-title {
    font-size: var(--font-size-xl);
  }

  .rule-title {
    font-size: var(--font-size-base);
  }

  .rule-description {
    font-size: var(--font-size-sm);
  }
}
</style>