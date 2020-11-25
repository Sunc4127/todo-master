<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit {{ todo.todo }}</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Task Name">
        <b-input type="text" v-model="name" placeholder="Your todo name"> </b-input>
      </b-field>
      <b-field grouped group-multiline>
        <b-field label="Project">
          <b-input type="text" v-model="project" placeholder="New project"> </b-input>
        </b-field>

        <b-field>
          <p class="title is-6" style="margin-top: 200%">OR</p>
        </b-field>

        <b-field label="Existing Project">
          <b-select @input="changeItem($event)" placeholder="Project" expanded>
            <option v-for="item in this.projectArray" :value="item" :key="item">
              {{ item }}
            </option>
          </b-select>
        </b-field>
      </b-field>
      <b-field label="Select datetime">
        <b-datetimepicker placeholder="Select a date..." icon="calendar-today" v-model="duedate"> </b-datetimepicker>
      </b-field>
      <b-field label="Status">
        <b-select placeholder="Select a status" v-model="status">
          <option v-for="option in statuses" :value="option.name" :key="option.id">
            {{ option.name }}
          </option>
        </b-select>
      </b-field>
    </section>
    <footer class="modal-card-foot">
      <button class="button" type="button" @click="$parent.close()">Close</button>
      <button class="button is-primary" @click="editTodo">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "TodoEditModal",
  props: {
    todo: {
      type: Object,
      required: true,
    },
    statuses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      name: "",
      initialProjectArray: [],
      projectArray: [],
      project: "",
      duedate: new Date(),
      status: "",
    };
  },
  mounted() {
    this.id = this.todo.id;
    this.name = this.todo.name;
    this.project = this.todo.project;
    this.duedate = new Date(this.todo.duedate);
    this.status = this.todo.status;
    if (localStorage.getItem("projectArray")) {
      this.projectArray = JSON.parse(localStorage.getItem("projectArray"));
    } else {
      this.projectArray = this.initialProjectArray;
    }
  },
  methods: {
    editTodo() {
      const payload = {
        id: this.todo.id,
        name: this.name,
        project: this.project,
        duedate: this.duedate,
        status: this.status,
      };

      if (!payload.name || !payload.project || !payload.status) {
        this.$buefy.dialog.alert({
          title: "Something is missing...",
          hasIcon: true,
          message: `Remember you need to fill in all the fields :)`,
          onConfirm: () => {},
        });
      } else {
        this.$emit("edit-todo", payload);
      }
    },
    changeItem(event) {
      this.project = event;
    },
  },
};
</script>

<style scoped></style>
