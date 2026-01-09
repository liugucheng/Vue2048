# Vue2048

A modern implementation of the classic 2048 game built with Vue 3, TypeScript, and Vite.

## 🎮 Game Introduction

2048 is a popular single-player sliding block puzzle game. The objective is to slide numbered tiles on a grid to combine them and create a tile with the number 2048.

## ✨ Features

- **Classic Gameplay**: Authentic 2048 game experience
- **Score Tracking**: Real-time score calculation
- **Best Score**: Persistent best score using localStorage
- **Game States**: Win/lose detection
- **Responsive Design**: Works on various screen sizes
- **Keyboard Controls**: Arrow keys for tile movement
- **Modern UI**: Clean and intuitive user interface

## 🎯 How to Play

1. Use **Arrow Keys** (↑ ↓ ← →) to move tiles in the respective direction
2. Tiles with the same number **merge** when they touch
3. Each merge **doubles** the tile value and increases your score
4. Create a tile with the number **2048** to win the game
5. The game ends when no more moves are possible

## 🛠️ Technical Stack

- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript superset
- **Vite**: Next-generation frontend build tool
- **CSS**: Modern styling with scoped components

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎲 Game Rules

- Each turn, a new tile will randomly appear on an empty spot with a value of either 2 or 4
- Tiles slide as far as possible in the chosen direction until they hit another tile or the edge
- If two tiles with the same number collide while moving, they merge into a tile with the total value of the two tiles
- The game is won when a tile with the number 2048 is created
- The game ends when the grid is full and no more moves can be made

## 📝 License

MIT

---

# Vue2048

一个使用 Vue 3、TypeScript 和 Vite 构建的经典 2048 游戏现代实现。

## 🎮 游戏介绍

2048 是一款流行的单人滑动方块益智游戏。目标是在网格上滑动带数字的方块，将它们合并并创建一个带有数字 2048 的方块。

## ✨ 功能特性

- **经典玩法**：原汁原味的 2048 游戏体验
- **分数追踪**：实时分数计算
- **最高分记录**：使用 localStorage 持久化存储最高分
- **游戏状态**：胜利/失败检测
- **响应式设计**：适用于各种屏幕尺寸
- **键盘控制**：方向键控制方块移动
- **现代界面**：简洁直观的用户界面

## 🎯 如何游玩

1. 使用 **方向键** (↑ ↓ ← →) 向相应方向移动方块
2. 相同数字的方块在接触时会 **合并**
3. 每次合并都会 **加倍** 方块数值并增加你的分数
4. 创建一个带有数字 **2048** 的方块来赢得游戏
5. 当无法进行更多移动时，游戏结束

## 🛠️ 技术栈

- **Vue 3**：渐进式 JavaScript 框架
- **TypeScript**：类型安全的 JavaScript 超集
- **Vite**：下一代前端构建工具
- **CSS**：使用作用域组件的现代样式

## 📦 安装

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 🎲 游戏规则

- 每回合，一个新方块会随机出现在空白位置，值为 2 或 4
- 方块会尽可能向所选方向滑动，直到碰到另一个方块或边缘
- 如果两个相同数字的方块在移动时碰撞，它们会合并成一个数值为两者总和的方块
- 当创建一个数字为 2048 的方块时，游戏获胜
- 当网格填满且无法进行更多移动时，游戏结束

## 📝 许可证

MIT