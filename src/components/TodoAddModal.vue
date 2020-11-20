<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Add Todo</p>
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
          <b-select @change="changeItem($event)" placeholder="Select an existing Project" @input="changeItem($event)"  expanded>
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
      <button class="button is-primary" @click="addTodo">Save</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "TodoAddModal",
  props: {
    statuses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      initialProjectArray: [],
      projectArray: [],
      name: "",
      project: "",
      duedate: new Date(),
      status: null,
    };
  },

  mounted() {
    if (localStorage.getItem("projectArray")) {
      this.projectArray = JSON.parse(localStorage.getItem("projectArray"));
    } else {
      this.projectArray = this.initialProjectArray;
    }
  },
  methods: {
    addTodo() {
      const payload = {
        name: this.name,
        project: this.project,
        duedate: this.duedate,
        status: this.status,
      };
      if (payload.name === undefined || payload.name === null ||
          payload.project === undefined || payload.project === null ||
          payload.status === undefined || payload.status === null) {
        this.$buefy.dialog.alert({
          title: 'Something is missing...',
          hasIcon: true,
          message: `Remember you need to fill in all the fields :)`,
          onConfirm: () => {},
        });
      } else {
        this.$emit("add-todo", payload);
      }
    },
    changeItem(event) {
      this.project = event;
    },
  },
};
</script>

<style scoped></style>
