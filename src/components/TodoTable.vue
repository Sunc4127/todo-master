<template>
  <div>
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-full">
            <b-field>
              <b-tooltip label="view template code on GitHub" position="is-right">
                <a href="https://github.com/Owlnofeathers/todo">
                  <h1 class="title">ToDo App</h1>
                </a>
              </b-tooltip>
            </b-field>
          </div>
        </div>

        <div class="columns">
          <div class="column">
            <b-field>
              <b-select @input="changeItem($event)" placeholder="Select an existing Project">
                <option>All Projects</option>
                <option v-for="item in this.projectArray" :value="item" :key="item">
                  {{ item }}
                </option>
              </b-select>
            </b-field>
          </div>
          <div class="column">
            <div class="columns is-mobile">
              <div class="column">
                <b-button class="is-light" :class="{ active: filter == 'all' }" @click="filter = 'all'">All Projects</b-button>
              </div>
              <div class="column">
                <b-button class="is-light" :class="{ active: filter == 'completed' }" @click="filter = 'completed'">Completed Projects</b-button>
              </div>
            </div>
          </div>
          <div class="column is-two-thirds"></div>
        </div>

        <div class="columns">
          <div class="column is-full">
            <b-table :data="todosFiltered" default-sort="duedate">
              <template slot-scope="todos">
                <b-table-column field="todo" label="Todo Status">
                  <b-checkbox v-model="todos.row.status" true-value="Complete" false-value="Ready">
                    {{ todos.row.status }}
                  </b-checkbox>
                </b-table-column>

                <b-table-column field="todo" label="Name" sortable>
                  {{ todos.row.name }}
                </b-table-column>

                <b-table-column field="project" label="Project" sortable>
                  {{ todos.row.project }}
                </b-table-column>

                <b-table-column field="duedate" label="Due Date" sortable>
                  {{ new Date(todos.row.duedate).toString().substring(0, 10) + new Date(todos.row.duedate).toString().substring(15, 21) }}
                </b-table-column>

                <b-table-column label="Edit">
                  <b-button type="is-text" icon-left="settings-outline" @click="openEditModal(todos.row)"></b-button>
                </b-table-column>

                <b-table-column label="Delete">
                  <b-button type="is-text" icon-left="delete" @click="deleteTodo(todos.row)"></b-button>
                </b-table-column>
              </template>
            </b-table>
          </div>
        </div>

        <div class="column">
          <div class="columns">
            <div class="column is-half">
              <b-button class="is-primary" @click="isAddModalActive = true"> Add A Todo </b-button>
            </div>
            <div class="column is-half">
              <p align="right" > <b-button class="is-warning" @click="deleteAllTodos"> Delete All Todos </b-button></p>
              
            </div>
          </div>
        </div>
      </div>
    </section>

    <b-modal :active.sync="isEditModalActive" has-modal-card>
      <todo-edit-modal :todo="selectedTodo" :statuses="statuses" @edit-todo="onEditTodo"></todo-edit-modal>
    </b-modal>

    <b-modal :active.sync="isAddModalActive" has-modal-card>
      <todo-add-modal @add-todo="onAddTodo" :statuses="statuses"></todo-add-modal>
    </b-modal>
  </div>
</template>

<script>
import TodoEditModal from "@/components/TodoEditModal";
import TodoAddModal from "@/components/TodoAddModal";

export default {
  name: "TodoTable",
  components: { TodoEditModal, TodoAddModal },
  data() {
    return {
      initialTodos: [],
      filter: "all",
      initialProjectArray: [],
      projectArray: [],
      todos: [],
      status: null,
      selectedProject: "All Projects",
      statuses: [
        { id: 1, name: "Ready" },
        { id: 2, name: "Pending" },
        { id: 3, name: "Complete" },
        { id: 4, name: "Paused" },
      ],
      isEditModalActive: false,
      selectedTodo: {},
      isAddModalActive: false,
    };
  },
  computed: {
    todosFiltered() {
      if (this.selectedProject == "All Projects") {
        if (this.filter == "all") {
          return this.todos;
        } else if (this.filter == "completed") {
          return this.todos.filter((todo) => todo.status == "Complete");
        }
      } else {
        if (this.filter == "all") {
          return this.todos.filter((todo) => todo.project == this.selectedProject);
        } else if (this.filter == "completed") {
          return this.todos.filter((todo) => todo.project == this.selectedProject);
        }
      }
      return this.todos;
    },
  },
  mounted() {
    if (localStorage.getItem("todos")) {
      this.todos = JSON.parse(localStorage.getItem("todos"));
    } else {
      this.todos = this.initialTodos;
    }

    if (localStorage.getItem("projectArray")) {
      this.projectArray = JSON.parse(localStorage.getItem("projectArray"));
    } else {
      this.projectArray = this.initialProjectArray;
    }
  },
  methods: {
    openEditModal(todo) {
      this.selectedTodo = todo;
      this.isEditModalActive = true;
    },
    onAddTodo(item) {
      // get the highest number id to iterate on it
      const highestId = Math.max.apply(
        Math,
        this.todos.map((item) => item.id)
      );
      // Add the item to the array
      this.todos.push({
        id: highestId + 1,
        name: item.name,
        project: item.project,
        duedate: item.duedate,
        status: item.status,
      });
      this.projectArray.push(item.project);
      this.projectArray = [...new Set(this.projectArray)];
      // save the updated array in localstorage
      this.saveLocalStorageTodos();
      this.isAddModalActive = false;
    },
    onEditTodo(item) {
      const todo = this.findTodo(item);
      // Apply the updated values
      todo.name = item.name;
      todo.project = item.project;
      todo.duedate = item.duedate;
      todo.status = item.status;
      // save the updated array in localstorage
      this.saveLocalStorageTodos();
      // close the modal
      this.isEditModalActive = false;
    },
    deleteTodo(item) {
      this.$buefy.dialog.confirm({
        title: `Deleting Todo`,
        confirmText: "Delete Todo",
        type: "is-danger",
        hasIcon: true,
        message: `Are you sure you want to delete this item? This cannot be undone.`,
        onConfirm: () => {
          // find in the array and remove
          const index = this.todos.indexOf(item);
          this.todos.splice(index, 1);

          console.log("todo is\n" + this.todos);
          console.log("Previous project array is: \n"+this.projectArray);
          // Update project array 
          // if all tasks in one project is deleted, delete that project array 
          this.projectArray = [];
          console.log(this.todos.length);
          for (var i = 0; i < this.todos.length; i ++ ) {
            console.log("Here or not");
            console.log(this.todos[i]);
            this.projectArray.push(this.todos[i].project);
          }
          console.log(this.projectArray);

          // save the updated array in localstorage
          this.saveLocalStorageTodos();
        },
      });
    },
  
    deleteAllTodos() {
      this.$buefy.dialog.confirm({
        title: `Deleting Todos`,
        confirmText: "Delete Todos",
        type: "is-danger",
        hasIcon: true,
        message: `Are you sure you want to delete all the todos on your list? This cannot be undone.`,
        onConfirm: () => {
          this.todos = [];
          this.projectArray = [];
          // save the updated array in localstorage
          this.saveLocalStorageTodos();
        },
      });
    },
    changeItem(event) {
      this.selectedProject = event;
    },
    findTodo(item) {
      return this.todos.find((todo) => todo.id === item.id);
    },
    saveLocalStorageTodos() {
      localStorage.setItem("todos", JSON.stringify(this.todos));
      localStorage.setItem("projectArray", JSON.stringify(this.projectArray));
      this.todos = JSON.parse(localStorage.getItem("todos"));
      this.projectArray = JSON.parse(localStorage.getItem("projectArray"));
    },
  },
};
</script>

<style lang="scss" scoped></style>
