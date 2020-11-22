<template>
  <div id="app">
    <todo-table></todo-table>
  </div>
</template>

<script>
import TodoTable from "@/components/TodoTable.vue";

export default {
  name: "app",
  components: {
    TodoTable,
  },
};
</script>

<style lang="scss"></style>
