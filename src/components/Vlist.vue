<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

// 生成100条模拟数据
const generateUsers = () => {
  const names = ["张三", "李四", "王五", "赵六", "钱七", "孙八", "周九", "吴十", "郑十一", "王十二"];
  const occupations = ["开发工程师", "产品经理", "设计师", "数据分析师", "市场专员", "测试工程师", "运维工程师", "项目经理", "UI设计师", "前端工程师"];

  return Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: names[index % names.length] + (Math.floor(index / names.length) + 1),
    age: Math.floor(Math.random() * 20) + 20, // 20-40岁
    occupation: occupations[index % occupations.length]
  }));
};

const users = ref(generateUsers());

const sortBy = ref("id");
const sortDirection = ref("asc"); // 'asc' 或 'desc'

// 虚拟列表相关状态
const containerRef = ref(null);
const visibleRange = ref({ start: 0, end: 20 });
const itemHeight = 50; // 每行高度
const containerHeight = 400; // 容器高度
const bufferSize = 5; // 缓冲区大小

// 排序后的用户列表
const sortedUsers = computed(() => {
  const direction = sortDirection.value === "asc" ? 1 : -1;

  return [...users.value].sort((a, b) => {
    if (a[sortBy.value] < b[sortBy.value]) return -1 * direction;
    if (a[sortBy.value] > b[sortBy.value]) return 1 * direction;
    return 0;
  });
});

// 可见的行数据
const visibleItems = computed(() => {
  const { start, end } = visibleRange.value;
  return sortedUsers.value.slice(start, end + bufferSize);
});

// 容器总高度
const totalHeight = computed(() => sortedUsers.value.length * itemHeight);

// 偏移量
const offsetY = computed(() => visibleRange.value.start * itemHeight);

// 滚动处理
function handleScroll() {
  if (!containerRef.value) return;

  const scrollTop = containerRef.value.scrollTop;
  const start = Math.floor(scrollTop / itemHeight);
  const end = Math.min(
    start + Math.ceil(containerHeight / itemHeight) + bufferSize,
    sortedUsers.value.length
  );

  visibleRange.value = { start, end };
}

// 排序方法
function sort(column) {
  if (sortBy.value === column) {
    // 如果已经按这列排序，则切换方向
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // 否则，按新列排序，默认升序
    sortBy.value = column;
    sortDirection.value = "asc";
  }
  // 排序后重置滚动到顶部
  if (containerRef.value) {
    containerRef.value.scrollTop = 0;
  }
  handleScroll();
}

// 获取排序图标
function getSortIcon(column) {
  if (sortBy.value !== column) return "⇅";
  return sortDirection.value === "asc" ? "↑" : "↓";
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
      <p>总共 {{ sortedUsers.length }} 条数据，显示范围: {{ visibleRange.start + 1 }} - {{ Math.min(visibleRange.end, sortedUsers.length) }}</p>
    </div>

    <div class="sortable-table">
      <!-- 固定表头 -->
      <div class="table-header">
        <table>
          <thead>
            <tr>
              <th @click="sort('id')">ID {{ getSortIcon("id") }}</th>
              <th @click="sort('name')">姓名 {{ getSortIcon("name") }}</th>
              <th @click="sort('age')">年龄 {{ getSortIcon("age") }}</th>
              <th @click="sort('occupation')">
                职业 {{ getSortIcon("occupation") }}
              </th>
            </tr>
          </thead>
        </table>
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
            <table>
              <tbody>
                <tr
                  v-for="user in visibleItems"
                  :key="user.id"
                  :style="{ height: itemHeight + 'px' }"
                >
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.age }}</td>
                  <td>{{ user.occupation }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.virtual-list-container {
  max-width: 700px;
  margin: 0 auto;
  font-family: sans-serif;
}

.info {
  margin-bottom: 10px;
  padding: 8px;
  background-color: #f0f8ff;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
}

.sortable-table {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  background-color: #f5f5f5;
}

.table-header table {
  width: 100%;
  border-collapse: collapse;
}

.table-body {
  overflow-y: auto;
  position: relative;
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

.visible-rows table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  cursor: pointer;
  font-weight: 600;
}

th:hover {
  background-color: #e5e5e5;
}

tr:hover {
  background-color: #f9f9f9;
}

/* 滚动条样式 */
.table-body::-webkit-scrollbar {
  width: 8px;
}

.table-body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.table-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
