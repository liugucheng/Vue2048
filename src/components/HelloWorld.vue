<script setup>
import { ref, computed } from "vue";

const users = ref([
  { id: 1, name: "张三", age: 28, occupation: "开发工程师" },
  { id: 2, name: "李四", age: 34, occupation: "产品经理" },
  { id: 3, name: "王五", age: 22, occupation: "设计师" },
  { id: 4, name: "赵六", age: 31, occupation: "数据分析师" },
  { id: 5, name: "钱七", age: 26, occupation: "市场专员" },
]);

const sortBy = ref("id");
const sortDirection = ref("asc"); // 'asc' 或 'desc'

// 排序后的用户列表
const sortedUsers = computed(() => {
  const direction = sortDirection.value === "asc" ? 1 : -1;

  return [...users.value].sort((a, b) => {
    if (a[sortBy.value] < b[sortBy.value]) return -1 * direction;
    if (a[sortBy.value] > b[sortBy.value]) return 1 * direction;
    return 0;
  });
});

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
}

// 获取排序图标
function getSortIcon(column) {
  if (sortBy.value !== column) return "⇅";
  return sortDirection.value === "asc" ? "↑" : "↓";
}
</script>
<template>
  <div class="sortable-table">
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
      <tbody>
        <tr v-for="user in sortedUsers" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>{{ user.age }}</td>
          <td>{{ user.occupation }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.sortable-table {
  max-width: 700px;
  margin: 0 auto;
  font-family: sans-serif;
}

table {
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
}

th:hover {
  background-color: #e5e5e5;
}

tr:hover {
  background-color: #f9f9f9;
}
</style>
